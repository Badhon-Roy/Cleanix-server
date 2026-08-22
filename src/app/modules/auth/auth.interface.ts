import { TGender, TUserRole } from '../user/user.interface';

export type TRegisterUser = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: TUserRole;
  avatar?: string;
  dob?: string;
  gender?: TGender;
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TGoogleLoginUser = {
  email: string;
  name?: string;
  avatar?: string;
  role?: TUserRole;
  phone?: string;
};

export type TRefreshToken = {
  refreshToken: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type TForgotPassword = {
  email: string;
};

export type TVerifyOTP = {
  email: string;
  otp: string;
};

export type TResetPassword = {
  email: string;
  otp: string;
  newPassword: string;
};
