import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3000);

async function startServer() {
  const app = await createApp();
  
  app.listen(port, () => {
    console.log(`Task board server is running at http://localhost:${port}`);
  });
}

startServer();
