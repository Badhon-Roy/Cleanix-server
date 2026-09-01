import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ReviewController } from './review.controller';

const router = Router();

// Public routes
router.get('/', ReviewController.getAllReviews);
router.get('/featured', ReviewController.getFeaturedReviews);
router.get('/service/:slug', ReviewController.getServiceReviews);
router.get('/team/:teamId', ReviewController.getTeamReviews);
router.get('/booking/:bookingId', ReviewController.getReviewByBooking);

// Protected routes (Customer / Team Leader / Admin)
router.post(
  '/',
  auth('CUSTOMER', 'ADMIN', 'TEAM_LEADER', 'CLEANER'),
  ReviewController.createReview,
);

router.get(
  '/my-reviews',
  auth('CUSTOMER', 'ADMIN', 'TEAM_LEADER', 'CLEANER'),
  ReviewController.getMyReviews,
);

// Role-based moderation updates (Admin can update both isApproved & isFeatured; Team Leader can update isApproved)
router.patch(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN', 'TEAM_LEADER'),
  ReviewController.updateReview,
);

router.patch(
  '/:id/status',
  auth('ADMIN', 'SUPER_ADMIN', 'TEAM_LEADER'),
  ReviewController.updateReview,
);

router.delete(
  '/:id',
  auth('ADMIN', 'SUPER_ADMIN'),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;
