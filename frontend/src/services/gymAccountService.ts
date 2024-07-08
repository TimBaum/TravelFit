import { config } from '@/config'
import { IGymAccount } from '@models/gymAccount'
import { useEffect, useState } from 'react'

interface GymAccount {
  data: IGymAccount | undefined
  loading: boolean
  error: string | null
}

function useReadGymAccount(id: string | null): GymAccount {
  const [data, setData] = useState<IGymAccount>()
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

function useUpdateGymAccount(id: string | null): GymAccount {
  const [data, setData] = useState<IGymAccount>()
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
