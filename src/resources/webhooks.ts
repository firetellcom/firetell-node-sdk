import { createHmac, timingSafeEqual } from 'node:crypto';
import { FiretellValidationError } from '../errors.js';
import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type WebhookEventName =
  | 'call.created'
  | 'call.answered'
  | 'call.ended'
  | 'call.recording.ready'
  | 'call.transcription.completed'
  | 'call.transcription.summary'
  | 'contact.created'
  | 'contact.updated'
  | 'contact.deleted'
  | 'agent.created'
  | 'agent.updated'
  | 'agent.deleted'
  | 'workspace.credit.updated'
  | 'message.received'
  | 'message.sent'
  | 'message.delivered'
  | 'message.failed'
  | 'message.undelivered';

export interface WebhookHeader {
  key: string;
  value: string;
}

export interface Webhook {
  id: string;
  workspace_id?: string;
  title?: string;
  url: string;
  events: (WebhookEventName | string)[];
  headers?: WebhookHeader[];
  is_active?: boolean;
  status?: string;
  secret?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateWebhookParams {
  title: string;
  url: string;
  events: (WebhookEventName | string)[];
  headers?: WebhookHeader[];
}

export type UpdateWebhookParams = CreateWebhookParams;

export interface TestWebhookEventParams {
  event: WebhookEventName | string;
}

export interface TestWebhookEventResponse {
  success: boolean;
  event?: string;
  delivered_at?: string;
  [key: string]: unknown;
}

export interface WebhookEventPayload<T = Record<string, unknown>> {
  event: WebhookEventName | string;
  workspace_id: string;
  data: T;
  timestamp: string;
  attempt: number;
}

/**
 * Verify an incoming Firetell webhook signature (`X-Webhook-Signature` header)
 * using HMAC-SHA256 with constant-time comparison.
 */
export function verifyWebhookSignature(
  rawBody: string | Buffer,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const sigBuf = Buffer.from(signature.trim(), 'utf8');
  const expectedBuf = Buffer.from(expected, 'utf8');

  if (sigBuf.length !== expectedBuf.length) {
    return false;
  }

  return timingSafeEqual(sigBuf, expectedBuf);
}

/**
 * Verify the `X-Webhook-Signature` header and parse the webhook JSON payload.
 * Throws `FiretellValidationError` if the signature is invalid or body is malformed JSON.
 */
export function constructWebhookEvent<T = Record<string, unknown>>(
  rawBody: string | Buffer,
  signature: string,
  secret: string,
): WebhookEventPayload<T> {
  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    throw new FiretellValidationError('Invalid Firetell webhook signature.', {
      code: 'INVALID_WEBHOOK_SIGNATURE',
    });
  }

  try {
    const text = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    return JSON.parse(text) as WebhookEventPayload<T>;
  } catch (err) {
    throw new FiretellValidationError('Invalid Firetell webhook JSON payload.', {
      code: 'INVALID_WEBHOOK_PAYLOAD',
      cause: err,
    });
  }
}

export class WebhooksResource extends BaseResource {
  /**
   * List webhook subscriptions in the workspace.
   * `GET /api/v1/webhooks`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Webhook>> {
    return this.http.get<PaginatedResponse<Webhook>>(
      '/webhooks',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Subscribe a new webhook endpoint.
   * `POST /api/v1/webhooks`
   */
  create(data: CreateWebhookParams, options?: RequestOptions): Promise<Webhook> {
    return this.http.post<Webhook>('/webhooks', data, options);
  }

  /**
   * Get webhook subscription details by ID.
   * `GET /api/v1/webhooks/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<Webhook> {
    return this.http.get<Webhook>(
      `/webhooks/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Update a webhook subscription.
   * `PATCH /api/v1/webhooks/{id}`
   */
  update(
    id: string,
    data: UpdateWebhookParams,
    options?: RequestOptions,
  ): Promise<Webhook> {
    return this.http.patch<Webhook>(`/webhooks/${this.encode(id)}`, data, options);
  }

  /**
   * Unsubscribe / delete a webhook.
   * `DELETE /api/v1/webhooks/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<Webhook> {
    return this.http.delete<Webhook>(
      `/webhooks/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Trigger a simulated test event to a webhook endpoint.
   * `POST /api/v1/webhooks/{id}/test-event`
   */
  testEvent(
    id: string,
    data: TestWebhookEventParams,
    options?: RequestOptions,
  ): Promise<TestWebhookEventResponse> {
    return this.http.post<TestWebhookEventResponse>(
      `/webhooks/${this.encode(id)}/test-event`,
      data,
      options,
    );
  }

  /**
   * Verify an incoming `X-Webhook-Signature` header against the raw request body and webhook secret.
   */
  verifySignature(
    rawBody: string | Buffer,
    signature: string,
    secret: string,
  ): boolean {
    return verifyWebhookSignature(rawBody, signature, secret);
  }

  /**
   * Verify the webhook signature and parse the typed event payload.
   */
  constructEvent<T = Record<string, unknown>>(
    rawBody: string | Buffer,
    signature: string,
    secret: string,
  ): WebhookEventPayload<T> {
    return constructWebhookEvent<T>(rawBody, signature, secret);
  }
}
