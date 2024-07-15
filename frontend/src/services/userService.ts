import { PublicUser } from '@models/user'
import { useEffect, useState } from 'react'
import { fetchJSON } from './utils'

interface User {
  data: PublicUser | undefined
  loading: boolean
  error: string | null
}

function useReadUser(id: string | null): User {
  const [data, setData] = useState<PublicUser>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/users/get/${id}`, {
        method: 'GET',
      }).catch((error) => {
        setError(error.message)
        return []
      })

      console.log(
        'userReadUser was called and returned the response ',
        response,
      )

      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [id])

  return { data, error, loading }
}

export { useReadUser }
