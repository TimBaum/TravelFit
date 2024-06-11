import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGymSearch } from '@/services/gymService'
import {
  BookmarkIcon,
  CalendarIcon,
  StarFilledIcon,
  StarIcon,
} from '@radix-ui/react-icons'
import { ArrowDown, Coins, ExpandIcon, MapIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { IGymWithId } from '@models/gym'
import { FilterState } from '@models/filter'
import HighlightBadge from '@/components/HighlightBadge'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'

function GymSearchResults() {
  const urlParams = new URLSearchParams(window.location.search)

  const [searchString, setSearchString] = useState(urlParams.get('search'))

  const defaultFilters: FilterState = {
    price: {
      from: undefined,
      to: undefined,
    },
    rating: {
      from: undefined,
      to: undefined,
    },
    weekday: undefined,
    radius: undefined,
    highlights: [],
  }

  const [filterState, setFilterState] = useState<FilterState>(defaultFilters)

  const { data, error, loading } = useGymSearch(searchString, filterState)

  const filters = [
    // { text: 'Date', icon: <CalendarIcon />, state: defaultFilters.weekday },
    { text: 'Rating', icon: <StarIcon />, state: filterState.rating },
    { text: 'Price', icon: <Coins />, state: filterState.price },
    { text: 'Radius', icon: <ExpandIcon />, state: filterState.radius },
  ]

  console.log(filterState)

  return (
    <div className="mb-10">
      <h1 className="text-5xl font-bold mb-2">Gyms in {searchString}</h1>
      <SearchBar
        searchTerm={searchString || ''}
        setSearchTerm={setSearchString}
        className="mb-2"
      />
      <div className="flex gap-2 mb-2">
        {filters.map((filter) => (
          <Filter
            key={filter.text}
            text={filter.text}
            icon={filter.icon}
            state={filter.state}
            filterState={filterState}
            setFilterState={setFilterState}
          />
        ))}
      </div>
      <Separator />
      <div className="flex items-center gap-2 mt-2 mb-4">
        <Button variant={'outline'} size={'sm'} className="flex gap-2">
          Sort by <div className="font-bold">lowest price</div>
          <ArrowDown className="w-5 h-5" />
        </Button>
        <Button variant={'outline'} size={'sm'} className="flex gap-2">
          Toggle map view
          <MapIcon className="w-5 h-5" />
        </Button>
      </div>
      {!loading && data?.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.map((gym) => (
            <GymTile key={gym._id} gym={gym} />
          ))}
        </div>
      )}
      {loading && <div>Loading...</div>}
      {!loading && data?.length === 0 && (
        <div className="mt-12 w-full justify-center text-center">
          <img
            src="src/assets/illustrations/MessyDoodle.svg"
            alt="No results found"
            className="w-2/5 mx-auto mb-6"
          />
          <div className="text-2xl font-bold">
            {' '}
            {error === 'LOCATION_NOT_FOUND'
              ? "Your address wasn't found"
              : 'No gyms found'}
          </div>
          <div>Try another search to find your next workout!</div>
        </div>
      )}
    </div>
  )
}

function Filter({
  text,
  icon,
  state,
  filterState,
  setFilterState,
}: {
  text: string
  icon: JSX.Element
  filterState: FilterState
  state: object | string | []
  setFilterState: (state: FilterState) => void
}) {
  function countActiveFilters() {
    if (typeof state === 'object') {
      return Object.keys(state).filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key) => (state as any)[key] || (state as any)[key] === 0,
      ).length
    } else return state === undefined ? 0 : 1
  }

  const activeFilters = countActiveFilters()

  function getFilterComponent() {
    switch (text) {
      case 'Price':
        return (
          <PriceFilter
            icon={icon}
            filterState={filterState}
            setFilterState={setFilterState}
          />
        )
      case 'Rating':
        return (
          <RatingFilter
            icon={icon}
            filterState={filterState}
            setFilterState={setFilterState}
          />
        )

      case 'Radius':
        return (
          <RadiusFilter
            icon={icon}
            filterState={filterState}
            setFilterState={setFilterState}
          />
        )

      default:
        return <>Not implemented yet.</>
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className="gap-2">
          {icon && React.cloneElement(icon, { className: 'w-5 h-5' })}
          {text}
          {activeFilters > 0 && (
            <div className="px-1 rounded bg-black text-white">
              {activeFilters}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{getFilterComponent()}</DropdownMenuContent>
    </DropdownMenu>
  )
}

interface FilterProps {
  icon: JSX.Element
  filterState: FilterState
  setFilterState: (state: FilterState) => void
}

function RadiusFilter({ icon, filterState, setFilterState }: FilterProps) {
  return (
    <div className="p-4 box-shadow-md">
      <div className="flex gap-2 items-center">
        {icon && React.cloneElement(icon, { className: 'w-7 h-7' })}{' '}
        <p className="text-3xl text-bold">Radius</p>
      </div>
      <div>
        <Label>Radius in km</Label>
        <Input
          type="number"
          placeholder="Number"
          value={filterState.radius ?? ''}
          onChange={(event) => {
            setFilterState({
              ...filterState,
              radius: parseFloat(event.target.value) ?? undefined,
            })
          }}
        />
      </div>
    </div>
  )
}

function RatingFilter({ icon, filterState, setFilterState }: FilterProps) {
  return (
    <div className="p-4 box-shadow-md">
      <div className="flex gap-2 items-center">
        {icon && React.cloneElement(icon, { className: 'w-7 h-7' })}{' '}
        <p className="text-3xl text-bold">Rating</p>
      </div>
      <div className="flex gap-2 mt-4">
        <div>
          <Label>From</Label>
          <Input
            type="number"
            placeholder="Number"
            value={filterState.rating.from ?? ''}
            onChange={(event) => {
              setFilterState({
                ...filterState,
                rating: {
                  ...filterState.rating,
                  from: parseFloat(event.target.value) ?? undefined,
                },
              })
            }}
          />
        </div>
        <div>
          <Label>To</Label>
          <Input
            type="number"
            placeholder="Number"
            value={filterState.rating.to ?? ''}
            onChange={(event) => {
              setFilterState({
                ...filterState,
                rating: {
                  ...filterState.rating,
                  to: parseFloat(event.target.value) ?? undefined,
                },
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}

function PriceFilter({ icon, filterState, setFilterState }: FilterProps) {
  return (
    <div className="p-4 box-shadow-md">
      <div className="flex gap-2 items-center">
        {icon && React.cloneElement(icon, { className: 'w-7 h-7' })}{' '}
        <p className="text-3xl text-bold">Price</p>
      </div>
      <div className="flex gap-2 mt-4">
        <div>
          <Label>From</Label>
          <Input
            type="number"
            placeholder="Number"
            value={filterState.price.from ?? ''}
            onChange={(event) => {
              setFilterState({
                ...filterState,
                price: {
                  ...filterState.price,
                  from: parseFloat(event.target.value) ?? undefined,
                },
              })
            }}
          />
        </div>
        <div>
          <Label>To</Label>
          <Input
            type="number"
            placeholder="Number"
            value={filterState.price.to ?? ''}
            onChange={(event) => {
              setFilterState({
                ...filterState,
                price: {
                  ...filterState.price,
                  to: parseFloat(event.target.value) ?? undefined,
                },
              })
            }}
          />
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
    <div className="flex min-h-48 w-full border rounded p-2 items-stretch">
      {/* Section left side */}
      <div className="w-1/3 h-full">images</div>
      {/* separator is behaving weirdly with the height */}
      <Separator orientation="vertical" className="flex h-46" />
      {/* Section right side */}
      <div className="flex justify-between w-full ml-4 pr-2">
        <div className="flex flex-col h-full justify-between">
          <div className="">
            <div className="text-2xl text-bold flex gap-2 items-center">
              {gym.name} <BookmarkIcon className="w-6 h-6" />
            </div>
            <div>{gym.address.street + ' ' + gym.address.city}</div>
            <div className="flex gap-2 flex-wrap mt-2">
              {gym.highlights.map((element) => (
                <HighlightBadge key={element} name={element} />
              ))}
            </div>
          </div>
          <div>
            {maxOpeningHourToday === 'Closed'
              ? 'Closed'
              : `Open today until ${maxOpeningHourToday.hour}:${maxOpeningHourToday.minute.toString().padStart(2, '0')}`}
          </div>
        </div>
        <div className="flex flex-col justify-between items-end min-w-40">
          <div className="flex items-center gap-1">
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

export default GymSearchResults
