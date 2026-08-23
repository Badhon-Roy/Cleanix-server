import express from 'express';
import auth from '../../middlewares/auth';
import { ServiceController } from './service.controller';

const router = express.Router();

// Public / Customer Endpoints
router.get('/active', ServiceController.getActiveServices);
router.get('/slug/:slug', ServiceController.getSingleServiceBySlug);

// Admin Endpoints
router.get('/admin', auth('ADMIN', 'CUSTOMER'), ServiceController.getAllServicesAdmin);
router.post('/', auth('ADMIN', 'CUSTOMER'), ServiceController.createService);
router.patch('/:id', auth('ADMIN', 'CUSTOMER'), ServiceController.updateService);
router.delete('/:id', auth('ADMIN', 'CUSTOMER'), ServiceController.deleteService);

export const ServiceCategoryRoutes = router;
