import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GalleryService } from './gallery.service';

const getActiveGallery = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const result = await GalleryService.getActiveGallery(page, limit);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Active gallery items retrieved successfully',
    data: result.items,
    meta: {
      page,
      limit,
      total: result.total,
      totalPage: Math.ceil(result.total / limit),
      hasMore: result.hasMore,
    },
  });
});

const getAllGalleryAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.getAllGalleryAdmin();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All gallery items retrieved successfully for admin',
    data: result,
  });
});

const createGalleryItem = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.createGalleryItem(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Gallery item created successfully',
    data: result,
  });
});

const createBulkGalleryItems = catchAsync(async (req: Request, res: Response) => {
  const result = await GalleryService.createBulkGalleryItems(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Bulk gallery items created successfully',
    data: result,
  });
});

const updateGalleryItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await GalleryService.updateGalleryItem(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery item updated successfully',
    data: result,
  });
});

const deleteGalleryItem = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await GalleryService.deleteGalleryItem(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Gallery item deleted successfully',
    data: null,
  });
});

const deleteBulkGalleryItems = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const count = await GalleryService.deleteBulkGalleryItems(ids);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `${count} gallery items deleted successfully`,
    data: { count },
  });
});

export const GalleryController = {
  getActiveGallery,
  getAllGalleryAdmin,
  createGalleryItem,
  createBulkGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  deleteBulkGalleryItems,
};
