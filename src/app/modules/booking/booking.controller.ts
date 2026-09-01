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

const assignTeamToBookingAdmin = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await BookingService.assignTeamToBookingAdmin(bookingId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Field Team assigned to booking service successfully!',
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

const getAvailableBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAvailableBookingsForTeamsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Available unassigned bookings retrieved successfully!',
    data: result,
  });
});

const requestBookingByTeam = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const teamSlug = (req.query.teamSlug as string) || (req.body.teamSlug as string);
  const result = await BookingService.requestBookingByTeamInDB(bookingId, req.user!, teamSlug);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking request sent to admin successfully!',
    data: result,
  });
});

const downloadBookingPDF = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const booking = await BookingService.getSingleBooking(req.user!.id, bookingId);
  const userObj: any = booking.user || {};
  const serviceObj: any = booking.serviceType || {};

  const serviceTitle = typeof serviceObj === 'object' ? serviceObj.title || serviceObj.name || 'Cleaning Service' : 'Cleaning Service';

  const items = Array.isArray(booking.services) && booking.services.length > 0
    ? booking.services.map((s: any) => ({
        description: s.name,
        qty: 1,
        unitPrice: s.value || 0,
        total: s.value || 0,
      }))
    : [
        {
          description: `${serviceTitle} (${booking.scheduledDate || ''})`,
          qty: 1,
          unitPrice: booking.totalAmount || 0,
          total: booking.totalAmount || 0,
        },
      ];

  const { generatePDFInvoiceStream } = await import('../../utils/pdfGenerator');

  generatePDFInvoiceStream(res, {
    title: 'CLEANIX CLEANING SERVICE INVOICE',
    invoiceNumber: booking.bookingRef || `#CLN-${String(booking._id).slice(-6).toUpperCase()}`,
    date: new Date((booking as any).createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    customerName: userObj.name || 'Cleanix Customer',
    customerPhone: userObj.phone,
    customerEmail: userObj.email,
    customerAddress: booking.address || 'Dhaka',
    items,
    subtotal: booking.totalAmount || 0,
    discount: 0,
    totalAmount: booking.totalAmount || 0,
    paymentMethod: booking.paymentMethod || 'BKASH',
    paymentStatus: booking.paymentStatus || 'PAID',
    trxId: `TXN-${String(booking._id).slice(-8).toUpperCase()}`,
    notes: booking.notes,
  });
});

const updateBookingProgress = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const result = await BookingService.updateBookingProgressByTeamInDB(bookingId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking status updated successfully!',
    data: result,
  });
});

const confirmBookingCompletion = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId as string;
  const userId = req.user!.id;
  const result = await BookingService.confirmBookingCompletionInDB(bookingId, userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking completion confirmed successfully!',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
  assignTeamToBookingAdmin,
  cancelBooking,
  getAvailableBookings,
  requestBookingByTeam,
  downloadBookingPDF,
  updateBookingProgress,
  confirmBookingCompletion,
};
