import { Schema, model } from 'mongoose';
import { IGalleryItem } from './gallery.interface';

const gallerySchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: [true, 'Gallery item title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO'],
      default: 'IMAGE',
    },
    url: {
      type: String,
      required: [true, 'Media URL is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ status: 1, isDeleted: 1, createdAt: -1 });

export const Gallery = model<IGalleryItem>('Gallery', gallerySchema);
