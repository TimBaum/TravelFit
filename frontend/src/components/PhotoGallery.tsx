import '../styles/PhotoGallery.css'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Photo {
  url: string
  alt?: string | undefined
}

interface PhotoGalleryProps {
  photos: Photo[]
}

function PhotoTile({
  url,
  alt,
  isLast,
}: {
  url: string
  alt: string | undefined
  isLast?: boolean
}) {
  return (
    <div className="relative">
      <div className="rectangle relative drop-shadow-md rounded-lg overflow-hidden">
        <img src={url} alt={alt} className="h-full w-full object-cover" />
      </div>
      {isLast && (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="absolute bottom-4 right-4 p-2 rounded"
                variant="outline"
              >
                View all pictures
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>All gym pictures</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4"></div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

function PhotoGallery({ photos }: PhotoGalleryProps) {
  const lastPhotoIndex = photos.length - 1

  return (
    <div className="grid-container">
      {photos.slice(0, 1).map((photo, index) => (
        <div key={index} className="item1">
          <PhotoTile
            url={photo.url}
            alt={photo.alt}
            isLast={index === lastPhotoIndex}
          />
        </div>
      ))}
      {photos.slice(1, 2).map((photo, index) => (
        <div key={index} className="item2">
          <PhotoTile
            url={photo.url}
            alt={photo.alt}
            isLast={index + 1 === lastPhotoIndex}
          />
        </div>
      ))}
      {photos.slice(2, 3).map((photo, index) => (
        <div key={index} className="item3">
          <PhotoTile
            url={photo.url}
            alt={photo.alt}
            isLast={index + 2 === lastPhotoIndex}
          />
        </div>
      ))}
      {photos.slice(3, 4).map((photo, index) => (
        <div key={index} className="item4">
          <PhotoTile
            url={photo.url}
            alt={photo.alt}
            isLast={index + 3 === lastPhotoIndex}
          />
        </div>
      ))}
      {photos.slice(4, 5).map((photo, index) => (
        <div key={index} className="item5">
          <PhotoTile
            url={photo.url}
            alt={photo.alt}
            isLast={index + 4 === lastPhotoIndex}
          />
        </div>
      ))}
    </div>
  )
}

export default PhotoGallery
