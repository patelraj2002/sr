import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp'; // Using sharp for image optimization

const UPLOAD_DIR = process.env.NODE_ENV === 'production' 
  ? '/var/www/srhomes/public/uploads'
  : path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.type.split('/')[1];
    const filename = `image-${timestamp}-${randomString}.${extension}`;
    
    // Ensure uploads directory exists
    await ensureUploadDir();

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize and save image
    try {
      const optimizedImage = await sharp(buffer)
        .resize(1920, 1080, { // Max dimensions
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const filepath = path.join(UPLOAD_DIR, filename);
      await writeFile(filepath, optimizedImage);

      return NextResponse.json({
        url: `/uploads/${filename}`,
        filename: filename
      });
    } catch (error) {
      console.error('Image processing error:', error);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
