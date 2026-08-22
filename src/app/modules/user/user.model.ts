import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: 0,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'CLEANER', 'ADMIN'],
      default: 'CUSTOMER',
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'BLOCKED'],
      default: 'APPROVED',
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetOTP: {
      type: String,
      select: 0,
    },
    passwordResetExpiresAt: {
      type: Date,
      select: 0,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

// Hash password before saving
userSchema.pre('save', async function () {
  const user = this;
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
});

// Static method to find user by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email, isDeleted: false }).select('+password +passwordResetOTP +passwordResetExpiresAt');
};

// Static method to compare password
userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword?: string,
) {
  if (!savedPassword) return false;
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
