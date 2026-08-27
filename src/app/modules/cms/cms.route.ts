import express from 'express';
import { CMSController } from './cms.controller';

const router = express.Router();

router.get('/home', CMSController.getHomeCMS);
router.patch('/home', CMSController.updateHomeCMS);
router.put('/home', CMSController.updateHomeCMS);

router.get('/about', CMSController.getAboutCMS);
router.patch('/about', CMSController.updateAboutCMS);
router.put('/about', CMSController.updateAboutCMS);

router.get('/services', CMSController.getServicesCMS);
router.patch('/services', CMSController.updateServicesCMS);
router.put('/services', CMSController.updateServicesCMS);

router.get('/projects', CMSController.getProjectsCMS);
router.patch('/projects', CMSController.updateProjectsCMS);
router.put('/projects', CMSController.updateProjectsCMS);

router.get('/pricing', CMSController.getPricingCMS);
router.patch('/pricing', CMSController.updatePricingCMS);
router.put('/pricing', CMSController.updatePricingCMS);

router.get('/coverage', CMSController.getCoverageCMS);
router.patch('/coverage', CMSController.updateCoverageCMS);
router.put('/coverage', CMSController.updateCoverageCMS);

export const CMSRoutes = router;
