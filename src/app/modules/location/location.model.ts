import { Schema, model } from 'mongoose';
import { ILocation } from './location.interface';

const locationSchema = new Schema<ILocation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    tag: {
      type: String,
      required: [true, 'Location tag name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home',
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
    },
    city: {
      type: String,
      default: 'Dhaka',
      trim: true,
    },
    zip: {
      type: String,
      default: '1200',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
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

export const Location = model<ILocation>('Location', locationSchema);
