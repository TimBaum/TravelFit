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
import { MarkFavourite } from '@/components/MarkFavourite'
import HighlightBadge from '@/components/HighlightBadge'
import { Button } from '@/components/ui/button'
import OfferTile from '@/components/OfferTile'
import Map from '@/components/map'

import '@/styles/gym-overview.css'

import { useGetGym } from '@/services/gymService'
import { useFetchImages } from '@/services/gymService'

import { useLocation, useParams } from 'react-router-dom'

import { Link } from 'react-router-dom'

import '@/index.css'
import { useAuth } from '@/provider/AuthProvider'
import { StarFilledIcon } from '@radix-ui/react-icons'

function GymOverview() {
  const { id } = useParams()
  const { user } = useAuth()

  // Use a valid default value for `id` to avoid `undefined`
  const GymId = id || ''

  const { data, error, loading } = useGetGym(GymId)
  const cleanedName = data?.name?.replace(/\s+/g, '') || 'gym'
  const { data: images } = useFetchImages(cleanedName)
  const gymname = data?.name
  const previousPage = useLocation().state?.from
  const previousPagePath =
    previousPage === '/favourites'
      ? '/favourites'
      : previousPage === '/find-gyms'
        ? `/find-gyms?search=${data?.address?.city || ''}`
        : previousPage === '/my-gyms'
          ? '/my-gyms'
          : '/'

  const breadcrumbPrevious =
    previousPage === '/favourites'
      ? 'Favourites'
      : previousPage === '/find-gyms'
        ? `${data?.address?.city}`
        : previousPage === '/my-gyms'
          ? 'My Gyms'
          : '/'

  if (!id) {
    return <div>Invalid ID</div>
  }

  if (error) {
    return <div>Error fetching gym</div>
  }

  const lat = data?.address.location?.coordinates[1]
  const lng = data?.address.location?.coordinates[0]

  return (
    <div>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            {previousPage === 'gymSearch' && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Find gyms</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />{' '}
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbLink href={previousPagePath}>
                {breadcrumbPrevious}
              </BreadcrumbLink>
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
          <MarkFavourite gym={data} />
        </div>
      </div>
      {/* Basic structure for the rest of the page */}
      <div>
        {/* Basic structure for the rest of the page */}
        <PhotoGallery photos={images || []} />
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
            </div>
          </div>

          {/* right side */}
          <div className="w-1/3 m-2">
            <Button asChild className="w-full">
              <Link to={data?.websiteLink ?? '/default-url'}>
                Visit gym website
              </Link>
            </Button>
            <h1 className="mt-5 text-3xl font-bold flex items-center gap-1 text-nowrap">
              <StarFilledIcon className="text-primary h-7 w-7" />
              {(data?.averageRating
                ? data?.averageRating.toFixed(1)
                : 'No reviews') +
                ' · ' +
                data?.reviews.length +
                ` Review${data?.reviews.length !== 1 ? 's' : ''}`}
            </h1>
            {!loading && (
              <div>
                {data?.reviews
                  .slice(0, 5)
                  .map((review) => <ReviewTile review={review} />)}
              </div>
            )}
            <ReviewDialog reviews={data?.reviews} />
            {user && <AddReviewDialog gym={data} />}
          </div>
        </div>
        {data?.address?.location?.coordinates ? (
          <Map
            markers={[
              {
                id: data._id,
                lat: lat ?? 0,
                lng: lng ?? 0,
                averageRating: data.averageRating,
                gymName: data.name,
              },
            ]}
            center={[lat ?? 0, lng ?? 0]}
          />
        ) : (
          <p>No coordinates available for this gym.</p>
        )}
      </div>
    </div>
  )
}

export default GymOverview
