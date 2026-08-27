import express from 'express';
import { PlanController } from './plan.controller';

const router = express.Router();

router.post('/', PlanController.createPlan);
router.get('/', PlanController.getAllPlans);
router.get('/:id', PlanController.getPlanById);
router.patch('/:id', PlanController.updatePlan);
router.delete('/:id', PlanController.deletePlan);

export const PlanRoutes = router;
