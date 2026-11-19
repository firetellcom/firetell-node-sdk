import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import type { Agent } from './agents.js';
import { BaseResource } from './base.js';

export interface Team {
  id: string;
  title: string;
  workspace_id?: string;
  agent_count?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface TeamAgentMember {
  id: string;
  workspace_id: string;
  team_id: string;
  agent_id: string;
  created_at?: string;
  agent?: {
    id: string;
    username: string;
    display_name: string;
    avatar?: string | null;
    email?: string | null;
    country_code?: string | null;
  };
  [key: string]: unknown;
}

export interface CreateTeamParams {
  title: string;
}

export interface UpdateTeamParams {
  title: string;
}

export class TeamsResource extends BaseResource {
  /**
   * List workspace teams.
   * `GET /api/v1/teams`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Team>> {
    return this.http.get<PaginatedResponse<Team>>(
      '/teams',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new team.
   * `POST /api/v1/teams`
   */
  create(data: CreateTeamParams, options?: RequestOptions): Promise<Team> {
    return this.http.post<Team>('/teams', data, options);
  }

  /**
   * Retrieve team details by ID.
   * `GET /api/v1/teams/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<Team> {
    return this.http.get<Team>(`/teams/${this.encode(id)}`, undefined, options);
  }

  /**
   * Update a team.
   * `PATCH /api/v1/teams/{id}`
   */
  update(
    id: string,
    data: UpdateTeamParams,
    options?: RequestOptions,
  ): Promise<Team> {
    return this.http.patch<Team>(`/teams/${this.encode(id)}`, data, options);
  }

  /**
   * Delete a team.
   * `DELETE /api/v1/teams/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<Team> {
    return this.http.delete<Team>(`/teams/${this.encode(id)}`, undefined, options);
  }

  /**
   * List agents belonging to a team.
   * `GET /api/v1/teams/{id}/agents`
   */
  listAgents(
    id: string,
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<TeamAgentMember>> {
    return this.http.get<PaginatedResponse<TeamAgentMember>>(
      `/teams/${this.encode(id)}/agents`,
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Add an agent to a team.
   * `PUT /api/v1/teams/{id}/agents/{agent_id}`
   */
  addAgent(
    id: string,
    agentId: string,
    options?: RequestOptions,
  ): Promise<TeamAgentMember> {
    return this.http.put<TeamAgentMember>(
      `/teams/${this.encode(id)}/agents/${this.encode(agentId)}`,
      undefined,
      options,
    );
  }

  /**
   * Remove an agent from a team.
   * `DELETE /api/v1/teams/{id}/agents/{agent_id}`
   */
  removeAgent(
    id: string,
    agentId: string,
    options?: RequestOptions,
  ): Promise<TeamAgentMember> {
    return this.http.delete<TeamAgentMember>(
      `/teams/${this.encode(id)}/agents/${this.encode(agentId)}`,
      undefined,
      options,
    );
  }

  /**
   * List active agents not yet belonging to this team.
   * `GET /api/v1/teams/{id}/agents/suggestions`
   */
  listAgentSuggestions(
    id: string,
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Agent>> {
    return this.http.get<PaginatedResponse<Agent>>(
      `/teams/${this.encode(id)}/agents/suggestions`,
      params as Record<string, unknown>,
      options,
    );
  }
}
