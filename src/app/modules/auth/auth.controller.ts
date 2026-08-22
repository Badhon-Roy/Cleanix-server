import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../../config';

const getCookieOptions = () => ({
  secure: config.node_env === 'production',
  httpOnly: true,
  sameSite: config.node_env === 'production' ? ('none' as const) : ('lax' as const),
});

const register = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const mime = req.file.mimetype;
    const base64 = req.file.buffer.toString('base64');
    req.body.avatar = `data:${mime};base64,${base64}`;
  }

  const result = await AuthService.registerUser(req.body);
  const { refreshToken, accessToken, user } = result;

  // Set HTTP-Only Cookies directly from Backend
  res.cookie('accessToken', accessToken, {
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('refreshToken', refreshToken, {
    ...getCookieOptions(),
    maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully!',
    data: {
      accessToken,
      user,
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken, user } = result;

  // Set HTTP-Only Cookies directly from Backend
  res.cookie('accessToken', accessToken, {
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...getCookieOptions(),
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      user,
    },
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.googleLogin(req.body);
  const { refreshToken, accessToken, user } = result;

  res.cookie('accessToken', accessToken, {
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...getCookieOptions(),
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Google login successful!',
    data: {
      accessToken,
      user,
    },
  });
});

// Redirect to Google OAuth Consent Screen
const googleAuth = catchAsync(async (req: Request, res: Response) => {
  const role = (req.query.role as string) || 'CUSTOMER';
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: config.google_redirect_uri as string,
    client_id: config.google_client_id as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
    state: role,
  };

  const qs = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${qs}`);
});

// Google OAuth Callback Handler
const googleAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const role = (req.query.state as string) || 'CUSTOMER';

  if (!code) {
    return res.redirect(`${config.frontend_url}/login?error=GoogleAuthFailed`);
  }

  // 1. Exchange authorization code for tokens
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.google_client_id as string,
      client_secret: config.google_client_secret as string,
      redirect_uri: config.google_redirect_uri as string,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token) {
    return res.redirect(`${config.frontend_url}/login?error=TokenExchangeFailed`);
  }

  // 2. Fetch Google User Profile
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const googleUser = await userResponse.json();

  if (!googleUser.email) {
    return res.redirect(`${config.frontend_url}/login?error=GoogleUserNotFound`);
  }

  // 3. Register or Login User via AuthService
  const result = await AuthService.googleLogin({
    email: googleUser.email,
    name: googleUser.name || googleUser.email.split('@')[0],
    avatar: googleUser.picture || undefined,
    role: role as any,
  });

  const { refreshToken, accessToken, user } = result;

  res.cookie('accessToken', accessToken, {
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...getCookieOptions(),
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  // 4. Redirect to Frontend Auth Callback Page
  const frontendCallbackUrl = `${config.frontend_url}/auth/callback?token=${accessToken}&role=${user.role}&status=${user.status}&isApproved=${user.isApproved}`;
  res.redirect(frontendCallbackUrl);
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const { id, role } = req.user!;
  const result = await AuthService.getMe(id, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user!;
  await AuthService.changePassword(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password updated successfully!',
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Verification OTP sent to your email address successfully!',
    data: result,
  });
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyOTP(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OTP verified successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password reset successfully! Please log in with your new password.',
    data: null,
  });
});

export const AuthController = {
  register,
  login,
  googleLogin,
  googleAuth,
  googleAuthCallback,
  getMe,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
