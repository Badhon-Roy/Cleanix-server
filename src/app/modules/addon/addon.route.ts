import express from 'express';
import auth from '../../middlewares/auth';
import { AddonController } from './addon.controller';

const router = express.Router();

// Public / Customer endpoint to get active add-ons
router.get('/', AddonController.getActiveAddons);

// Admin endpoints
router.get('/admin', auth('ADMIN'), AddonController.getAllAddonsAdmin);
router.post('/', auth('ADMIN'), AddonController.createAddon);
router.patch('/:addonId', auth('ADMIN'), AddonController.updateAddon);
router.delete('/:addonId', auth('ADMIN'), AddonController.deleteAddon);

export const AddonRoutes = router;
