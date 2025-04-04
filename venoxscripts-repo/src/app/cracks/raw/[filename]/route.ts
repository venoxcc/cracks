// src/app/cracks/raw/[filename]/route.tsx

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  const { filename } = await params
  const filePath = path.join(process.cwd(), "content", "cracks", filename)

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 })
    }

    const content = fs.readFileSync(filePath, "utf-16le") // Read as text file

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",  // Adjust content type if needed
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error)
    return new NextResponse("Error serving file", { status: 500 })
  }
}
