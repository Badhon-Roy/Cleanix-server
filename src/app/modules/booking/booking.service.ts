import { Types } from 'mongoose';
import { Booking } from './booking.model';
import AppError from '../../errors/AppError';
import { NewBookingPricingService } from '../newbookingpricing/newbookingpricing.service';
import { Addon } from '../addon/addon.model';
import { ServiceCategory } from '../servicecategory/servicecategory.model';

const createBooking = async (userId: string, payload: any) => {
  const sqft = payload.sqft && payload.sqft > 0 ? payload.sqft : 1200;
  const bedrooms = payload.bedrooms && payload.bedrooms > 0 ? payload.bedrooms : 3;
  const bathrooms = payload.bathrooms && payload.bathrooms > 0 ? payload.bathrooms : 2;
  const selectedAddons = payload.selectedAddons || [];

  // Validate serviceType is a valid ObjectId
  if (!payload.serviceType || !Types.ObjectId.isValid(payload.serviceType)) {
    throw new AppError(400, 'Invalid serviceType: must be a valid ServiceCategory ID');
  }

  // Fetch service category by _id
  const serviceCategoryDoc = await ServiceCategory.findOne({
    _id: payload.serviceType,
    isDeleted: false,
  });

  // Fetch live pricing multipliers configured by Admin
  const pricingConfig = await NewBookingPricingService.getPricingConfig();

  // Base fee from service category price, fallback to pricingConfig.baseFee
  let baseFee = pricingConfig.baseFee || 1500;
  if (serviceCategoryDoc?.price) {
    const parsedPrice = parseFloat(String(serviceCategoryDoc.price).replace(/[^0-9.]/g, ''));
    if (!isNaN(parsedPrice) && parsedPrice > 0) baseFee = parsedPrice;
  }

  const sqftCost = sqft * (pricingConfig.sqftRate || 2.5);
  const bedroomCost = bedrooms * (pricingConfig.bedroomRate || 500);
  const bathroomCost = bathrooms * (pricingConfig.bathroomRate || 400);

  // Fetch active addons to calculate price
  const activeAddons = await Addon.find({ isDeleted: false });
  const addonsTotal = selectedAddons.reduce((acc: number, addonKey: string) => {
    const item = activeAddons.find((a) => a.slug === addonKey || String(a._id) === addonKey);
    return acc + (item ? item.price : 0);
  }, 0);

  const totalAmount = baseFee + sqftCost + bedroomCost + bathroomCost + addonsTotal;

  // Auto-generate Booking Reference
  const randomRefNum = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `#CLN-2026-${randomRefNum}`;

  const paymentStatus = payload.paymentMethod === 'COD' ? 'PENDING' : 'PAID';

  const newBooking = await Booking.create({
    bookingRef,
    user: userId,
    serviceType: new Types.ObjectId(payload.serviceType),
    sqft,
    bedrooms,
    bathrooms,
    selectedAddons,
    scheduledDate: payload.scheduledDate || '2026-08-25',
    timeSlot: payload.timeSlot || '09:00 AM - 11:00 AM',
    address: payload.address || 'Dhaka',
    locationId: payload.locationId,
    paymentMethod: payload.paymentMethod || 'BKASH',
    paymentStatus,
    status: 'CONFIRMED',
    baseFee,
    sqftCost,
    bedroomCost,
    bathroomCost,
    addonsTotal,
    totalAmount,
    notes: payload.notes,
  });

  // Return populated
  return await Booking.findById(newBooking._id)
    .populate('serviceType', 'title slug category badge price heroImage')
    .populate('locationId');
};

const getMyBookings = async (userId: string) => {
  const bookings = await Booking.find({ user: userId, isDeleted: false })
    .populate('serviceType', 'title slug category badge price heroImage')
    .populate('locationId')
    .sort({ createdAt: -1 });

  return bookings;
};

const getSingleBooking = async (userId: string, bookingId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, isDeleted: false })
    .populate('serviceType', 'title slug category badge price heroImage')
    .populate('locationId');

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  return booking;
};

const cancelBooking = async (userId: string, bookingId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, isDeleted: false });

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  if (booking.status === 'COMPLETED') {
    throw new AppError(400, 'Completed booking cannot be cancelled!');
  }

  booking.status = 'CANCELLED';
  await booking.save();

  return booking;
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
};
