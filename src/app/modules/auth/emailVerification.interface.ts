export interface IEmailVerification {
  _id?: string;
  email: string;
  otp: string;
  expiresAt: Date;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
