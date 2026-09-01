import { Schema, model } from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriptionRef: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
    },
    planId: {
      type: String,
      required: true,
      default: 'STANDARD',
    },
    planTitle: {
      type: String,
      required: true,
      default: 'STANDARD',
    },
    coverageArea: {
      type: Schema.Types.ObjectId,
      ref: 'CoverageArea',
    },
    zoneName: {
      type: String,
      required: true,
      default: 'Dhaka Central Zone',
    },
    streetAddress: {
      type: String,
      required: true,
    },
    selectedAddons: {
      type: [String],
      default: [],
    },
    firstVisitDate: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      default: '09:00 AM - 11:00 AM',
    },
    specialInstructions: {
      type: String,
      default: '',
    },
    billingCycle: {
      type: String,
      enum: ['MONTHLY', 'QUARTERLY', 'YEARLY'],
      default: 'MONTHLY',
    },
    totalVisitsPerMonth: {
      type: Number,
      required: true,
      default: 4,
    },
    remainingVisits: {
      type: Number,
      required: true,
      default: 4,
    },
    usedVisits: {
      type: Number,
      required: true,
      default: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['BKASH', 'NAGAD', 'SSLCOMMERZ', 'COD', 'STRIPE'],
      required: true,
      default: 'BKASH',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PAID',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
    },
    trxId: {
      type: String,
      default: '',
    },
    bkashPhone: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
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

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
