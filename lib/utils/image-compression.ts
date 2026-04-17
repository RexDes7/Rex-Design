/**
 * Client-side image compression utility
 * Compresses images before upload to reduce payload size
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  maxSizeMB: 2,
};

/**
 * Compress an image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > opts.maxWidth! || height > opts.maxHeight!) {
          const ratio = Math.min(opts.maxWidth! / width, opts.maxHeight! / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Check size
            const sizeMB = blob.size / 1024 / 1024;
            
            if (sizeMB > opts.maxSizeMB!) {
              // Try with lower quality
              canvas.toBlob(
                (blob2) => {
                  if (!blob2) {
                    reject(new Error('Failed to compress image'));
                    return;
                  }
                  
                  const compressedFile = new File([blob2], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  
                  resolve(compressedFile);
                },
                file.type,
                0.7 // Lower quality
              );
            } else {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            }
          },
          file.type,
          opts.quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images
 */
export async function compressImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> {
  const compressed: File[] = [];
  
  for (const file of files) {
    try {
      const compressedFile = await compressImage(file, options);
      compressed.push(compressedFile);
    } catch (error) {
      console.error('Failed to compress image:', file.name, error);
      // Use original if compression fails
      compressed.push(file);
    }
  }
  
  return compressed;
}
