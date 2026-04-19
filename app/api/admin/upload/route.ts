/**
 * Image Upload API with Cloudinary
 * POST /api/admin/upload - Upload image file to Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-simple';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log('[UPLOAD] Starting upload process');
    
    const user = verifyToken(request);
    if (!user) {
      console.log('[UPLOAD] Unauthorized - no valid token');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[UPLOAD] User verified:', user.email);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
      console.log('[UPLOAD] No file provided');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[UPLOAD] File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.log('[UPLOAD] Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Check file size (4MB max for Vercel)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log('[UPLOAD] File too large:', file.size);
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is 4MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    console.log('[UPLOAD] Cloudinary config:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    });

    // Verify Cloudinary credentials
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('[UPLOAD] Missing Cloudinary credentials');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error: Missing Cloudinary credentials',
          details: {
            cloud_name: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: !!process.env.CLOUDINARY_API_KEY,
            api_secret: !!process.env.CLOUDINARY_API_SECRET,
          }
        },
        { status: 500 }
      );
    }

    // Convert file to base64
    console.log('[UPLOAD] Converting to base64...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('[UPLOAD] Buffer size:', buffer.length, 'bytes');
    
    const base64 = buffer.toString('base64');
    console.log('[UPLOAD] Base64 size:', base64.length, 'chars');
    
    const dataURI = `data:${file.type};base64,${base64}`;
    console.log('[UPLOAD] DataURI size:', dataURI.length, 'chars');

    console.log('[UPLOAD] Uploading to Cloudinary...');
    // Upload to Cloudinary with high quality settings
    try {
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'rex-portfolio',
        resource_type: 'image',
        quality: 'auto:best', // Лучшее автоматическое качество
        fetch_format: 'auto', // Автоматический формат (WebP для поддерживающих браузеров)
        // Не применяем дополнительные трансформации при загрузке
        // чтобы сохранить максимальное качество
      });

      console.log('[UPLOAD] Upload successful:', result.secure_url);

      return NextResponse.json({
        success: true,
        data: {
          url: result.secure_url
        }
      });
    } catch (cloudinaryError: any) {
      console.error('[UPLOAD] Cloudinary error:', cloudinaryError);
      console.error('[UPLOAD] Cloudinary error details:', {
        message: cloudinaryError.message,
        error: cloudinaryError.error,
        http_code: cloudinaryError.http_code,
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Cloudinary upload failed: ${cloudinaryError.message || 'Unknown error'}`,
          details: cloudinaryError.error?.message || cloudinaryError.message
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[UPLOAD] Upload error:', error);
    console.error('[UPLOAD] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
