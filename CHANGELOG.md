# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-11-19

### Added
- Initial release of `@firetell/firetell-node-sdk` for Node.js (ESM & CommonJS) and TypeScript.
- Server-to-server authentication via Workspace Domain and API Secret Key (`Authorization: ApiKey <secretKey>`).
- Full coverage of Firetell Workspace API resources: Workspace, Agents, Teams, Calls, Messages, Recordings, Transcriptions, Voice AI Agents (+ Tools), Knowledge Bases (+ Documents), Phone Numbers, SIP Accounts, Extensions, Audios, Webhooks, Contacts, Address Books, Call Flows, Invoices, Audit Logs, and Credit Transactions.
- Typed error hierarchy (`FiretellError`, `FiretellValidationError`, `FiretellAuthenticationError`, `FiretellRateLimitError`, etc.) with automatic retries on 429/5xx/network errors.
- HMAC-SHA256 webhook signature verification helpers (`verifyWebhookSignature` and `constructWebhookEvent`).
