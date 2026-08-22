import { Types } from 'mongoose';

export type TGender = 'Male' | 'Female' | 'Other';
export type TCleanerStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED';

export interface ICleaner {
  _id?: string;
  user: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dob?: string;
  gender?: TGender;
  nidNumber?: string;
  status: TCleanerStatus;
  isApproved: boolean;
  isAvailable: boolean;
  rating: number;
  totalJobsDone: number;
  totalEarnings: number;
  coverageArea?: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
