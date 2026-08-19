import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

export const createApiRouter = (taskController: TaskController): Router => {
  const router = Router();

  router.get('/tasks/:taskId/hydrate', taskController.hydrateTask);
  router.post('/tasks/submit', taskController.submitTask);

  return router;
};