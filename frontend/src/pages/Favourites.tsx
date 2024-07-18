import { useAuth } from '@/provider/AuthProvider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'

import { useGetGymsByIds } from '@/services/gymService'
import { useReadUser } from '@/services/userService'
import { GymTile } from './GymTile'

function Favourites() {
  const { user, getAccountType } = useAuth()

  const userFavourites = useReadUser(user?._id ?? '', getAccountType()).data
    ?.favourites

  const { data: gyms, loading: gymsLoading } = useGetGymsByIds(userFavourites)
  console.log(gyms)

  if (!user) {
    return <div>not logged in. Please log in to view your favourites</div>
  }

  return (
    <div>
      <div>
        <div className="breadcrumps">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/favourites">Favourites</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="gym-tiles">
          {!gymsLoading && gyms?.length > 0 && (
            <div className="flex flex-col gap-2">
              {gyms.map((gym) => (
                <GymTile key={gym._id} gym={gym} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favourites
