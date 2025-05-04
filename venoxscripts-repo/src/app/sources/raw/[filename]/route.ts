// src/app/sources/raw/[filename]/route.ts - GitHub-like raw content display
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
   const filename = (await params).filename; 
  const filePath = path.join(process.cwd(), "content", "sources", filename)

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 })
    }

    const content = fs.readFileSync(filePath, "utf8")

    // Return content as plain text with UTF-16LE encoding
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-16le",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error(`Error serving raw source file ${filename}:`, error)
    return new NextResponse("Error serving file", { status: 500 })
  }
}

