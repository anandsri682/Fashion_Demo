export interface UploadedFile {
  url: string;
  publicId?: string;
}

/**
 * Common interface every storage backend must implement, so business logic
 * (product controller/service) never needs to know whether images are on
 * local disk or in Cloudinary.
 */
export interface IStorageProvider {
  uploadImage(file: Express.Multer.File, folder: string): Promise<UploadedFile>;
  deleteImage(publicIdOrPath: string): Promise<void>;
}
