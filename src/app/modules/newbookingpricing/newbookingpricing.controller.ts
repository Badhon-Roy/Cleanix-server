import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NewBookingPricingService } from './newbookingpricing.service';

const getPricingConfig = catchAsync(async (req: Request, res: Response) => {
  const result = await NewBookingPricingService.getPricingConfig();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dynamic pricing engine configuration retrieved successfully!',
    data: result,
  });
});

const updatePricingConfig = catchAsync(async (req: Request, res: Response) => {
  const result = await NewBookingPricingService.updatePricingConfig(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dynamic pricing engine multipliers updated successfully!',
    data: result,
  });
});

export const NewBookingPricingController = {
  getPricingConfig,
  updatePricingConfig,
};
