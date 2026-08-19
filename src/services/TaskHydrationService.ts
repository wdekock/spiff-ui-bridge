import { MetastructClient } from '../clients/MetastructClient.js';

export interface HydrateTaskParams {
  taskId: string;
  qStepId: string;
  entityName: string;
  entityId?: string;
}

export interface HydratedTaskPayload {
  taskId: string;
  qStepId: string;
  entityName: string;
  initialValues: Record<string, any>;
}

export class TaskHydrationService {
  constructor(private readonly metastructClient: MetastructClient) {}

  public async hydrateTask(params: HydrateTaskParams): Promise<HydratedTaskPayload> {
    let initialValues: Record<string, any> = {};

    if (params.entityId) {
      initialValues = await this.metastructClient.getEntity(params.entityName, params.entityId);
    }

    return {
      taskId: params.taskId,
      qStepId: params.qStepId,
      entityName: params.entityName,
      initialValues,
    };
  }
}