import SearchBar from '@/components/SearchBar'
import { useGymSearch } from '@/services/gymService'
import { useState } from 'react'

function GymSearchResults() {
  const urlParams = new URLSearchParams(window.location.search)

  const [searchString, setSearchString] = useState(urlParams.get('search'))

  const { data, error, loading } = useGymSearch(searchString)

  return (
    <div>
      <h1 className="text-5xl font-bold mb-2">Gyms in {searchString}</h1>
      <SearchBar
        searchTerm={searchString || ''}
        setSearchTerm={setSearchString}
        className="mb-8"
      />
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  )
}

export default GymSearchResults
