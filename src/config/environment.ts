import dotenv from 'dotenv';

dotenv.config();

export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  metastructRuntimeUrl: string;
  spiffWorkflowUrl: string;
  requestTimeoutMs: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`[spiff-ui-bridge] Missing required environment variable: ${key}`);
  }
  return value;
};

export const config: EnvironmentConfig = Object.freeze({
  port: parseInt(process.env.PORT || '3005', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  metastructRuntimeUrl: getEnvVar('METASTRUCT_RUNTIME_URL', 'http://localhost:8000'),
  spiffWorkflowUrl: getEnvVar('SPIFF_WORKFLOW_URL', 'http://localhost:8080'),
  requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS || '5000', 10),
});