import { useEffect, useState } from 'react'

function GymSearchResults() {
  const [searchResults, setSearchResults] = useState(null)

  const urlParams = new URLSearchParams(window.location.search)

  const searchString = urlParams.get('search')

  useEffect(() => {
    async function fetchData() {
      //TODO: Refactor to use service layer and with some abstraction of base url and error handling
      const response = await fetch(`http://localhost:5000/gyms/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchString: searchString }),
      }).then((response) => response.json())
      setSearchResults(response)
    }

    fetchData()
  }, [searchString])

  return (
    <div>
      <h1>Search Results for {searchString}</h1>
      {searchResults && <div>{JSON.stringify(searchResults)}</div>}
    </div>
  )
}

export default GymSearchResults
