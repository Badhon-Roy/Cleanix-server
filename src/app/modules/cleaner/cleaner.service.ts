import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Cleaner } from './cleaner.model';
import { User } from '../user/user.model';
import { Team } from '../team/team.model';
import { TeamAssignment } from '../teamAssignment/teamAssignment.model';
import { Review } from '../review/review.model';
import { ICleaner } from './cleaner.interface';
import { sendEmail, generateCleanerApprovalEmailHTML } from '../../utils/sendEmail';

const getAllCleanersFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) filter.status = query.status;
  if (query.isApproved !== undefined) filter.isApproved = query.isApproved === 'true';
  if (query.isAvailable !== undefined) filter.isAvailable = query.isAvailable === 'true';

  const cleaners = await Cleaner.find(filter)
    .populate('user', 'name email phone role status isApproved')
    .sort({ createdAt: -1 });

  return cleaners;
};

const getCleanerByIdFromDB = async (id: string) => {
  const cleaner = await Cleaner.findById(id).populate('user', 'name email phone role status isApproved');
  if (!cleaner || cleaner.isDeleted) {
    throw new AppError(404, 'Cleaner profile not found');
  }
  return cleaner;
};

const updateCleanerProfileInDB = async (userId: string, payload: Partial<ICleaner>) => {
  const cleaner = await Cleaner.findOne({ user: userId, isDeleted: false });
  if (!cleaner) {
    throw new AppError(404, 'Cleaner profile not found');
  }

  const updatedCleaner = await Cleaner.findOneAndUpdate({ user: userId }, payload, {
    new: true,
    runValidators: true,
  });

  return updatedCleaner;
};

const updateCleanerApprovalInDB = async (cleanerId: string, payload: { status: 'PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED'; isApproved: boolean }) => {
  const cleaner = await Cleaner.findById(cleanerId);
  if (!cleaner || cleaner.isDeleted) {
    throw new AppError(404, 'Cleaner profile not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Update Cleaner Collection
    cleaner.status = payload.status;
    cleaner.isApproved = payload.isApproved;
    await cleaner.save({ session });

    // 2. Sync User Collection
    await User.findByIdAndUpdate(
      cleaner.user,
      {
        status: payload.status,
        isApproved: payload.isApproved,
      },
      { session, new: true },
    );

    await session.commitTransaction();
    await session.endSession();

    // 3. Send Professional Approval Email Notification upon ACCEPTANCE
    if (payload.status === 'APPROVED' && payload.isApproved) {
      try {
        const html = generateCleanerApprovalEmailHTML(cleaner.name, cleaner.email);
        await sendEmail({
          to: cleaner.email,
          subject: 'Cleanix - Your Cleaner Staff Account Has Been Approved! 🎉',
          html,
        });
      } catch (emailErr) {
        console.error('⚠️ [APPROVAL EMAIL NOTICE] Failed to deliver approval email:', emailErr);
      }
    }

    return cleaner;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

const getCleanerProfileMeFromDB = async (userId: string) => {
  let cleaner = await Cleaner.findOne({ user: userId, isDeleted: false }).populate(
    'user',
    'name email phone role status isApproved',
  );
  if (!cleaner) {
    cleaner = await Cleaner.findById(userId).populate(
      'user',
      'name email phone role status isApproved',
    );
  }
  if (!cleaner || cleaner.isDeleted) {
    throw new AppError(404, 'Cleaner profile not found');
  }

  // Find assignments for this cleaner / cleaner squad
  const team = await Team.findOne({
    isDeleted: false,
    $or: [
      { leader: cleaner._id },
      { members: cleaner._id },
      { leader: cleaner.user },
      { members: cleaner.user },
    ],
  });

  const orConds: Record<string, any>[] = [{ assignedCleaners: cleaner._id }];
  if (team) {
    orConds.push({ team: team._id });
  }

  const assignments = await TeamAssignment.find({
    $or: orConds,
    isDeleted: false,
  }).populate('booking');

  const totalJobsCount = assignments.length;
  const completedAssignments = assignments.filter(
    (a) => a.status === 'COMPLETED' || (a.booking as any)?.status === 'COMPLETED',
  );
  const completedCount = completedAssignments.length;
  const totalEstimatedEarnings = assignments.reduce(
    (sum, a) => sum + (Number(a.cleanerPoolPayout) || 0),
    0,
  );

  // Backend review & rating calculations
  const bookingIds = assignments
    .map((a) => (a.booking as any)?._id)
    .filter(Boolean);

  const reviews = await Review.find({ booking: { $in: bookingIds } });

  let ratingValue = '5.0';
  if (reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length;
    ratingValue = avg.toFixed(1);
  } else if (cleaner.rating) {
    ratingValue = Number(cleaner.rating).toFixed(1);
  }

  const cleanerObj: Record<string, any> = cleaner.toObject();
  cleanerObj.dashboardStats = {
    totalJobsCount,
    completedCount,
    totalEstimatedEarnings,
    ratingValue,
    totalReviewsCount: reviews.length,
  };

  return cleanerObj;
};

const toggleDutyStatusInDB = async (
  userId: string,
  targetStatus?: 'ON_DUTY' | 'OFF_DUTY' | 'IN_SERVICE',
) => {
  let cleaner = await Cleaner.findOne({ user: userId, isDeleted: false });
  if (!cleaner) {
    cleaner = await Cleaner.findById(userId);
  }
  if (!cleaner || cleaner.isDeleted) {
    throw new AppError(404, 'Cleaner profile not found');
  }

  const newStatus = targetStatus
    ? targetStatus
    : cleaner.dutyStatus === 'ON_DUTY' || cleaner.dutyStatus === 'IN_SERVICE'
    ? 'OFF_DUTY'
    : 'ON_DUTY';

  const now = new Date();

  if (newStatus === 'ON_DUTY') {
    cleaner.dutyStatus = 'ON_DUTY';
    cleaner.dutyStartedAt = now;
    cleaner.isAvailable = true;
  } else if (newStatus === 'OFF_DUTY') {
    if (cleaner.dutyStartedAt) {
      const durationMs = now.getTime() - new Date(cleaner.dutyStartedAt).getTime();
      const minutes = Math.max(1, Math.floor(durationMs / (1000 * 60)));
      cleaner.totalDutyMinutes = (cleaner.totalDutyMinutes || 0) + minutes;
    }
    cleaner.dutyStatus = 'OFF_DUTY';
    cleaner.dutyEndedAt = now;
    cleaner.isAvailable = false;
  } else if (newStatus === 'IN_SERVICE') {
    cleaner.dutyStatus = 'IN_SERVICE';
    cleaner.isAvailable = false;
  }

  await cleaner.save();
  return cleaner;
};

export const CleanerService = {
  getAllCleanersFromDB,
  getCleanerByIdFromDB,
  getCleanerProfileMeFromDB,
  updateCleanerProfileInDB,
  updateCleanerApprovalInDB,
  toggleDutyStatusInDB,
};
