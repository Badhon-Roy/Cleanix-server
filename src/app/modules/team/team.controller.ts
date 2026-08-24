import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TeamService } from './team.service';
import { emitTeamUpdated, emitCleanerUpdated, emitLeaderRequestUpdated } from '../../socket/socket';

const createTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.createTeamInDB(req.body);

  emitTeamUpdated(result);
  emitLeaderRequestUpdated(result);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Team squad created successfully',
    data: result,
  });
});

const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.getAllTeamsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teams retrieved successfully',
    data: result,
  });
});

const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TeamService.getTeamByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team details retrieved successfully',
    data: result,
  });
});

const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TeamService.updateTeamInDB(id, req.body);

  emitTeamUpdated(result);
  emitLeaderRequestUpdated(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team squad updated successfully',
    data: result,
  });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await TeamService.deleteTeamFromDB(id);

  emitTeamUpdated(result);
  emitLeaderRequestUpdated(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team squad deleted successfully',
    data: result,
  });
});

const respondLeaderRequest = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { id: userId } = req.user!;
  const { action } = req.body;

  const result = await TeamService.respondLeaderRequestInDB(id, userId, action);

  emitTeamUpdated(result);
  emitCleanerUpdated(result);
  emitLeaderRequestUpdated(result);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Team Leader invitation request ${action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED'} successfully`,
    data: result,
  });
});

export const TeamController = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  respondLeaderRequest,
  deleteTeam,
};
