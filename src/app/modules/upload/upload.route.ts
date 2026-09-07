import { Router } from 'express';
import { upload } from '../../middlewares/multer';
import { UploadController } from './upload.controller';

const router = Router();

// Upload single image via multipart/form-data or JSON base64
router.post(
  '/image',
  upload.single('file'),
  UploadController.uploadSingleImage,
);

// Upload multiple images
router.post(
  '/multiple-images',
  upload.array('files', 10),
  UploadController.uploadMultipleImages,
);

export const UploadRoutes = router;
