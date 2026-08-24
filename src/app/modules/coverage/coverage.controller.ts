import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CoverageService } from './coverage.service';

const createCoverage = catchAsync(async (req: Request, res: Response) => {
  const result = await CoverageService.createCoverageInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Coverage area zone created successfully',
    data: result,
  });
});

const getAllCoverages = catchAsync(async (req: Request, res: Response) => {
  const result = await CoverageService.getAllCoveragesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coverage area zones fetched successfully',
    data: result,
  });
});

const getCoverageById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CoverageService.getCoverageByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coverage area zone retrieved successfully',
    data: result,
  });
});

const updateCoverage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CoverageService.updateCoverageInDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coverage area zone updated successfully',
    data: result,
  });
});

const deleteCoverage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CoverageService.deleteCoverageFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Coverage area zone deleted successfully',
    data: result,
  });
});

export const CoverageController = {
  createCoverage,
  getAllCoverages,
  getCoverageById,
  updateCoverage,
  deleteCoverage,
};
