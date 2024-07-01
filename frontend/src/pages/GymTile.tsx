import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { IGymWithId } from '@models/gym'
import HighlightBadge from '@/components/HighlightBadge'
import { useLocation, useNavigate } from 'react-router-dom'
import { MarkFavourite } from '@/components/MarkFavourite'

export function GymTile({ gym }: { gym: IGymWithId }) {
  const navigate = useNavigate()
  const location = useLocation()

  console.log(location.pathname)

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
              {gym.name} <MarkFavourite gym={gym} />
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
