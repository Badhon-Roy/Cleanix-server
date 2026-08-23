import express from 'express';
import auth from '../../middlewares/auth';
import { NewBookingPricingController } from './newbookingpricing.controller';

const router = express.Router();

router.get('/', NewBookingPricingController.getPricingConfig);
router.patch('/', auth('ADMIN', 'CUSTOMER'), NewBookingPricingController.updatePricingConfig);

export const NewBookingPricingRoutes = router;
