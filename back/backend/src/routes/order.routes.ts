import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createOrderValidator, orderIdValidator } from '../validators/order.validator';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrderValidator, validate, orderController.createOrder);
router.get('/', orderController.listMyOrders);
router.get('/:id', orderIdValidator, validate, orderController.getMyOrder);
router.post('/:id/cancel', orderIdValidator, validate, orderController.cancelMyOrder);

export default router;
