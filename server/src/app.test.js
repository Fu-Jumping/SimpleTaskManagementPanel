import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

async function registerUser(app) {
  const username = `u${Date.now().toString().slice(-10)}`;
  const response = await request(app)
    .post('/api/auth/register')
    .send({ username, password: '123456' })
    .expect(200);

  return {
    token: response.body.data.token,
    user: response.body.data.user
  };
}

describe('health api', () => {
  it('returns the unified success response', async () => {
    const app = await createApp();

    const response = await request(app).get('/api/health').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        status: 'ok'
      }
    });
  });
});

describe('backend contract api', () => {
  it('returns user and token after registration', async () => {
    const app = await createApp();

    const { token, user } = await registerUser(app);

    expect(token).toEqual(expect.any(String));
    expect(user).toEqual({
      id: expect.any(String),
      username: expect.any(String)
    });
  });

  it('wraps created tasks in data.task and inserts them at the top of the status column', async () => {
    const app = await createApp();
    const { token } = await registerUser(app);

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Contract task',
        description: 'Created by contract test',
        priority: 'high',
        status: 'todo'
      })
      .expect(200);

    expect(createResponse.body.data).toEqual({
      task: expect.objectContaining({
        id: expect.any(String),
        title: 'Contract task',
        status: 'todo',
        priority: 'high',
        order: 0
      })
    });

    const listResponse = await request(app)
      .get('/api/tasks?status=todo')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listResponse.body.data.tasks[0]).toEqual(
      expect.objectContaining({
        id: createResponse.body.data.task.id,
        title: 'Contract task',
        order: 0
      })
    );
    expect(listResponse.body.data.tasks[1].order).toBe(1);
  });

  it('wraps updated tasks in data.task', async () => {
    const app = await createApp();
    const { token } = await registerUser(app);

    const createResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task before update',
        priority: 'medium',
        status: 'todo'
      })
      .expect(200);

    const updateResponse = await request(app)
      .patch(`/api/tasks/${createResponse.body.data.task.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task after update',
        status: 'doing'
      })
      .expect(200);

    expect(updateResponse.body.data).toEqual({
      task: expect.objectContaining({
        id: createResponse.body.data.task.id,
        title: 'Task after update',
        status: 'doing'
      })
    });
  });

  it('does not expose userId from sample task responses', async () => {
    const app = await createApp();
    const { token } = await registerUser(app);

    const response = await request(app)
      .post('/api/tasks/sample')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.created).toBeGreaterThan(0);
    expect(response.body.data.tasks[0]).not.toHaveProperty('userId');
  });
});
