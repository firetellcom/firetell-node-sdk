import { createHmac } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import {
  constructWebhookEvent,
  Firetell,
  FiretellAuthenticationError,
  FiretellError,
  FiretellNotFoundError,
  FiretellRateLimitError,
  FiretellValidationError,
  normalizeBaseUrl,
  verifyWebhookSignature,
} from '../src/index.js';

function createMockFetch(
  handler: (url: string, init: RequestInit) => Response | Promise<Response>,
) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    return handler(url, init ?? {});
  });
}

function jsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

describe('normalizeBaseUrl & client initialization', () => {
  it('normalizes workspace domains properly', () => {
    expect(normalizeBaseUrl('acme.firetell.app')).toBe(
      'https://acme.firetell.app/api/v1',
    );
    expect(normalizeBaseUrl('https://acme.firetell.app/')).toBe(
      'https://acme.firetell.app/api/v1',
    );
    expect(normalizeBaseUrl('http://localhost:3000')).toBe(
      'http://localhost:3000/api/v1',
    );
    expect(normalizeBaseUrl('https://acme.firetell.app/api/v1')).toBe(
      'https://acme.firetell.app/api/v1',
    );
  });

  it('throws FiretellError when domain or secretKey is missing', () => {
    expect(
      () => new Firetell({ domain: '', secretKey: 'sk-test' }),
    ).toThrow(FiretellError);
    expect(
      () => new Firetell({ domain: 'acme.firetell.app', secretKey: '' }),
    ).toThrow(FiretellError);
  });
});

describe('HttpClient authentication & error handling', () => {
  it('sends Authorization: ApiKey header and parses JSON response', async () => {
    const mockFetch = createMockFetch((url, init) => {
      const headers = init.headers as Record<string, string>;
      expect(url).toBe('https://acme.firetell.app/api/v1');
      expect(headers.Authorization).toBe('ApiKey sk-live-123');
      expect(headers['User-Agent']).toMatch(/^firetell-node-sdk\//);
      return jsonResponse({ workspace_id: 'acme', domain: 'acme.firetell.app' });
    });

    const client = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-live-123',
      fetch: mockFetch as unknown as typeof fetch,
    });

    const meta = await client.workspace.getMetadata();
    expect(meta.workspace_id).toBe('acme');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('maps 400 validation errors with field errors', async () => {
    const mockFetch = createMockFetch(() =>
      jsonResponse(
        {
          message: 'from must be a valid phone number',
          errors: [
            { field: 'from', messages: ['from must be a valid phone number'] },
          ],
        },
        400,
      ),
    );

    const client = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-test',
      maxRetries: 0,
      fetch: mockFetch as unknown as typeof fetch,
    });

    await expect(
      client.messages.send({ from: 'bad', to: '+15559876543', body: 'hi' }),
    ).rejects.toMatchObject({
      name: 'FiretellValidationError',
      statusCode: 400,
      errors: [
        { field: 'from', messages: ['from must be a valid phone number'] },
      ],
    });
  });

  it('maps 401 and 404 to typed error classes', async () => {
    const mock401 = createMockFetch(() =>
      jsonResponse({ message: 'Invalid API Key' }, 401),
    );
    const c1 = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-bad',
      maxRetries: 0,
      fetch: mock401 as unknown as typeof fetch,
    });
    await expect(c1.agents.list()).rejects.toBeInstanceOf(
      FiretellAuthenticationError,
    );

    const mock404 = createMockFetch(() =>
      jsonResponse({ message: 'Agent not found' }, 404),
    );
    const c2 = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-ok',
      maxRetries: 0,
      fetch: mock404 as unknown as typeof fetch,
    });
    await expect(c2.agents.retrieve('missing')).rejects.toBeInstanceOf(
      FiretellNotFoundError,
    );
  });

  it('retries on 429 and surfaces rate limit metadata when retries are exhausted', async () => {
    const mockFetch = createMockFetch(() =>
      jsonResponse(
        { message: 'Rate limit exceeded', retryAfter: 0 },
        429,
        {
          'Retry-After': '0',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
        },
      ),
    );

    const client = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-test',
      maxRetries: 1,
      fetch: mockFetch as unknown as typeof fetch,
    });

    try {
      await client.calls.list();
      expect.unreachable('Expected rate limit error');
    } catch (err) {
      expect(err).toBeInstanceOf(FiretellRateLimitError);
      const rlErr = err as FiretellRateLimitError;
      expect(rlErr.statusCode).toBe(429);
      expect(rlErr.limit).toBe(100);
      expect(rlErr.remaining).toBe(0);
      expect(rlErr.retryAfter).toBe(0);
    }

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('Resource endpoints', () => {
  it('calls.make & calls.sendActions & calls.getRecordingStream', async () => {
    const calls: Array<{ url: string; method?: string; body?: string }> = [];
    const mockFetch = createMockFetch((url, init) => {
      calls.push({
        url,
        method: init.method,
        body: typeof init.body === 'string' ? init.body : undefined,
      });
      return jsonResponse({ call_id: 'call_123', status: 'created' }, 201);
    });

    const client = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-test',
      fetch: mockFetch as unknown as typeof fetch,
    });

    await client.calls.make({
      from: { number: '+18005550199', name: 'Support' },
      to: { number: '+14155552671', name: 'John' },
      actions: [{ action: 'tts', params: { text: 'Hello!' } }],
    });

    await client.calls.sendActions('call_123', {
      actions: [{ action: 'hangup' }],
    });

    await client.calls.getRecordingStream('call_123', 0);

    expect(calls[0]).toMatchObject({
      method: 'POST',
      url: 'https://acme.firetell.app/api/v1/calls/make',
    });
    expect(calls[1]).toMatchObject({
      method: 'PUT',
      url: 'https://acme.firetell.app/api/v1/calls/call_123/actions',
    });
    expect(calls[2]).toMatchObject({
      method: 'GET',
      url: 'https://acme.firetell.app/api/v1/calls/call_123/recordings/0/stream?redirect=false',
    });
  });

  it('voiceAgents.tools and knowledgeBases.documents sub-resources', async () => {
    const requests: Array<{ url: string; method?: string }> = [];
    const mockFetch = createMockFetch((url, init) => {
      requests.push({ url, method: init.method });
      return jsonResponse({ id: 'ok' });
    });

    const client = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-test',
      fetch: mockFetch as unknown as typeof fetch,
    });

    await client.voiceAgents.tools.create('va_1', {
      name: 'check_order',
      description: 'Check order status',
    });

    await client.knowledgeBases.documents.upload('kb_1', {
      content: Buffer.from('hello pdf'),
      filename: 'guide.pdf',
      contentType: 'application/pdf',
    });

    await client.audios.upload({
      title: 'Welcome',
      file: {
        content: Buffer.from('fake-mp3'),
        filename: 'welcome.mp3',
        contentType: 'audio/mpeg',
      },
    });

    await client.phoneNumbers.delete('pn_1', '123456');

    expect(requests[0]).toEqual({
      method: 'POST',
      url: 'https://acme.firetell.app/api/v1/voice-agents/va_1/tools',
    });
    expect(requests[1]).toEqual({
      method: 'POST',
      url: 'https://acme.firetell.app/api/v1/knowledge-bases/kb_1/documents/upload',
    });
    expect(requests[2]).toEqual({
      method: 'POST',
      url: 'https://acme.firetell.app/api/v1/audios',
    });
    expect(requests[3]).toEqual({
      method: 'DELETE',
      url: 'https://acme.firetell.app/api/v1/phone-numbers/pn_1',
    });
  });

  it('sends x-otp header on phoneNumbers.delete', async () => {
    const mockFetch = createMockFetch((_url, init) => {
      const headers = init.headers as Record<string, string>;
      expect(headers['x-otp']).toBe('654321');
      return jsonResponse({ id: 'pn_1' });
    });

    const client = new Firetell({
      domain: 'acme.firetell.app',
      secretKey: 'sk-test',
      fetch: mockFetch as unknown as typeof fetch,
    });

    await client.phoneNumbers.delete('pn_1', '654321');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe('Webhook signature verification', () => {
  const secret = 'whsec_test_secret_123456';
  const payload = JSON.stringify({
    event: 'call.ended',
    workspace_id: 'acme',
    data: { call_id: 'call_1' },
    timestamp: '2026-08-18T00:00:00.000Z',
    attempt: 1,
  });

  const validSig = createHmac('sha256', secret).update(payload).digest('hex');

  it('verifies valid HMAC-SHA256 signatures and constructs typed events', () => {
    expect(verifyWebhookSignature(payload, validSig, secret)).toBe(true);
    expect(verifyWebhookSignature(Buffer.from(payload), validSig, secret)).toBe(
      true,
    );

    const event = constructWebhookEvent<{ call_id: string }>(
      payload,
      validSig,
      secret,
    );
    expect(event.event).toBe('call.ended');
    expect(event.data.call_id).toBe('call_1');
  });

  it('rejects invalid signatures or tampered payloads', () => {
    expect(verifyWebhookSignature(payload, 'invalid_sig', secret)).toBe(false);
    expect(verifyWebhookSignature(payload + ' ', validSig, secret)).toBe(false);
    expect(() => constructWebhookEvent(payload, 'bad', secret)).toThrow(
      FiretellValidationError,
    );
  });
});
