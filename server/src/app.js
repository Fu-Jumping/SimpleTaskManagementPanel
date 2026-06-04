import cors from 'cors';
import express from 'express';

export function createApp() {
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

  app.use((_request, response) => {
    response.status(404).json({
      success: false,
      message: '接口不存在'
    });
  });

  return app;
}

