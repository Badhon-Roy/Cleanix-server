import express from 'express';
import auth from '../../middlewares/auth';
import { SubscriptionController } from './subscription.controller';

const router = express.Router();

router.post('/', auth('CUSTOMER', 'ADMIN'), SubscriptionController.createSubscription);
router.get('/me', auth('CUSTOMER', 'ADMIN'), SubscriptionController.getMySubscriptions);
router.get('/', auth('ADMIN'), SubscriptionController.getAllSubscriptionsAdmin);
router.get('/:id', auth('CUSTOMER', 'ADMIN'), SubscriptionController.getSingleSubscription);
router.get('/:id/pdf', auth('CUSTOMER', 'ADMIN'), SubscriptionController.downloadSubscriptionPDF);
router.patch('/:id/cancel', auth('CUSTOMER', 'ADMIN'), SubscriptionController.cancelSubscription);
router.patch('/:id/status', auth('ADMIN'), SubscriptionController.updateSubscriptionStatusAdmin);

export const SubscriptionRoutes = router;
