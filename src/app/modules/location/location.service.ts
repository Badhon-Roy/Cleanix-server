import { Location } from './location.model';
import { ILocation } from './location.interface';
import AppError from '../../errors/AppError';

const createLocation = async (userId: string, payload: Partial<ILocation>) => {
  const existingCount = await Location.countDocuments({ user: userId, isDeleted: false });
  
  // If first location, make default automatically
  const shouldBeDefault = existingCount === 0 || !!payload.isDefault;

  if (shouldBeDefault) {
    await Location.updateMany(
      { user: userId, isDeleted: false },
      { $set: { isDefault: false } },
    );
  }

  const newLocation = await Location.create({
    ...payload,
    user: userId,
    isDefault: shouldBeDefault,
  });

  return newLocation;
};

const getMyLocations = async (userId: string) => {
  const locations = await Location.find({ user: userId, isDeleted: false }).sort({
    isDefault: -1,
    createdAt: -1,
  });
  return locations;
};

const updateLocation = async (userId: string, locationId: string, payload: Partial<ILocation>) => {
  const location = await Location.findOne({ _id: locationId, user: userId, isDeleted: false });
  if (!location) {
    throw new AppError(404, 'Service location not found!');
  }

  if (payload.isDefault) {
    await Location.updateMany(
      { user: userId, isDeleted: false },
      { $set: { isDefault: false } },
    );
  }

  const updatedLocation = await Location.findOneAndUpdate(
    { _id: locationId, user: userId, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return updatedLocation;
};

const setDefaultLocation = async (userId: string, locationId: string) => {
  const location = await Location.findOne({ _id: locationId, user: userId, isDeleted: false });
  if (!location) {
    throw new AppError(404, 'Service location not found!');
  }

  await Location.updateMany(
    { user: userId, isDeleted: false },
    { $set: { isDefault: false } },
  );

  const updatedLocation = await Location.findOneAndUpdate(
    { _id: locationId, user: userId, isDeleted: false },
    { $set: { isDefault: true } },
    { new: true },
  );

  return updatedLocation;
};

const deleteLocation = async (userId: string, locationId: string) => {
  const location = await Location.findOne({ _id: locationId, user: userId, isDeleted: false });
  if (!location) {
    throw new AppError(404, 'Service location not found!');
  }

  await Location.findOneAndDelete({ _id: locationId, user: userId });

  // If deleted location was default, make remaining newest location default
  if (location.isDefault) {
    const remaining = await Location.findOne({ user: userId, isDeleted: false }).sort({ createdAt: -1 });
    if (remaining) {
      remaining.isDefault = true;
      await remaining.save();
    }
  }

  return null;
};

export const LocationService = {
  createLocation,
  getMyLocations,
  updateLocation,
  setDefaultLocation,
  deleteLocation,
};
