import SearchBar from '@/components/SearchBar'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function GymSearch() {
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

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
          <i onClick={() => navigate('/create-gym-account/')}>
            become a partner
          </i>
        </u>
        .
      </p>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
    <Link to={`/find-gyms?search=${city}`}>
      <Card className="aspect-square relative drop-shadow-md rounded-lg overflow-hidden">
        <img src={picture} alt={city} className="h-full w-full object-cover" />
        <p className="absolute bottom-0 left-0 text-white text-xl font-bold p-2">
          {city}
        </p>
      </Card>
    </Link>
  )
}

export default GymSearch
