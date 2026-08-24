import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TeamController } from './team.controller';
import { TeamValidation } from './team.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(TeamValidation.createTeamValidationSchema),
  TeamController.createTeam,
);

router.get(
  '/',
  auth('ADMIN', 'TEAM_LEADER', 'CLEANER'),
  TeamController.getAllTeams,
);

router.get(
  '/:id',
  auth('ADMIN', 'TEAM_LEADER', 'CLEANER'),
  TeamController.getTeamById,
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(TeamValidation.updateTeamValidationSchema),
  TeamController.updateTeam,
);

router.patch(
  '/:id/leader-request',
  auth('CLEANER', 'TEAM_LEADER'),
  TeamController.respondLeaderRequest,
);

router.delete(
  '/:id',
  auth('ADMIN'),
  TeamController.deleteTeam,
);

export const TeamRoutes = router;
