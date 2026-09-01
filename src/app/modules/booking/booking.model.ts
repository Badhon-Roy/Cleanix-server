import { Schema, model } from 'mongoose';
import { IBooking, IBookingServiceItem } from './booking.interface';

const bookingServiceItemSchema = new Schema<IBookingServiceItem>(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
    addOn: { type: Boolean, required: true, default: false },
  },
  { _id: false },
);

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
    coverageArea: {
      type: Schema.Types.ObjectId,
      ref: 'CoverageArea',
      required: true,
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
      enum: [
        'PENDING',
        'SCHEDULED',
        'CONFIRMED',
        'ASSIGNED',
        'EN_ROUTE',
        'IN_PROGRESS',
        'COMPLETION_REQUESTED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'PENDING',
    },
    cleanerTeam: {
      type: String,
      default: 'Unassigned',
    },
    assignedTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    teamRequests: [
      {
        team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
        requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        requestedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
      },
    ],
    services: [bookingServiceItemSchema],
    addonsTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    customFieldValues: {
      type: Schema.Types.Mixed,
    },
    notes: {
      type: String,
    },
    proofOfWork: {
      beforePhotos: [{ type: String }],
      afterPhotos: [{ type: String }],
      notes: { type: String, default: '' },
      checklist: [
        {
          id: { type: Number },
          text: { type: String },
          done: { type: Boolean, default: false },
        },
      ],
      submittedAt: { type: Date },
      approvedAt: { type: Date },
      rating: { type: Number },
      feedback: { type: String },
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
