import { Types } from 'mongoose';

export interface IReview {
  _id?: string;
  booking: Types.ObjectId;
  customer: Types.ObjectId;
  rating: number;
  feedback?: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
