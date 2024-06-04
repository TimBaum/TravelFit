function GymSearchResults() {
  const urlParams = new URLSearchParams(window.location.search)

  const searchTerm = urlParams.get('search')

  return (
    <div>
      <h1>Search Results for {searchTerm}</h1>
    </div>
  )
}

export default GymSearchResults
