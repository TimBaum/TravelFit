import { useEffect, useState } from 'react'
import { IGymWithId } from '@models/gym'
import { fetchJSON } from './utils'

interface GymSearchResults {
  data: IGymWithId[]
  error: string | null
  loading: boolean
}

function useGymSearch(searchString: string | null): GymSearchResults {
  const [data, setData] = useState<IGymWithId[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!searchString) return
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/gyms/search`, {
        method: 'POST',
        body: JSON.stringify({ searchString: searchString }),
      }).catch((error) => {
        setError(error.message)
        return []
      })
      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [searchString])

  return { data, error, loading }
}

export { useGymSearch }
