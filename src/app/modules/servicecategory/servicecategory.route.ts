import express from 'express';
import auth from '../../middlewares/auth';
import { ServiceCategoryController } from './servicecategory.controller';

const router = express.Router();

router.get('/active', ServiceCategoryController.getActiveServices);
router.get('/slug/:slug', ServiceCategoryController.getSingleServiceBySlug);

router.get('/admin', auth('ADMIN', 'CUSTOMER'), ServiceCategoryController.getAllServicesAdmin);
router.post('/', auth('ADMIN', 'CUSTOMER'), ServiceCategoryController.createService);
router.patch('/:id', auth('ADMIN', 'CUSTOMER'), ServiceCategoryController.updateService);
router.delete('/:id', auth('ADMIN', 'CUSTOMER'), ServiceCategoryController.deleteService);

export const ServiceCategoryRoutes = router;
