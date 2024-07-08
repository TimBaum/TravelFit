import { useEffect, useState } from 'react'
import { IGymWithId } from '@models/gym'
import { fetchJSON } from './utils'
import { FilterState } from '@models/filter'
import { config } from '@/config'
import { CloudinaryImage } from '@models/cloudinaryImage'

interface GymSearchResults {
  data: IGymWithId[]
  pages: number | undefined
  coordinates: [number, number] | undefined
  error: string | null
  loading: boolean
}

interface GymOverview {
  data: IGymWithId | undefined
  error: string | null
  loading: boolean
}

function useGymSearch(
  searchString: string | null,
  filters: FilterState,
  sortBy: string,
  pageLimit: number,
  page: number,
): GymSearchResults {
  const [data, setData] = useState<IGymWithId[]>([])
  const [pages, setPages] = useState<number | undefined>(undefined)
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(
    undefined,
  )
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  /* useEffect hook specialized for manupilations after the component has been rendered  */
  useEffect(() => {
    async function fetchData() {
      if (!searchString) return
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/gyms/search`, {
        method: 'POST',
        body: JSON.stringify({
          searchString,
          pageLimit,
          sortBy,
          filters,
          page: page - 1,
        }),
      }).catch((error) => {
        setError(error.message)
        return []
      })
      setData(response.gyms)
      setPages(response.pages)
      setCoordinates(response.coordinates)
      setLoading(false)
    }

    fetchData()
  }, [searchString, filters, pageLimit, sortBy, page])

  return { data, pages, coordinates, error, loading }
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

function useReadAll(): {
  data: IGymWithId[]
  error: string | null
  loading: boolean
} {
  const [data, setData] = useState<IGymWithId[]>([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/gyms/get/`, {
        method: 'GET',
      }).catch((error) => {
        setError(error.message)
        return []
      })
      setData(response.gyms)
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, error, loading }
}

function useFetchImages(id: string | null) {
  const [data, setData] = useState<CloudinaryImage[]>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/gyms/fetch-images/${id}`, {
        method: 'GET',
      }).catch((error) => {
        setError(error.message)
        return []
      })

      const photos = response.map((image: CloudinaryImage) => {
        return {
          url: image.secure_url,
          alt: image.display_name,
        }
      })

      setData(photos)
      setLoading(false)
    }

    fetchData()
  }, [])

  return { data, error, loading }
}

export { useGymSearch, useGetGym, useReadAll, useFetchImages }
