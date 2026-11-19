import {
  FieldValidationError,
  FiretellApiError,
  FiretellAuthenticationError,
  FiretellConflictError,
  FiretellError,
  FiretellNetworkError,
  FiretellNotFoundError,
  FiretellPermissionError,
  FiretellRateLimitError,
  FiretellTimeoutError,
  FiretellValidationError,
} from './errors.js';
import {
  FetchLike,
  FileUploadInput,
  FiretellClientConfig,
  RequestOptions,
} from './types/common.js';
import { SDK_VERSION } from './version.js';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestParams {
  method: HttpMethod;
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  formData?: FormData;
  options?: RequestOptions;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;

export function normalizeBaseUrl(domain: string): string {
  const trimmed = domain.trim().replace(/\/+$/, '');
  if (!trimmed) {
    throw new FiretellError('Firetell workspace `domain` is required.');
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  if (withProtocol.endsWith('/api/v1')) {
    return withProtocol;
  }

  return `${withProtocol}/api/v1`;
}

export function buildBlobFromFileInput(file: FileUploadInput): Blob {
  if (file.content instanceof Blob) {
    return file.contentType && file.content.type !== file.contentType
      ? new Blob([file.content], { type: file.contentType })
      : file.content;
  }

  const options = file.contentType ? { type: file.contentType } : undefined;
  if (file.content instanceof ArrayBuffer) {
    return new Blob([file.content], options);
  }
  return new Blob([new Uint8Array(file.content)], options);
}

export class HttpClient {
  readonly baseUrl: string;
  private readonly secretKey: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: FetchLike;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: FiretellClientConfig) {
    if (!config || typeof config !== 'object') {
      throw new FiretellError('Firetell client configuration is required.');
    }
    if (!config.domain || !config.domain.trim()) {
      throw new FiretellError('Firetell workspace `domain` is required.');
    }
    if (!config.secretKey || !config.secretKey.trim()) {
      throw new FiretellError('Firetell `secretKey` is required.');
    }

    const fetchFn = config.fetch ?? globalThis.fetch;
    if (typeof fetchFn !== 'function') {
      throw new FiretellError(
        'No fetch implementation available. Use Node.js 18+ or pass a custom `fetch` option.',
      );
    }

    this.baseUrl = normalizeBaseUrl(config.domain);
    this.secretKey = config.secretKey.trim();
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT_MS;
    this.maxRetries = Math.max(0, config.maxRetries ?? DEFAULT_MAX_RETRIES);
    this.fetchImpl = fetchFn;
    this.defaultHeaders = { ...(config.headers ?? {}) };
  }

  async request<T>(params: HttpRequestParams): Promise<T> {
    const url = this.buildUrl(params.path, params.query);
    const timeoutMs = params.options?.timeout ?? this.timeout;
    const headers = this.buildHeaders(params);

    let bodyInit: FormData | string | undefined;
    if (params.formData) {
      bodyInit = params.formData;
    } else if (params.body !== undefined) {
      bodyInit = JSON.stringify(params.body);
    }

    let attempt = 0;

    while (true) {
      const controller = new AbortController();
      let timedOut = false;

      const onExternalAbort = () => controller.abort();
      if (params.options?.signal) {
        if (params.options.signal.aborted) {
          controller.abort();
        } else {
          params.options.signal.addEventListener('abort', onExternalAbort, {
            once: true,
          });
        }
      }

      const timer =
        timeoutMs > 0
          ? setTimeout(() => {
              timedOut = true;
              controller.abort();
            }, timeoutMs)
          : undefined;

      try {
        const response = await this.fetchImpl(url, {
          method: params.method,
          headers,
          body: bodyInit,
          signal: controller.signal,
        });

        if (timer) clearTimeout(timer);
        if (params.options?.signal) {
          params.options.signal.removeEventListener('abort', onExternalAbort);
        }

        if (response.ok) {
          return await this.parseSuccessResponse<T>(response);
        }

        const error = await this.buildApiError(response);

        if (this.shouldRetryStatus(response.status) && attempt < this.maxRetries) {
          const delayMs = this.computeRetryDelay(attempt, response);
          attempt += 1;
          await this.sleep(delayMs);
          continue;
        }

        throw error;
      } catch (err) {
        if (timer) clearTimeout(timer);
        if (params.options?.signal) {
          params.options.signal.removeEventListener('abort', onExternalAbort);
        }

        if (err instanceof FiretellError) {
          throw err;
        }

        if (timedOut) {
          const timeoutError = new FiretellTimeoutError(timeoutMs, { cause: err });
          if (attempt < this.maxRetries) {
            attempt += 1;
            await this.sleep(this.computeBackoffMs(attempt));
            continue;
          }
          throw timeoutError;
        }

        if (params.options?.signal?.aborted) {
          throw new FiretellNetworkError('Request was aborted', { cause: err });
        }

        const message =
          err instanceof Error ? err.message : 'Unexpected network error';
        const networkError = new FiretellNetworkError(message, { cause: err });

        if (attempt < this.maxRetries) {
          attempt += 1;
          await this.sleep(this.computeBackoffMs(attempt));
          continue;
        }

        throw networkError;
      }
    }
  }

  get<T>(
    path: string,
    query?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>({ method: 'GET', path, query, options });
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
    query?: Record<string, unknown>,
  ): Promise<T> {
    return this.request<T>({ method: 'POST', path, body, query, options });
  }

  postForm<T>(
    path: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>({ method: 'POST', path, formData, options });
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>({ method: 'PUT', path, body, options });
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, body, options });
  }

  patchForm<T>(
    path: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>({ method: 'PATCH', path, formData, options });
  }

  delete<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>({ method: 'DELETE', path, body, options });
  }

  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const normalizedPath = path === '' || path === '/'
      ? ''
      : path.startsWith('/')
        ? path
        : `/${path}`;

    const fullUrl = `${this.baseUrl}${normalizedPath}`;

    if (!query) {
      return fullUrl;
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null) {
            searchParams.append(key, String(item));
          }
        }
      } else {
        searchParams.append(key, String(value));
      }
    }

    const qs = searchParams.toString();
    return qs ? `${fullUrl}?${qs}` : fullUrl;
  }

  private buildHeaders(params: HttpRequestParams): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': `firetell-node-sdk/${SDK_VERSION}`,
      ...this.defaultHeaders,
      ...(params.options?.headers ?? {}),
      Authorization: `ApiKey ${this.secretKey}`,
    };

    if (!params.formData && params.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  private async buildApiError(response: Response): Promise<FiretellError> {
    const status = response.status;
    let raw: unknown;

    const text = await response.text().catch(() => '');
    if (text) {
      try {
        raw = JSON.parse(text);
      } catch {
        raw = text;
      }
    }

    const payload =
      raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

    let message = response.statusText || `Request failed with status ${status}`;
    if (typeof payload.message === 'string' && payload.message.trim()) {
      message = payload.message;
    } else if (Array.isArray(payload.message) && payload.message.length > 0) {
      message = payload.message.map(String).join('; ');
    } else if (typeof raw === 'string' && raw.trim()) {
      message = raw.trim();
    }

    const errors = Array.isArray(payload.errors)
      ? (payload.errors as FieldValidationError[])
      : undefined;

    const code = typeof payload.error === 'string' ? payload.error : undefined;
    const baseOpts = { statusCode: status, code, errors, raw };

    switch (status) {
      case 400:
      case 422:
        return new FiretellValidationError(message, baseOpts);
      case 401:
        return new FiretellAuthenticationError(message, baseOpts);
      case 403:
        return new FiretellPermissionError(message, baseOpts);
      case 404:
        return new FiretellNotFoundError(message, baseOpts);
      case 409:
        return new FiretellConflictError(message, baseOpts);
      case 429: {
        const retryAfterHeader = response.headers.get('retry-after');
        const limitHeader = response.headers.get('x-ratelimit-limit');
        const remainingHeader = response.headers.get('x-ratelimit-remaining');
        const retryAfter =
          retryAfterHeader !== null
            ? Number(retryAfterHeader)
            : typeof payload.retryAfter === 'number'
              ? payload.retryAfter
              : undefined;
        return new FiretellRateLimitError(message, {
          ...baseOpts,
          retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
          limit:
            limitHeader !== null && Number.isFinite(Number(limitHeader))
              ? Number(limitHeader)
              : undefined,
          remaining:
            remainingHeader !== null && Number.isFinite(Number(remainingHeader))
              ? Number(remainingHeader)
              : undefined,
        });
      }
      default:
        return new FiretellApiError(message, baseOpts);
    }
  }

  private shouldRetryStatus(status: number): boolean {
    return status === 429 || status === 408 || status >= 500;
  }

  private computeRetryDelay(attempt: number, response: Response): number {
    const retryAfter = response.headers.get('retry-after');
    if (retryAfter) {
      const seconds = Number(retryAfter);
      if (Number.isFinite(seconds) && seconds >= 0) {
        return Math.min(seconds * 1000, 30_000);
      }
    }
    return this.computeBackoffMs(attempt + 1);
  }

  private computeBackoffMs(attemptNumber: number): number {
    const base = 300 * Math.pow(2, attemptNumber - 1);
    const jitter = Math.floor(Math.random() * 100);
    return Math.min(base + jitter, 10_000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
