import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { IGymWithId } from '@models/gym'
import HighlightBadge from '@/components/HighlightBadge'
import { useLocation, useNavigate } from 'react-router-dom'
import { MarkFavourite } from '@/components/MarkFavourite'
import { useAuth } from '@/provider/AuthProvider'
import { useFetchImages } from '@/services/gymService'

export function GymTile({ gym }: { gym: IGymWithId }) {
  const navigate = useNavigate()
  const location = useLocation()

  const { data } = useFetchImages(gym.name.replace(/\s+/g, ''))

  const images = data

  function getImage(index: number) {
    if (images && images.length > index) {
      return images[index].url
    }
    const placeholderImageUrl =
      'https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg'
    return placeholderImageUrl
  }

  const { getAccountType } = useAuth()
  const accountType = getAccountType()

  function getMaxOpeningHourToday() {
    const today = new Date().getDay()
    const openingHoursToday = gym.openingHours.filter(
      (openingHour) => openingHour.weekday === today,
    )
    if (openingHoursToday.length === 0) {
      return 'Closed'
    }

    // Find the maximum closing time
    const maxClosingTime = openingHoursToday.reduce((max, current) => {
      return current.closingTime > max ? current.closingTime : max
    }, '00:00')

    return maxClosingTime
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
    <div className="flex h-48 w-full bg-white border rounded p-2">
      {/* Section left side */}
      {/* TODO: exchange pictures */}
      <div className="h-full flex gap-2 pr-2">
        <img
          className="h-full shrink object-cover aspect-square rounded"
          src={getImage(0)}
        />
        <div className="h-full shrink grid grid-cols-1 grid-rows-2 gap-2">
          <img
            className="h-full aspect-square object-cover rounded"
            src={getImage(1)}
          />
          <img
            className="h-full aspect-square object-cover rounded"
            src={getImage(2)}
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
              {gym.name}{' '}
              {accountType !== 'GYM_USER' && <MarkFavourite gym={gym} />}
            </div>
            <div>{gym.address.street + ' ' + gym.address.city}</div>
            <div className="flex gap-2 w-full flex-nowrap mt-2 no-scrollbar overflow-scroll max-h-12">
              {gym.highlights.map((element) => (
                <HighlightBadge key={element} name={element} />
              ))}
            </div>
          </div>
          <div>
            {maxOpeningHourToday === 'Closed'
              ? 'Closed today'
              : `Open today until ${maxOpeningHourToday}`}
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
            onClick={() =>
              navigate(`/gyms/${gym._id}`, {
                state: { from: location.pathname },
              })
            }
          >
            Show details
          </Button>
        </div>
      </div>
    </div>
  )
}
