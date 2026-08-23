import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LocationService } from './location.service';

const createLocation = catchAsync(async (req: Request, res: Response) => {
  const result = await LocationService.createLocation(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service location added successfully!',
    data: result,
  });
});

const getMyLocations = catchAsync(async (req: Request, res: Response) => {
  const result = await LocationService.getMyLocations(req.user!.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Saved service locations retrieved successfully!',
    data: result,
  });
});

const updateLocation = catchAsync(async (req: Request, res: Response) => {
  const locationId = req.params.locationId as string;
  const result = await LocationService.updateLocation(req.user!.id, locationId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service location updated successfully!',
    data: result,
  });
});

const setDefaultLocation = catchAsync(async (req: Request, res: Response) => {
  const locationId = req.params.locationId as string;
  const result = await LocationService.setDefaultLocation(req.user!.id, locationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Default service location updated!',
    data: result,
  });
});

const deleteLocation = catchAsync(async (req: Request, res: Response) => {
  const locationId = req.params.locationId as string;
  await LocationService.deleteLocation(req.user!.id, locationId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service location deleted successfully!',
    data: null,
  });
});

export const LocationController = {
  createLocation,
  getMyLocations,
  updateLocation,
  setDefaultLocation,
  deleteLocation,
};
