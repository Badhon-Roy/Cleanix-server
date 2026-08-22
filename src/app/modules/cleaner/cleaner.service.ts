import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Cleaner } from './cleaner.model';
import { User } from '../user/user.model';
import { ICleaner } from './cleaner.interface';

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

    return cleaner;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const CleanerService = {
  getAllCleanersFromDB,
  getCleanerByIdFromDB,
  updateCleanerProfileInDB,
  updateCleanerApprovalInDB,
};
