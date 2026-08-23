import { Schema, model } from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new Schema<IBooking>(
  {
    bookingRef: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceType: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    sqft: {
      type: Number,
      required: true,
      default: 1200,
    },
    bedrooms: {
      type: Number,
      required: true,
      default: 3,
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 2,
    },
    selectedAddons: {
      type: [String],
      default: [],
    },
    scheduledDate: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    paymentMethod: {
      type: String,
      enum: ['BKASH', 'NAGAD', 'STRIPE', 'COD'],
      required: true,
      default: 'BKASH',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PENDING',
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    baseFee: {
      type: Number,
      required: true,
      default: 1500,
    },
    sqftCost: {
      type: Number,
      required: true,
      default: 3000,
    },
    bedroomCost: {
      type: Number,
      required: true,
      default: 1500,
    },
    bathroomCost: {
      type: Number,
      required: true,
      default: 800,
    },
    addonsTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Booking = model<IBooking>('Booking', bookingSchema);
