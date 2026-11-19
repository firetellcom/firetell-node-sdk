export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_field?: string;
  sort_order?: SortOrder;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface RequestOptions {
  /** Additional HTTP headers for this request. */
  headers?: Record<string, string>;
  /** Per-request timeout in milliseconds (overrides client default). */
  timeout?: number;
  /** Optional AbortSignal to cancel the request. */
  signal?: AbortSignal;
}

export type FetchLike = typeof globalThis.fetch;

export interface FiretellClientConfig {
  /**
   * Your Firetell workspace domain (e.g. `yourcompany.firetell.app` or `https://yourcompany.firetell.app`).
   */
  domain: string;
  /**
   * Workspace API secret key (e.g. `sk-...`), sent via `Authorization: ApiKey <secretKey>`.
   */
  secretKey: string;
  /**
   * Default request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;
  /**
   * Maximum number of automatic retries on rate limits (429), 5xx responses, or transient network errors.
   * @default 2
   */
  maxRetries?: number;
  /**
   * Custom `fetch` implementation (useful for testing or custom proxies).
   * Defaults to global `fetch` (Node.js 18+).
   */
  fetch?: FetchLike;
  /**
   * Default custom headers attached to every request.
   */
  headers?: Record<string, string>;
}

/**
 * Supported file input types for multipart file uploads.
 */
export interface FileUploadInput {
  /** Raw file bytes or Blob. */
  content: Buffer | Uint8Array | Blob | ArrayBuffer;
  /** Original filename including extension (e.g. `welcome.mp3`, `guide.pdf`, `avatar.png`). */
  filename: string;
  /** Optional MIME type (e.g. `audio/mpeg`, `application/pdf`, `image/png`). */
  contentType?: string;
}
