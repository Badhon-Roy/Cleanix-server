import { Router } from 'express';
import { GalleryController } from './gallery.controller';

const router = Router();

router.get('/active', GalleryController.getActiveGallery);
router.get('/admin', GalleryController.getAllGalleryAdmin);
router.post('/', GalleryController.createGalleryItem);
router.post('/bulk', GalleryController.createBulkGalleryItems);
router.post('/delete-bulk', GalleryController.deleteBulkGalleryItems);
router.patch('/:id', GalleryController.updateGalleryItem);
router.delete('/:id', GalleryController.deleteGalleryItem);

export const GalleryRoutes = router;
