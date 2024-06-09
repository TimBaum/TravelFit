import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import '@/index.css'
import '@/styles/gym-overview.css'
import { Share1Icon, BookmarkIcon } from '@radix-ui/react-icons'
import { useGetGym } from '@/services/gymService'
import PhotoGallery from '@/components/PhotoGallery'
import HighlightBadge from '@/components/HighlightBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IOffer } from '@models/offer'
import { Clock9, Copy, CircleCheckBig } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IReview } from '@models/review'
import { IAddress } from '@models/adress'

function GymOverview() {
  const pathname = window.location.pathname
  const regex = /\/gymoverview\/([a-f0-9]+)/
  const match = pathname.match(regex)
  const id = match ? match[1] : null

  const { data, error, loading } = useGetGym(id)
  const gymname = data?.name

  const photos = [
    { url: '/src/assets/img1.png', alt: 'Gym photo 1' },
    { url: '/src/assets/img2.png', alt: 'Gym photo 1' },
    { url: '/src/assets/img3.png', alt: 'Gym photo 1' },
    { url: '/src/assets/img4.png', alt: 'Gym photo 1' },
    { url: '/src/assets/img5.png', alt: 'Gym photo 1' },
  ]

  return (
    <div>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Find gyms</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">city</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={pathname}>{gymname}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="header-container">
        <h1 className="text-5xl font-bold pb-2">{gymname}</h1>
        <div className="header-icons">
          <ShareButton link={window.location.href} />
          <Button variant="outline">
            <BookmarkIcon className="mr-2 h-4 w-4" />
            Mark as favourite
          </Button>
        </div>
      </div>
      {/* Basic structure for the rest of the page */}
      <div>
        {/* Basic structure for the rest of the page */}
        <PhotoGallery photos={photos} />
        <div className="flex gap-2">
          {/* left side */}
          <div className="w-2/3 mr-10">
            <div className="flex gap-2">
              {data?.highlights.map((element) => (
                <HighlightBadge key={element} name={element} />
              ))}
            </div>
            <div className="mt-3">
              {/* Offers Component */}
              <h1 className="mt-2 text-3xl font-bold">Offers</h1>
              {!loading && (
                <div>
                  {data?.offers.map((offer) => (
                    <OfferTile key={offer.title} offer={offer} />
                  ))}
                </div>
              )}
              More infors about offers
            </div>
          </div>

          {/* right side */}
          <div className="w-1/3 m-2">
            <Button asChild className="w-full">
              <Link to={data?.websiteLink ?? '/default-url'}>
                Visit gym website
              </Link>
            </Button>
            <h1 className="mt-2 text-3xl font-bold">Reviews</h1>
            {!loading && (
              <div>
                {data?.reviews
                  .slice(0, 5)
                  .map((review) => <ReviewTile review={review} />)}
              </div>
            )}
            <ReviewDialog reviews={data?.reviews} /> | add review
          </div>
        </div>
      </div>
    </div>
  )
}

function OfferTile({ offer }: { offer: IOffer }) {
  return (
    <div className="flex h-46 w-full border rounded p-2 relative m-2">
      {/* Section left side */}
      <div className="w-2/3">
        {offer.type === 'Special' && <SpecialOfferTile />}
        <h1 className="mt-2 text-2xl font-bold">{offer.title}</h1>
        {offer.description}
      </div>
      {/* Section right side */}
      <div className="flex justify-between w-full ml-4 pr-2">
        <div className="ml-auto">
          Valid until {new Date(offer.endDate).toLocaleDateString('de-DE')}
        </div>
        <div className="absolute bottom-2 right-2">
          Price: {offer.priceEuro}€
        </div>
      </div>
    </div>
  )
}

function SpecialOfferTile() {
  return (
    <div className="flex gap-2 items-center px-2 py-1 border rounded">
      <Clock9 className="w-5 h-5" />
      Special Offer
    </div>
  )
}

function ShareButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 3000) // Reset the icon back after 2 seconds
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share1Icon className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Copy the link and share your best gym with your friends!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={handleCopyLink}
          >
            <span className="sr-only">Copy</span>
            {copied ? (
              <CircleCheckBig className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReviewTile({ review }: { review: IReview }) {
  const [showFullText, setShowFullText] = useState(false)
  const maxLength = 100

  const toggleShowFullText = () => {
    setShowFullText(!showFullText)
  }
  return (
    <div className="flex h-46 w-full rounded p-2 relative m-2">
      <div>
        {showFullText || review.text.length <= maxLength
          ? review.text
          : `${review.text.substring(0, maxLength)}...`}
        {review.text.length > maxLength && (
          <button onClick={toggleShowFullText} className="ml-2 text-blue-500">
            {showFullText ? 'show less' : 'read more'}
          </button>
        )}
      </div>
    </div>
  )
}

function MapTile({ address }: { address: IAddress }) {
  const latitude = address.latitude
  const longitude = address.longitude
  const delta = 0.05
  const left = longitude - delta
  const right = longitude + delta
  const bottom = latitude - delta
  const top = latitude + delta

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div>
      <iframe src={mapUrl}></iframe>
      <br />
      <small>
        <a
          href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`}
        >
          View Larger Map
        </a>
      </small>
    </div>
  )
}

function ReviewDialog({ reviews }: { reviews: [IReview] | undefined }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">view more</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View all reviews</DialogTitle>
        </DialogHeader>

        <div>
          {reviews?.map((review) => <ReviewTile review={review} />) || (
            <p>No reviews available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GymOverview
