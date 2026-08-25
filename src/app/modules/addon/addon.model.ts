import { Schema, model } from 'mongoose';
import { IAddon } from './addon.interface';

const addonSchema = new Schema<IAddon>(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subLabel: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      default: 'ADD-ON',
    },
    iconImage: {
      type: String,
    },
    active: {
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

export const Addon = model<IAddon>('Addon', addonSchema);
