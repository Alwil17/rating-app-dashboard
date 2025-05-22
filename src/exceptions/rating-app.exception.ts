export class RatingAppException extends Error {
  public status?: number;
  public details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "RatingAppException";
    this.status = status;
    this.details = details;
    Error.captureStackTrace?.(this, RatingAppException);
  }
}