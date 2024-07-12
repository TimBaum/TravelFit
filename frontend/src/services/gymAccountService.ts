import { config } from '@/config'
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
      const response = await fetchJSON(`/gymAccounts/get/${id}`, {
        method: 'GET',
      }).catch((error) => {
        setError(error.message)
        return []
      })

      console.log(
        'userReadGymAccount was called and returned the response ',
        response,
      )
      const publicGymAccount = response

      setData(publicGymAccount)
      setLoading(false)
    }

    fetchData()
  }, [id])

  return { data, error, loading }
}

//TODO: fix this method
function useUpdateGymAccount(
  id: string | null,
  newGymAccountData: string,
): GymAccount {
  const [data, setData] = useState<PublicGymAccount>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function updateData() {
      if (!id) return
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/gymAccounts/update/${id}`, {
        method: 'PATCH',
        body: newGymAccountData,
      }).catch((error) => {
        setError(error.message)
        return []
      })

      console.log(
        'userUpdateGymAccount was called and returned the response ',
        response,
      )
      const publicGymAccount = response
      console.log('Gym account changed successfully:', publicGymAccount)
      setData(publicGymAccount)
      setLoading(false)
    }

    updateData()
  }, [id])

  return { data, error, loading }
}

export { useReadGymAccount, useUpdateGymAccount }
