import { Schema, model } from 'mongoose';
import { ICoverageArea } from './coverage.interface';

const coverageAreaSchema = new Schema<ICoverageArea>(
  {
    zoneName: {
      type: String,
      required: [true, 'Zone name is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District name is required'],
      trim: true,
      default: 'Dhaka',
    },
    areasIncluded: {
      type: [String],
      required: [true, 'At least one area must be included'],
      default: [],
    },
    zipCodes: {
      type: [String],
      default: [],
    },
    desc: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
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

export const CoverageArea = model<ICoverageArea>('CoverageArea', coverageAreaSchema);
