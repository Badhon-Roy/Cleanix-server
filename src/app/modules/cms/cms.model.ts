import { Schema, model } from 'mongoose';
import { ICMS } from './cms.interface';

const cmsSchema = new Schema<ICMS>(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CMS = model<ICMS>('CMS', cmsSchema);
