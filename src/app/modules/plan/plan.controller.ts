import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PlanService } from './plan.service';

const createPlan = catchAsync(async (req, res) => {
  const result = await PlanService.createPlanInDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Pricing plan card created successfully!',
    data: result,
  });
});

const getAllPlans = catchAsync(async (req, res) => {
  const result = await PlanService.getAllPlansFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pricing plans retrieved successfully',
    data: result,
  });
});

const getPlanById = catchAsync(async (req, res) => {
  const result = await PlanService.getPlanByIdFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pricing plan fetched successfully',
    data: result,
  });
});

const updatePlan = catchAsync(async (req, res) => {
  const result = await PlanService.updatePlanInDB(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pricing plan updated successfully',
    data: result,
  });
});

const deletePlan = catchAsync(async (req, res) => {
  const result = await PlanService.deletePlanFromDB(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pricing plan deleted successfully',
    data: result,
  });
});

export const PlanController = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};
