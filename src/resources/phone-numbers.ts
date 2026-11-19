import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type TranscriptionProvider =
  | 'deepgram'
  | 'soniox'
  | 'openai'
  | 'enterprise_ws'
  | 'custom_http';

export interface PhoneNumberTranscriptionConfig {
  enabled?: boolean;
  provider?: TranscriptionProvider;
  language?: string;
  detect_entities?: boolean;
  enterprise_ws_url?: string;
  enterprise_api_key?: string;
}

export interface PhoneNumber {
  id: string;
  title: string;
  number: string;
  workspace_id: string;
  status?: string;
  enable_outbound?: boolean;
  record_outbound?: boolean;
  inbound_acl_id?: string | null;
  outbound_gateway_id?: string | null;
  call_flow_id?: string | null;
  country_code?: string;
  dial_code?: string;
  provider?: string;
  type?: string;
  capabilities?: string[];
  shared_teams_id?: string[];
  fee_per_month?: number;
  fee_per_mins_call?: number;
  transcription?: PhoneNumberTranscriptionConfig;
  acl?: Record<string, unknown> | null;
  gateway?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface UpdatePhoneNumberParams {
  title?: string;
  inbound_acl_id?: string;
  enable_outbound?: boolean;
  outbound_gateway_id?: string;
  shared_teams_id?: string[];
  record_outbound?: boolean;
  transcription?: PhoneNumberTranscriptionConfig;
  call_flow_id?: string | null;
}

export class PhoneNumbersResource extends BaseResource {
  /**
   * List phone numbers in the workspace.
   * `GET /api/v1/phone-numbers`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<PhoneNumber>> {
    return this.http.get<PaginatedResponse<PhoneNumber>>(
      '/phone-numbers',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Get phone number details by ID.
   * `GET /api/v1/phone-numbers/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<PhoneNumber> {
    return this.http.get<PhoneNumber>(
      `/phone-numbers/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Update phone number configuration (routing, recording, transcription, etc.).
   * `PATCH /api/v1/phone-numbers/{id}`
   */
  update(
    id: string,
    data: UpdatePhoneNumberParams,
    options?: RequestOptions,
  ): Promise<PhoneNumber> {
    return this.http.patch<PhoneNumber>(
      `/phone-numbers/${this.encode(id)}`,
      data,
      options,
    );
  }

  /**
   * Release / delete a phone number (requires OTP verification header `x-otp`).
   * `DELETE /api/v1/phone-numbers/{id}`
   */
  delete(
    id: string,
    otp: string,
    options?: RequestOptions,
  ): Promise<PhoneNumber> {
    return this.http.delete<PhoneNumber>(
      `/phone-numbers/${this.encode(id)}`,
      undefined,
      {
        ...options,
        headers: {
          ...(options?.headers ?? {}),
          'x-otp': otp,
        },
      },
    );
  }
}
