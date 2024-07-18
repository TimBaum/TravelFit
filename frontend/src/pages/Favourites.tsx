import { useAuth } from '@/provider/AuthProvider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'

import { useReadAll } from '@/services/gymService'
import { useReadUser } from '@/services/userService'
import { GymTile } from './GymTile'

function Favourites() {
  const { user, getAccountType } = useAuth()
  //TODO: replace useReadAll with something like useReadFavourites to avoid loading all gyms
  const { data, loading } = useReadAll()

  const userFavourites = useReadUser(user?._id ?? '', getAccountType()).data
    ?.favourites

  const filteredGyms = data?.filter(
    (gym) =>
      userFavourites &&
      Array.isArray(userFavourites) &&
      userFavourites.includes(gym._id),
  )

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
          {!loading && data?.length > 0 && (
            <div className="flex flex-col gap-2">
              {filteredGyms.map((gym) => (
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
