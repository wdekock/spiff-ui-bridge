import { Request, Response } from 'express';
import { TaskHydrationService } from '../services/TaskHydrationService.js';
import { LawValidationService } from '../services/LawValidationService.js';
import { LawViolationError } from '../errors/LawViolationError.js';

export class TaskController {
  constructor(
    private readonly hydrationService: TaskHydrationService,
    private readonly validationService: LawValidationService
  ) {}

  public hydrateTask = async (req: Request, res: Response): Promise<Response> => {
    const { taskId } = req.params;
    const { qStepId, entityName, entityId } = req.query;

    if (!qStepId || !entityName) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Missing required query parameters: qStepId and entityName',
      });
    }

    try {
      const data = await this.hydrationService.hydrateTask({
        taskId,
        qStepId: String(qStepId),
        entityName: String(entityName),
        entityId: entityId ? String(entityId) : undefined,
      });

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: 'HYDRATION_FAILED', message: error.message });
    }
  };

  public submitTask = async (req: Request, res: Response): Promise<Response> => {
    const { taskId, qStepId, entityName, payload } = req.body;

    if (!taskId || !qStepId || !entityName || !payload) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Missing required body fields: taskId, qStepId, entityName, payload',
      });
    }

    try {
      const validatedData = await this.validationService.validateSubmission({
        taskId,
        qStepId,
        entityName,
        payload,
      });

      return res.status(200).json({
        status: 'ACCEPTED',
        taskId,
        qStepId,
        data: validatedData,
      });
    } catch (error: any) {
      if (error instanceof LawViolationError) {
        return res.status(error.statusCode).json({
          status: 'REJECTED_BY_LAW',
          taskId,
          qStepId,
          timestamp: new Date().toISOString(),
          violations: error.violations,
        });
      }

      return res.status(500).json({ error: 'VALIDATION_FAILED', message: error.message });
    }
  };
}