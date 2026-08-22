import { Schema, model } from 'mongoose';
import { IEmailVerification } from './emailVerification.interface';

const emailVerificationSchema = new Schema<IEmailVerification>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const EmailVerification = model<IEmailVerification>(
  'EmailVerification',
  emailVerificationSchema,
);
