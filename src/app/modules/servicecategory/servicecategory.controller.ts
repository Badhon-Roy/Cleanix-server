import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ServiceCategoryService } from './servicecategory.service';

const getActiveServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceCategoryService.getActiveServices();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Active service categories retrieved successfully!',
    data: result,
  });
});

const getAllServicesAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceCategoryService.getAllServicesAdmin();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All service categories retrieved for admin successfully!',
    data: result,
  });
});

const getSingleServiceBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await ServiceCategoryService.getSingleServiceBySlug(slug as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single service category retrieved successfully!',
    data: result,
  });
});

const createService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceCategoryService.createService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'New service category created successfully!',
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceCategoryService.updateService(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service category updated successfully!',
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await ServiceCategoryService.deleteService(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service category deleted successfully!',
    data: null,
  });
});

export const ServiceCategoryController = {
  getActiveServices,
  getAllServicesAdmin,
  getSingleServiceBySlug,
  createService,
  updateService,
  deleteService,
};
