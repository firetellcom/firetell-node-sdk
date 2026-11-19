import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export interface CreditTransaction {
  id: string;
  workspace_id: string;
  amount: number;
  currency: string;
  type: string;
  charge_type?: string | null;
  description?: string | null;
  call_id?: string | null;
  created_by_admin?: string | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface ListCreditTransactionsParams extends PaginationParams {
  type?: string;
  charge_type?: string;
  call_id?: string;
  from?: string;
  to?: string;
}

export class CreditTransactionsResource extends BaseResource {
  /**
   * List workspace credit transactions with pagination and filters.
   * `GET /api/v1/credit-transactions`
   */
  list(
    params?: ListCreditTransactionsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<CreditTransaction>> {
    return this.http.get<PaginatedResponse<CreditTransaction>>(
      '/credit-transactions',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Get a single credit transaction detail by ID.
   * `GET /api/v1/credit-transactions/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<CreditTransaction> {
    return this.http.get<CreditTransaction>(
      `/credit-transactions/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
