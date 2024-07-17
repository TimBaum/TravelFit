import { PublicGymAccount } from '@models/gymAccount'
import { useEffect, useState } from 'react'
import { fetchJSON } from './utils'

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
      setError(null)
      const response = await fetchJSON(`/gymAccounts/get`, {
        method: 'GET',
      }).catch((error) => {
        setError(error.message)
        return []
      })

      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [id])

  return { data, error, loading }
}

export { useReadGymAccount }
