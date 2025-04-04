import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function decodeUtf16LE(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer)
  const uint16Array = new Uint16Array(uint8Array.buffer)
  return String.fromCharCode.apply(null, Array.from(uint16Array))
}

