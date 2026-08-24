import { Types } from 'mongoose';

export type TGender = 'Male' | 'Female' | 'Other';
export type TCleanerStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED';
export type TDutyStatus = 'ON_DUTY' | 'OFF_DUTY' | 'IN_SERVICE';

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
  dutyStatus: TDutyStatus;
  dutyStartedAt?: Date | null;
  dutyEndedAt?: Date | null;
  totalDutyMinutes?: number;
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
