import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export class InvoicesResource extends BaseResource {
  /**
   * List workspace billing invoices.
   * `GET /api/v1/invoices`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Invoice>> {
    return this.http.get<PaginatedResponse<Invoice>>(
      '/invoices',
      params as Record<string, unknown>,
      options,
    );
  }
}
