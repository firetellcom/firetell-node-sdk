import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export interface SipAccount {
  id: string;
  title: string;
  username: string;
  domain?: string;
  workspace_id?: string;
  outbound_caller_id?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateSipAccountParams {
  title: string;
  username: string;
  password: string;
  outbound_caller_id?: string | null;
}

export interface UpdateSipAccountParams {
  title?: string;
  password?: string;
  outbound_caller_id?: string | null;
}

export class SipAccountsResource extends BaseResource {
  /**
   * List SIP accounts in the workspace.
   * `GET /api/v1/sip-accounts`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<SipAccount>> {
    return this.http.get<PaginatedResponse<SipAccount>>(
      '/sip-accounts',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new SIP account.
   * `POST /api/v1/sip-accounts`
   */
  create(
    data: CreateSipAccountParams,
    options?: RequestOptions,
  ): Promise<SipAccount> {
    return this.http.post<SipAccount>('/sip-accounts', data, options);
  }

  /**
   * Update a SIP account.
   * `PATCH /api/v1/sip-accounts/{id}`
   */
  update(
    id: string,
    data: UpdateSipAccountParams,
    options?: RequestOptions,
  ): Promise<SipAccount> {
    return this.http.patch<SipAccount>(
      `/sip-accounts/${this.encode(id)}`,
      data,
      options,
    );
  }

  /**
   * Delete a SIP account.
   * `DELETE /api/v1/sip-accounts/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<SipAccount> {
    return this.http.delete<SipAccount>(
      `/sip-accounts/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
