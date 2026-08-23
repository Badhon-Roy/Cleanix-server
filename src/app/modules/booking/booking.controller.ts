import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.createBooking(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Cleaning service booking confirmed successfully!',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getMyBookings(req.user!.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer bookings retrieved successfully!',
    data: result,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await BookingService.getSingleBooking(req.user!.id, bookingId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking details retrieved successfully!',
    data: result,
  });
});

const getAllBookingsAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookingsAdmin();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All system bookings retrieved successfully for admin!',
    data: result,
  });
});

const updateBookingStatusAdmin = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await BookingService.updateBookingStatusAdmin(bookingId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking status updated successfully!',
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await BookingService.cancelBooking(req.user!.id, bookingId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking cancelled successfully!',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
  cancelBooking,
};
