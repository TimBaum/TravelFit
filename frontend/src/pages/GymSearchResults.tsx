import { useGymSearch } from '@/services/gymService'

function GymSearchResults() {
  const urlParams = new URLSearchParams(window.location.search)
  const searchString = urlParams.get('search')

  const { data, error, loading } = useGymSearch(searchString)

  return (
    <div>
      <h1>Search Results for {searchString}</h1>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  )
}

export default GymSearchResults
