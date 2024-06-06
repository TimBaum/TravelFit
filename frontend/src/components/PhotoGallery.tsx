import React from 'react'
import { Card } from '@/components/ui/card'

interface Photo {
  url: string
  alt?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

function PhotoTile({ url, alt }: { url: string; alt: string }) {
  return (
    <Card className="aspect-square relative drop-shadow-md rounded-lg overflow-hidden">
      <img src={url} alt={alt} className="h-full w-full object-cover" />
      <p className="absolute bottom-0 left-0 text-white text-xl font-bold p-2">
        {url}
      </p>
    </Card>
  )
}

function PhotoGallery() {}

export default PhotoGallery
