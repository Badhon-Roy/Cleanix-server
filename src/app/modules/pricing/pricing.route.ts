import express from 'express';
import auth from '../../middlewares/auth';
import { PricingController } from './pricing.controller';

const router = express.Router();

// Public / Customer endpoint to get pricing config
router.get('/', PricingController.getPricingConfig);

// Admin endpoint to update dynamic pricing formula multipliers
router.patch('/', auth('ADMIN', 'CUSTOMER'), PricingController.updatePricingConfig);

export const PricingRoutes = router;
