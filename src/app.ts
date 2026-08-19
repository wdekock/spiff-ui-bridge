import express, { Express, Request, Response, NextFunction } from 'express';
import { config } from './config/environment.js';
import { MetastructClient } from './clients/MetastructClient.js';
import { TaskHydrationService } from './services/TaskHydrationService.js';
import { LawValidationService } from './services/LawValidationService.js';
import { TaskController } from './controllers/taskController';
import { ServiceTaskController } from './controllers/ServiceTaskController';
import { createApiRouter } from './routes/apiRouter';

export const createApp = (): Express => {
  const app = express();

  app.use(express.json());

  // Dependency Injection Hierarchy
  const metastructClient = new MetastructClient(config);
  const hydrationService = new TaskHydrationService(metastructClient);
  const validationService = new LawValidationService();

  const taskController = new TaskController(hydrationService, validationService);
  const serviceTaskController = new ServiceTaskController(metastructClient);

  // Health Check Endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', environment: config.nodeEnv });
  });

  // Mount API Routers
  const apiRouter = createApiRouter(taskController);
  apiRouter.post('/service/mutate', serviceTaskController.mutateEntity);

  app.use('/api/v1', apiRouter);

  // Global Fallback Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  });

  return app;
};

if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[spiff-ui-bridge] Running on port ${config.port} in ${config.nodeEnv} mode`);
  });
}