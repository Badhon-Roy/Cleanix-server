import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { uploadBufferToCloudinary, uploadBase64ToCloudinary } from '../../utils/cloudinary';
import AppError from '../../errors/AppError';

const uploadSingleImage = catchAsync(async (req: Request, res: Response) => {
  let url = '';

  // 1. Check if multipart/form-data file was uploaded
  if (req.file) {
    const folder = (req.body?.folder as string) || 'cleanix';
    url = await uploadBufferToCloudinary(req.file.buffer, folder, req.file.originalname);
  }
  // 2. Check if base64 string or image URL was posted in JSON body
  else if (req.body?.image || req.body?.base64) {
    const rawImage = req.body.image || req.body.base64;
    const folder = req.body.folder || 'cleanix';

    if (typeof rawImage === 'string' && rawImage.startsWith('data:image/')) {
      url = await uploadBase64ToCloudinary(rawImage, folder);
    } else if (typeof rawImage === 'string' && (rawImage.startsWith('http://') || rawImage.startsWith('https://'))) {
      url = rawImage;
    } else if (typeof rawImage === 'string') {
      url = await uploadBase64ToCloudinary(rawImage, folder);
    }
  } else {
    throw new AppError(400, 'No image file or base64 data provided');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url,
    },
  });
});

const uploadMultipleImages = catchAsync(async (req: Request, res: Response) => {
  const urls: string[] = [];
  const folder = (req.body?.folder as string) || 'cleanix';

  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const u = await uploadBufferToCloudinary(file.buffer, folder, file.originalname);
      urls.push(u);
    }
  } else if (Array.isArray(req.body?.images)) {
    for (const img of req.body.images) {
      if (typeof img === 'string' && img.startsWith('data:image/')) {
        const u = await uploadBase64ToCloudinary(img, folder);
        urls.push(u);
      } else if (typeof img === 'string') {
        urls.push(img);
      }
    }
  } else {
    throw new AppError(400, 'No images provided for upload');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Images uploaded successfully',
    data: {
      urls,
    },
  });
});

export const UploadController = {
  uploadSingleImage,
  uploadMultipleImages,
};
