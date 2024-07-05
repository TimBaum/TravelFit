import { config } from '@/config'
import { IGymAccount } from '@models/gymAccount'
import { IUser } from '@models/user'
import { useEffect, useState } from 'react'

interface User {
  data: IUser | undefined
  loading: boolean
  error: string | null
}

function useReadUser(id: string | null): User {
  const [data, setData] = useState<IUser>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      setLoading(true)
      const response = await fetch(`${config.BACKEND_URL}/users/get/${id}`, {
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

export { useReadUser }
