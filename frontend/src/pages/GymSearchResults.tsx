import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGymSearch } from '@/services/gymService'
import { CalendarIcon, StarIcon } from '@radix-ui/react-icons'
import { ArrowDown, Coins, MapIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { IGym } from '@models/gym'

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

  return (
    <div>
      <h1 className="text-5xl font-bold mb-2">Gyms in {searchString}</h1>
      <SearchBar
        searchTerm={searchString || ''}
        setSearchTerm={setSearchString}
        className="mb-6"
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
      {!loading && (
        <div>
          {data.map((gym) => (
            <GymTile key={gym.name} gym={gym} />
          ))}
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

function GymTile({ gym }: { gym: IGym }) {
  return <div>{gym.name}</div>
}

export default GymSearchResults
