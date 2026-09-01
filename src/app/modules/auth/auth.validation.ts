import { z } from 'zod';

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(6, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['CUSTOMER', 'CLEANER', 'ADMIN']).default('CUSTOMER'),
    agreeTerms: z
      .union([z.boolean(), z.string()])
      .transform((val) => val === true || val === 'true')
      .refine((val) => val === true, {
        message: 'Please accept the Terms of Service and Privacy Policy to proceed.',
      }),
    avatar: z.string().optional().nullable(),
    dob: z.string().optional().nullable(),
    gender: z.enum(['Male', 'Female', 'Other']).optional().nullable(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const googleLoginValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().optional(),
    avatar: z.string().optional().nullable(),
    role: z.enum(['CUSTOMER', 'CLEANER', 'ADMIN']).optional(),
    phone: z.string().optional(),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().optional(),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const verifyOTPValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

const sendRegisterOTPValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

const verifyRegisterOTPValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  }),
});

export const AuthValidation = {
  registerUserValidationSchema,
  loginUserValidationSchema,
  googleLoginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  verifyOTPValidationSchema,
  resetPasswordValidationSchema,
  sendRegisterOTPValidationSchema,
  verifyRegisterOTPValidationSchema,
};
