import express from 'express';
import { ProjectController } from './project.controller';

const router = express.Router();

router.get('/', ProjectController.getAllProjects);
router.get('/:slug', ProjectController.getProjectBySlug);
router.post('/', ProjectController.createProject);
router.patch('/:slug', ProjectController.updateProject);
router.put('/:slug', ProjectController.updateProject);
router.delete('/:slug', ProjectController.deleteProject);

export const ProjectRoutes = router;
