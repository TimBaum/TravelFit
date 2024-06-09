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
import { ArrowDown, Coins, MapIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { IGym, IGymWithId } from '@models/gym'
import HighlightBadge from '@/components/HighlightBadge'
import { useNavigate } from 'react-router-dom'

function GymSearchResults() {
  const urlParams = new URLSearchParams(window.location.search)

  const [searchString, setSearchString] = useState(urlParams.get('search'))

  const { data, error, loading } = useGymSearch(searchString)

  console.log(data)

  const filters = [
    { text: 'Date', icon: <CalendarIcon /> },
    { text: 'Rating', icon: <StarIcon /> },
    { text: 'Price', icon: <Coins /> },
  ]

  if (error) return <div>Error loading gyms</div>

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
          <Filter key={filter.text} text={filter.text} icon={filter.icon} />
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
      {!loading && data.length > 0 && (
        <div>
          {data.map((gym) => (
            <GymTile key={gym.name} gym={gym} />
          ))}
        </div>
      )}
      {loading && <div>Loading...</div>}
      {!loading && data.length === 0 && (
        <div className="mt-12 w-full justify-center text-center">
          <img
            src="src/assets/illustrations/MessyDoodle.svg"
            alt="No results found"
            className="w-2/5 mx-auto mb-6"
          />
          <div className="text-2xl font-bold">No gyms found</div>
          <div>Try another search to find your next workout!</div>
        </div>
      )}
    </div>
  )
}

function Filter({ text, icon }: { text: string; icon: JSX.Element }) {
  return (
    <Button variant={'outline'} className="gap-2">
      {icon && React.cloneElement(icon, { className: 'w-5 h-5' })} {text}
    </Button>
  )
}

function GymTile({ gym }: { gym: IGymWithId }) {
  const navigate = useNavigate()

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
          <div>Open Wednesdays until 22.00</div>
        </div>
        <div className="flex flex-col justify-between items-end min-w-40">
          <div className="flex items-center gap-1">
            <StarFilledIcon className="text-primary h-4 w-4" />
            {gym.averageRating.toFixed(1) +
              ' · ' +
              (gym.reviews.length + 3) +
              ' Reviews'}
          </div>
          <div className="text-left">from 5€</div>
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
