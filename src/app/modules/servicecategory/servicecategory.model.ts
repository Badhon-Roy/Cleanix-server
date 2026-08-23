import { Schema, model } from 'mongoose';
import { IServiceCategory } from './servicecategory.interface';

const bookingFieldOptionSchema = new Schema(
  {
    label: { type: String },
    value: { type: String },
    price: { type: Number, default: 0 },
  },
  { _id: false },
);

const bookingFieldConfigSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    fieldType: {
      type: String,
      enum: ['COUNTER', 'NUMBER', 'SELECT', 'RADIO', 'TEXT'],
      default: 'COUNTER',
    },
    isPredefined: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    defaultValue: { type: Schema.Types.Mixed },
    unit: { type: String },
    unitPrice: { type: Number, default: 0 },
    options: [bookingFieldOptionSchema],
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true, default: 'HOME CARE' },
    badge: { type: String, required: true, default: 'B2C HOME CLEANING' },
    price: { type: String, required: true, default: '৳3,500 BDT' },
    slaTime: { type: String, default: '30 Mins SLA' },
    heroImage: { type: String, default: '/RESIDENTIAL-DEEP-CLEANING.png' },
    contentImage: {
      type: String,
      default: 'https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400',
    },
    shortDesc: { type: String, required: true },
    introParagraph1: { type: String },
    introParagraph2: { type: String },
    offersTitle: { type: String, default: 'WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)' },
    offersDesc: { type: String, default: 'ঢাকার অ্যাপার্টমেন্ট ও কমার্শিয়াল ফ্লোরের জন্য ডিপ রিসেট সার্ভিস।' },
    offers: [
      {
        iconName: { type: String },
        title: { type: String },
        desc: { type: String },
      },
    ],
    whyChooseTitle: { type: String },
    whyChooseDesc: { type: String },
    whyChoosePoints: [
      {
        title: { type: String },
        desc: { type: String },
      },
    ],
    faqs: [
      {
        num: { type: String },
        question: { type: String },
        answer: { type: String },
      },
    ],
    fields: [bookingFieldConfigSchema],
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const ServiceCategory = model<IServiceCategory>(
  'ServiceCategory',
  serviceCategorySchema,
  'servicecategory',
);
