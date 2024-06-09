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
import { IOffer } from '@models/offer'
import { Clock9 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Link } from 'react-router-dom'

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
          <Button variant="outline">
            <Share1Icon className="mr-2 h-4 w-4" />
            Share
          </Button>
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
          <div className="w-2/3 m-2">
            <div className="flex gap-2">
              {data?.highlights.map((element) => (
                <HighlightBadge key={element} name={element} />
              ))}
            </div>
            <div className="mt-3">
              {/* Offers Component */}
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

            <h2>Reviews</h2>
            {/* Reviews Component */}
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

export default GymOverview
