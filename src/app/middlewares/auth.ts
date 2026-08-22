import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;

    if (!token) {
      throw new AppError(401, 'You are not authorized!');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role } = decoded;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(403, 'Forbidden! You do not have permission.');
    }

    req.user = decoded as JwtPayload & { id: string; email: string; role: string };
    next();
  });
};

export default auth;
