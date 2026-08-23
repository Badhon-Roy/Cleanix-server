import { Booking } from './booking.model';
import { IBooking } from './booking.interface';
import AppError from '../../errors/AppError';

const addonPriceMap: Record<string, number> = {
  sofa: 2000,
  oven: 1200,
  fridge: 1000,
  window: 800,
  pet: 1500,
};

const createBooking = async (userId: string, payload: Partial<IBooking>) => {
  const sqft = payload.sqft && payload.sqft > 0 ? payload.sqft : 1200;
  const bedrooms = payload.bedrooms && payload.bedrooms > 0 ? payload.bedrooms : 3;
  const bathrooms = payload.bathrooms && payload.bathrooms > 0 ? payload.bathrooms : 2;
  const selectedAddons = payload.selectedAddons || [];

  const baseFee = 1500;
  const sqftCost = sqft * 2.5;
  const bedroomCost = bedrooms * 500;
  const bathroomCost = bathrooms * 400;

  const addonsTotal = selectedAddons.reduce((acc, addonKey) => {
    return acc + (addonPriceMap[addonKey] || 0);
  }, 0);

  const totalAmount = baseFee + sqftCost + bedroomCost + bathroomCost + addonsTotal;

  // Auto-generate Booking Reference
  const randomRefNum = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `#CLN-2026-${randomRefNum}`;

  const paymentStatus = payload.paymentMethod === 'COD' ? 'PENDING' : 'PAID';
  const status = 'CONFIRMED';

  const newBooking = await Booking.create({
    bookingRef,
    user: userId,
    serviceType: payload.serviceType || 'RESIDENTIAL',
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
    status,
    baseFee,
    sqftCost,
    bedroomCost,
    bathroomCost,
    addonsTotal,
    totalAmount,
    notes: payload.notes,
  });

  return newBooking;
};

const getMyBookings = async (userId: string) => {
  const bookings = await Booking.find({ user: userId, isDeleted: false })
    .populate('locationId')
    .sort({ createdAt: -1 });

  return bookings;
};

const getSingleBooking = async (userId: string, bookingId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, isDeleted: false })
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
