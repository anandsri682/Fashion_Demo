import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

async function start(): Promise<void> {
  // Do not start the server if the database connection fails.
  await connectDatabase();

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Fashion Store API running on http://localhost:${env.PORT}`);
    // eslint-disable-next-line no-console
    console.log(`[server] API base URL: http://localhost:${env.PORT}/api`);
    // eslint-disable-next-line no-console
    console.log(`[server] Environment: ${env.NODE_ENV}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[server] Failed to start:', error);
  process.exit(1);
});
