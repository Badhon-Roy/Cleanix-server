import multer from 'multer';
import { NextFunction, Request, Response } from 'express';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const parseBodyData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body?.data) {
    try {
      const parsed = JSON.parse(req.body.data);
      req.body = { ...parsed, ...req.body };
      delete req.body.data;
    } catch (error) {
      // Proceed if not JSON string
    }
  }
  next();
};
