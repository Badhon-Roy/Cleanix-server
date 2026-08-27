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

const getAboutCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getAboutCMSFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us Page CMS content retrieved successfully!',
    data: result,
  });
});

const updateAboutCMS = catchAsync(async (req: Request, res: Response) => {
  const { fullContent, updatedFields } = await CMSService.updateAboutCMSInDB(req.body);

  emitCMSUpdated({ page: 'about', updatedFields, data: fullContent });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us Page CMS content updated successfully live!',
    data: fullContent,
  });
});

const getServicesCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getServicesCMSFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Services Page CMS content retrieved successfully!',
    data: result,
  });
});

const updateServicesCMS = catchAsync(async (req: Request, res: Response) => {
  const { fullContent, updatedFields } = await CMSService.updateServicesCMSInDB(req.body);

  emitCMSUpdated({ page: 'services', updatedFields, data: fullContent });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Services Page CMS content updated successfully live!',
    data: fullContent,
  });
});

const getProjectsCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getProjectsCMSFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Projects Page CMS content retrieved successfully!',
    data: result,
  });
});

const updateProjectsCMS = catchAsync(async (req: Request, res: Response) => {
  const { fullContent, updatedFields } = await CMSService.updateProjectsCMSInDB(req.body);

  emitCMSUpdated({ page: 'projects', updatedFields, data: fullContent });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Projects Page CMS content updated successfully live!',
    data: fullContent,
  });
});

const getPricingCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getPricingCMSFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pricing Page CMS content retrieved successfully!',
    data: result,
  });
});

const updatePricingCMS = catchAsync(async (req: Request, res: Response) => {
  const { fullContent, updatedFields } = await CMSService.updatePricingCMSInDB(req.body);

  emitCMSUpdated({ page: 'pricing', updatedFields, data: fullContent });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pricing Page CMS content updated successfully live!',
    data: fullContent,
  });
});

const getCoverageCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getCoverageCMSFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coverage Page CMS content retrieved successfully!',
    data: result,
  });
});

const updateCoverageCMS = catchAsync(async (req: Request, res: Response) => {
  const { fullContent, updatedFields } = await CMSService.updateCoverageCMSInDB(req.body);

  emitCMSUpdated({ page: 'coverage', updatedFields, data: fullContent });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coverage Page CMS content updated successfully live!',
    data: fullContent,
  });
});

const getContactCMS = catchAsync(async (req: Request, res: Response) => {
  const result = await CMSService.getContactCMSFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact Page CMS content retrieved successfully!',
    data: result,
  });
});

const updateContactCMS = catchAsync(async (req: Request, res: Response) => {
  const { fullContent, updatedFields } = await CMSService.updateContactCMSInDB(req.body);

  emitCMSUpdated({ page: 'contact', updatedFields, data: fullContent });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contact Page CMS content updated successfully live!',
    data: fullContent,
  });
});

export const CMSController = {
  getHomeCMS,
  updateHomeCMS,
  getAboutCMS,
  updateAboutCMS,
  getServicesCMS,
  updateServicesCMS,
  getProjectsCMS,
  updateProjectsCMS,
  getPricingCMS,
  updatePricingCMS,
  getCoverageCMS,
  updateCoverageCMS,
  getContactCMS,
  updateContactCMS,
};
