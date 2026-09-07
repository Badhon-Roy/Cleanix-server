import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import config from '../../config';

// Configure Cloudinary if credentials exist
if (config.cloudinary_cloud_name && config.cloudinary_api_key && config.cloudinary_api_secret) {
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
    secure: true,
  });
}

/**
 * Uploads any image Buffer (JPEG, PNG, WebP, GIF, SVG, AVIF, BMP, TIFF, HEIC, ICO, etc.)
 * to Cloudinary or saves to local server /uploads static folder.
 */
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder = 'cleanix',
  filename?: string,
): Promise<string> => {
  const ext = filename ? path.extname(filename).toLowerCase() || '.webp' : '.webp';
  const isSvg = ext === '.svg';
  const isGif = ext === '.gif';

  if (config.cloudinary_cloud_name && config.cloudinary_api_key && config.cloudinary_api_secret) {
    try {
      const uploadOptions: Record<string, any> = {
        folder,
        resource_type: 'image',
        public_id: filename
          ? `${Date.now()}-${filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`
          : undefined,
      };

      // Apply intelligent responsive optimizations for raster images (JPEG, PNG, WebP, AVIF, BMP, TIFF, HEIC)
      if (!isSvg && !isGif) {
        uploadOptions.format = 'webp';
        uploadOptions.transformation = [
          { width: 1920, height: 1920, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ];
      } else if (isGif) {
        uploadOptions.resource_type = 'image';
      }

      return await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) return reject(error);
          if (result?.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Cloudinary upload did not return a secure URL'));
          }
        });
        uploadStream.end(buffer);
      });
    } catch (cloudErr) {
      console.warn('⚠️ Cloudinary upload failed, falling back to local server storage:', cloudErr);
    }
  }

  // Fallback: Save file to local public static directory
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const cleanBaseName = filename ? path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_') : 'image';
  const safeName = `${Date.now()}-${cleanBaseName}${ext}`;
  const filePath = path.join(uploadsDir, safeName);

  fs.writeFileSync(filePath, buffer);

  const baseServerUrl = config.server_url.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
  return `${baseServerUrl}/uploads/${safeName}`;
};

/**
 * Uploads base64 data URI of any image format to Cloudinary or local storage
 */
export const uploadBase64ToCloudinary = async (
  base64String: string,
  folder = 'cleanix',
): Promise<string> => {
  // Parse MIME type from base64 string
  const matches = base64String.match(/^data:([A-Za-z0-9-+./]+);base64,(.+)$/);
  const mimeType = matches && matches[1] ? matches[1].toLowerCase() : 'image/webp';
  const buffer = matches && matches[2] ? Buffer.from(matches[2], 'base64') : Buffer.from(base64String, 'base64');

  const isSvg = mimeType.includes('svg');
  const isGif = mimeType.includes('gif');

  if (config.cloudinary_cloud_name && config.cloudinary_api_key && config.cloudinary_api_secret) {
    try {
      const uploadOptions: Record<string, any> = {
        folder,
        resource_type: 'image',
      };

      if (!isSvg && !isGif) {
        uploadOptions.format = 'webp';
        uploadOptions.transformation = [
          { width: 1920, height: 1920, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ];
      }

      const result = await cloudinary.uploader.upload(base64String, uploadOptions);
      if (result?.secure_url) {
        return result.secure_url;
      }
    } catch (cloudErr) {
      console.warn('⚠️ Cloudinary base64 upload failed, falling back to local storage:', cloudErr);
    }
  }

  let ext = '.webp';
  if (isSvg) ext = '.svg';
  else if (isGif) ext = '.gif';
  else if (mimeType.includes('png')) ext = '.png';
  else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
  else if (mimeType.includes('avif')) ext = '.avif';
  else if (mimeType.includes('bmp')) ext = '.bmp';
  else if (mimeType.includes('tiff')) ext = '.tiff';
  else if (mimeType.includes('ico')) ext = '.ico';

  return uploadBufferToCloudinary(buffer, folder, `upload-${Date.now()}${ext}`);
};
