import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type CallDirection = 'inbound' | 'outbound' | 'internal';
export type CallDirectionFilter = CallDirection | 'all';
export type CallSentiment = 'positive' | 'neutral' | 'negative';
export type CallSentimentFilter = CallSentiment | 'all';

export type CallActionType =
  | 'play'
  | 'tts'
  | 'ivr'
  | 'to_operator'
  | 'connect_agent'
  | 'connect_team'
  | 'connect_voice_agent'
  | 'connect_sip'
  | 'voicemail'
  | 'disconnect'
  | 'hangup'
  | 'recording'
  | 'stream';

export interface CallParty {
  type?: string;
  name?: string;
  number: string;
  avatar?: string | null;
}

export interface ServerCallParty {
  number: string;
  name?: string;
}

export interface ServerCallAction {
  action: CallActionType;
  params?: Record<string, unknown>;
  continue?: boolean;
  auto_answer?: boolean;
}

export interface CallRecord {
  id: string;
  workspace_id: string;
  number?: string;
  client_number?: string;
  from?: CallParty;
  to?: CallParty;
  source?: string;
  type?: string;
  direction?: CallDirection;
  status?: string;
  start_time?: string;
  answer_time?: string | null;
  end_time?: string | null;
  duration?: number;
  billsec?: number;
  cost?: number;
  hangup_cause?: string | null;
  hangup_code?: number | null;
  hangup_source?: string | null;
  recording?: string | null;
  transcription?: string | null;
  sentiment?: CallSentiment | null;
  summary?: string | null;
  action_items?: string[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ListCallsParams extends PaginationParams {
  direction?: CallDirectionFilter;
  status?: string;
  from?: string;
  to?: string;
  kb_doc_id?: string;
  kb_id?: string;
  has_kb_query?: boolean | string;
  sentiment?: CallSentimentFilter;
}

export interface MakeCallParams {
  to: ServerCallParty;
  from?: ServerCallParty;
  max_duration?: number;
  call_flow_id?: string;
  actions: ServerCallAction[];
}

export interface MakeCallResponse {
  call_id: string;
  status: string;
  direction: CallDirection;
  from?: CallParty;
  to?: CallParty;
  job_id?: string;
  job_status?: string;
  [key: string]: unknown;
}

export interface UpdateCallActionsParams {
  actions: ServerCallAction[];
}

export interface UpdateCallActionsResponse {
  success: boolean;
  action?: string;
  call_id: string;
  [key: string]: unknown;
}

export interface CallEvent {
  id: string;
  workspace_id: string;
  call_id: string;
  event: string;
  from?: CallParty;
  to?: CallParty;
  created_at?: string;
  [key: string]: unknown;
}

export interface CallRecordingItem {
  index: number;
  id: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  format?: string;
  size_bytes?: number;
  file?: string;
  stream_url?: string;
  download_url?: string;
  [key: string]: unknown;
}

export interface CallRecordingsResponse {
  call_id: string;
  recordings: CallRecordingItem[];
}

export interface DeleteCallRecordingsResponse {
  message: string;
  call_id: string;
  deleted_count: number;
  freed_bytes: number;
}

export interface DeleteSingleRecordingResponse {
  message: string;
  call_id: string;
  recording_id: string;
  freed_bytes: number;
  remaining_recordings: number;
}

export interface RecordingMediaMetadata {
  call_id: string;
  recording_id: string;
  recording_index: number;
  file?: string;
  format?: string;
  stream_url: string;
  download_url?: string;
  size_bytes?: number;
  start_time?: string;
  end_time?: string;
}

export interface CallTranscriptionDialogue {
  id: string;
  speaker: string;
  channel_index: number;
  text: string;
  confidence?: number;
  duration_ms?: number;
  timestamp?: string;
}

export interface CallTranscriptionEntity {
  type: string;
  value: string;
  confidence?: number;
}

export interface CallTranscription {
  id: string;
  call_id: string;
  workspace_id: string;
  direction?: CallDirection;
  language?: string;
  dialogue_count?: number;
  duration_seconds?: number;
  dialogues?: CallTranscriptionDialogue[];
  full_text?: string;
  summary?: string | null;
  sentiment?: CallSentiment | null;
  action_items?: string[];
  entities?: CallTranscriptionEntity[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface DeleteCallTranscriptionResponse {
  message: string;
  call_id: string;
}

export class CallsResource extends BaseResource {
  /**
   * List Call Detail Records (CDR) with optional filters and pagination.
   * `GET /api/v1/calls`
   */
  list(
    params?: ListCallsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<CallRecord>> {
    return this.http.get<PaginatedResponse<CallRecord>>(
      '/calls',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Initiate an outbound programmable API call.
   * `POST /api/v1/calls/make`
   */
  make(
    data: MakeCallParams,
    options?: RequestOptions,
  ): Promise<MakeCallResponse> {
    return this.http.post<MakeCallResponse>('/calls/make', data, options);
  }

  /**
   * Execute active call control actions (hangup, play, tts, transfer, recording, etc.).
   * `PUT /api/v1/calls/{id}/actions`
   */
  sendActions(
    id: string,
    data: UpdateCallActionsParams,
    options?: RequestOptions,
  ): Promise<UpdateCallActionsResponse> {
    return this.http.put<UpdateCallActionsResponse>(
      `/calls/${this.encode(id)}/actions`,
      data,
      options,
    );
  }

  /**
   * Get call execution event timeline log.
   * `GET /api/v1/calls/{id}/events`
   */
  listEvents(
    id: string,
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<CallEvent>> {
    return this.http.get<PaginatedResponse<CallEvent>>(
      `/calls/${this.encode(id)}/events`,
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * List all recordings for a call with presigned stream/download URLs.
   * `GET /api/v1/calls/{id}/recordings`
   */
  getRecordings(
    id: string,
    options?: RequestOptions,
  ): Promise<CallRecordingsResponse> {
    return this.http.get<CallRecordingsResponse>(
      `/calls/${this.encode(id)}/recordings`,
      undefined,
      options,
    );
  }

  /**
   * Delete all recordings for a call.
   * `DELETE /api/v1/calls/{id}/recordings`
   */
  deleteRecordings(
    id: string,
    options?: RequestOptions,
  ): Promise<DeleteCallRecordingsResponse> {
    return this.http.delete<DeleteCallRecordingsResponse>(
      `/calls/${this.encode(id)}/recordings`,
      undefined,
      options,
    );
  }

  /**
   * Delete a single recording by recording ID.
   * `DELETE /api/v1/calls/{id}/recordings/{recording_id}`
   */
  deleteRecording(
    id: string,
    recordingId: string,
    options?: RequestOptions,
  ): Promise<DeleteSingleRecordingResponse> {
    return this.http.delete<DeleteSingleRecordingResponse>(
      `/calls/${this.encode(id)}/recordings/${this.encode(recordingId)}`,
      undefined,
      options,
    );
  }

  /**
   * Get stream metadata (presigned URL) for a call recording.
   * Omit `index` to fetch the primary (first) recording.
   * `GET /api/v1/calls/{id}/recordings/stream?redirect=false` or `GET /api/v1/calls/{id}/recordings/{index}/stream?redirect=false`
   */
  getRecordingStream(
    id: string,
    index?: number | string,
    options?: RequestOptions,
  ): Promise<RecordingMediaMetadata> {
    const path =
      index === undefined
        ? `/calls/${this.encode(id)}/recordings/stream`
        : `/calls/${this.encode(id)}/recordings/${this.encode(index)}/stream`;
    return this.http.get<RecordingMediaMetadata>(
      path,
      { redirect: 'false' },
      options,
    );
  }

  /**
   * Get download metadata (presigned attachment URL) for a call recording.
   * `GET /api/v1/calls/{id}/recordings/{index}/download?redirect=false`
   */
  getRecordingDownload(
    id: string,
    index: number | string = 0,
    options?: RequestOptions,
  ): Promise<RecordingMediaMetadata> {
    return this.http.get<RecordingMediaMetadata>(
      `/calls/${this.encode(id)}/recordings/${this.encode(index)}/download`,
      { redirect: 'false' },
      options,
    );
  }

  /**
   * Get transcription details for a call (including dialogues timeline, summary, sentiment, and entities).
   * `GET /api/v1/calls/{id}/transcription`
   */
  getTranscription(
    id: string,
    options?: RequestOptions,
  ): Promise<CallTranscription> {
    return this.http.get<CallTranscription>(
      `/calls/${this.encode(id)}/transcription`,
      undefined,
      options,
    );
  }

  /**
   * Delete transcription for a call.
   * `DELETE /api/v1/calls/{id}/transcription`
   */
  deleteTranscription(
    id: string,
    options?: RequestOptions,
  ): Promise<DeleteCallTranscriptionResponse> {
    return this.http.delete<DeleteCallTranscriptionResponse>(
      `/calls/${this.encode(id)}/transcription`,
      undefined,
      options,
    );
  }
}
