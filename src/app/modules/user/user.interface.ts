import { Model, HydratedDocument } from 'mongoose';

export type TUserRole = 'CUSTOMER' | 'CLEANER' | 'ADMIN';
export type TUserStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED';
export type TGender = 'Male' | 'Female' | 'Other';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: TUserRole;
  status: TUserStatus;
  isApproved: boolean;
  isDeleted: boolean;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  passwordResetOTP?: string;
  passwordResetExpiresAt?: Date;
  isOTPVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<HydratedDocument<IUser> | null>;
  isPasswordMatched(givenPassword: string, savedPassword?: string): Promise<boolean>;
}
