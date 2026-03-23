import { STATUS_CODES } from './status.codes';
// ================= BASE ERROR =================
class BaseError extends Error {
  constructor(
    public readonly name: string,
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

// ================= COMMON ERRORS =================

// 🔴 400 - Validation Error (input issues)
export class ValidationError extends BaseError {
  constructor(message = 'Invalid request data') {
    super('VALIDATION_ERROR', STATUS_CODES.BAD_REQUEST, message);
  }
}

// 🔴 401 - Unauthorized
export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', STATUS_CODES.UNAUTHORIZED, message);
  }
}

// 🔴 403 - Forbidden
export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super('FORBIDDEN', STATUS_CODES.FORBIDDEN, message);
  }
}

// 🔴 404 - Not Found
export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', STATUS_CODES.NOT_FOUND, message);
  }
}

// 🔴 409 - Conflict (duplicates)
export class ConflictError extends BaseError {
  constructor(message = 'Resource already exists') {
    super('CONFLICT', STATUS_CODES.CONFLICT, message);
  }
}

// 🔴 422 - Business Rule Violation
export class UnprocessableEntityError extends BaseError {
  constructor(message = 'Business rule violation') {
    super('UNPROCESSABLE_ENTITY', STATUS_CODES.UNPROCESSABLE_ENTITY, message);
  }
}

// 🔴 500 - Internal Server Error
export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error') {
    super('INTERNAL_SERVER_ERROR', STATUS_CODES.INTERNAL_SERVER_ERROR, message);
  }
}