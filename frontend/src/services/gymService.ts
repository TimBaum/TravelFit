import { useEffect, useState } from 'react'
import { IGymWithId, IGymWithIdPopulated } from '@models/gym'
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
  data: IGymWithIdPopulated | undefined
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
  const [data, setData] = useState<IGymWithIdPopulated>()
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

function useGetGymsByIds(ids: string[] | undefined): {
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
      const response = await fetch(`${config.BACKEND_URL}/gyms/by-ids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      })
        .then((response) => response.json())
        .catch((error) => {
          setError(error.message)
          return []
        })
      setData(response.gyms)
      setLoading(false)
    }

    fetchData()
  }, [ids])

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

// Fetch all images from cloudinary for a gym (id)
function useFetchImages(prefix: string | undefined) {
  const [data, setData] = useState<CloudinaryImage[]>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      console.log('Prefix:', prefix)

      const response = await fetchJSON(`/gyms/fetch-images/${prefix}`, {
        method: 'GET',
      }).catch((error) => {
        setError(error.message)
        return []
      })

      const photos = response.resources.map((image: CloudinaryImage) => {
        return {
          url: image.secure_url,
          alt: image.display_name,
          public_id: image.public_id,
        }
      })

      setData(photos)
      setLoading(false)
    }

    fetchData()
  }, [prefix])

  return { data, error, loading }
}

const useDeleteImage = (public_id: string | null) => {
  const [data, setData] = useState()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/gyms/delete-image/${public_id}`, {
        method: 'DELETE',
      }).catch((error) => {
        setError(error.message)
        return []
      })

      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [public_id])

  return { data, error, loading }
}

export {
  useGymSearch,
  useGetGym,
  useReadAll,
  useFetchImages,
  useDeleteImage,
  useGetGymsByIds,
}
