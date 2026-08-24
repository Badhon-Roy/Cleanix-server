import { Router } from 'express';
import auth from '../../middlewares/auth';
import { LeaderAppointmentController } from './leaderAppointment.controller';

const router = Router();

router.get(
  '/my-pending',
  auth('CLEANER', 'TEAM_LEADER'),
  LeaderAppointmentController.getMyPendingAppointment,
);

router.get(
  '/my-history',
  auth('CLEANER', 'TEAM_LEADER'),
  LeaderAppointmentController.getMyAppointmentHistory,
);

router.patch(
  '/:id/respond',
  auth('CLEANER', 'TEAM_LEADER'),
  LeaderAppointmentController.respondToAppointment,
);

export const LeaderAppointmentRoutes = router;
