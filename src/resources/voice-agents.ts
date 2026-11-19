import { HttpClient } from '../http.js';
import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type VoiceAgentProvider = 'openai' | 'gemini' | 'elevenlabs';
export type VoiceAgentWebhookMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface VoiceAgentSettings {
  id?: string;
  workspace_id?: string;
  voice_agent_id?: string;
  provider?: 'openai' | 'gemini' | string;
  model_id?: string;
  voice_id?: string;
  language?: string;
  greeting_message?: string | null;
  instructions?: string;
  temperature?: number;
  speed?: number;
  modalities?: string[];
  enable_noise_reduction?: boolean;
  enable_conversation_memory?: boolean;
  enable_recording?: boolean;
  max_call_duration_seconds?: number;
  tools_id?: string[];
  builtin_tools?: string[];
  knowledge_base_ids?: string[];
  version: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface VoiceAgent {
  id: string;
  name: string;
  country_code?: string;
  workspace_id?: string;
  published_version?: number;
  settings?: VoiceAgentSettings;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateVoiceAgentParams {
  name: string;
  instructions: string;
}

export interface UpdateVoiceAgentParams {
  name?: string;
}

export interface RetrieveVoiceAgentParams {
  version?: number | string;
}

export interface UpdateVoiceAgentSettingsParams {
  version: number;
  greeting_message?: string | null;
  instructions?: string;
  provider?: 'openai' | 'gemini';
  model_id?: string;
  voice_id?: string;
  language?: string;
  temperature?: number;
  speed?: number;
  modalities?: string[];
  enable_noise_reduction?: boolean;
  enable_conversation_memory?: boolean;
  enable_recording?: boolean;
  max_call_duration_seconds?: number;
  tools_id?: string[];
  builtin_tools?: string[];
  knowledge_base_ids?: string[];
}

export interface PublishVoiceAgentVersionParams {
  version: number;
}

export interface VoiceAgentVersionItem {
  version: number;
  updated_at?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface VoiceAgentVersionsResponse {
  data: VoiceAgentVersionItem[];
}

export interface DeleteVoiceAgentVersionResponse {
  version: number;
  deleted: boolean;
}

export interface VoiceAgentTestCallResponse {
  call_id: string;
  call_token: string;
  ws_url: string;
  to: string;
  [key: string]: unknown;
}

export interface VoiceProviderInfo {
  id: string;
  name: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface VoiceModelInfo {
  id: string;
  name: string;
  provider: string;
  rate_per_min?: number;
  is_active: boolean;
  [key: string]: unknown;
}

export interface ListVoiceModelsParams extends PaginationParams {
  provider?: VoiceAgentProvider;
}

export interface SystemVoiceInfo {
  id: string;
  name: string;
  gender?: string;
  description?: string;
  provider: string;
  languages?: string[];
  country_code?: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface ListSystemVoicesParams extends PaginationParams {
  model_id?: string;
  provider?: 'openai' | 'gemini';
}

export interface BuiltinToolInfo {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
  required_params?: string[];
  [key: string]: unknown;
}

export interface VoiceAgentTool {
  id: string;
  name: string;
  description: string;
  webhook_url?: string;
  webhook_method?: VoiceAgentWebhookMethod;
  webhook_headers?: Record<string, string>;
  parameters?: Record<string, unknown>;
  required_params?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateVoiceAgentToolParams {
  name: string;
  description: string;
  webhook_url?: string;
  webhook_method?: VoiceAgentWebhookMethod;
  webhook_headers?: Record<string, string>;
  parameters?: Record<string, unknown>;
  required_params?: string[];
  is_active?: boolean;
}

export interface UpdateVoiceAgentToolParams {
  name?: string;
  description?: string;
  webhook_url?: string;
  webhook_method?: VoiceAgentWebhookMethod;
  webhook_headers?: Record<string, string>;
  parameters?: Record<string, unknown>;
  required_params?: string[];
  is_active?: boolean;
}

export class VoiceAgentToolsResource extends BaseResource {
  /**
   * List custom tools attached to a Voice AI agent.
   * `GET /api/v1/voice-agents/{voiceAgentId}/tools`
   */
  list(
    voiceAgentId: string,
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<VoiceAgentTool>> {
    return this.http.get<PaginatedResponse<VoiceAgentTool>>(
      `/voice-agents/${this.encode(voiceAgentId)}/tools`,
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new custom tool for a Voice AI agent.
   * `POST /api/v1/voice-agents/{voiceAgentId}/tools`
   */
  create(
    voiceAgentId: string,
    data: CreateVoiceAgentToolParams,
    options?: RequestOptions,
  ): Promise<VoiceAgentTool> {
    return this.http.post<VoiceAgentTool>(
      `/voice-agents/${this.encode(voiceAgentId)}/tools`,
      data,
      options,
    );
  }

  /**
   * Get a specific tool by ID.
   * `GET /api/v1/voice-agents/{voiceAgentId}/tools/{toolId}`
   */
  retrieve(
    voiceAgentId: string,
    toolId: string,
    options?: RequestOptions,
  ): Promise<VoiceAgentTool> {
    return this.http.get<VoiceAgentTool>(
      `/voice-agents/${this.encode(voiceAgentId)}/tools/${this.encode(toolId)}`,
      undefined,
      options,
    );
  }

  /**
   * Update a Voice AI agent tool.
   * `PATCH /api/v1/voice-agents/{voiceAgentId}/tools/{toolId}`
   */
  update(
    voiceAgentId: string,
    toolId: string,
    data: UpdateVoiceAgentToolParams,
    options?: RequestOptions,
  ): Promise<VoiceAgentTool> {
    return this.http.patch<VoiceAgentTool>(
      `/voice-agents/${this.encode(voiceAgentId)}/tools/${this.encode(toolId)}`,
      data,
      options,
    );
  }

  /**
   * Delete a Voice AI agent tool.
   * `DELETE /api/v1/voice-agents/{voiceAgentId}/tools/{toolId}`
   */
  delete(
    voiceAgentId: string,
    toolId: string,
    options?: RequestOptions,
  ): Promise<VoiceAgentTool> {
    return this.http.delete<VoiceAgentTool>(
      `/voice-agents/${this.encode(voiceAgentId)}/tools/${this.encode(toolId)}`,
      undefined,
      options,
    );
  }
}

export class VoiceAgentsResource extends BaseResource {
  /** Sub-resource for managing custom webhook tools on a Voice AI agent. */
  readonly tools: VoiceAgentToolsResource;

  constructor(http: HttpClient) {
    super(http);
    this.tools = new VoiceAgentToolsResource(http);
  }

  /**
   * List Voice AI agents in the workspace.
   * `GET /api/v1/voice-agents`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<VoiceAgent>> {
    return this.http.get<PaginatedResponse<VoiceAgent>>(
      '/voice-agents',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new Voice AI agent.
   * `POST /api/v1/voice-agents`
   */
  create(
    data: CreateVoiceAgentParams,
    options?: RequestOptions,
  ): Promise<VoiceAgent> {
    return this.http.post<VoiceAgent>('/voice-agents', data, options);
  }

  /**
   * Get Voice AI agent details (optionally for a specific configuration version).
   * `GET /api/v1/voice-agents/{id}`
   */
  retrieve(
    id: string,
    params?: RetrieveVoiceAgentParams,
    options?: RequestOptions,
  ): Promise<VoiceAgent> {
    return this.http.get<VoiceAgent>(
      `/voice-agents/${this.encode(id)}`,
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Update Voice AI agent metadata (e.g. name).
   * `PATCH /api/v1/voice-agents/{id}`
   */
  update(
    id: string,
    data: UpdateVoiceAgentParams,
    options?: RequestOptions,
  ): Promise<VoiceAgent> {
    return this.http.patch<VoiceAgent>(
      `/voice-agents/${this.encode(id)}`,
      data,
      options,
    );
  }

  /**
   * Delete a Voice AI agent.
   * `DELETE /api/v1/voice-agents/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<VoiceAgent> {
    return this.http.delete<VoiceAgent>(
      `/voice-agents/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Update Voice AI agent prompt, model, voice, and behavioral settings.
   * `PATCH /api/v1/voice-agents/{id}/settings`
   */
  updateSettings(
    id: string,
    data: UpdateVoiceAgentSettingsParams,
    options?: RequestOptions,
  ): Promise<VoiceAgent> {
    return this.http.patch<VoiceAgent>(
      `/voice-agents/${this.encode(id)}/settings`,
      data,
      options,
    );
  }

  /**
   * List settings version history for a Voice AI agent.
   * `GET /api/v1/voice-agents/{id}/versions`
   */
  listVersions(
    id: string,
    options?: RequestOptions,
  ): Promise<VoiceAgentVersionsResponse> {
    return this.http.get<VoiceAgentVersionsResponse>(
      `/voice-agents/${this.encode(id)}/versions`,
      undefined,
      options,
    );
  }

  /**
   * Create a new draft version snapshot of Voice AI agent settings.
   * `POST /api/v1/voice-agents/{id}/version`
   */
  createVersion(
    id: string,
    options?: RequestOptions,
  ): Promise<VoiceAgentVersionItem> {
    return this.http.post<VoiceAgentVersionItem>(
      `/voice-agents/${this.encode(id)}/version`,
      undefined,
      options,
    );
  }

  /**
   * Delete a draft version snapshot.
   * `DELETE /api/v1/voice-agents/{id}/version/{version}`
   */
  deleteVersion(
    id: string,
    version: number | string,
    options?: RequestOptions,
  ): Promise<DeleteVoiceAgentVersionResponse> {
    return this.http.delete<DeleteVoiceAgentVersionResponse>(
      `/voice-agents/${this.encode(id)}/version/${this.encode(version)}`,
      undefined,
      options,
    );
  }

  /**
   * Publish a draft version of a Voice AI agent to production.
   * `PATCH /api/v1/voice-agents/{id}/publish`
   */
  publish(
    id: string,
    data: PublishVoiceAgentVersionParams,
    options?: RequestOptions,
  ): Promise<VoiceAgent> {
    return this.http.patch<VoiceAgent>(
      `/voice-agents/${this.encode(id)}/publish`,
      data,
      options,
    );
  }

  /**
   * Initiate a WebRTC test call session with a Voice AI agent.
   * `POST /api/v1/voice-agents/{id}/test-call`
   */
  testCall(
    id: string,
    params?: RetrieveVoiceAgentParams,
    options?: RequestOptions,
  ): Promise<VoiceAgentTestCallResponse> {
    return this.http.post<VoiceAgentTestCallResponse>(
      `/voice-agents/${this.encode(id)}/test-call`,
      undefined,
      options,
      params as Record<string, unknown>,
    );
  }

  /**
   * List supported AI providers for Voice Agents.
   * `GET /api/v1/voice-agents/providers`
   */
  listProviders(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<VoiceProviderInfo>> {
    return this.http.get<PaginatedResponse<VoiceProviderInfo>>(
      '/voice-agents/providers',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * List supported Realtime models for Voice AI with pricing.
   * `GET /api/v1/voice-agents/models`
   */
  listModels(
    params?: ListVoiceModelsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<VoiceModelInfo>> {
    return this.http.get<PaginatedResponse<VoiceModelInfo>>(
      '/voice-agents/models',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * List available system voices for Voice AI.
   * `GET /api/v1/voice-agents/voices`
   */
  listVoices(
    params?: ListSystemVoicesParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<SystemVoiceInfo>> {
    return this.http.get<PaginatedResponse<SystemVoiceInfo>>(
      '/voice-agents/voices',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * List available system built-in telephony tools for Voice AI agents.
   * `GET /api/v1/voice-agents/builtin-tools`
   */
  listBuiltinTools(
    options?: RequestOptions,
  ): Promise<PaginatedResponse<BuiltinToolInfo>> {
    return this.http.get<PaginatedResponse<BuiltinToolInfo>>(
      '/voice-agents/builtin-tools',
      undefined,
      options,
    );
  }
}
