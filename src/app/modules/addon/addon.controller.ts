import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AddonService } from './addon.service';

const getActiveAddons = catchAsync(async (req: Request, res: Response) => {
  const result = await AddonService.getActiveAddons();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Active service add-ons retrieved successfully!',
    data: result,
  });
});

const getAllAddonsAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AddonService.getAllAddonsAdmin();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin service add-ons catalog retrieved successfully!',
    data: result,
  });
});

const createAddon = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const mime = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    req.body.iconImage = `data:${mime};base64,${base64}`;
  }

  const result = await AddonService.createAddon(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service add-on created successfully!',
    data: result,
  });
});

const updateAddon = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const mime = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    req.body.iconImage = `data:${mime};base64,${base64}`;
  }

  const addonId = req.params.addonId as string;
  const result = await AddonService.updateAddon(addonId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service add-on updated successfully!',
    data: result,
  });
});

const deleteAddon = catchAsync(async (req: Request, res: Response) => {
  const addonId = req.params.addonId as string;
  await AddonService.deleteAddon(addonId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service add-on deleted successfully!',
    data: null,
  });
});

export const AddonController = {
  getActiveAddons,
  getAllAddonsAdmin,
  createAddon,
  updateAddon,
  deleteAddon,
};
