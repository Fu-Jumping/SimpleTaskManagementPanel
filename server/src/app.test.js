import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

let usernameCounter = 0;

async function registerUser(app) {
  usernameCounter += 1;
  const username = `u${Date.now().toString().slice(-8)}${usernameCounter}`;
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

  it('rejects task access without a token', async () => {
    const app = await createApp();

    const response = await request(app)
      .get('/api/tasks')
      .expect(401);

    expect(response.body).toEqual({
      success: false,
      message: expect.any(String)
    });
  });

  it('keeps tasks isolated between different users', async () => {
    const app = await createApp();
    const userA = await registerUser(app);
    const userB = await registerUser(app);
    const titleA = `User A task ${Date.now()}`;
    const titleB = `User B task ${Date.now()}`;

    const taskAResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ title: titleA, priority: 'high', status: 'todo' })
      .expect(200);

    const taskBResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ title: titleB, priority: 'low', status: 'doing' })
      .expect(200);

    const listAResponse = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${userA.token}`)
      .expect(200);

    const userATaskIds = listAResponse.body.data.tasks.map(task => task.id);
    expect(userATaskIds).toContain(taskAResponse.body.data.task.id);
    expect(userATaskIds).not.toContain(taskBResponse.body.data.task.id);

    await request(app)
      .patch(`/api/tasks/${taskBResponse.body.data.task.id}`)
      .set('Authorization', `Bearer ${userA.token}`)
      .send({ title: 'Should not update' })
      .expect(404);

    await request(app)
      .delete(`/api/tasks/${taskBResponse.body.data.task.id}`)
      .set('Authorization', `Bearer ${userA.token}`)
      .expect(404);

    const taskBCheckResponse = await request(app)
      .get(`/api/tasks/${taskBResponse.body.data.task.id}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .expect(200);

    expect(taskBCheckResponse.body.data.task).toEqual(
      expect.objectContaining({
        id: taskBResponse.body.data.task.id,
        title: titleB
      })
    );
  });

  it('rejects invalid task enum and date values', async () => {
    const app = await createApp();
    const { token } = await registerUser(app);

    const invalidPriorityResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Invalid priority', priority: 'urgent', status: 'todo' })
      .expect(400);

    expect(invalidPriorityResponse.body.success).toBe(false);

    const invalidDateResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Invalid date', priority: 'low', status: 'todo', dueDate: '2026-02-31' })
      .expect(400);

    expect(invalidDateResponse.body.success).toBe(false);
  });

  it('skips invalid imported tasks and only saves valid items', async () => {
    const app = await createApp();
    const { token } = await registerUser(app);
    const validTitle = `Imported valid task ${Date.now()}`;

    const response = await request(app)
      .post('/api/tasks/import')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tasks: [
          { title: validTitle, priority: 'medium', status: 'todo', dueDate: '2026-06-15' },
          { title: '', priority: 'medium', status: 'todo' },
          { title: 'Missing priority imported task', status: 'todo' },
          { title: 'Missing status imported task', priority: 'medium' },
          { title: 'Invalid imported task', priority: 'blocked', status: 'todo' }
        ]
      })
      .expect(200);

    expect(response.body.data.imported).toBe(1);
    expect(response.body.data.skipped).toBe(4);
    expect(response.body.data.tasks).toHaveLength(1);
    expect(response.body.data.tasks[0]).toEqual(
      expect.objectContaining({
        title: validTitle,
        priority: 'medium',
        status: 'todo'
      })
    );
  });

  it('rejects reorder requests for tasks owned by another user', async () => {
    const app = await createApp();
    const userA = await registerUser(app);
    const userB = await registerUser(app);

    const taskBResponse = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userB.token}`)
      .send({ title: 'Protected reorder task', priority: 'medium', status: 'todo' })
      .expect(200);

    const response = await request(app)
      .patch('/api/tasks/reorder')
      .set('Authorization', `Bearer ${userA.token}`)
      .send({
        items: [
          {
            id: taskBResponse.body.data.task.id,
            priority: 'low',
            status: 'done',
            order: 0
          }
        ]
      })
      .expect(404);

    expect(response.body.success).toBe(false);

    const taskBCheckResponse = await request(app)
      .get(`/api/tasks/${taskBResponse.body.data.task.id}`)
      .set('Authorization', `Bearer ${userB.token}`)
      .expect(200);

    expect(taskBCheckResponse.body.data.task).toEqual(
      expect.objectContaining({
        priority: 'medium',
        status: 'todo'
      })
    );
  });
});
