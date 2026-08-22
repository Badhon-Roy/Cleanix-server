export type TLoginUser = {
  email: string;
  password: string;
};

export type TRefreshToken = {
  refreshToken: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
};
