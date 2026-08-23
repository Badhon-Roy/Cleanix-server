import { Schema, model } from 'mongoose';
import { IPricingConfig } from './pricing.interface';

const pricingConfigSchema = new Schema<IPricingConfig>(
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

export const PricingConfig = model<IPricingConfig>('PricingConfig', pricingConfigSchema);
