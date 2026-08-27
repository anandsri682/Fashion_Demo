import cloudinary from '../../config/cloudinary';
import { IStorageProvider, UploadedFile } from './storage.types';

export class CloudinaryStorageProvider implements IStorageProvider {
  async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadedFile> {
    const uploadFromBuffer = (): Promise<UploadedFile> =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `fashion-store/${folder}` },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        );
        stream.end(file.buffer);
      });

    if (file.buffer) {
      return uploadFromBuffer();
    }

    const result = await cloudinary.uploader.upload(file.path, { folder: `fashion-store/${folder}` });
    return { url: result.secure_url, publicId: result.public_id };
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  }
}
