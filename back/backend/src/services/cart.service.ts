import { Cart, ICart } from '../models/Cart';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';

interface AddToCartInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

async function validateProductForCart(productId: string, quantity: number, size?: string, color?: string) {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw ApiError.notFound('Product not found or unavailable', 'PRODUCT_NOT_FOUND');
  }
  if (product.stock < quantity) {
    throw ApiError.badRequest(`Only ${product.stock} unit(s) left in stock`, 'INSUFFICIENT_STOCK');
  }
  if (size && product.sizes.length > 0 && !product.sizes.includes(size)) {
    throw ApiError.badRequest(`Size '${size}' is not available for this product`, 'INVALID_SIZE');
  }
  if (color && product.colors.length > 0 && !product.colors.includes(color)) {
    throw ApiError.badRequest(`Color '${color}' is not available for this product`, 'INVALID_COLOR');
  }
  return product;
}

async function getOrCreateCart(userId: string): Promise<ICart> {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export const cartService = {
  async getCart(userId: string) {
    const cart = await getOrCreateCart(userId);
    await cart.populate('items.product', 'title price images stock isActive slug');
    return cart;
  },

  async addItem(userId: string, input: AddToCartInput) {
    // Never trust a client-supplied price — always re-fetch from the database.
    const product = await validateProductForCart(input.productId, input.quantity, input.size, input.color);
    const cart = await getOrCreateCart(userId);

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === input.productId &&
        item.size === input.size &&
        item.color === input.color
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + input.quantity;
      if (product.stock < newQuantity) {
        throw ApiError.badRequest(`Only ${product.stock} unit(s) left in stock`, 'INSUFFICIENT_STOCK');
      }
      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: input.quantity,
        size: input.size,
        color: input.color,
        price: product.price,
      } as never);
    }

    await cart.save();
    await cart.populate('items.product', 'title price images stock isActive slug');
    return cart;
  },

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await getOrCreateCart(userId);
    const item = cart.items.find((i) => i._id.toString() === itemId);
    if (!item) {
      throw ApiError.notFound('Cart item not found', 'CART_ITEM_NOT_FOUND');
    }

    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      throw ApiError.notFound('Product no longer available', 'PRODUCT_NOT_FOUND');
    }
    if (product.stock < quantity) {
      throw ApiError.badRequest(`Only ${product.stock} unit(s) left in stock`, 'INSUFFICIENT_STOCK');
    }

    item.quantity = quantity;
    item.price = product.price;
    await cart.save();
    await cart.populate('items.product', 'title price images stock isActive slug');
    return cart;
  },

  async removeItem(userId: string, itemId: string) {
    const cart = await getOrCreateCart(userId);
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((i) => i._id.toString() !== itemId) as never;
    if (cart.items.length === originalLength) {
      throw ApiError.notFound('Cart item not found', 'CART_ITEM_NOT_FOUND');
    }
    await cart.save();
    await cart.populate('items.product', 'title price images stock isActive slug');
    return cart;
  },

  async clearCart(userId: string) {
    const cart = await getOrCreateCart(userId);
    cart.items = [] as never;
    await cart.save();
    return cart;
  },
};
