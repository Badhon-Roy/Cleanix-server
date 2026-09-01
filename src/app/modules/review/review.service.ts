import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { Review } from './review.model';
import { Booking } from '../booking/booking.model';
import { User } from '../user/user.model';
import { ServiceCategory } from '../servicecategory/servicecategory.model';
import { emitReviewCreated, emitReviewUpdated } from '../../socket/socket';

const createOrUpdateReviewInDB = async (
  userId: string,
  payload: {
    bookingId: string;
    rating: number;
    feedback?: string;
  },
) => {
  const booking = await Booking.findById(payload.bookingId);
  if (!booking || booking.isDeleted) {
    throw new AppError(404, 'Service booking not found!');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User profile not found!');
  }

  const numRating = Math.max(1, Math.min(5, Number(payload.rating) || 5));

  let review = await Review.findOne({ booking: booking._id });

  if (review) {
    review.rating = numRating;
    if (payload.feedback !== undefined) review.feedback = payload.feedback;
    await review.save();
  } else {
    review = await Review.create({
      booking: booking._id,
      customer: new Types.ObjectId(userId),
      rating: numRating,
      feedback: payload.feedback || '',
      isApproved: true,
      isFeatured: false,
    });
  }

  const populated = await Review.findById(review._id)
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    });

  emitReviewCreated(populated);

  return populated;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query.customer) filter.customer = query.customer;
  if (query.isApproved !== undefined) filter.isApproved = query.isApproved === 'true';
  if (query.isFeatured !== undefined) filter.isFeatured = query.isFeatured === 'true';
  if (query.minRating) filter.rating = { $gte: Number(query.minRating) };

  const reviews = await Review.find(filter)
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    })
    .sort({ createdAt: -1 });

  return reviews;
};

const getFeaturedReviewsFromDB = async () => {
  // Only Approved AND Featured reviews can appear on homepage Testimonials
  const reviews = await Review.find({ isApproved: true, isFeatured: true })
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    })
    .sort({ rating: -1, createdAt: -1 })
    .limit(12);

  return reviews;
};

const getApprovedReviewsByServiceFromDB = async (serviceSlugOrId: string) => {
  let serviceCategory = null;
  if (Types.ObjectId.isValid(serviceSlugOrId)) {
    serviceCategory = await ServiceCategory.findById(serviceSlugOrId);
  }
  if (!serviceCategory) {
    serviceCategory = await ServiceCategory.findOne({ slug: serviceSlugOrId, isDeleted: false });
  }

  if (!serviceCategory) {
    return [];
  }

  const bookings = await Booking.find({ serviceType: serviceCategory._id, isDeleted: false }).select('_id');
  const bookingIds = bookings.map((b) => b._id);

  const reviews = await Review.find({
    booking: { $in: bookingIds },
    isApproved: true,
  })
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    })
    .sort({ isFeatured: -1, rating: -1, createdAt: -1 });

  return reviews;
};

const getApprovedReviewsByTeamFromDB = async (teamId: string) => {
  const bookings = await Booking.find({ assignedTeam: teamId, isDeleted: false }).select('_id');
  const bookingIds = bookings.map((b) => b._id);

  const reviews = await Review.find({
    booking: { $in: bookingIds },
  })
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    })
    .sort({ createdAt: -1 });

  return reviews;
};

const getMyReviewsFromDB = async (userId: string) => {
  const reviews = await Review.find({ customer: userId })
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    })
    .sort({ createdAt: -1 });

  return reviews;
};

const getReviewByBookingIdFromDB = async (bookingId: string) => {
  const review = await Review.findOne({ booking: bookingId })
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    });

  return review;
};

const updateReviewStatusInDB = async (
  reviewId: string,
  payload: { isApproved?: boolean; isFeatured?: boolean; rating?: number; feedback?: string },
  userRole?: string,
) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(404, 'Review record not found!');
  }

  // TEAM_LEADER can toggle isApproved, but CANNOT toggle isFeatured (Admin only)
  if (payload.isApproved !== undefined) {
    review.isApproved = Boolean(payload.isApproved);
  }

  if (payload.isFeatured !== undefined) {
    if (userRole === 'TEAM_LEADER') {
      throw new AppError(403, 'Only Admins can feature reviews on the homepage testimonials section!');
    }
    review.isFeatured = Boolean(payload.isFeatured);
  }

  if (payload.rating !== undefined && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
    review.rating = Math.max(1, Math.min(5, Number(payload.rating)));
  }

  if (payload.feedback !== undefined && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
    review.feedback = payload.feedback;
  }

  await review.save();

  const populated = await Review.findById(review._id)
    .populate('customer', 'name email phone avatar')
    .populate({
      path: 'booking',
      select: 'bookingRef serviceType totalAmount scheduledDate assignedTeam',
      populate: [
        { path: 'serviceType', select: 'title slug category badge price heroImage' },
        { path: 'assignedTeam', select: 'teamName teamCode leader rating' },
      ],
    });

  emitReviewUpdated(populated);

  return populated;
};

const deleteReviewFromDB = async (reviewId: string) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new AppError(404, 'Review record not found!');
  }
  emitReviewUpdated({ deletedReviewId: reviewId });
  return review;
};

export const ReviewService = {
  createOrUpdateReviewInDB,
  getAllReviewsFromDB,
  getFeaturedReviewsFromDB,
  getApprovedReviewsByServiceFromDB,
  getApprovedReviewsByTeamFromDB,
  getMyReviewsFromDB,
  getReviewByBookingIdFromDB,
  updateReviewStatusInDB,
  deleteReviewFromDB,
};
