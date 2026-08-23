import { Router } from 'express';
import auth from '../../middlewares/auth';
import { CustomerController } from './customer.controller';

const router = Router();

router.get('/me', auth('CUSTOMER', 'ADMIN'), CustomerController.getMyProfile);
router.patch('/me', auth('CUSTOMER', 'ADMIN'), CustomerController.updateMyProfile);
router.delete('/me', auth('CUSTOMER', 'ADMIN'), CustomerController.deleteMyAccount);

export const CustomerRoutes = router;
