import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';
import { Product, IProduct } from '../src/models/Product';

async function registerUser(email: string) {
  const res = await request(app).post('/api/auth/register').send({
    firstName: 'Jane',
    lastName: 'Doe',
    email,
    phone: '9876543211',
    password: 'password123',
  });
  return { token: res.body.token as string, userId: res.body.user._id as string };
}

async function createAdmin() {
  const admin = await User.create({
    firstName: 'Store',
    lastName: 'Admin',
    email: 'admin2@example.com',
    phone: '9999999998',
    password: 'AdminPass123',
    role: 'ADMIN',
  });
  const res = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'AdminPass123' });
  return { token: res.body.token as string, admin };
}

async function createProduct(adminId: string, overrides: Partial<IProduct> = {}) {
  return Product.create({
    title: 'Test Product',
    slug: `test-product-${Date.now()}-${Math.random()}`,
    description: 'desc',
    category: 'shirts',
    gender: 'men',
    price: 500,
    stock: 10,
    sizes: ['M', 'L'],
    colors: ['Black'],
    createdBy: adminId,
    images: [{ url: '/uploads/products/x.jpg' }],
    ...overrides,
  });
}

describe('Orders', () => {
  it('rejects order creation when stock is insufficient', async () => {
    const { admin } = await createAdmin();
    const { token } = await registerUser('buyer1@example.com');
    const product = await createProduct(admin._id.toString(), { stock: 1 });

    const addressRes = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '9876543211',
        email: 'buyer1@example.com',
        addressLine1: '123 Main St',
        city: 'Hyderabad',
        state: 'TS',
        country: 'India',
        pincode: '500001',
      });
    const addressId = addressRes.body.address._id;

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product._id, quantity: 5, size: 'M', color: 'Black' }],
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod: 'COD',
      });

    expect(orderRes.status).toBe(400);
    expect(orderRes.body.error.code).toBe('INSUFFICIENT_STOCK');
  });

  it('creates an order, decreases stock, clears cart, and sets an expected delivery date', async () => {
    const { admin } = await createAdmin();
    const { token } = await registerUser('buyer2@example.com');
    const product = await createProduct(admin._id.toString(), { stock: 10, price: 500 });

    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 2, size: 'M', color: 'Black' });

    const addressRes = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '9876543211',
        email: 'buyer2@example.com',
        addressLine1: '123 Main St',
        city: 'Hyderabad',
        state: 'TS',
        country: 'India',
        pincode: '500001',
      });
    const addressId = addressRes.body.address._id;

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        items: [{ productId: product._id, quantity: 2, size: 'M', color: 'Black' }],
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod: 'COD',
      });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.order.total).toBeGreaterThan(0);
    expect(orderRes.body.order.expectedDeliveryDate).toBeDefined();
    expect(orderRes.body.order.orderNumber).toMatch(/^ORD-\d{8}-\d{5}$/);

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct!.stock).toBe(8);

    const cartRes = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
    expect(cartRes.body.cart.items.length).toBe(0);
  });

  it('prevents a user from accessing another user\'s order', async () => {
    const { admin } = await createAdmin();
    const { token: buyerToken } = await registerUser('buyer3@example.com');
    const { token: otherToken } = await registerUser('buyer4@example.com');
    const product = await createProduct(admin._id.toString());

    const addressRes = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '9876543211',
        email: 'buyer3@example.com',
        addressLine1: '123 Main St',
        city: 'Hyderabad',
        state: 'TS',
        country: 'India',
        pincode: '500001',
      });
    const addressId = addressRes.body.address._id;

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        items: [{ productId: product._id, quantity: 1, size: 'M', color: 'Black' }],
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod: 'COD',
      });

    const orderId = orderRes.body.order._id;

    const res = await request(app).get(`/api/orders/${orderId}`).set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(404);
  });

  it('allows admin to update order status and delivery date, visible to the user', async () => {
    const { token: adminToken, admin } = await createAdmin();
    const { token: buyerToken } = await registerUser('buyer5@example.com');
    const product = await createProduct(admin._id.toString());

    const addressRes = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '9876543211',
        email: 'buyer5@example.com',
        addressLine1: '123 Main St',
        city: 'Hyderabad',
        state: 'TS',
        country: 'India',
        pincode: '500001',
      });
    const addressId = addressRes.body.address._id;

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        items: [{ productId: product._id, quantity: 1, size: 'M', color: 'Black' }],
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod: 'COD',
      });
    const orderId = orderRes.body.order._id;

    const statusRes = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'SHIPPED' });
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.order.orderStatus).toBe('SHIPPED');

    const deliveryRes = await request(app)
      .put(`/api/admin/orders/${orderId}/delivery-date`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ expectedDeliveryDate: '2026-09-01' });
    expect(deliveryRes.status).toBe(200);

    const userViewRes = await request(app).get(`/api/orders/${orderId}`).set('Authorization', `Bearer ${buyerToken}`);
    expect(userViewRes.body.order.orderStatus).toBe('SHIPPED');
    expect(new Date(userViewRes.body.order.expectedDeliveryDate).toISOString().slice(0, 10)).toBe('2026-09-01');
  });

  it('rejects a non-admin attempting to update order status', async () => {
    const { admin } = await createAdmin();
    const { token: buyerToken } = await registerUser('buyer6@example.com');
    const product = await createProduct(admin._id.toString());

    const addressRes = await request(app)
      .post('/api/addresses')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '9876543211',
        email: 'buyer6@example.com',
        addressLine1: '123 Main St',
        city: 'Hyderabad',
        state: 'TS',
        country: 'India',
        pincode: '500001',
      });
    const addressId = addressRes.body.address._id;

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        items: [{ productId: product._id, quantity: 1, size: 'M', color: 'Black' }],
        shippingAddressId: addressId,
        billingAddressId: addressId,
        paymentMethod: 'COD',
      });
    const orderId = orderRes.body.order._id;

    const res = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ status: 'SHIPPED' });
    expect(res.status).toBe(403);
  });
});
