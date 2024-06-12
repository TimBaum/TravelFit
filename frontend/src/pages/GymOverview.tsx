import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import PhotoGallery from '@/components/PhotoGallery'
import ShareButton from '@/components/ShareButton'
import { AddReviewDialog, ReviewTile, ReviewDialog } from '@/components/Review'
import HighlightBadge from '@/components/HighlightBadge'
import { Button } from '@/components/ui/button'
import OfferTile from '@/components/Offer'

import '@/styles/gym-overview.css'

import { useGetGym } from '@/services/gymService'

import { useParams, useLocation } from 'react-router-dom'

import { BookmarkIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IAddress } from '@models/address'

import '@/index.css'

function GymOverview() {
  const pathname = useLocation()
  const { id } = useParams()

  if (!id) {
    return <div>Invalid ID</div>
  }

  console.log(id)

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
              <BreadcrumbLink>{gymname}</BreadcrumbLink>
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
            <ReviewDialog reviews={data?.reviews} /> |{' '}
            <AddReviewDialog gym={data} />
          </div>
        </div>
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

export default GymOverview
