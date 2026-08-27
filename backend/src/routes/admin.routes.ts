import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as productController from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { orderIdValidator, updateOrderStatusValidator, updateDeliveryDateValidator } from '../validators/order.validator';
import { productListValidator } from '../validators/product.validator';

import * as settingsController from '../controllers/settings.controller';
import * as categoryController from '../controllers/category.controller';
import * as couponController from '../controllers/coupon.controller';
import * as bannerController from '../controllers/banner.controller';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

// Every admin route requires a valid authenticated ADMIN user.
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', adminController.getDashboard);

router.get('/products', productListValidator, validate, productController.listProductsAdmin);
router.put('/products/:id/stock', adminController.updateProductStock);

router.get('/orders', adminController.listOrders);
router.get('/orders/:id', orderIdValidator, validate, adminController.getOrder);
router.put('/orders/:id/status', updateOrderStatusValidator, validate, adminController.updateOrderStatus);
router.put('/orders/:id/delivery-date', updateDeliveryDateValidator, validate, adminController.updateOrderDeliveryDate);

router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/status', adminController.updateUserStatus);

// Store Settings
router.put('/settings', settingsController.updateSettings);

// Categories & Subcategories
router.get('/categories', categoryController.listAllAdminCategories);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

router.post('/subcategories', categoryController.createSubcategory);
router.put('/subcategories/:id', categoryController.updateSubcategory);
router.delete('/subcategories/:id', categoryController.deleteSubcategory);

// Coupons
router.get('/coupons', couponController.listCoupons);
router.post('/coupons', couponController.createCoupon);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);

// Banners
router.get('/banners', bannerController.listAllAdminBanners);
router.post('/banners', bannerController.createBanner);
router.put('/banners/:id', bannerController.updateBanner);
router.delete('/banners/:id', bannerController.deleteBanner);

// Notifications
router.get('/notifications', notificationController.listNotifications);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.put('/notifications/read-all', notificationController.markAllAsRead);

// Admin Profile
router.put('/profile', adminController.updateAdminProfile);

export default router;

