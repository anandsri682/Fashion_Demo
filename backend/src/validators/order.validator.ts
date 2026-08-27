import { body, param } from 'express-validator';
import { ORDER_STATUSES, PAYMENT_METHODS } from '../models/Order';

export const createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isMongoId().withMessage('Invalid product id in items'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddressId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid shipping address id'),
  body('billingAddressId')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid billing address id'),
  body('paymentMethod').isIn(PAYMENT_METHODS).withMessage('Invalid payment method'),
];


export const orderIdValidator = [param('id').isMongoId().withMessage('Invalid order id')];

export const updateOrderStatusValidator = [
  param('id').isMongoId().withMessage('Invalid order id'),
  body('status').isIn(ORDER_STATUSES).withMessage('Invalid order status'),
];

export const updateDeliveryDateValidator = [
  param('id').isMongoId().withMessage('Invalid order id'),
  body('expectedDeliveryDate').isISO8601().withMessage('Invalid date format'),
];
