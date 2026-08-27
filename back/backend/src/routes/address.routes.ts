import { Router } from 'express';
import * as addressController from '../controllers/address.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createAddressValidator, addressIdValidator } from '../validators/address.validator';

const router = Router();

router.use(authMiddleware);

router.post('/', createAddressValidator, validate, addressController.createAddress);
router.get('/', addressController.listAddresses);
router.get('/:id', addressIdValidator, validate, addressController.getAddress);
router.put('/:id', addressIdValidator, validate, addressController.updateAddress);
router.delete('/:id', addressIdValidator, validate, addressController.deleteAddress);

export default router;
