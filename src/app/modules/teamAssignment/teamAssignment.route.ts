import express from 'express';
import auth from '../../middlewares/auth';
import { TeamAssignmentController } from './teamAssignment.controller';

const router = express.Router();

router.get(
  '/my-team',
  auth('SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER', 'CLEANER'),
  TeamAssignmentController.getMyTeamAssignments,
);

router.get(
  '/',
  auth('SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER'),
  TeamAssignmentController.getAllAssignments,
);

router.patch(
  '/:id',
  auth('SUPER_ADMIN', 'ADMIN', 'TEAM_LEADER'),
  TeamAssignmentController.updateAssignmentDetails,
);

export const TeamAssignmentRoutes = router;
