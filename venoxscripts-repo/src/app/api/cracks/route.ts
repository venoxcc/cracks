// src/app/api/cracks/route.ts - API for cracks
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const cracksDirectory = path.join(process.cwd(), 'content', 'cracks');
  let crackFiles: string[] = [];
  
  try {
    if (fs.existsSync(cracksDirectory)) {
      crackFiles = fs.readdirSync(cracksDirectory)
        .filter(file => file.endsWith('.lua'));
    }
  } catch (error) {
    console.error('Error reading cracks directory:', error);
    return NextResponse.json({ error: 'Failed to read cracks' }, { status: 500 });
  }

  return NextResponse.json({ files: crackFiles });
}

// Only allow adding files through API with proper authorization
export async function POST(request: NextRequest) {
  // Simple API key check (you would use a more secure method in production)
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { filename, content } = data;
    
    if (!filename || !content) {
      return NextResponse.json({ error: 'Filename and content are required' }, { status: 400 });
    }
    
    if (!filename.endsWith('.lua')) {
      return NextResponse.json({ error: 'File must be a .lua file' }, { status: 400 });
    }

    const cracksDirectory = path.join(process.cwd(), 'content', 'cracks');
    
    // Make sure the directory exists
    if (!fs.existsSync(cracksDirectory)) {
      fs.mkdirSync(cracksDirectory, { recursive: true });
    }
    
    const filePath = path.join(cracksDirectory, filename);
    fs.writeFileSync(filePath, content);

    return NextResponse.json({ success: true, file: filename });
  } catch (error) {
    console.error('Error adding crack file:', error);
    return NextResponse.json({ error: 'Failed to add crack file' }, { status: 500 });
  }
}