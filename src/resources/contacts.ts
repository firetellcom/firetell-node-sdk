import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export interface ContactEmail {
  email: string;
  type?: string;
  is_primary?: boolean;
}

export interface ContactPhoneNumber {
  phone_number: string;
  normalized_number?: string;
  type?: string;
  is_primary?: boolean;
}

export interface Contact {
  id: string;
  address_book_id: string;
  workspace_id?: string;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  title?: string | null;
  phone_number?: string | null;
  email?: string | null;
  phone_numbers: ContactPhoneNumber[];
  emails?: ContactEmail[];
  tags?: string[];
  notes?: string | null;
  timezone?: string | null;
  language?: string | null;
  country_code?: string | null;
  assigned_agent_id?: string | null;
  source?: string | null;
  custom_fields?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ListContactsParams extends PaginationParams {
  address_book_id: string;
}

export interface CreateContactParams {
  address_book_id: string;
  phone_numbers: ContactPhoneNumber[];
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
  emails?: ContactEmail[];
  tags?: string[];
  notes?: string;
  timezone?: string;
  language?: string;
  country_code?: string;
  assigned_agent_id?: string;
  source?: string;
  custom_fields?: Record<string, unknown>;
}

export type UpdateContactParams = CreateContactParams;

export class ContactsResource extends BaseResource {
  /**
   * List contacts in a specific address book.
   * `GET /api/v1/contacts`
   */
  list(
    params: ListContactsParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<Contact>> {
    return this.http.get<PaginatedResponse<Contact>>(
      '/contacts',
      params as unknown as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new contact.
   * `POST /api/v1/contacts`
   */
  create(data: CreateContactParams, options?: RequestOptions): Promise<Contact> {
    return this.http.post<Contact>('/contacts', data, options);
  }

  /**
   * Lookup a contact by phone number.
   * `GET /api/v1/contacts/lookup`
   */
  lookup(number: string, options?: RequestOptions): Promise<Contact | null> {
    return this.http.get<Contact | null>(
      '/contacts/lookup',
      { number },
      options,
    );
  }

  /**
   * Get contact details by ID.
   * `GET /api/v1/contacts/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<Contact> {
    return this.http.get<Contact>(
      `/contacts/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Update contact details.
   * `PUT /api/v1/contacts/{id}`
   */
  update(
    id: string,
    data: UpdateContactParams,
    options?: RequestOptions,
  ): Promise<Contact> {
    return this.http.put<Contact>(`/contacts/${this.encode(id)}`, data, options);
  }

  /**
   * Delete a contact by ID.
   * `DELETE /api/v1/contacts/{id}`
   */
  delete(id: string, options?: RequestOptions): Promise<Contact> {
    return this.http.delete<Contact>(
      `/contacts/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
