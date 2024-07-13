import { config } from '@/config'
import { IUser, PublicUser } from '@models/user'
import { useEffect, useState } from 'react'

interface User {
  data: PublicUser | undefined
  loading: boolean
  error: string | null
}

//TODO: test if this works
function useReadUser(id: string | null): User {
  const [data, setData] = useState<PublicUser>()
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

//TODO: test if this works
function useUpdateUser(id: string | null, newUserData: string): User {
  const [data, setData] = useState<PublicUser>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      setLoading(true)
      const response = await fetch(`${config.BACKEND_URL}/users/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newUserData,
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

export { useReadUser, useUpdateUser }
