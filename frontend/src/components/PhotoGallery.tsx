import React from 'react'
import { Card } from '@/components/ui/card'
import '../styles/PhotoGallery.css'
import { Button } from './ui/button'

interface Photo {
  url: string
  alt?: string | undefined
}

interface PhotoGalleryProps {
  photos: Photo[]
}

function PhotoTile({ url, alt }: { url: string; alt: string | undefined }) {
  return (
    <Card className="rectangle relative drop-shadow-md rounded-lg overflow-hidden">
      <img src={url} alt={alt} className="h-full w-full object-cover" />
    </Card>
  )
}

function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <div className="grid-container">
      {photos.slice(0, 1).map((photo, index) => (
        <div key={index} className="item1">
          <PhotoTile url={photo.url} alt={photo.alt} />
        </div>
      ))}
      {photos.slice(1, 2).map((photo, index) => (
        <div key={index} className="item2">
          <PhotoTile url={photo.url} alt={photo.alt} />
        </div>
      ))}
      {photos.slice(2, 3).map((photo, index) => (
        <div key={index} className="item3">
          <PhotoTile url={photo.url} alt={photo.alt} />
        </div>
      ))}
      {photos.slice(3, 4).map((photo, index) => (
        <div key={index} className="item4">
          <PhotoTile url={photo.url} alt={photo.alt} />
        </div>
      ))}
      {photos.slice(4, 5).map((photo, index) => (
        <div key={index} className="item5">
          <PhotoTile url={photo.url} alt={photo.alt} />
        </div>
      ))}
    </div>
  )
}

export default PhotoGallery
