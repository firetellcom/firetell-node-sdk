import { RequestOptions } from '../types/common.js';
import { BaseResource } from './base.js';

export interface IceServer {
  urls: string[];
  username?: string;
  credential?: string;
}

export interface IceServersResponse {
  ice_servers: IceServer[];
  ice_servers_ttl: number;
  ice_servers_expires_at: string;
}

export interface WorkspaceMetadata {
  workspace_id: string;
  domain: string;
  country_code?: string;
  title?: string;
  logo?: string | null;
  time_zone?: string;
  region_id?: string;
  created_by_account_id?: string;
  ws_servers?: string[];
  ice_servers?: IceServer[];
  ice_servers_ttl?: number;
  ice_servers_expires_at?: string;
  [key: string]: unknown;
}

export class WorkspaceResource extends BaseResource {
  /**
   * Get workspace public metadata and configuration.
   * `GET /api/v1`
   */
  getMetadata(options?: RequestOptions): Promise<WorkspaceMetadata> {
    return this.http.get<WorkspaceMetadata>('', undefined, options);
  }

  /**
   * Refresh WebRTC ICE servers (short-lived TURN credentials).
   * `GET /api/v1/ice-servers`
   */
  getIceServers(options?: RequestOptions): Promise<IceServersResponse> {
    return this.http.get<IceServersResponse>('/ice-servers', undefined, options);
  }
}
