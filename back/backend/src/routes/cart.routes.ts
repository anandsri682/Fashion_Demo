import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { addToCartValidator, updateCartItemValidator, cartItemIdValidator } from '../validators/cart.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', addToCartValidator, validate, cartController.addToCart);
router.put('/:itemId', updateCartItemValidator, validate, cartController.updateCartItem);
router.delete('/:itemId', cartItemIdValidator, validate, cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;
