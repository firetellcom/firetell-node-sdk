import {
  PaginatedResponse,
  PaginationParams,
  RequestOptions,
} from '../types/common.js';
import { BaseResource } from './base.js';

export type AddressBookOwnerType = 'agent' | 'team' | 'everyone';

export interface AddressBook {
  id: string;
  title: string;
  description?: string | null;
  owner_type?: AddressBookOwnerType;
  owner_id?: string | null;
  contact_count?: number;
  workspace_id?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface CreateAddressBookParams {
  title: string;
  description?: string;
  owner_type?: AddressBookOwnerType;
  owner_id?: string;
}

export interface UpdateAddressBookParams {
  title?: string;
  description?: string;
  owner_type?: AddressBookOwnerType;
  owner_id?: string;
}

export interface DeleteAddressBookResponse {
  id: string;
  deleted?: boolean;
  [key: string]: unknown;
}

export class AddressBooksResource extends BaseResource {
  /**
   * List workspace address books.
   * `GET /api/v1/address-books`
   */
  list(
    params?: PaginationParams,
    options?: RequestOptions,
  ): Promise<PaginatedResponse<AddressBook>> {
    return this.http.get<PaginatedResponse<AddressBook>>(
      '/address-books',
      params as Record<string, unknown>,
      options,
    );
  }

  /**
   * Create a new address book.
   * `POST /api/v1/address-books`
   */
  create(
    data: CreateAddressBookParams,
    options?: RequestOptions,
  ): Promise<AddressBook> {
    return this.http.post<AddressBook>('/address-books', data, options);
  }

  /**
   * Get address book details by ID.
   * `GET /api/v1/address-books/{id}`
   */
  retrieve(id: string, options?: RequestOptions): Promise<AddressBook> {
    return this.http.get<AddressBook>(
      `/address-books/${this.encode(id)}`,
      undefined,
      options,
    );
  }

  /**
   * Update address book details.
   * `PUT /api/v1/address-books/{id}`
   */
  update(
    id: string,
    data: UpdateAddressBookParams,
    options?: RequestOptions,
  ): Promise<AddressBook> {
    return this.http.put<AddressBook>(
      `/address-books/${this.encode(id)}`,
      data,
      options,
    );
  }

  /**
   * Delete an address book.
   * `DELETE /api/v1/address-books/{id}`
   */
  delete(
    id: string,
    options?: RequestOptions,
  ): Promise<DeleteAddressBookResponse> {
    return this.http.delete<DeleteAddressBookResponse>(
      `/address-books/${this.encode(id)}`,
      undefined,
      options,
    );
  }
}
