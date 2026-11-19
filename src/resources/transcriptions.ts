import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';
import type { CallDirection, CallSentiment } from './calls.js';

export type TranscriptionSortField =
  | 'created_at'
  | 'duration_seconds'
  | 'dialogue_count';

export interface TranscriptionSummary {
  id: string;
  workspace_id: string;
  call_id: string;
  direction?: CallDirection;
  language?: string;
  dialogue_count?: number;
  duration_seconds?: number;
  full_text?: string;
  summary?: string | null;
  sentiment?: CallSentiment | null;
  action_items?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ListTranscriptionsParams
  extends Omit<PaginationParams, 'sort_field'> {
  call_id?: string;
  sentiment?: CallSentiment;
  /** Filter from date (ISO 8601). */
  from?: string;
  /** Filter to date (ISO 8601). */
  to?: string;
  sort_field?: TranscriptionSortField | string;
}

export interface BulkDeleteTranscriptionsParams {
  ids: string[];
}

export interface BulkDeleteTranscriptionsResponse {
  message: string;
  deleted_count: number;
}

export class TranscriptionsResource extends BaseResource {
  /**
   * List all transcriptions in the workspace with pagination and filters.
   * `GET /api/v1/transcriptions`
   */
  list(
    params?: ListTranscriptionsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<TranscriptionSummary>> {
    return this.http.get<PaginatedResponse<TranscriptionSummary>>(
      '/transcriptions',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Bulk delete transcriptions in the workspace by ID list (max 100).
   * `DELETE /api/v1/transcriptions/bulk`
   */
  bulkDelete(
    ids: string[] | BulkDeleteTranscriptionsParams,
    options?: RequestOptions,
  ): Promise<BulkDeleteTranscriptionsResponse> {
    const body: BulkDeleteTranscriptionsParams = Array.isArray(ids)
      ? { ids }
      : ids;
    return this.http.delete<BulkDeleteTranscriptionsResponse>(
      '/transcriptions/bulk',
      body,
      options,
    );
  }
}
