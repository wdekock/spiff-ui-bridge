import { LawViolationDetail, LawViolationError } from '../errors/LawViolationError.js';

export interface ValidateTaskParams {
  taskId: string;
  qStepId: string;
  entityName: string;
  payload: Record<string, any>;
}

export class LawValidationService {
  public async validateSubmission(params: ValidateTaskParams): Promise<Record<string, any>> {
    const violations: LawViolationDetail[] = [];

    // Base schema checks; expandable via dynamic law manifests
    if (!params.payload || typeof params.payload !== 'object') {
      violations.push({
        field: 'payload',
        code: 'MISSING_PAYLOAD',
        message: 'Submission payload must be a valid JSON object.',
      });
    }

    if (violations.length > 0) {
      throw new LawViolationError(violations);
    }

    return params.payload;
  }
}