import express from 'express';
import { CMSController } from './cms.controller';

const router = express.Router();

router.get('/home', CMSController.getHomeCMS);
router.patch('/home', CMSController.updateHomeCMS);
router.put('/home', CMSController.updateHomeCMS);

router.get('/about', CMSController.getAboutCMS);
router.patch('/about', CMSController.updateAboutCMS);
router.put('/about', CMSController.updateAboutCMS);

export const CMSRoutes = router;
