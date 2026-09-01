import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await ReviewService.createOrUpdateReviewInDB(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Customer review and rating submitted successfully!',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviewsFromDB(req.query as Record<string, unknown>);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer reviews fetched successfully!',
    data: result,
  });
});

const getFeaturedReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getFeaturedReviewsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Featured reviews and ratings fetched successfully!',
    data: result,
  });
});

const getServiceReviews = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await ReviewService.getApprovedReviewsByServiceFromDB(slug);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service reviews fetched successfully!',
    data: result,
  });
});

const getTeamReviews = catchAsync(async (req: Request, res: Response) => {
  const teamId = req.params.teamId as string;
  const result = await ReviewService.getApprovedReviewsByTeamFromDB(teamId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team reviews fetched successfully!',
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await ReviewService.getMyReviewsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My reviews fetched successfully!',
    data: result,
  });
});

const getReviewByBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await ReviewService.getReviewByBookingIdFromDB(bookingId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking review fetched successfully!',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userRole = req.user?.role;
  const result = await ReviewService.updateReviewStatusInDB(id, req.body, userRole);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review moderation status updated successfully!',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ReviewService.deleteReviewFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully!',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getFeaturedReviews,
  getServiceReviews,
  getTeamReviews,
  getMyReviews,
  getReviewByBooking,
  updateReview,
  deleteReview,
};
