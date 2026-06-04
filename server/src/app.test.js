import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('health api', () => {
  it('returns the unified success response', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        status: 'ok'
      }
    });
  });
});

