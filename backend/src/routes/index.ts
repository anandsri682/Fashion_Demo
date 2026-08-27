import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import addressRoutes from './address.routes';
import orderRoutes from './order.routes';
import wishlistRoutes from './wishlist.routes';
import adminRoutes from './admin.routes';

import { getSettings } from '../controllers/settings.controller';
import { listCategories } from '../controllers/category.controller';
import { listPublicBanners } from '../controllers/banner.controller';
import { validateCoupon } from '../controllers/coupon.controller';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);

router.get('/settings', getSettings);
router.get('/categories', listCategories);
router.get('/banners', listPublicBanners);
router.post('/coupons/validate', validateCoupon);

export default router;

