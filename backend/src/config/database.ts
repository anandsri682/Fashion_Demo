import mongoose from 'mongoose';
import { env } from './env';

mongoose.set('strictQuery', true);

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.connection.on('connected', () => {
      // eslint-disable-next-line no-console
      console.log('[database] MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('[database] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      // eslint-disable-next-line no-console
      console.warn('[database] MongoDB disconnected');
    });

    await mongoose.connect(env.MONGO_URI);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[database] Failed to connect to MongoDB. Server will not start.', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});
