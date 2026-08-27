import fs from 'fs';
import path from 'path';
import { IStorageProvider, UploadedFile } from './storage.types';

const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');

export class LocalStorageProvider implements IStorageProvider {
  async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadedFile> {
    const targetDir = path.join(UPLOADS_ROOT, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // multer (disk storage) already wrote the file to `file.path`; if using
    // memory storage instead, write the buffer out here.
    if (file.buffer && !file.path) {
      const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      const destination = path.join(targetDir, filename);
      fs.writeFileSync(destination, file.buffer);
      return { url: `/uploads/${folder}/${filename}` };
    }

    const relative = path.relative(UPLOADS_ROOT, file.path);
    return { url: `/uploads/${relative.split(path.sep).join('/')}` };
  }

  async deleteImage(relativeUrl: string): Promise<void> {
    const cleanPath = relativeUrl.replace(/^\/uploads\//, '');
    const fullPath = path.join(UPLOADS_ROOT, cleanPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
