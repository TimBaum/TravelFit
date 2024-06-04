import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

function GymSearch() {
  const { searchTerm, setSearchTerm } = useState('')

  const cityTiles = [
    { city: 'Munich', picture: '/src/assets/munich.png' },
    { city: 'Berlin', picture: '/src/assets/berlin.png' },
    { city: 'Hamburg', picture: '/src/assets/hamburg.png' },
    { city: 'Cologne', picture: '/src/assets/cologne.png' },
    { city: 'Frankfurt', picture: '/src/assets/frankfurt.png' },
    { city: 'Stuttgart', picture: '/src/assets/stuttgart.png' },
  ]

  return (
    <div>
      <h1 className="text-5xl font-bold pb-2">Find your perfect gym</h1>
      <p className="">
        Find your gym or{' '}
        <u>
          <i>become a partner</i>
        </u>
        .
      </p>
      <div className="flex gap-2 mt-4">
        <Input className="h-14" placeholder="Search for your location"></Input>
        <Button className="w-14 h-14" size="icon" variant={'outline'}>
          <MagnifyingGlassIcon className="h-6 w-6" />
        </Button>
      </div>
      <div className="mb-16">
        <h3 className="text-xl font-bold mt-8">Or explore cities</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {cityTiles.map(({ city, picture }) => (
            <CityTile key={city} city={city} picture={picture} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CityTile({ city, picture }: { city: string; picture: string }) {
  return (
    <Card className="aspect-square relative drop-shadow-md rounded-lg overflow-hidden">
      <img src={picture} alt={city} className="h-full w-full object-cover" />
      <p className="absolute bottom-0 left-0 text-white text-xl font-bold p-2">
        {city}
      </p>
    </Card>
  )
}

export default GymSearch
