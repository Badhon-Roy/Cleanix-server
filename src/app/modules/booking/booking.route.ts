import express from 'express';
import auth from '../../middlewares/auth';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post('/', auth('CUSTOMER', 'ADMIN'), BookingController.createBooking);
router.get('/me', auth('CUSTOMER', 'ADMIN'), BookingController.getMyBookings);
router.get('/:bookingId', auth('CUSTOMER', 'ADMIN'), BookingController.getSingleBooking);
router.patch('/:bookingId/cancel', auth('CUSTOMER', 'ADMIN'), BookingController.cancelBooking);

export const BookingRoutes = router;
