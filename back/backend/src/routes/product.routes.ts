import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { uploadProductImages } from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
  productListValidator,
} from '../validators/product.validator';

const router = Router();

// Public routes
router.get('/', productListValidator, validate, productController.listProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/category/:category', productListValidator, validate, productController.getProductsByCategory);
router.get('/:id', productIdValidator, validate, productController.getProductById);

// Admin routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  uploadProductImages,
  createProductValidator,
  validate,
  productController.createProduct
);
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  uploadProductImages,
  updateProductValidator,
  validate,
  productController.updateProduct
);
router.delete('/:id', authMiddleware, adminMiddleware, productIdValidator, validate, productController.deleteProduct);

export default router;
