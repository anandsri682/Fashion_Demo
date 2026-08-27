import { body, param } from 'express-validator';

export const addToCartValidator = [
  body('productId').isMongoId().withMessage('Invalid product id'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('size').optional().isString(),
  body('color').optional().isString(),
];

export const updateCartItemValidator = [
  param('itemId').isMongoId().withMessage('Invalid cart item id'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

export const cartItemIdValidator = [param('itemId').isMongoId().withMessage('Invalid cart item id')];
