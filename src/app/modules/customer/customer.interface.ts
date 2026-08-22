import { Types } from 'mongoose';

export interface ICustomer {
  _id?: string;
  user: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  city?: string;
  totalBookings: number;
  spentAmount: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
