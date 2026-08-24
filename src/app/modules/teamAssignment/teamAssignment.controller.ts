import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TeamAssignmentService } from './teamAssignment.service';
import { emitBookingUpdated } from '../../socket/socket';

const getMyTeamAssignments = catchAsync(async (req: Request, res: Response) => {
  const teamSlug = (req.query.teamSlug as string) || (req.query.teamId as string);
  const result = await TeamAssignmentService.getMyTeamAssignmentsFromDB(req.user!, teamSlug);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My team assigned services retrieved successfully',
    data: result,
  });
});

const getAllAssignments = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamAssignmentService.getAllAssignmentsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team assignments retrieved successfully',
    data: result,
  });
});

const updateAssignmentDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TeamAssignmentService.updateAssignmentDetailsInDB(id as string, req.body);

  if (result?.booking) {
    emitBookingUpdated(result.booking);
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team assignment details updated successfully',
    data: result,
  });
});

export const TeamAssignmentController = {
  getMyTeamAssignments,
  getAllAssignments,
  updateAssignmentDetails,
};
