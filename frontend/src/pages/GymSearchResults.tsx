import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGymSearch } from '@/services/gymService'
import { StarIcon } from '@radix-ui/react-icons'
import { Coins, ExpandIcon, MapIcon } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { FilterState } from '@models/filter'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import '../App.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GymTile } from './GymTile'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'
import Map from '@/components/map'

function GymSearchResults() {
  const urlParams = new URLSearchParams(window.location.search)

  const [searchString, setSearchString] = useState(urlParams.get('search'))

  const [showMapView, setShowMapView] = useState(false)

  const [sortBy, setSortBy] = useState('-averageRating')
  const [page, setPage] = useState(1)

  const defaultFilters: FilterState = {
    price: {
      from: undefined,
      to: undefined,
    },
    rating: {
      from: undefined,
    },
    weekday: undefined,
    radius: undefined,
    highlights: [],
  }

  const [filterState, setFilterState] = useState<FilterState>(defaultFilters)

  const { data, pages, coordinates, error, loading } = useGymSearch(
    searchString,
    filterState,
    sortBy,
    10,
    page,
  )

  const filters = [
    // { text: 'Date', icon: <CalendarIcon />, state: defaultFilters.weekday },
    { text: 'Rating', icon: <StarIcon />, state: filterState.rating },
    { text: 'Price', icon: <Coins />, state: filterState.price },
    { text: 'Radius', icon: <ExpandIcon />, state: filterState.radius },
  ]

  const sortOptions = [
    {
      text: 'Highest rating',
      value: '-averageRating',
    },
    {
      text: 'Lowest price',
      value: 'cheapestOfferPrice',
    },
    {
      text: 'Highest price',
      value: '-cheapestOfferPrice',
    },
    {
      text: 'Name',
      value: 'name',
    },
  ]

  if (!searchString) return

  return (
    <div className="mb-10">
      <h1 className="text-5xl font-bold mb-2">
        Gyms in {searchString.slice(0, 1).toUpperCase() + searchString.slice(1)}
      </h1>
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
        <Select
          onValueChange={(event) => setSortBy(event)}
          defaultValue={
            sortOptions.find((option) => option.value === sortBy)?.text ||
            'Sort by'
          }
        >
          <SelectTrigger size="sm" className="w-[180px]">
            <SelectValue placeholder="Sort by">
              {sortOptions.find((option) => option.value === sortBy)?.text ||
                'Sort by'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.text} value={option.value}>
                {option.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={'outline'}
          size={'sm'}
          className="flex gap-2"
          onClick={() => setShowMapView(!showMapView)}
        >
          Toggle map view
          <MapIcon className="w-5 h-5" />
        </Button>
      </div>
      {!loading && data?.length > 0 && !showMapView && (
        <div className="flex flex-col gap-2">
          {data.map((gym) => (
            <GymTile key={gym._id} gym={gym} />
          ))}
        </div>
      )}
      {!loading && data?.length > 0 && coordinates && showMapView && (
        <Map
          markers={data.map((gym) => ({
            id: gym._id,
            lat: gym.address.location.coordinates[1],
            lng: gym.address.location.coordinates[0],
            gymName: gym.name,
            averageRating: gym.averageRating,
          }))}
          enablePopups={true}
          center={coordinates}
        />
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
      {pages && (
        <PaginationWrapper
          pages={pages}
          activePage={page}
          setActivePage={setPage}
        />
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any //TODO: specify type
  setFilterState: (state: FilterState) => void
}) {
  function getActiveFilters(): string | undefined {
    if (typeof state === 'object') {
      const entries = Object.entries(state)
      const activeEntries = entries
        .map(([, value]) => value)
        .filter((value) => !!value || value === 0)
      return activeEntries.join(' - ')
    } else if (!!state || state === 0) return state
  }

  const activeFilters = getActiveFilters()

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
          {activeFilters && (
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
            step={0.1}
            max={5}
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

export function PaginationWrapper({
  pages,
  activePage,
  setActivePage,
}: {
  pages: number
  activePage: number
  setActivePage: (newPage: number) => void
}) {
  const pagesArray = Array.from({ length: pages }, (_, i) => i + 1)
  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {activePage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => setActivePage(activePage - 1)} />
          </PaginationItem>
        )}
        {pagesArray.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink onClick={() => setActivePage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {activePage < pages && (
          <PaginationItem>
            <PaginationNext onClick={() => setActivePage(activePage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default GymSearchResults
