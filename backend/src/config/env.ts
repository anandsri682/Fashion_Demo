import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: required('MONGO_URI', 'mongodb://127.0.0.1:27017/fashion_store'),
  JWT_SECRET: required('JWT_SECRET', 'dev_secret_change_me'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3001',
  DEFAULT_DELIVERY_DAYS: parseInt(process.env.DEFAULT_DELIVERY_DAYS || '7', 10),
  STORAGE_PROVIDER: (process.env.STORAGE_PROVIDER || 'local') as 'local' | 'cloudinary',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@fashionstore.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  ADMIN_FIRST_NAME: process.env.ADMIN_FIRST_NAME || 'Store',
  ADMIN_LAST_NAME: process.env.ADMIN_LAST_NAME || 'Admin',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};
