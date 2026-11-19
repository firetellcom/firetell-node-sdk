import { HttpClient } from '../http.js';

export abstract class BaseResource {
  protected readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  protected encode(segment: string | number): string {
    return encodeURIComponent(String(segment));
  }
}
