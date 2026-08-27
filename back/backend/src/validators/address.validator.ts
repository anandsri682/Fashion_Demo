import { body, param } from 'express-validator';

export const createAddressValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('Must be a valid phone number'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
  body('addressLine1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('isDefault').optional().isBoolean(),
];

export const addressIdValidator = [param('id').isMongoId().withMessage('Invalid address id')];
