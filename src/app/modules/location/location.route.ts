import { Router } from 'express';
import auth from '../../middlewares/auth';
import { LocationController } from './location.controller';

const router = Router();

router.post('/', auth('CUSTOMER', 'CLEANER', 'ADMIN'), LocationController.createLocation);
router.get('/me', auth('CUSTOMER', 'CLEANER', 'ADMIN'), LocationController.getMyLocations);
router.patch('/:locationId', auth('CUSTOMER', 'CLEANER', 'ADMIN'), LocationController.updateLocation);
router.patch('/:locationId/default', auth('CUSTOMER', 'CLEANER', 'ADMIN'), LocationController.setDefaultLocation);
router.delete('/:locationId', auth('CUSTOMER', 'CLEANER', 'ADMIN'), LocationController.deleteLocation);

export const LocationRoutes = router;
