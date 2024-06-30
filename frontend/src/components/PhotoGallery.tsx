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
  alt?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

const PhotoTile = ({
  url,
  alt,
  isLast,
}: {
  url: string
  alt?: string
  isLast?: boolean
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
          <div className="grid gap-4 py-4"></div>
        </DialogContent>
      </Dialog>
    )}
  </div>
)

const PhotoGallery = ({ photos }: PhotoGalleryProps) => (
  <div className="grid-container">
    {photos.map((photo, index) => (
      <div key={index} className={`item${index + 1}`}>
        <PhotoTile
          url={photo.url}
          alt={photo.alt}
          isLast={index === photos.length - 1}
        />
      </div>
    ))}
  </div>
)

export default PhotoGallery
