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
import { useState } from 'react'
import { IGym } from '@models/gym'

function GymOverview() {
  const urlParams = new URLSearchParams(window.location.search)

  const id = urlParams.get('id')

  const { data, error, loading } = useGetGym(id)

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
              <BreadcrumbLink href="/components">
                City placeholder
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {!loading && (
                  <div>
                    {data.map((gym) => (
                      <GymTile key={gym.name} gym={gym} />
                    ))}
                  </div>
                )}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="header-container">
        <h1 className="text-5xl font-bold pb-2">
          {!loading && (
            <div>
              {data.map((gym) => (
                <GymTile key={gym.name} gym={gym} />
              ))}
            </div>
          )}
        </h1>
        <div className="header-icons">
          <Share1Icon className="icon" />
          Share
          <BookmarkIcon className="icon" />
          Mark as favourite
        </div>
      </div>
      {/* Basic structure for the rest of the page */}
      <div>
        <div>{/* Image Gallery Component */}</div>
        <div>
          {' '}
          {/* left side*/}
          <div>{/* Pool, Sauna, Posing room details */}</div>
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

function GymTile({ gym }: { gym: IGym }) {
  return <div>{gym.name}</div>
}

export default GymOverview
