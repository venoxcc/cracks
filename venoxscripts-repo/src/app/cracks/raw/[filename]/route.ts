// src/app/cracks/raw/[filename]/route.ts

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  const { filename } = params  // Access params here
  const filePath = path.join(process.cwd(), "content", "cracks", filename)

  try {
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 })
    }

    const content = fs.readFileSync(filePath, "utf-8")  // Read file content

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",  // Return plain text
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error)
    return new NextResponse("Error serving file", { status: 500 })
  }
}
