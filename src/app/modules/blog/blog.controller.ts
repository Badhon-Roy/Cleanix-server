import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogService } from './blog.service';
import { emitCMSUpdated } from '../../socket/socket';

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllBlogsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs retrieved successfully!',
    data: result,
  });
});

const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await BlogService.getBlogBySlugFromDB(slug);

  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Blog post not found!',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog article retrieved successfully!',
    data: result,
  });
});

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.createBlogInDB(req.body);

  emitCMSUpdated({ page: 'blog', action: 'create', data: result });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Blog article created successfully live!',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await BlogService.updateBlogInDB(slug, req.body);

  emitCMSUpdated({ page: 'blog', action: 'update', data: result });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog article updated successfully live!',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await BlogService.deleteBlogFromDB(slug);

  emitCMSUpdated({ page: 'blog', action: 'delete', slug });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog article deleted successfully live!',
    data: result,
  });
});

export const BlogController = {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
