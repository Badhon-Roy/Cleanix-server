import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CleanerService } from './cleaner.service';
import { emitCleanerUpdated } from '../../socket/socket';

const getAllCleaners = catchAsync(async (req: Request, res: Response) => {
  const result = await CleanerService.getAllCleanersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cleaners retrieved successfully',
    data: result,
  });
});

const getCleanerById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CleanerService.getCleanerByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cleaner profile retrieved successfully',
    data: result,
  });
});

const updateCleanerProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user!;
  const result = await CleanerService.updateCleanerProfileInDB(id, req.body);

  emitCleanerUpdated(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cleaner profile updated successfully',
    data: result,
  });
});

const updateCleanerApproval = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CleanerService.updateCleanerApprovalInDB(id, req.body);

  emitCleanerUpdated(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Cleaner staff status set to ${req.body.status} successfully`,
    data: result,
  });
});

export const CleanerController = {
  getAllCleaners,
  getCleanerById,
  updateCleanerProfile,
  updateCleanerApproval,
};
