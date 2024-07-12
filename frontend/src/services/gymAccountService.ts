import { config } from '@/config'
import { PublicGymAccount } from '@models/gymAccount'
import { useEffect, useState } from 'react'

interface GymAccount {
  data: PublicGymAccount | undefined
  loading: boolean
  error: string | null
}

function useReadGymAccount(id: string | null): GymAccount {
  const [data, setData] = useState<PublicGymAccount>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      setLoading(true)
      const response = await fetch(
        `${config.BACKEND_URL}/gymAccounts/get/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
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

function useUpdateGymAccount(
  id: string | null,
  newGymData: string,
): GymAccount {
  const [data, setData] = useState<PublicGymAccount>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function updateData() {
      if (!id) return
      setLoading(true)
      const response = await fetch(
        `${config.BACKEND_URL}/gymAccounts/update/${id}`,
        {
          method: 'PATCH',
          body: newGymData,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((response) => response.json())
        .catch((error) => {
          setError(error)
        })
      setData(response)
      setLoading(false)
    }

    updateData()
  }, [id])

  return { data, error, loading }
}

export { useReadGymAccount, useUpdateGymAccount }
