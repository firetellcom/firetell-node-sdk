import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type CallFlowTriggerType = 'inbound' | 'outbound';

export interface CallFlow {
  id: string;
  title: string;
  trigger_type?: CallFlowTriggerType;
  status?: string;
  workspace_id?: string;
  assigned_dids?: string[];
  compiled_actions?: unknown[];
  flow_data?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ListCallFlowsParams extends PaginationParams {
  trigger_type?: CallFlowTriggerType;
}

export interface CreateCallFlowParams {
  title: string;
  trigger_type?: CallFlowTriggerType;
}

export class CallFlowsResource extends BaseResource {
  /**
   * List visual call flows.
   * `GET /api/v1/call-flows`
   */
  list(
    params?: ListCallFlowsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<CallFlow>> {
    return this.http.get<PaginatedResponse<CallFlow>>(
      '/call-flows',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new visual call flow.
   * `POST /api/v1/call-flows`
   */
  create(
    data: CreateCallFlowParams,
    options?: RequestOptions,
  ): Promise<CallFlow> {
    return this.http.post<CallFlow>('/call-flows', data, options);
  }

  /**
   * Get call flow details by ID.
   * `GET /api/v1/call-flows/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<CallFlow> {
    return this.http.get<CallFlow>(
      `/call-flows/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Delete a call flow by ID.
   * `DELETE /api/v1/call-flows/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<CallFlow> {
    return this.http.delete<CallFlow>(
      `/call-flows/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
