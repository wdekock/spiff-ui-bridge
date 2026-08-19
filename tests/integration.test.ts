import { describe, it, expect, jest } from '@jest/globals';
import supertest from 'supertest';
import { createApp } from '../src/app';

// Mock external MetastructClient calls
jest.mock('../src/clients/MetastructClient.js', () => {
  return {
    MetastructClient: jest.fn().mockImplementation(() => ({
      fetchSchema: jest.fn().mockResolvedValue({ status: 'ok', schema: {} }),
      mutateEntity: jest.fn().mockResolvedValue({ status: 'MUTATION_SUCCESS' }),
    })),
  };
});

const app = createApp();
const request = supertest(app);

describe('Integration Tests', () => {
  it('should return health check status', async () => {
    const response = await request.get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'UP',
      environment: expect.any(String),
    });
  });

  it('should hydrate a task successfully', async () => {
    const payload = {
      taskId: 'task-123',
      qStepId: 'qstep-456',
      entityName: 'User',
      payload: {},
    };

    const response = await request
      .post('/api/v1/tasks/submit')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ACCEPTED');
    expect(response.body).toHaveProperty('taskId', 'task-123');
  });

  it('should process service task mutation', async () => {
    const payload = {
      entityName: 'User',
      action: 'UPDATE',
      data: {
        id: 'ent-456',
      },
    };

    const response = await request
      .post('/api/v1/service/mutate')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'MUTATION_SUCCESS');
  });
});