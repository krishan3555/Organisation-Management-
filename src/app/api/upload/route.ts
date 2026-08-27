import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;

    // 1. Attempt upload to Supabase Storage if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('[PROJECT_REF]')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        // Upload bytes to 'media' bucket (make sure this bucket is set to public in Supabase)
        const { data, error } = await supabase.storage
          .from('media')
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(filename);
            
          return NextResponse.json({ url: urlData.publicUrl });
        } else {
          console.warn('Supabase storage upload failed (ensure "media" bucket exists & is public), falling back to local:', error);
        }
      } catch (err) {
        console.warn('Supabase storage integration error, falling back to local:', err);
      }
    }

    // 2. Fallback: Save to Local Public Uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ url: `/uploads/${filename}` });

  } catch (err: any) {
    console.error('[Upload API Error]', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
