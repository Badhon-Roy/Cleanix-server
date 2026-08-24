import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CleanerController } from './cleaner.controller';
import { CleanerValidation } from './cleaner.validation';

const router = Router();

router.get(
  '/',
  auth('ADMIN', 'CUSTOMER', 'CLEANER', 'TEAM_LEADER'),
  CleanerController.getAllCleaners,
);

router.get(
  '/:id',
  auth('ADMIN', 'CUSTOMER', 'CLEANER', 'TEAM_LEADER'),
  CleanerController.getCleanerById,
);

router.get(
  '/profile/me',
  auth('CLEANER', 'TEAM_LEADER', 'ADMIN'),
  CleanerController.getCleanerProfileMe,
);

router.patch(
  '/toggle-duty',
  auth('CLEANER', 'TEAM_LEADER', 'ADMIN'),
  CleanerController.toggleDutyStatus,
);

router.patch(
  '/me',
  auth('CLEANER', 'TEAM_LEADER'),
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
