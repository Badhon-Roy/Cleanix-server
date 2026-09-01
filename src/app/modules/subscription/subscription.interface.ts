import { Types } from 'mongoose';

export type TSubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED';
export type TSubscriptionPaymentMethod = 'BKASH' | 'NAGAD' | 'SSLCOMMERZ' | 'COD' | 'STRIPE';
export type TSubscriptionPaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface ISubscription {
  _id?: Types.ObjectId | string;
  subscriptionRef: string;
  user: Types.ObjectId;
  plan?: Types.ObjectId;
  planId: string; // e.g. 'BASIC', 'STANDARD', 'PREMIUM'
  planTitle: string;
  coverageArea?: Types.ObjectId;
  zoneName: string;
  streetAddress: string;
  selectedAddons: string[];
  firstVisitDate: string;
  timeSlot: string;
  specialInstructions?: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  totalVisitsPerMonth: number;
  remainingVisits: number;
  usedVisits: number;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: TSubscriptionPaymentMethod;
  paymentStatus: TSubscriptionPaymentStatus;
  status: TSubscriptionStatus;
  trxId?: string;
  bkashPhone?: string;
  startDate: Date;
  endDate: Date;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
