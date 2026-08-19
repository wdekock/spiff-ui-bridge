import axios, { AxiosInstance, AxiosError } from 'axios';
import { EnvironmentConfig } from '../config/environment.js';

export interface EntityMutationPayload {
  entityName: string;
  action: 'CREATE' | 'UPDATE';
  data: Record<string, any>;
  entityId?: string;
}

export class MetastructClient {
  private readonly client: AxiosInstance;

  constructor(config: EnvironmentConfig) {
    this.client = axios.create({
      baseURL: config.metastructRuntimeUrl,
      timeout: config.requestTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  public async getEntity(entityName: string, id: string): Promise<Record<string, any>> {
    try {
      const response = await this.client.get<Record<string, any>>(
        `/api/v1/entities/${encodeURIComponent(entityName)}/${encodeURIComponent(id)}`
      );
      return response.data;
    } catch (error) {
      throw this.handleAxiosError(`Failed to fetch entity [${entityName}:${id}]`, error as AxiosError);
    }
  }

  public async mutateEntity(payload: EntityMutationPayload): Promise<Record<string, any>> {
    const { entityName, action, data, entityId } = payload;

    try {
      if (action === 'CREATE') {
        const response = await this.client.post<Record<string, any>>(
          `/api/v1/entities/${encodeURIComponent(entityName)}`,
          data
        );
        return response.data;
      }

      if (!entityId) {
        throw new Error('Entity ID is required for UPDATE operations.');
      }

      const response = await this.client.put<Record<string, any>>(
        `/api/v1/entities/${encodeURIComponent(entityName)}/${encodeURIComponent(entityId)}`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleAxiosError(`Failed to ${action} entity [${entityName}]`, error as AxiosError);
    }
  }

  private handleAxiosError(context: string, error: AxiosError): Error {
    if (error.response) {
      return new Error(
        `[MetastructClient] ${context} - Remote HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
      );
    }
    if (error.request) {
      return new Error(`[MetastructClient] ${context} - Network timeout or host unreachable.`);
    }
    return new Error(`[MetastructClient] ${context} - ${error.message}`);
  }
}
