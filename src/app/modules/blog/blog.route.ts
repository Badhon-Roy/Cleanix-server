import express from 'express';
import { BlogController } from './blog.controller';

const router = express.Router();

router.get('/', BlogController.getAllBlogs);
router.get('/:slug', BlogController.getBlogBySlug);
router.post('/', BlogController.createBlog);
router.patch('/:slug', BlogController.updateBlog);
router.put('/:slug', BlogController.updateBlog);
router.delete('/:slug', BlogController.deleteBlog);

export const BlogRoutes = router;
