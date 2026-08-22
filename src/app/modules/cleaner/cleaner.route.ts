import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CleanerController } from './cleaner.controller';
import { CleanerValidation } from './cleaner.validation';

const router = Router();

router.get(
  '/',
  auth('ADMIN', 'CUSTOMER', 'CLEANER'),
  CleanerController.getAllCleaners,
);

router.get(
  '/:id',
  auth('ADMIN', 'CUSTOMER', 'CLEANER'),
  CleanerController.getCleanerById,
);

router.patch(
  '/me',
  auth('CLEANER'),
  validateRequest(CleanerValidation.updateCleanerProfileValidationSchema),
  CleanerController.updateCleanerProfile,
);

router.patch(
  '/:id/approval',
  auth('ADMIN'),
  validateRequest(CleanerValidation.updateCleanerApprovalValidationSchema),
  CleanerController.updateCleanerApproval,
);

export const CleanerRoutes = router;
