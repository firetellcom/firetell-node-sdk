export { Firetell, default } from './client.js';
export { HttpClient, normalizeBaseUrl } from './http.js';
export { SDK_VERSION } from './version.js';

export {
  FiretellError,
  FiretellAuthenticationError,
  FiretellPermissionError,
  FiretellNotFoundError,
  FiretellValidationError,
  FiretellConflictError,
  FiretellRateLimitError,
  FiretellApiError,
  FiretellTimeoutError,
  FiretellNetworkError,
  type FieldValidationError,
  type FiretellErrorOptions,
  type FiretellRateLimitErrorOptions,
} from './errors.js';

export type {
  SortOrder,
  PaginationParams,
  PaginationMeta,
  PaginatedResponse,
  RequestOptions,
  FetchLike,
  FiretellClientConfig,
  FileUploadInput,
} from './types/common.js';

export {
  WorkspaceResource,
  type IceServer,
  type IceServersResponse,
  type WorkspaceMetadata,
} from './resources/workspace.js';

export {
  AgentsResource,
  type AgentState,
  type AgentRole,
  type Agent,
  type ListAgentsParams,
  type CreateAgentParams,
  type UpdateAgentParams,
  type ChangeAgentPasswordParams,
  type ChangeAgentPasswordResponse,
} from './resources/agents.js';

export {
  TeamsResource,
  type Team,
  type TeamAgentMember,
  type CreateTeamParams,
  type UpdateTeamParams,
} from './resources/teams.js';

export {
  CallsResource,
  type CallDirection,
  type CallDirectionFilter,
  type CallSentiment,
  type CallSentimentFilter,
  type CallActionType,
  type CallParty,
  type ServerCallParty,
  type ServerCallAction,
  type CallRecord,
  type ListCallsParams,
  type MakeCallParams,
  type MakeCallResponse,
  type UpdateCallActionsParams,
  type UpdateCallActionsResponse,
  type CallEvent,
  type CallRecordingItem,
  type CallRecordingsResponse,
  type DeleteCallRecordingsResponse,
  type DeleteSingleRecordingResponse,
  type RecordingMediaMetadata,
  type CallTranscriptionDialogue,
  type CallTranscriptionEntity,
  type CallTranscription,
  type DeleteCallTranscriptionResponse,
} from './resources/calls.js';

export {
  MessagesResource,
  type MessageDirection,
  type MessageStatus,
  type MessageSenderType,
  type Message,
  type SendMessageParams,
  type ListMessagesParams,
} from './resources/messages.js';

export {
  RecordingsResource,
  type RecordingSortField,
  type Recording,
  type ListRecordingsParams,
  type BulkDeleteRecordingsParams,
  type BulkDeleteRecordingsResponse,
} from './resources/recordings.js';

export {
  TranscriptionsResource,
  type TranscriptionSortField,
  type TranscriptionSummary,
  type ListTranscriptionsParams,
  type BulkDeleteTranscriptionsParams,
  type BulkDeleteTranscriptionsResponse,
} from './resources/transcriptions.js';

export {
  VoiceAgentsResource,
  VoiceAgentToolsResource,
  type VoiceAgentProvider,
  type VoiceAgentWebhookMethod,
  type VoiceAgentSettings,
  type VoiceAgent,
  type CreateVoiceAgentParams,
  type UpdateVoiceAgentParams,
  type RetrieveVoiceAgentParams,
  type UpdateVoiceAgentSettingsParams,
  type PublishVoiceAgentVersionParams,
  type VoiceAgentVersionItem,
  type VoiceAgentVersionsResponse,
  type DeleteVoiceAgentVersionResponse,
  type VoiceAgentTestCallResponse,
  type VoiceProviderInfo,
  type VoiceModelInfo,
  type ListVoiceModelsParams,
  type SystemVoiceInfo,
  type ListSystemVoicesParams,
  type BuiltinToolInfo,
  type VoiceAgentTool,
  type CreateVoiceAgentToolParams,
  type UpdateVoiceAgentToolParams,
} from './resources/voice-agents.js';

export {
  KnowledgeBasesResource,
  KnowledgeBaseDocumentsResource,
  type KnowledgeBaseAnalyticsRange,
  type KnowledgeBaseDocumentStatus,
  type KnowledgeBase,
  type CreateKnowledgeBaseParams,
  type UpdateKnowledgeBaseParams,
  type KnowledgeBaseAnalyticsParams,
  type KnowledgeBaseAnalytics,
  type KnowledgeBaseDocument,
  type ListKnowledgeBaseDocumentsParams,
  type CrawlKnowledgeBaseUrlsParams,
  type DiscoverKnowledgeBaseUrlsParams,
  type BulkDeleteKnowledgeBaseDocumentsParams,
  type DocumentDownloadUrlResponse,
} from './resources/knowledge-bases.js';

export {
  PhoneNumbersResource,
  type TranscriptionProvider,
  type PhoneNumberTranscriptionConfig,
  type PhoneNumber,
  type UpdatePhoneNumberParams,
} from './resources/phone-numbers.js';

export {
  SipAccountsResource,
  type SipAccount,
  type CreateSipAccountParams,
  type UpdateSipAccountParams,
} from './resources/sip-accounts.js';

export {
  ExtensionsResource,
  type Extension,
  type CreateExtensionParams,
  type UpdateExtensionParams,
} from './resources/extensions.js';

export {
  AudiosResource,
  type AudioSample,
  type AudioPrompt,
  type UploadAudioParams,
} from './resources/audios.js';

export {
  WebhooksResource,
  verifyWebhookSignature,
  constructWebhookEvent,
  type WebhookEventName,
  type WebhookHeader,
  type Webhook,
  type CreateWebhookParams,
  type UpdateWebhookParams,
  type TestWebhookEventParams,
  type TestWebhookEventResponse,
  type WebhookEventPayload,
} from './resources/webhooks.js';

export {
  ContactsResource,
  type ContactEmail,
  type ContactPhoneNumber,
  type Contact,
  type ListContactsParams,
  type CreateContactParams,
  type UpdateContactParams,
} from './resources/contacts.js';

export {
  AddressBooksResource,
  type AddressBookOwnerType,
  type AddressBook,
  type CreateAddressBookParams,
  type UpdateAddressBookParams,
  type DeleteAddressBookResponse,
} from './resources/address-books.js';

export {
  CallFlowsResource,
  type CallFlowTriggerType,
  type CallFlow,
  type ListCallFlowsParams,
  type CreateCallFlowParams,
} from './resources/call-flows.js';

export { InvoicesResource, type Invoice } from './resources/invoices.js';

export {
  AuditLogsResource,
  type AuditLogActor,
  type AuditLogTarget,
  type AuditLog,
  type ListAuditLogsParams,
} from './resources/audit-logs.js';

export {
  CreditTransactionsResource,
  type CreditTransaction,
  type ListCreditTransactionsParams,
} from './resources/credit-transactions.js';
