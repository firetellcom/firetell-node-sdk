import { buildBlobFromFileInput } from '../http.js';
import {
  FileUploadInput,
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';
import type { Team } from './teams.js';

export type AgentState = 'online' | 'available' | 'incall' | 'busy' | 'offline';
export type AgentRole = 'leader' | 'member' | 'supervisor';

export interface Agent {
  id: string;
  username: string;
  display_name: string;
  email?: string | null;
  avatar?: string | null;
  role?: AgentRole | string;
  state?: AgentState;
  is_active: boolean;
  workspace_id?: string;
  domain?: string;
  country_code?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ListAgentsParams extends PaginationParams {
  state?: AgentState;
  country_code?: string;
  is_active?: boolean;
  role?: AgentRole;
}

export interface CreateAgentParams {
  username: string;
  password: string;
  display_name: string;
  email?: string;
  avatar?: string;
  country_code?: string;
  is_active?: boolean;
  role?: AgentRole;
}

export interface UpdateAgentParams {
  username?: string;
  display_name?: string;
  avatar?: string;
  email?: string;
  is_active?: boolean;
  country_code?: string;
  role?: AgentRole;
}

export interface ChangeAgentPasswordParams {
  password: string;
}

export interface ChangeAgentPasswordResponse {
  message: string;
}

export class AgentsResource extends BaseResource {
  /**
   * List workspace agents with optional filters and pagination.
   * `GET /api/v1/agents`
   */
  list(
    params?: ListAgentsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Agent>> {
    return this.http.get<PaginatedResponse<Agent>>(
      '/agents',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new agent in the workspace.
   * `POST /api/v1/agents`
   */
  create(data: CreateAgentParams, options?: RequestOptions): Promise<Agent> {
    return this.http.post<Agent>('/agents', data, options);
  }

  /**
   * Retrieve an agent by ID.
   * `GET /api/v1/agents/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<Agent> {
    return this.http.get<Agent>(`/agents/${this.encode(id)}`, undefined, options);
  }

  /**
   * Update agent details.
   * `PATCH /api/v1/agents/{id}`
   */
  update(
    id: string,
    data: UpdateAgentParams,
    options?: RequestOptions,
  ): Promise<Agent> {
    return this.http.patch<Agent>(`/agents/${this.encode(id)}`, data, options);
  }

  /**
   * Delete an agent by ID.
   * `DELETE /api/v1/agents/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<Agent> {
    return this.http.delete<Agent>(`/agents/${this.encode(id)}`, undefined, options);
  }

  /**
   * List teams assigned to an agent.
   * `GET /api/v1/agents/{id}/teams`
   */
  listTeams(
    id: string,
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Team>> {
    return this.http.get<PaginatedResponse<Team>>(
      `/agents/${this.encode(id)}/teams`,
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Upload or replace an agent's avatar image.
   * `PATCH /api/v1/agents/{id}/avatar`
   */
  uploadAvatar(
    id: string,
    file: FileUploadInput,
    options?: RequestOptions,
  ): Promise<Agent> {
    const formData = new FormData();
    formData.append('file', buildBlobFromFileInput(file), file.filename);
    return this.http.patchForm<Agent>(
      `/agents/${this.encode(id)}/avatar`,
      formData,
      options,
    );
  }

  /**
   * Reset an agent's password.
   * `PATCH /api/v1/agents/{id}/password`
   */
  changePassword(
    id: string,
    data: ChangeAgentPasswordParams,
    options?: RequestOptions,
  ): Promise<ChangeAgentPasswordResponse> {
    return this.http.patch<ChangeAgentPasswordResponse>(
      `/agents/${this.encode(id)}/password`,
      data,
      options,
    );
  }
}
