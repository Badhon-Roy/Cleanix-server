import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { upload, parseBodyData } from '../../middlewares/multer';

const router = Router();

router.post(
  '/register',
  upload.single('file'),
  parseBodyData,
  validateRequest(AuthValidation.registerUserValidationSchema),
  AuthController.register,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginUserValidationSchema),
  AuthController.login,
);

router.post(
  '/google-login',
  validateRequest(AuthValidation.googleLoginValidationSchema),
  AuthController.googleLogin,
);

// Google OAuth 2.0 Consent Screen Redirect
router.get('/google', AuthController.googleAuth);

// Google OAuth 2.0 Callback Handler
router.get('/google/callback', AuthController.googleAuthCallback);

router.get(
  '/me',
  auth('CUSTOMER', 'CLEANER', 'ADMIN'),
  AuthController.getMe,
);

router.post(
  '/change-password',
  auth('CUSTOMER', 'CLEANER', 'ADMIN'),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);

export const AuthRoutes = router;
