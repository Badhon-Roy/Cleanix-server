import { Schema, model } from 'mongoose';
import { ICleaner } from './cleaner.interface';

const cleanerSchema = new Schema<ICleaner>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference ID is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: null,
    },
    nidNumber: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'BLOCKED'],
      default: 'PENDING_APPROVAL',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    totalJobsDone: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    coverageArea: {
      type: [String],
      default: ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara'],
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

export const Cleaner = model<ICleaner>('Cleaner', cleanerSchema);
