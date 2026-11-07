'use client'

// Local replacement for the Figma image loader: use the image URL as-is.
export default function imageLoader({ src }: { src: string; width?: number; quality?: number }) {
  return src
}
