// src/app/api/sources/route.ts - API for sources
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const sourcesDirectory = path.join(process.cwd(), 'content', 'sources');
  let sourceFiles: string[] = [];
  
  try {
    if (fs.existsSync(sourcesDirectory)) {
      sourceFiles = fs.readdirSync(sourcesDirectory)
        .filter(file => file.endsWith('.lua'));
    }
  } catch (error) {
    console.error('Error reading sources directory:', error);
    return NextResponse.json({ error: 'Failed to read sources' }, { status: 500 });
  }

  return NextResponse.json({ files: sourceFiles });
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

    const sourcesDirectory = path.join(process.cwd(), 'content', 'sources');
    
    // Make sure the directory exists
    if (!fs.existsSync(sourcesDirectory)) {
      fs.mkdirSync(sourcesDirectory, { recursive: true });
    }
    
    const filePath = path.join(sourcesDirectory, filename);
    fs.writeFileSync(filePath, content);

    return NextResponse.json({ success: true, file: filename });
  } catch (error) {
    console.error('Error adding source file:', error);
    return NextResponse.json({ error: 'Failed to add source file' }, { status: 500 });
  }
}