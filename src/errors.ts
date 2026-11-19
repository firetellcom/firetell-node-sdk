export interface FieldValidationError {
  field: string;
  messages: string[];
}

export interface FiretellErrorOptions {
  statusCode?: number;
  code?: string;
  errors?: FieldValidationError[];
  raw?: unknown;
  cause?: unknown;
}

/**
 * Base error class for all Firetell SDK errors.
 */
export class FiretellError extends Error {
  readonly statusCode?: number;
  readonly code?: string;
  readonly errors?: FieldValidationError[];
  readonly raw?: unknown;

  constructor(message: string, options: FiretellErrorOptions = {}) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = new.target.name;
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.errors = options.errors;
    this.raw = options.raw;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when API key authentication fails (HTTP 401).
 */
export class FiretellAuthenticationError extends FiretellError {
  constructor(message = 'Authentication failed', options: FiretellErrorOptions = {}) {
    super(message, { ...options, statusCode: options.statusCode ?? 401 });
  }
}

/**
 * Thrown when the API key lacks permission for the requested action (HTTP 403).
 */
export class FiretellPermissionError extends FiretellError {
  constructor(message = 'Permission denied', options: FiretellErrorOptions = {}) {
    super(message, { ...options, statusCode: options.statusCode ?? 403 });
  }
}

/**
 * Thrown when the requested resource does not exist (HTTP 404).
 */
export class FiretellNotFoundError extends FiretellError {
  constructor(message = 'Resource not found', options: FiretellErrorOptions = {}) {
    super(message, { ...options, statusCode: options.statusCode ?? 404 });
  }
}

/**
 * Thrown when request parameters fail validation (HTTP 400 / 422).
 */
export class FiretellValidationError extends FiretellError {
  constructor(message = 'Validation failed', options: FiretellErrorOptions = {}) {
    super(message, { ...options, statusCode: options.statusCode ?? 400 });
  }
}

/**
 * Thrown when a resource conflict occurs (HTTP 409).
 */
export class FiretellConflictError extends FiretellError {
  constructor(message = 'Resource conflict', options: FiretellErrorOptions = {}) {
    super(message, { ...options, statusCode: options.statusCode ?? 409 });
  }
}

export interface FiretellRateLimitErrorOptions extends FiretellErrorOptions {
  retryAfter?: number;
  limit?: number;
  remaining?: number;
}

/**
 * Thrown when the workspace rate limit is exceeded (HTTP 429).
 */
export class FiretellRateLimitError extends FiretellError {
  readonly retryAfter?: number;
  readonly limit?: number;
  readonly remaining?: number;

  constructor(message = 'Rate limit exceeded', options: FiretellRateLimitErrorOptions = {}) {
    super(message, { ...options, statusCode: options.statusCode ?? 429 });
    this.retryAfter = options.retryAfter;
    this.limit = options.limit;
    this.remaining = options.remaining;
  }
}

/**
 * Thrown for other HTTP API errors (4xx / 5xx).
 */
export class FiretellApiError extends FiretellError {
  constructor(message: string, options: FiretellErrorOptions = {}) {
    super(message, options);
  }
}

/**
 * Thrown when a request exceeds the configured timeout.
 */
export class FiretellTimeoutError extends FiretellError {
  readonly timeoutMs: number;

  constructor(timeoutMs: number, options: FiretellErrorOptions = {}) {
    super(`Request timed out after ${timeoutMs}ms`, options);
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Thrown when a network or transport error occurs before receiving an HTTP response.
 */
export class FiretellNetworkError extends FiretellError {
  constructor(message = 'Network error', options: FiretellErrorOptions = {}) {
    super(message, options);
  }
}
