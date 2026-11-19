import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export interface AuditLogActor {
  type?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface AuditLogTarget {
  type?: string;
  id?: string;
}

export interface AuditLog {
  id: string;
  workspace_id: string;
  actor?: AuditLogActor;
  action: string;
  category?: string;
  target?: AuditLogTarget;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ListAuditLogsParams extends PaginationParams {
  actor_id?: string;
  actor_type?: string;
  action?: string;
  category?: string;
  target_type?: string;
  target_id?: string;
  status?: string;
  from?: string;
  to?: string;
}

export class AuditLogsResource extends BaseResource {
  /**
   * List audit logs in the workspace with pagination and filters.
   * `GET /api/v1/audit-logs`
   */
  list(
    params?: ListAuditLogsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<AuditLog>> {
    return this.http.get<PaginatedResponse<AuditLog>>(
      '/audit-logs',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Get a single audit log record detail by ID.
   * `GET /api/v1/audit-logs/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<AuditLog> {
    return this.http.get<AuditLog>(
      `/audit-logs/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
