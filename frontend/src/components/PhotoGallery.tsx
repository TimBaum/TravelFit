import '../styles/PhotoGallery.css'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CloudinaryImage } from '@models/cloudinaryImage'

interface PhotoGalleryProps {
  photos: CloudinaryImage[]
}

const PhotoTile = ({
  url,
  alt,
  isLast,
  photos,
}: {
  url: string
  alt?: string
  isLast?: boolean
  photos: CloudinaryImage[]
}) => (
  <div className="relative">
    <div className="rectangle relative drop-shadow-md rounded-lg overflow-hidden">
      <img src={url} alt={alt} className="h-full w-full object-cover" />
    </div>
    {isLast && (
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
          <div className="grid gap-4 py-4 grid-cols-2">
            {photos.map((photo, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="rectangle relative drop-shadow-md rounded-lg overflow-hidden cursor-pointer">
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>{photo.alt || 'Gym Picture'}</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="max-h-[90vh] w-auto object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )}
  </div>
)

const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  const initialPhotos = photos.slice(0, 5)

  return (
    <div className="grid-container mb-4">
      {initialPhotos.map((photo, index) => (
        <div key={index} className={`item${index + 1}`}>
          <PhotoTile
            url={photo.url}
            alt={photo.alt}
            isLast={index === initialPhotos.length - 1}
            photos={photos}
          />
        </div>
      ))}
    </div>
  )
}

export default PhotoGallery
