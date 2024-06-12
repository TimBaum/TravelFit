import { useEffect, useState } from 'react'
import { IGymWithId } from '@models/gym'
import { fetchJSON } from './utils'

interface GymSearchResults {
  data: IGymWithId[]
  error: string | null
  loading: boolean
}

interface GymOverview {
  data: IGymWithId | undefined
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

function useGetGym(id: string | null): GymOverview {
  const [data, setData] = useState<IGymWithId>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      setLoading(true)
      const response = await fetch(`${config.BACKEND_URL}/gyms/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .catch((error) => {
          setError(error)
        })
      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [id])

  return { data, error, loading }
}

function useAddReview(id: string | null, review: any): GymOverview {
  const [data, setData] = useState<IGymWithId>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!id) return

      setLoading(true)

      const response = await fetch(`${config.BACKEND_URL}/gyms/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review }), // Pass the review data in the body
      })
        .then((response) => response.json())
        .catch((error) => {
          setError(error)
        })
      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [id, review]) // Add review to dependency array to trigger the effect when review changes

  return { data, error, loading }
}

export { useGymSearch, useGetGym, useAddReview }
