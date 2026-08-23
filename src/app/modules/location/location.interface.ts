import { Types } from 'mongoose';

export interface ILocation {
  _id?: string;
  user: Types.ObjectId;
  tag: string;
  type: 'home' | 'office' | 'other';
  street: string;
  area: string;
  city: string;
  zip?: string;
  isDefault: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
