import { Schema, model } from 'mongoose';
import { IPlan } from './plan.interface';

const PlanSchema = new Schema<IPlan>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Plan title is required'],
      trim: true,
    },
    subtitleBn: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: String,
      required: [true, 'Price is required'],
      trim: true,
    },
    pricePeriodBn: {
      type: String,
      default: '/ মাস (Monthly)',
      trim: true,
    },
    category: {
      type: String,
      default: 'SUBSCRIPTION',
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    popularLabel: {
      type: String,
      default: '★ MOST POPULAR',
      trim: true,
    },
    vipBadge: {
      type: String,
      default: '',
      trim: true,
    },
    isAddonFree: {
      type: Boolean,
      default: false,
    },
    ctaText: {
      type: String,
      default: 'Select Plan',
      trim: true,
    },
    ctaHref: {
      type: String,
      default: '/contact',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
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

export const Plan = model<IPlan>('Plan', PlanSchema);
