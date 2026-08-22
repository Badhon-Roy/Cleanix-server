import { Types } from 'mongoose';

export interface IAdmin {
  _id?: string;
  user: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
