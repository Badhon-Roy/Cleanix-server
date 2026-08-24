import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LeaderAppointmentService } from './leaderAppointment.service';
import {
  emitTeamUpdated,
  emitCleanerUpdated,
  emitLeaderAppointmentUpdated,
} from '../../socket/socket';

const getMyPendingAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user!;
  const result = await LeaderAppointmentService.getMyPendingAppointmentFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result
      ? 'Pending appointment request retrieved successfully'
      : 'No pending appointment request found',
    data: result,
  });
});

const respondToAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id: appointmentId } = req.params;
  const { id: userId } = req.user!;
  const { action } = req.body;

  const result = await LeaderAppointmentService.respondToAppointmentInDB(
    appointmentId as string,
    userId,
    action,
  );

  emitTeamUpdated(result?.team);
  emitCleanerUpdated(result?.cleaner);
  emitLeaderAppointmentUpdated(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Appointment request ${action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED'} successfully`,
    data: result,
  });
});

const getMyAppointmentHistory = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user!;
  const result = await LeaderAppointmentService.getMyAppointmentHistoryFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Appointment history retrieved successfully',
    data: result,
  });
});

export const LeaderAppointmentController = {
  getMyPendingAppointment,
  getMyAppointmentHistory,
  respondToAppointment,
};
