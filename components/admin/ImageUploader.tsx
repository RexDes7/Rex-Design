'use client';

/**
 * ImageUploader Component
 * 
 * Provides drag-and-drop image upload with preview and progress bar.
 * 
 * Requirements: 3.6
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import styles from '@/styles/admin/ImageUploader.module.css';
import { compressImage } from '@/lib/utils/image-compression';

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

export interface ImageUploaderProps {
  type?: 'project' | 'avatar' | 'general';
  onUploadComplete?: (result: ImageUploadResult) => void;
  onUploadError?: (error: string) => void;
  currentImageUrl?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// ============================================================================
// Component
// ============================================================================

export default function ImageUploader({
  type = 'general',
  onUploadComplete,
  onUploadError,
  currentImageUrl,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // Validation
  // ============================================================================

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file format. Accepted formats: JPEG, PNG, WebP`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }

    return null;
  };

  // ============================================================================
  // File Handling
  // ============================================================================

  const handleFileSelect = (file: File) => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onUploadError) {
        onUploadError(validationError);
      }
      return;
    }

    // Clear previous error
    setError(null);

    // Set selected file
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // ============================================================================
  // Drag and Drop
  // ============================================================================

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // ============================================================================
  // Upload
  // ============================================================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Compress image before upload
      console.log('[UPLOAD] Original size:', (selectedFile.size / 1024 / 1024).toFixed(2), 'MB');
      const compressedFile = await compressImage(selectedFile, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        maxSizeMB: 2,
      });
      console.log('[UPLOAD] Compressed size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
      
      // Create form data
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('type', type);

      // Simulate progress (since fetch doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload file
      const response = await fetch('/api/admin/images', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      
      // Call success callback
      if (onUploadComplete && data.data) {
        onUploadComplete(data.data);
      }

      // Update preview with uploaded image URL
      setPreviewUrl(data.data.url);
      
      // Reset state
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
      }, 500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
      
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    }
  };

  // ============================================================================
  // UI Actions
  // ============================================================================

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className={styles.container}>
      {/* Drop Zone */}
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${
          previewUrl ? styles.hasPreview : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!previewUrl ? handleBrowseClick : undefined}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleInputChange}
          className={styles.fileInput}
        />

        {/* Preview */}
        {previewUrl ? (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            <div className={styles.previewOverlay}>
              <button
                type="button"
                onClick={handleBrowseClick}
                className={styles.changeButton}
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <svg
              className={styles.uploadIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={styles.placeholderText}>
              Drag and drop an image here, or click to browse
            </p>
            <p className={styles.placeholderHint}>
              Accepted formats: JPEG, PNG, WebP (max {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className={styles.progressText}>{uploadProgress}%</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <svg
            className={styles.errorIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !isUploading && (
        <button
          type="button"
          onClick={handleUpload}
          className={styles.uploadButton}
          disabled={isUploading}
        >
          Upload Image
        </button>
      )}
    </div>
  );
}
