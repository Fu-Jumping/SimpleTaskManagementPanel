import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { initDb } from './db/index.js';

export async function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({
      success: true,
      data: {
        status: 'ok'
      }
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  app.use((_request, response) => {
    response.status(404).json({
      success: false,
      message: '接口不存在'
    });
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  });

  await initDb();

  return app;
}
