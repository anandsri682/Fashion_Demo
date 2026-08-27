import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as productController from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { orderIdValidator, updateOrderStatusValidator, updateDeliveryDateValidator } from '../validators/order.validator';
import { productListValidator } from '../validators/product.validator';

const router = Router();

// Every admin route requires a valid authenticated ADMIN user.
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', adminController.getDashboard);

router.get('/products', productListValidator, validate, productController.listProductsAdmin);

router.get('/orders', adminController.listOrders);
router.get('/orders/:id', orderIdValidator, validate, adminController.getOrder);
router.put('/orders/:id/status', updateOrderStatusValidator, validate, adminController.updateOrderStatus);
router.put('/orders/:id/delivery-date', updateDeliveryDateValidator, validate, adminController.updateOrderDeliveryDate);

router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/status', adminController.updateUserStatus);

export default router;
