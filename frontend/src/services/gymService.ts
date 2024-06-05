import { config } from '@/config'
import { useEffect, useState } from 'react'

export interface IGym {
  name: string
  highlights: ['Sauna', 'Posing room', 'Pool']
  websiteLink: string
  pictures: [string]
  averageRating: number
  // address: IAddress
  // openingHours: [ITimeRange]
  // offers: [IOffer]
  // reviews: [IReview]
  createdAt: Date
  updatedAt: Date
}

interface GymSearchResults {
  data: IGym[]
  error: string | null
  loading: boolean
}

function useGymSearch(searchString: string | null): GymSearchResults {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!searchString) return
      setLoading(true)
      const response = await fetch(`${config.BACKEND_URL}/gyms/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchString: searchString }),
      })
        .then((response) => response.json())
        .catch((error) => {
          setError(error)
        })
      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [searchString])

  return { data, error, loading }
}

export { useGymSearch }
