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
  maxWidth: 3840, // 4K resolution
  maxHeight: 2160, // 4K resolution
  quality: 0.95, // Higher quality
  maxSizeMB: 4, // Vercel limit is ~4.5MB, we target 4MB to be safe
};

/**
 * Compress image to blob with specific quality
 */
async function compressToBlob(
  canvas: HTMLCanvasElement,
  fileType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }
        resolve(blob);
      },
      fileType,
      quality
    );
  });
}

/**
 * Compress an image file
 * Automatically adjusts quality to fit within maxSizeMB while maintaining best possible quality
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const maxSizeBytes = opts.maxSizeMB! * 1024 * 1024;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const img = new Image();
      
      img.onload = async () => {
        try {
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
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try to compress with high quality first
          let quality = opts.quality!;
          let blob = await compressToBlob(canvas, file.type, quality);
          
          console.log(`[COMPRESSION] Initial: ${(blob.size / 1024 / 1024).toFixed(2)} MB at quality ${quality}`);
          
          // If file is too large, reduce quality iteratively
          if (blob.size > maxSizeBytes) {
            console.log(`[COMPRESSION] File exceeds ${opts.maxSizeMB} MB, adjusting quality...`);
            
            // Binary search for optimal quality
            let minQuality = 0.5;
            let maxQuality = quality;
            let attempts = 0;
            const maxAttempts = 8;
            
            while (attempts < maxAttempts && Math.abs(blob.size - maxSizeBytes) > maxSizeBytes * 0.05) {
              attempts++;
              
              if (blob.size > maxSizeBytes) {
                maxQuality = quality;
              } else {
                minQuality = quality;
              }
              
              quality = (minQuality + maxQuality) / 2;
              blob = await compressToBlob(canvas, file.type, quality);
              
              console.log(`[COMPRESSION] Attempt ${attempts}: ${(blob.size / 1024 / 1024).toFixed(2)} MB at quality ${quality.toFixed(2)}`);
              
              // If we're within 5% of target, that's good enough
              if (blob.size <= maxSizeBytes) {
                break;
              }
            }
            
            console.log(`[COMPRESSION] Final: ${(blob.size / 1024 / 1024).toFixed(2)} MB at quality ${quality.toFixed(2)}`);
          }
          
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          
          resolve(compressedFile);
        } catch (error) {
          reject(error);
        }
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
