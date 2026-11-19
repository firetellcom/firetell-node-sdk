import { buildBlobFromFileInput } from '../http.js';
import {
  FileUploadInput,
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export interface AudioSample {
  url: string;
  sample_rate: number;
  size: number;
  duration: number;
}

export interface AudioPrompt {
  id: string;
  title: string;
  url: string;
  duration?: number;
  file_size?: number;
  workspace_id?: string;
  samples?: AudioSample[];
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface UploadAudioParams {
  /** Title of the audio prompt (1-50 chars). */
  title: string;
  /** Audio file to upload (must have an `audio/*` MIME type, max 5MB). */
  file: FileUploadInput;
}

export class AudiosResource extends BaseResource {
  /**
   * List uploaded audio prompt files in the workspace.
   * `GET /api/v1/audios`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<AudioPrompt>> {
    return this.http.get<PaginatedResponse<AudioPrompt>>(
      '/audios',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Upload a new audio prompt file (multipart/form-data).
   * `POST /api/v1/audios`
   */
  upload(
    data: UploadAudioParams,
    options?: RequestOptions,
  ): Promise<AudioPrompt> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', buildBlobFromFileInput(data.file), data.file.filename);
    return this.http.postForm<AudioPrompt>('/audios', formData, options);
  }

  /**
   * Get audio prompt details by ID.
   * `GET /api/v1/audios/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<AudioPrompt> {
    return this.http.get<AudioPrompt>(
      `/audios/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Delete an audio prompt by ID.
   * `DELETE /api/v1/audios/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<AudioPrompt> {
    return this.http.delete<AudioPrompt>(
      `/audios/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
