import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';
import { Product } from '../src/models/Product';

async function createAdminAndToken() {
  const admin = await User.create({
    firstName: 'Store',
    lastName: 'Admin',
    email: 'admin@example.com',
    phone: '9999999999',
    password: 'AdminPass123',
    role: 'ADMIN',
  });
  const res = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'AdminPass123' });
  return res.body.token as string;
}

async function createUserAndToken() {
  const res = await request(app).post('/api/auth/register').send({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '9876543211',
    password: 'password123',
  });
  return res.body.token as string;
}

describe('Products', () => {
  it('rejects product creation without images', async () => {
    const token = await createAdminAndToken();
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Shirt')
      .field('description', 'A shirt')
      .field('category', 'shirts')
      .field('gender', 'men')
      .field('price', '999')
      .field('stock', '10');
    expect(res.status).toBe(400);
  });

  it('rejects product creation from a non-admin user', async () => {
    const token = await createUserAndToken();
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Shirt')
      .field('description', 'A shirt')
      .field('category', 'shirts')
      .field('gender', 'men')
      .field('price', '999')
      .field('stock', '10')
      .attach('images', Buffer.from('fake-image-data'), 'shirt.jpg');
    expect(res.status).toBe(403);
  });

  it('creates a product as admin with an image and it appears in the public listing', async () => {
    const token = await createAdminAndToken();
    const createRes = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Shirt')
      .field('description', 'A shirt')
      .field('category', 'shirts')
      .field('gender', 'men')
      .field('price', '999')
      .field('stock', '10')
      .field('sizes', 'S,M,L')
      .field('colors', 'Blue,Black')
      .attach('images', Buffer.from('fake-image-data'), 'shirt.jpg');

    expect(createRes.status).toBe(201);
    expect(createRes.body.product.slug).toBe('test-shirt');

    const listRes = await request(app).get('/api/products');
    expect(listRes.status).toBe(200);
    expect(listRes.body.products.length).toBe(1);
  });

  it('updates a product as admin', async () => {
    const token = await createAdminAndToken();
    const admin = await User.findOne({ email: 'admin@example.com' });
    const product = await Product.create({
      title: 'Old Title',
      slug: 'old-title',
      description: 'desc',
      category: 'shirts',
      gender: 'men',
      price: 500,
      stock: 5,
      createdBy: admin!._id,
      images: [{ url: '/uploads/products/x.jpg' }],
    });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 799 });

    expect(res.status).toBe(200);
    expect(res.body.product.price).toBe(799);
  });

  it('soft-deletes (deactivates) a product by default', async () => {
    const token = await createAdminAndToken();
    const admin = await User.findOne({ email: 'admin@example.com' });
    const product = await Product.create({
      title: 'To Delete',
      slug: 'to-delete',
      description: 'desc',
      category: 'shirts',
      gender: 'men',
      price: 500,
      stock: 5,
      createdBy: admin!._id,
      images: [{ url: '/uploads/products/x.jpg' }],
    });

    const res = await request(app).delete(`/api/products/${product._id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const stillInDb = await Product.findById(product._id);
    expect(stillInDb).not.toBeNull();
    expect(stillInDb!.isActive).toBe(false);
  });
});
