import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type RecordingSortField = 'created_at' | 'size_bytes' | 'duration';

export interface Recording {
  id: string;
  workspace_id: string;
  call_id: string;
  index: number;
  start_time?: string;
  end_time?: string;
  duration?: number;
  format?: string;
  size_bytes?: number;
  file?: string;
  stream_url?: string;
  download_url?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ListRecordingsParams extends Omit<PaginationParams, 'sort_field'> {
  call_id?: string;
  /** Filter recordings created on or after this ISO 8601 date. */
  from?: string;
  /** Filter recordings created on or before this ISO 8601 date. */
  to?: string;
  sort_field?: RecordingSortField | string;
}

export interface BulkDeleteRecordingsParams {
  ids: string[];
}

export interface BulkDeleteRecordingsResponse {
  message: string;
  deleted_count: number;
  freed_bytes: number;
}

export class RecordingsResource extends BaseResource {
  /**
   * List all recordings in the workspace with pagination and filters.
   * `GET /api/v1/recordings`
   */
  list(
    params?: ListRecordingsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Recording>> {
    return this.http.get<PaginatedResponse<Recording>>(
      '/recordings',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Bulk delete recordings in the workspace by ID list (max 100).
   * `DELETE /api/v1/recordings/bulk`
   */
  bulkDelete(
    ids: string[] | BulkDeleteRecordingsParams,
    options?: RequestOptions,
  ): Promise<BulkDeleteRecordingsResponse> {
    const body: BulkDeleteRecordingsParams = Array.isArray(ids) ? { ids } : ids;
    return this.http.delete<BulkDeleteRecordingsResponse>(
      '/recordings/bulk',
      body,
      options,
    );
  }
}
