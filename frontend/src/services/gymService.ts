import { useEffect, useState } from 'react'
import { IGymWithId } from '@models/gym'
import { fetchJSON } from './utils'
import { FilterState } from '@models/filter'
import { config } from '@/config'

interface GymSearchResults {
  data: IGymWithId[]
  error: string | null
  loading: boolean
}

function useGymSearch(
  searchString: string | null,
  filters: FilterState,
): GymSearchResults {
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
        body: JSON.stringify({ searchString: searchString, filters }),
      }).catch((error) => {
        setError(error.message)
        return []
      })
      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [searchString, filters])

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

function useReadAll(): GymSearchResults {
  const [data, setData] = useState<IGymWithId[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/gyms/get`, {
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
  }, [])

  return { data, error, loading }
}
interface GymOverview {
  data: IGymWithId | undefined
  error: string | null
  loading: boolean
}

export { useGymSearch, useGetGym, useReadAll }
