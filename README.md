# @firetell/firetell-node-sdk

Official Node.js and TypeScript SDK for the **Firetell Workspace API** — programmable voice calls, SMS/MMS messaging, Voice AI agents, knowledge bases, call recordings, transcriptions, SIP accounts, and webhooks.

- **Zero runtime dependencies** (uses native Node.js 18+ `fetch`, `FormData`, `Blob`, and `node:crypto`)
- **Full TypeScript support** with strict request/response types
- **Dual ESM & CommonJS** builds for seamless usage in both JavaScript and TypeScript projects
- **Built-in retries & error hierarchy** with automatic handling of `429 Rate Limit` (`Retry-After`) and transient 5xx/network errors
- **Webhook signature verification** (`X-Webhook-Signature` HMAC-SHA256)

## Requirements

- Node.js `>= 18.0.0`

## Installation

```bash
npm install @firetell/firetell-node-sdk
```

```bash
yarn add @firetell/firetell-node-sdk
```

```bash
pnpm add @firetell/firetell-node-sdk
```

## Quick Start

Authenticate server-to-server using your **Workspace Domain** and **API Secret Key** (sent via `Authorization: ApiKey <secretKey>`).

### TypeScript / ESM

```ts
import { Firetell } from '@firetell/firetell-node-sdk';

const firetell = new Firetell({
  domain: 'yourcompany.firetell.app',
  secretKey: process.env.FIRETELL_SECRET_KEY!,
});

// Send an SMS message
const message = await firetell.messages.send({
  from: '+15551234567',
  to: '+15559876543',
  body: 'Hello from Firetell!',
});

console.log('Queued message:', message.id);
```

### CommonJS (JavaScript)

```js
const { Firetell } = require('@firetell/firetell-node-sdk');

const firetell = new Firetell({
  domain: 'yourcompany.firetell.app',
  secretKey: process.env.FIRETELL_SECRET_KEY,
});

async function main() {
  const agents = await firetell.agents.list({ page: 1, limit: 20 });
  console.log(agents.data);
}

main();
```

## Configuration Options

```ts
const firetell = new Firetell({
  domain: 'yourcompany.firetell.app', // Accepts domain or full URL (https://...)
  secretKey: 'sk-...',                // Required API secret key
  timeout: 30_000,                    // Request timeout in ms (default: 30000)
  maxRetries: 2,                      // Retries on 429 / 5xx / network errors (default: 2)
  headers: {                          // Optional default headers
    'X-Custom-Header': 'value',
  },
});
```

Every SDK method also accepts an optional `RequestOptions` object as its final argument:

```ts
const controller = new AbortController();
await firetell.calls.list(
  { direction: 'outbound', page: 1, limit: 10 },
  { timeout: 10_000, signal: controller.signal },
);
```

## Usage Examples

### Make an Outbound Programmable Call

```ts
const call = await firetell.calls.make({
  from: { number: '+18005550199', name: 'Support Hotline' },
  to: { number: '+14155552671', name: 'John Doe' },
  max_duration: 180,
  actions: [
    {
      action: 'tts',
      params: { text: 'Hello! Thank you for answering our call.' },
    },
    {
      action: 'connect_voice_agent',
      params: { voice_agent_id: 'va_01h900000000000000000001' },
    },
  ],
});

// Control an active call
await firetell.calls.sendActions(call.call_id, {
  actions: [{ action: 'hangup' }],
});
```

### Voice AI Agents & Custom Tools

```ts
// Create a Voice AI agent
const agent = await firetell.voiceAgents.create({
  name: 'Front Desk Receptionist',
  instructions: 'You are a friendly hotel receptionist. Assist callers with bookings.',
});

// Attach a custom webhook tool
const tool = await firetell.voiceAgents.tools.create(agent.id, {
  name: 'check_room_availability',
  description: 'Check room availability by check-in date',
  webhook_url: 'https://api.example.com/rooms/check',
  webhook_method: 'POST',
  parameters: {
    check_in_date: { type: 'string', description: 'YYYY-MM-DD' },
  },
  required_params: ['check_in_date'],
});

// Update settings & publish
await firetell.voiceAgents.updateSettings(agent.id, {
  version: 1,
  provider: 'gemini',
  model_id: 'gemini-3.1-flash-live-preview',
  voice_id: 'Aoede',
  language: 'en',
  tools_id: [tool.id],
});

await firetell.voiceAgents.publish(agent.id, { version: 1 });
```

### Knowledge Bases (RAG)

```ts
import { readFileSync } from 'node:fs';

const kb = await firetell.knowledgeBases.create({
  name: 'Product FAQ',
  description: 'Pricing and support documentation',
});

// Upload a PDF document
await firetell.knowledgeBases.documents.upload(kb.id, {
  content: readFileSync('./pricing-guide.pdf'),
  filename: 'pricing-guide.pdf',
  contentType: 'application/pdf',
});

// Crawl web URLs
await firetell.knowledgeBases.documents.crawl(kb.id, {
  urls: ['https://example.com/pricing', 'https://example.com/faq'],
});
```

### Webhook Signature Verification

Verify incoming `X-Webhook-Signature` headers using HMAC-SHA256 with constant-time comparison:

```ts
import express from 'express';
import { constructWebhookEvent } from '@firetell/firetell-node-sdk';

const app = express();

app.post(
  '/webhooks/firetell',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const signature = req.header('x-webhook-signature') ?? '';

    try {
      const event = constructWebhookEvent(
        req.body,
        signature,
        process.env.FIRETELL_WEBHOOK_SECRET!,
      );

      console.log('Verified event:', event.event, event.data);
      res.sendStatus(200);
    } catch (err) {
      res.status(400).send('Invalid signature');
    }
  },
);
```

## Available Resources

| Resource | Property | Description |
| --- | --- | --- |
| Workspace | `firetell.workspace` | Workspace metadata and WebRTC ICE/TURN servers |
| Agents | `firetell.agents` | CRUD, teams, avatar upload, password reset |
| Teams | `firetell.teams` | CRUD, add/remove agents, agent suggestions |
| Calls | `firetell.calls` | List CDRs, make calls, live call actions, events, recordings, transcriptions |
| Messages | `firetell.messages` | Send SMS/MMS, list and retrieve message history |
| Recordings | `firetell.recordings` | List workspace recordings, bulk delete |
| Transcriptions | `firetell.transcriptions` | List workspace transcriptions, bulk delete |
| Voice AI Agents | `firetell.voiceAgents` | CRUD, settings, versions, publish, test calls, providers/models/voices/tools |
| Knowledge Bases | `firetell.knowledgeBases` | CRUD, analytics, document upload/crawl/discover/recrawl/bulk-delete |
| Phone Numbers | `firetell.phoneNumbers` | List, retrieve, update config, release (with OTP) |
| SIP Accounts | `firetell.sipAccounts` | List, create, update, delete SIP credentials |
| Extensions | `firetell.extensions` | List, create, update, delete internal extensions |
| Audios | `firetell.audios` | List, upload (multipart), retrieve, delete audio prompts |
| Webhooks | `firetell.webhooks` | CRUD, simulate test events, signature verification |
| Contacts | `firetell.contacts` | CRUD and lookup by phone number |
| Address Books | `firetell.addressBooks` | List, create, retrieve, update, delete address books |
| Call Flows | `firetell.callFlows` | List, create, retrieve, delete visual call flows |
| Invoices | `firetell.invoices` | List workspace billing invoices |
| Audit Logs | `firetell.auditLogs` | List and retrieve workspace audit logs |
| Credit Transactions | `firetell.creditTransactions` | List and retrieve workspace credit transactions |

## Error Handling

All errors extend `FiretellError`:

```ts
import {
  FiretellError,
  FiretellAuthenticationError,
  FiretellValidationError,
  FiretellRateLimitError,
  FiretellNotFoundError,
} from '@firetell/firetell-node-sdk';

try {
  await firetell.agents.retrieve('non-existent-id');
} catch (err) {
  if (err instanceof FiretellNotFoundError) {
    console.error('Not found:', err.message);
  } else if (err instanceof FiretellValidationError) {
    console.error('Validation errors:', err.errors);
  } else if (err instanceof FiretellRateLimitError) {
    console.error(`Rate limited. Retry after ${err.retryAfter}s`);
  } else if (err instanceof FiretellAuthenticationError) {
    console.error('Invalid API key');
  } else if (err instanceof FiretellError) {
    console.error('API error:', err.statusCode, err.message);
  }
}
```

## Documentation & References

- **Workspace API Reference:** https://firetell.com/docs/developers/rest-api/overview
- **Quickstart:** https://firetell.com/docs/developers/getting-started/quickstart
- **Authentication:** https://firetell.com/docs/developers/getting-started/authentication
- **Webhooks:** https://firetell.com/docs/developers/rest-api/workspace-api/webhooks
- **SDKs Overview:** https://firetell.com/docs/developers/sdks/overview
- **OpenAPI Playground:** https://firetell.com/docs/developers/api-playground/workspace-api

## License

MIT © [Firetell](https://github.com/firetellcom/firetell-node-sdk/blob/main/LICENSE)
