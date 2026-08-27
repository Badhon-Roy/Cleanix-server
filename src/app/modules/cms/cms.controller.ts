import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CMSService } from './cms.service';
import { emitCMSUpdated } from '../../socket/socket';

const getHomeCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getHomeCMSFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Home Page CMS content retrieved successfully!',
    data: result,
  });
});

const updateHomeCMS = catchAsync(async (req: Request, res: Response) => {
  const { fullContent, updatedFields } = await CMSService.updateHomeCMSInDB(req.body);

  emitCMSUpdated({ page: 'home', updatedFields, data: fullContent });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Home Page CMS content updated successfully live!',
    data: fullContent,
  });
});

export const CMSController = {
  getHomeCMS,
  updateHomeCMS,
};
