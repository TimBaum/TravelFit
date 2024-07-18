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
import { Button } from '@/components/ui/button'

import NoGyms from '@/assets/illustrations/NoGyms.svg'
import { useNavigate } from 'react-router-dom'

function Favourites() {
  const { user, getAccountType } = useAuth()

  const navigate = useNavigate()

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
        <h1 className="text-5xl font-bold mb-4">Favourites</h1>
        {gyms.length === 0 ? (
          <div className="no-gyms-container flex flex-col justify-center text-center">
            <img
              src={NoGyms}
              alt="No Gyms Available"
              className="w-2/5 mx-auto mb-6"
            />
            <p className="text-2xl">Nothing here yet.</p>
            <Button className="mx-auto mt-3" onClick={() => navigate('/')}>
              Find your first gym
            </Button>
          </div>
        ) : (
          <div className="gym-tiles">
            {!gymsLoading && gyms?.length > 0 && (
              <div className="flex flex-col gap-2">
                {gyms.map((gym) => (
                  <GymTile key={gym._id} gym={gym} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favourites
