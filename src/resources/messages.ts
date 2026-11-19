import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type MessageDirection = 'outbound' | 'inbound';
export type MessageStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'undelivered'
  | 'received';
export type MessageSenderType = 'client' | 'agent' | 'voice_agent' | 'system';

export interface Message {
  id: string;
  workspace_id: string;
  phone_number_id?: string;
  from: string;
  to: string;
  body: string;
  direction: MessageDirection;
  status: MessageStatus;
  cost?: number;
  media_urls?: string[];
  conversation_id?: string | null;
  sender_type?: MessageSenderType;
  sender_id?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface SendMessageParams {
  /** Sender phone number in E.164 format (must have SMS capability). */
  from: string;
  /** Destination phone number in E.164 format. */
  to: string;
  /** Text body of the message (max 1600 chars). */
  body: string;
  /** Optional media URLs for MMS. */
  media_urls?: string[];
  /** Optional conversation ID to link this message to. */
  conversation_id?: string;
  /** Optional sender entity type. */
  sender_type?: MessageSenderType;
  /** Optional sender ID (e.g. agent ID or voice agent ID). */
  sender_id?: string;
}

export interface ListMessagesParams extends PaginationParams {
  phone_number_id?: string;
  direction?: MessageDirection;
  status?: MessageStatus;
  /** Filter from date (ISO 8601). */
  from?: string;
  /** Filter to date (ISO 8601). */
  to_date?: string;
}

export class MessagesResource extends BaseResource {
  /**
   * Send an SMS or MMS message.
   * `POST /api/v1/messages/send`
   */
  send(data: SendMessageParams, options?: RequestOptions): Promise<Message> {
    return this.http.post<Message>('/messages/send', data, options);
  }

  /**
   * List SMS/MMS message history with filters and pagination.
   * `GET /api/v1/messages`
   */
  list(
    params?: ListMessagesParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Message>> {
    return this.http.get<PaginatedResponse<Message>>(
      '/messages',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Get message details by ID.
   * `GET /api/v1/messages/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<Message> {
    return this.http.get<Message>(`/messages/${this.encode(id)}`, undefined, options);
  }
}
