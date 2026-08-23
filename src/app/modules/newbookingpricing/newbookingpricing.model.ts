import { Schema, model } from 'mongoose';
import { INewBookingPricing } from './newbookingpricing.interface';

const newBookingPricingSchema = new Schema<INewBookingPricing>(
  {
    baseFee: { type: Number, required: true, default: 1500 },
    sqftRate: { type: Number, required: true, default: 2.5 },
    bedroomRate: { type: Number, required: true, default: 500 },
    bathroomRate: { type: Number, required: true, default: 400 },
  },
  {
    timestamps: true,
  },
);

export const NewBookingPricing = model<INewBookingPricing>(
  'NewBookingPricing',
  newBookingPricingSchema,
  'newbookingpricing',
);
