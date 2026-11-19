import { HttpClient } from './http.js';
import { AddressBooksResource } from './resources/address-books.js';
import { AgentsResource } from './resources/agents.js';
import { AudiosResource } from './resources/audios.js';
import { AuditLogsResource } from './resources/audit-logs.js';
import { CallFlowsResource } from './resources/call-flows.js';
import { CallsResource } from './resources/calls.js';
import { ContactsResource } from './resources/contacts.js';
import { CreditTransactionsResource } from './resources/credit-transactions.js';
import { ExtensionsResource } from './resources/extensions.js';
import { InvoicesResource } from './resources/invoices.js';
import { KnowledgeBasesResource } from './resources/knowledge-bases.js';
import { MessagesResource } from './resources/messages.js';
import { PhoneNumbersResource } from './resources/phone-numbers.js';
import { RecordingsResource } from './resources/recordings.js';
import { SipAccountsResource } from './resources/sip-accounts.js';
import { TeamsResource } from './resources/teams.js';
import { TranscriptionsResource } from './resources/transcriptions.js';
import { VoiceAgentsResource } from './resources/voice-agents.js';
import { WebhooksResource } from './resources/webhooks.js';
import { WorkspaceResource } from './resources/workspace.js';
import { FiretellClientConfig } from './types/common.js';

/**
 * Official Firetell Workspace API server-to-server client.
 *
 * Authenticates using your workspace domain and API secret key (`Authorization: ApiKey sk-...`).
 *
 * @example
 * ```ts
 * import { Firetell } from '@firetell/firetell-node-sdk';
 *
 * const firetell = new Firetell({
 *   domain: 'yourcompany.firetell.app',
 *   secretKey: process.env.FIRETELL_SECRET_KEY!,
 * });
 *
 * const message = await firetell.messages.send({
 *   from: '+15551234567',
 *   to: '+15559876543',
 *   body: 'Hello from Firetell!',
 * });
 * ```
 */
export class Firetell {
  readonly http: HttpClient;

  readonly workspace: WorkspaceResource;
  readonly agents: AgentsResource;
  readonly teams: TeamsResource;
  readonly calls: CallsResource;
  readonly messages: MessagesResource;
  readonly recordings: RecordingsResource;
  readonly transcriptions: TranscriptionsResource;
  readonly voiceAgents: VoiceAgentsResource;
  readonly knowledgeBases: KnowledgeBasesResource;
  readonly phoneNumbers: PhoneNumbersResource;
  readonly sipAccounts: SipAccountsResource;
  readonly extensions: ExtensionsResource;
  readonly audios: AudiosResource;
  readonly webhooks: WebhooksResource;
  readonly contacts: ContactsResource;
  readonly addressBooks: AddressBooksResource;
  readonly callFlows: CallFlowsResource;
  readonly invoices: InvoicesResource;
  readonly auditLogs: AuditLogsResource;
  readonly creditTransactions: CreditTransactionsResource;

  constructor(config: FiretellClientConfig) {
    this.http = new HttpClient(config);

    this.workspace = new WorkspaceResource(this.http);
    this.agents = new AgentsResource(this.http);
    this.teams = new TeamsResource(this.http);
    this.calls = new CallsResource(this.http);
    this.messages = new MessagesResource(this.http);
    this.recordings = new RecordingsResource(this.http);
    this.transcriptions = new TranscriptionsResource(this.http);
    this.voiceAgents = new VoiceAgentsResource(this.http);
    this.knowledgeBases = new KnowledgeBasesResource(this.http);
    this.phoneNumbers = new PhoneNumbersResource(this.http);
    this.sipAccounts = new SipAccountsResource(this.http);
    this.extensions = new ExtensionsResource(this.http);
    this.audios = new AudiosResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
    this.contacts = new ContactsResource(this.http);
    this.addressBooks = new AddressBooksResource(this.http);
    this.callFlows = new CallFlowsResource(this.http);
    this.invoices = new InvoicesResource(this.http);
    this.auditLogs = new AuditLogsResource(this.http);
    this.creditTransactions = new CreditTransactionsResource(this.http);
  }
}

export default Firetell;
