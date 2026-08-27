import { env } from '../config/env';
import { IStorageProvider } from './storage/storage.types';
import { LocalStorageProvider } from './storage/local.storage';
import { CloudinaryStorageProvider } from './storage/cloudinary.storage';

/**
 * Storage provider factory. Business logic depends only on IStorageProvider,
 * so switching between local disk and Cloudinary is a single config change
 * (STORAGE_PROVIDER=local|cloudinary) with zero controller/service edits.
 */
function createStorageProvider(): IStorageProvider {
  if (env.STORAGE_PROVIDER === 'cloudinary') {
    return new CloudinaryStorageProvider();
  }
  return new LocalStorageProvider();
}

export const storageService = createStorageProvider();
