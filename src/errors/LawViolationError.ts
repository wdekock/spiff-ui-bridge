export interface LawViolationDetail {
  field: string;
  code: string;
  message: string;
}

export class LawViolationError extends Error {
  public readonly statusCode: number = 422;
  public readonly violations: LawViolationDetail[];

  constructor(violations: LawViolationDetail[], message = 'Semantic law validation failed') {
    super(message);
    this.name = 'LawViolationError';
    this.violations = violations;
    Object.setPrototypeOf(this, LawViolationError.prototype);
  }
}
