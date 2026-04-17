/**
 * Image Service
 * 
 * Handles image upload, optimization, deletion, and metadata management.
 * Uses Sharp library for image processing and optimization.
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.9
 */

import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { getDatabase } from '@/lib/db/client';
import type { Image, ImageType, CreateImageInput } from '@/lib/db/schema';

// ============================================================================
// Constants
// ============================================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const AVATAR_SIZE = 200; // 200x200px for avatars
const PUBLIC_IMAGES_DIR = join(process.cwd(), 'public', 'images');

// ============================================================================
// Types
// ============================================================================

export interface ImageUploadResult {
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface ImageMetadata {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
  uploadedAt: Date;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate unique filename with timestamp and random string
 * Format: {timestamp}-{random}.{ext}
 */
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString('hex');
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}-${random}.${ext}`;
}

/**
 * Ensure directory exists, create if not
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * Get file extension from mime type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  return map[mimeType] || 'jpg';
}

// ============================================================================
// Image Service
// ============================================================================

export class ImageService {
  /**
   * Upload and optimize image
   * 
   * Requirements:
   * - 3.1: Accept JPEG, PNG, WebP formats
   * - 3.2: Validate file size (max 5MB)
   * - 3.3: Optimize image for web delivery
   * - 3.4: Generate unique filename
   * - 3.5: Store in /public/images/{type}/
   * - 3.9: Resize avatars to 200x200px
   */
  async uploadImage(
    file: Buffer,
    originalName: string,
    mimeType: string,
    type: ImageType
  ): Promise<ImageUploadResult> {
    // Validate mime type (Requirement 3.1)
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(
        `Invalid file format. Allowed formats: JPEG, PNG, WebP. Received: ${mimeType}`
      );
    }

    // Validate file size (Requirement 3.2)
    if (file.length > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum allowed size of 5MB. File size: ${(file.length / 1024 / 1024).toFixed(2)}MB`
      );
    }

    // Generate unique filename (Requirement 3.4)
    const filename = generateUniqueFilename(originalName);

    // Ensure type directory exists
    const typeDir = join(PUBLIC_IMAGES_DIR, type);
    await ensureDirectoryExists(typeDir);

    // Process image with Sharp
    let sharpInstance = sharp(file);

    // Get original metadata
    const metadata = await sharpInstance.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Special handling for avatars (Requirement 3.9)
    if (type === 'avatar') {
      sharpInstance = sharpInstance.resize(AVATAR_SIZE, AVATAR_SIZE, {
        fit: 'cover',
        position: 'center',
      });
    }

    // Optimize image (Requirement 3.3)
    const optimizedBuffer = await sharpInstance
      .jpeg({ quality: 85, progressive: true })
      .png({ compressionLevel: 9, progressive: true })
      .webp({ quality: 85 })
      .toBuffer();

    // Get final metadata after optimization
    const finalMetadata = await sharp(optimizedBuffer).metadata();
    const finalWidth = type === 'avatar' ? AVATAR_SIZE : (finalMetadata.width || originalWidth);
    const finalHeight = type === 'avatar' ? AVATAR_SIZE : (finalMetadata.height || originalHeight);
    const finalSize = optimizedBuffer.length;

    // Save to filesystem (Requirement 3.5)
    const filePath = join(typeDir, filename);
    await writeFile(filePath, optimizedBuffer);

    // Save metadata to database
    const imageRecord: CreateImageInput = {
      filename,
      original_name: originalName,
      type,
      size: finalSize,
      mime_type: mimeType,
      width: finalWidth,
      height: finalHeight,
    };

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO images (id, filename, original_name, type, size, mime_type, width, height)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = randomBytes(16).toString('hex');
    stmt.run(
      id,
      imageRecord.filename,
      imageRecord.original_name,
      imageRecord.type,
      imageRecord.size,
      imageRecord.mime_type,
      imageRecord.width,
      imageRecord.height
    );

    // Return result
    return {
      filename,
      url: `/images/${type}/${filename}`,
      width: finalWidth,
      height: finalHeight,
      size: finalSize,
    };
  }

  /**
   * Delete image from storage and database
   */
  async deleteImage(filename: string): Promise<void> {
    const db = getDatabase();
    
    // Get image record from database
    const stmt = db.prepare('SELECT * FROM images WHERE filename = ?');
    const image = stmt.get(filename) as Image | undefined;

    if (!image) {
      throw new Error(`Image not found: ${filename}`);
    }

    // Delete file from filesystem
    const filePath = join(PUBLIC_IMAGES_DIR, image.type, filename);
    
    try {
      await unlink(filePath);
    } catch (error) {
      // File might not exist, log but continue
      console.warn(`Failed to delete file: ${filePath}`, error);
    }

    // Delete record from database
    const deleteStmt = db.prepare('DELETE FROM images WHERE filename = ?');
    deleteStmt.run(filename);
  }

  /**
   * Optimize existing image
   */
  async optimizeImage(filename: string): Promise<void> {
    const db = getDatabase();
    
    // Get image record from database
    const stmt = db.prepare('SELECT * FROM images WHERE filename = ?');
    const image = stmt.get(filename) as Image | undefined;

    if (!image) {
      throw new Error(`Image not found: ${filename}`);
    }

    const filePath = join(PUBLIC_IMAGES_DIR, image.type, filename);

    // Read existing file
    const sharpInstance = sharp(filePath);

    // Optimize
    const optimizedBuffer = await sharpInstance
      .jpeg({ quality: 85, progressive: true })
      .png({ compressionLevel: 9, progressive: true })
      .webp({ quality: 85 })
      .toBuffer();

    // Get new metadata
    const metadata = await sharp(optimizedBuffer).metadata();

    // Save optimized file
    await writeFile(filePath, optimizedBuffer);

    // Update database record
    const updateStmt = db.prepare(`
      UPDATE images 
      SET size = ?, width = ?, height = ?
      WHERE filename = ?
    `);

    updateStmt.run(
      optimizedBuffer.length,
      metadata.width || image.width,
      metadata.height || image.height,
      filename
    );
  }

  /**
   * Get image metadata from database
   */
  async getImageMetadata(filename: string): Promise<ImageMetadata> {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM images WHERE filename = ?');
    const image = stmt.get(filename) as Image | undefined;

    if (!image) {
      throw new Error(`Image not found: ${filename}`);
    }

    return {
      filename: image.filename,
      originalName: image.original_name,
      size: image.size,
      mimeType: image.mime_type,
      width: image.width,
      height: image.height,
      uploadedAt: new Date(image.uploaded_at),
    };
  }

  /**
   * Get all images by type
   */
  async getImagesByType(type: ImageType): Promise<Image[]> {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM images WHERE type = ? ORDER BY uploaded_at DESC');
    return stmt.all(type) as Image[];
  }

  /**
   * Check if image exists
   */
  async imageExists(filename: string): Promise<boolean> {
    const db = getDatabase();
    const stmt = db.prepare('SELECT COUNT(*) as count FROM images WHERE filename = ?');
    const result = stmt.get(filename) as { count: number };
    return result.count > 0;
  }
}

// Export singleton instance
export const imageService = new ImageService();
