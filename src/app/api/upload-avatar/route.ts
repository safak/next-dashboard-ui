import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises'; // Import mkdir as well
import path from 'path';
// Remove incorrect auth import
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Import authOptions from the correct location

export async function POST(request: Request) {
  // 1. Check Authentication
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file: File | null = data.get('avatar') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    // Basic validation (add more as needed: size, type)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    // Convert ArrayBuffer directly to Uint8Array for writeFile
    const uint8Array = new Uint8Array(bytes);

    // Generate a unique filename
    const filename = `${session.user.id}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/avatars');
    const filePath = path.join(uploadDir, filename);

    // Ensure the upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (mkdirError: any) {
      // Ignore error if directory already exists, otherwise rethrow
      if (mkdirError.code !== 'EEXIST') {
        console.error('Failed to create upload directory:', mkdirError);
        throw mkdirError; // Rethrow if it's not an 'already exists' error
      }
    }

    // Write the file using Uint8Array
    await writeFile(filePath, uint8Array);
    console.log(`Avatar uploaded successfully: ${filePath}`);

    // Return the public URL of the uploaded file
    const publicUrl = `/uploads/avatars/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ success: false, error: 'File upload failed.' }, { status: 500 });
  }
}
