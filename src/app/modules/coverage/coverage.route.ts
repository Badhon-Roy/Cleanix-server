import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CoverageController } from './coverage.controller';
import { CoverageValidation } from './coverage.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(CoverageValidation.createCoverageValidationSchema),
  CoverageController.createCoverage,
);

router.get(
  '/',
  CoverageController.getAllCoverages,
);

router.get(
  '/:id',
  CoverageController.getCoverageById,
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(CoverageValidation.updateCoverageValidationSchema),
  CoverageController.updateCoverage,
);

router.delete(
  '/:id',
  auth('ADMIN'),
  CoverageController.deleteCoverage,
);

export const CoverageRoutes = router;
