import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomerService } from './customer.service';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.getMyProfile(req.user!.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer profile retrieved successfully!',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.updateMyProfile(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Personal Information updated successfully!',
    data: result,
  });
});

export const CustomerController = {
  getMyProfile,
  updateMyProfile,
};
