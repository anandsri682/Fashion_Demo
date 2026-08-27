import { body, param, query } from 'express-validator';

export const createProductValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('gender').isIn(['men', 'women', 'unisex', 'kids']).withMessage('Invalid gender'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('originalPrice').optional().isFloat({ min: 0 }),
  body('discount').optional().isFloat({ min: 0, max: 100 }),
  body('sizes').optional(),
  body('colors').optional(),
];

export const updateProductValidator = [
  param('id').isMongoId().withMessage('Invalid product id'),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('discount').optional().isFloat({ min: 0, max: 100 }),
];

export const productIdValidator = [param('id').isMongoId().withMessage('Invalid product id')];

export const productListValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
];
