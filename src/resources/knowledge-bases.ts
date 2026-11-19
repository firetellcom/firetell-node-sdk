import { buildBlobFromFileInput, HttpClient } from '../http.js';
import {
  FileUploadInput,
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type KnowledgeBaseAnalyticsRange =
  | 'today'
  | '7d'
  | '30d'
  | 'all'
  | 'custom';

export type KnowledgeBaseDocumentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface KnowledgeBase {
  id: string;
  workspace_id?: string;
  name: string;
  description?: string | null;
  embedding_model?: string;
  document_count?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateKnowledgeBaseParams {
  name: string;
  description?: string;
  embedding_model?: string;
}

export interface UpdateKnowledgeBaseParams {
  name?: string;
  description?: string;
}

export interface KnowledgeBaseAnalyticsParams {
  range?: KnowledgeBaseAnalyticsRange | string;
  start_date?: string;
  end_date?: string;
}

export interface KnowledgeBaseAnalytics {
  [key: string]: unknown;
}

export interface KnowledgeBaseDocument {
  id: string;
  knowledge_base_id?: string;
  workspace_id?: string;
  title?: string;
  source_type?: string;
  source_url?: string | null;
  status?: KnowledgeBaseDocumentStatus | string;
  file_size?: number;
  chunk_count?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ListKnowledgeBaseDocumentsParams extends PaginationParams {
  source_type?: string;
  status?: KnowledgeBaseDocumentStatus | string;
}

export interface CrawlKnowledgeBaseUrlsParams {
  /** List of web page URLs to crawl (1 to 100 URLs). */
  urls: string[];
}

export interface DiscoverKnowledgeBaseUrlsParams {
  /** Domain or homepage URL to auto-discover sitemaps and pages. */
  url: string;
}

export interface BulkDeleteKnowledgeBaseDocumentsParams {
  ids: string[];
}

export interface DocumentDownloadUrlResponse {
  download_url?: string;
  url?: string;
  [key: string]: unknown;
}

export class KnowledgeBaseDocumentsResource extends BaseResource {
  /**
   * List all documents in a Knowledge Base.
   * `GET /api/v1/knowledge-bases/{id}/documents`
   */
  list(
    knowledgeBaseId: string,
    params?: ListKnowledgeBaseDocumentsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<KnowledgeBaseDocument>> {
    return this.http.get<PaginatedResponse<KnowledgeBaseDocument>>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents`,
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Get document details by ID.
   * `GET /api/v1/knowledge-bases/{id}/documents/{doc_id}`
   */
  retrieve(
    knowledgeBaseId: string,
    docId: string,
    options?: RequestOptions,
  ): Promise<KnowledgeBaseDocument> {
    return this.http.get<KnowledgeBaseDocument>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/${this.encode(docId)}`,
      undefined,
      options,
    );
  }

  /**
   * Delete a document from a Knowledge Base.
   * `DELETE /api/v1/knowledge-bases/{id}/documents/{doc_id}`
   */
  delete(
    knowledgeBaseId: string,
    docId: string,
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    return this.http.delete<Record<string, unknown>>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/${this.encode(docId)}`,
      undefined,
      options,
    );
  }

  /**
   * Upload a file document (PDF, DOCX, XLSX, TXT, etc., max 25MB) to a Knowledge Base.
   * `POST /api/v1/knowledge-bases/{id}/documents/upload`
   */
  upload(
    knowledgeBaseId: string,
    file: FileUploadInput,
    options?: RequestOptions,
  ): Promise<KnowledgeBaseDocument> {
    const formData = new FormData();
    formData.append('file', buildBlobFromFileInput(file), file.filename);
    return this.http.postForm<KnowledgeBaseDocument>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/upload`,
      formData,
      options,
    );
  }

  /**
   * Crawl one or more web URLs into a Knowledge Base.
   * `POST /api/v1/knowledge-bases/{id}/documents/crawl`
   */
  crawl(
    knowledgeBaseId: string,
    data: CrawlKnowledgeBaseUrlsParams,
    options?: RequestOptions,
  ): Promise<KnowledgeBaseDocument[]> {
    return this.http.post<KnowledgeBaseDocument[]>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/crawl`,
      data,
      options,
    );
  }

  /**
   * Auto-discover website URLs from a domain sitemap or homepage links.
   * `POST /api/v1/knowledge-bases/{id}/documents/discover-urls`
   */
  discoverUrls(
    knowledgeBaseId: string,
    data: DiscoverKnowledgeBaseUrlsParams,
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    return this.http.post<Record<string, unknown>>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/discover-urls`,
      data,
      options,
    );
  }

  /**
   * Get a presigned download URL for an uploaded document.
   * `GET /api/v1/knowledge-bases/{id}/documents/{doc_id}/download-url`
   */
  getDownloadUrl(
    knowledgeBaseId: string,
    docId: string,
    options?: RequestOptions,
  ): Promise<DocumentDownloadUrlResponse> {
    return this.http.get<DocumentDownloadUrlResponse>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/${this.encode(docId)}/download-url`,
      undefined,
      options,
    );
  }

  /**
   * Bulk delete documents from a Knowledge Base (max 100 IDs).
   * `POST /api/v1/knowledge-bases/{id}/documents/bulk-delete`
   */
  bulkDelete(
    knowledgeBaseId: string,
    ids: string[] | BulkDeleteKnowledgeBaseDocumentsParams,
    options?: RequestOptions,
  ): Promise<Record<string, unknown>> {
    const body: BulkDeleteKnowledgeBaseDocumentsParams = Array.isArray(ids)
      ? { ids }
      : ids;
    return this.http.post<Record<string, unknown>>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/bulk-delete`,
      body,
      options,
    );
  }

  /**
   * Re-crawl and re-index a URL document in a Knowledge Base.
   * `POST /api/v1/knowledge-bases/{id}/documents/{doc_id}/recrawl`
   */
  recrawl(
    knowledgeBaseId: string,
    docId: string,
    options?: RequestOptions,
  ): Promise<KnowledgeBaseDocument> {
    return this.http.post<KnowledgeBaseDocument>(
      `/knowledge-bases/${this.encode(knowledgeBaseId)}/documents/${this.encode(docId)}/recrawl`,
      undefined,
      options,
    );
  }
}

export class KnowledgeBasesResource extends BaseResource {
  /** Sub-resource for managing documents within a Knowledge Base. */
  readonly documents: KnowledgeBaseDocumentsResource;

  constructor(http: HttpClient) {
    super(http);
    this.documents = new KnowledgeBaseDocumentsResource(http);
  }

  /**
   * List all Knowledge Bases in the workspace.
   * `GET /api/v1/knowledge-bases`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<KnowledgeBase>> {
    return this.http.get<PaginatedResponse<KnowledgeBase>>(
      '/knowledge-bases',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new Knowledge Base.
   * `POST /api/v1/knowledge-bases`
   */
  create(
    data: CreateKnowledgeBaseParams,
    options?: RequestOptions,
  ): Promise<KnowledgeBase> {
    return this.http.post<KnowledgeBase>('/knowledge-bases', data, options);
  }

  /**
   * Get Knowledge Base details by ID.
   * `GET /api/v1/knowledge-bases/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<KnowledgeBase> {
    return this.http.get<KnowledgeBase>(
      `/knowledge-bases/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Update a Knowledge Base.
   * `PATCH /api/v1/knowledge-bases/{id}`
   */
  update(
    id: string,
    data: UpdateKnowledgeBaseParams,
    options?: RequestOptions,
  ): Promise<KnowledgeBase> {
    return this.http.patch<KnowledgeBase>(
      `/knowledge-bases/${this.encode(id)}`,
      data,
      options,
    );
  }

  /**
   * Delete a Knowledge Base.
   * `DELETE /api/v1/knowledge-bases/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<KnowledgeBase> {
    return this.http.delete<KnowledgeBase>(
      `/knowledge-bases/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Get workspace-level Knowledge Base usage analytics and insights.
   * `GET /api/v1/knowledge-bases/analytics`
   */
  getWorkspaceAnalytics(
    params?: KnowledgeBaseAnalyticsParams,
    options?: RequestOptions,
  ): Promise<KnowledgeBaseAnalytics> {
    return this.http.get<KnowledgeBaseAnalytics>(
      '/knowledge-bases/analytics',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Get usage analytics and insights for a specific Knowledge Base.
   * `GET /api/v1/knowledge-bases/{id}/analytics`
   */
  getAnalytics(
    id: string,
    params?: KnowledgeBaseAnalyticsParams,
    options?: RequestOptions,
  ): Promise<KnowledgeBaseAnalytics> {
    return this.http.get<KnowledgeBaseAnalytics>(
      `/knowledge-bases/${this.encode(id)}/analytics`,
      params as Record<string, unknown>,
      options,
    );
  }
}
