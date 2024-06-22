import { useAuth } from '@/provider/AuthProvider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
import { IGymWithId } from '@models/gym'
import { useNavigate } from 'react-router-dom'
import { Separator } from '@radix-ui/react-separator'
import { BookmarkIcon } from 'lucide-react'
import HighlightBadge from '@/components/HighlightBadge'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

import { useReadAll } from '@/services/gymService'
import { useEffect, useState } from 'react'
import { useReadUser } from '@/services/userService'

function Favourites() {
  const { user } = useAuth()
  const [favouriteGyms, setFavouriteGyms] = useState<IGymWithId[]>([])
  const { data, error, loading } = useReadAll()
  const userFavourites = useReadUser(user?._id ?? '').data?.favourites

  console.log('User: ' + user?.displayName)
  console.log('Data: ' + JSON.stringify(data.gyms[0]))
  console.log('Favourites: ' + userFavourites)

  /*useEffect(() => {
    if (user && userFavourites && gyms) {
      const favGyms = gyms.filter((gym) => user.favourites.includes(gym._id))
      setFavouriteGyms(favGyms)
      console.log('FAV GYMS: ' + favGyms)
    }
  }, [user, userFavourites, gyms])*/

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
              {data.map((gym) => (
                <GymTile key={gym._id} gym={gym} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GymTile({ gym }: { gym: IGymWithId }) {
  const navigate = useNavigate()

  function getMaxOpeningHourToday() {
    const today = new Date().getDay()
    const openingHoursToday = gym.openingHours.filter(
      (openingHour) => openingHour.weekday === today,
    )
    if (openingHoursToday.length === 0) {
      return 'Closed'
    }
    return openingHoursToday.slice(-1)[0].closingTime
  }

  function findCheapestOffer() {
    const offers = gym.offers
    if (offers.length === 0) {
      return 'Contact gym for prices'
    }
    const cheapestOffer = offers.reduce((prev, current) =>
      prev.priceEuro < current.priceEuro ? prev : current,
    )
    return 'from ' + cheapestOffer.priceEuro + '€'
  }

  const maxOpeningHourToday = getMaxOpeningHourToday()

  return (
    <div className="flex h-48 w-full border rounded p-2 items-stretch">
      {/* Section left side */}
      {/* TODO: exchange pictures */}
      <div className="h-full flex gap-2 pr-2">
        <img
          className="h-full shrink object-cover aspect-square rounded"
          src={`src/assets/img${Math.floor(Math.random() * 4) + 1}.png`}
        />
        <div className="h-full shrink grid grid-cols-1 grid-rows-2 gap-2">
          <img
            className="h-full aspect-square object-cover rounded"
            src={`src/assets/img${Math.floor(Math.random() * 4) + 1}.png`}
          />
          <img
            className="h-full aspect-square object-cover rounded"
            src={`src/assets/img${Math.floor(Math.random() * 4) + 1}.png`}
          />
        </div>
      </div>
      {/* separator is behaving weirdly with the height */}
      <Separator orientation="vertical" className="flex h-full" />
      {/* Section right side */}
      <div className="flex justify-between grow w-2/3 ml-4 pr-2">
        <div className="flex flex-col h-full justify-between w-2/3">
          <div className="">
            <div className="text-2xl text-bold flex gap-2 items-center">
              {gym.name} <BookmarkIcon className="w-6 h-6" />
            </div>
            <div>{gym.address.street + ' ' + gym.address.city}</div>
            <div className="flex gap-2 w-full lg:flex-wrap mt-2 no-scrollbar overflow-scroll max-h-20">
              {gym.highlights.map((element) => (
                <HighlightBadge key={element} name={element} />
              ))}
            </div>
          </div>
          <div>
            {maxOpeningHourToday === 'Closed'
              ? 'Closed today'
              : `Open today until ${maxOpeningHourToday.hour}:${maxOpeningHourToday.minute.toString().padStart(2, '0')}`}
          </div>
        </div>
        <div className="flex flex-col justify-between items-end w-1/3">
          <div className="flex items-center gap-1 text-nowrap">
            <StarFilledIcon className="text-primary h-4 w-4" />
            {(gym.averageRating ? gym.averageRating.toFixed(1) : '?') +
              ' · ' +
              gym.reviews.length +
              ` Review${gym.reviews.length !== 1 ? 's' : ''}`}
          </div>
          <div className="text-left">{findCheapestOffer()}</div>
          <Button
            className=""
            onClick={() => navigate(`/gymoverview/${gym._id}`)}
          >
            Show details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Favourites
