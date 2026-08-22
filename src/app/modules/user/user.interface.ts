import { Model } from 'mongoose';

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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(givenPassword: string, savedPassword?: string): Promise<boolean>;
}
