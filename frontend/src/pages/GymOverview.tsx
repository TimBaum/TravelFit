import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import '@/index.css'
import '@/styles/gym-overview.css'
import { Share1Icon, BookmarkIcon } from '@radix-ui/react-icons'
import { useGetGym } from '@/services/gymService'
import PhotoGallery from '@/components/PhotoGallery'
import HighlightBar from '@/components/HighlightBar'
import { Button } from '@/components/ui/button'

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

  const highlights = [
    { highlight: 'Pool', icon: 'src/assets/icons/pool.png' },
    { highlight: 'Sauna', icon: 'src/assets/icons/pool.png' },
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
        <div> {/* photo gallery*/}</div>
        <PhotoGallery photos={photos} />
        <div>
          {' '}
          {/* left side*/}
          <div>
            {/* Pool, Sauna, Posing room details */}
            <HighlightBar highlights={highlights} />
          </div>
          <div>
            <h2>All offers</h2>
            {/* Offers Component */}
          </div>
          <div>{/* Map Component */}</div>
        </div>
        <div>
          {' '}
          {/* right side*/}
          <div>
            <h2>Reviews</h2>
            {/* Reviews Component */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GymOverview
