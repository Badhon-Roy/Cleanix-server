import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectService } from './project.service';
import { emitCMSUpdated } from '../../socket/socket';

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getAllProjectsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Projects retrieved successfully!',
    data: result,
  });
});

const getProjectBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await ProjectService.getProjectBySlugFromDB(slug);

  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Project not found!',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Project detail retrieved successfully!',
    data: result,
  });
});

const createProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.createProjectInDB(req.body);

  emitCMSUpdated({ page: 'projects', action: 'create', data: result });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Project created successfully live!',
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await ProjectService.updateProjectInDB(slug, req.body);

  emitCMSUpdated({ page: 'projects', action: 'update', data: result });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Project updated successfully live!',
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await ProjectService.deleteProjectFromDB(slug);

  emitCMSUpdated({ page: 'projects', action: 'delete', slug });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Project deleted successfully live!',
    data: result,
  });
});

export const ProjectController = {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
