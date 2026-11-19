import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export interface Extension {
  id: string;
  extension?: string;
  extension_number?: string;
  name?: string;
  title?: string;
  type?: string;
  destination?: string;
  assigned_agent_id?: string | null;
  agent_id?: string | null;
  team_id?: string | null;
  sip_account_id?: string | null;
  voice_agent_id?: string | null;
  workspace_id?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateExtensionParams {
  title: string;
  /** 3 to 6 digits (e.g. `"1001"`). */
  extension_number: string;
  destination: string;
  agent_id?: string;
  team_id?: string;
  sip_account_id?: string;
  voice_agent_id?: string;
}

export interface UpdateExtensionParams {
  title?: string;
  extension_number?: string;
  destination?: string;
  agent_id?: string;
  team_id?: string;
  sip_account_id?: string;
  voice_agent_id?: string;
}

export class ExtensionsResource extends BaseResource {
  /**
   * List internal extensions in the workspace.
   * `GET /api/v1/extensions`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Extension>> {
    return this.http.get<PaginatedResponse<Extension>>(
      '/extensions',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new internal extension.
   * `POST /api/v1/extensions`
   */
  create(
    data: CreateExtensionParams,
    options?: RequestOptions,
  ): Promise<Extension> {
    return this.http.post<Extension>('/extensions', data, options);
  }

  /**
   * Update an internal extension.
   * `PATCH /api/v1/extensions/{id}`
   */
  update(
    id: string,
    data: UpdateExtensionParams,
    options?: RequestOptions,
  ): Promise<Extension> {
    return this.http.patch<Extension>(
      `/extensions/${this.encode(id)}`,
      data,
      options,
    );
  }

  /**
   * Delete an internal extension.
   * `DELETE /api/v1/extensions/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<Extension> {
    return this.http.delete<Extension>(
      `/extensions/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
