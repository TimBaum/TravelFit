import { PublicGymAccount } from '@models/gymAccount'
import { useEffect, useState } from 'react'
import { fetchJSON } from './utils'
import { useAuth } from '@/provider/AuthProvider'
import { useNavigate } from 'react-router-dom'

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

      setData(response)
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
        'useUpdateGymAccount was called and returned the response ',
        response,
      )
      console.log('Gym account changed successfully:', response)
      setData(response)
      setLoading(false)
    }

    updateData()
  }, [id])

  return { data, error, loading }
}

function useDeleteGymAccount(): GymAccount {
  const { logout } = useAuth()
  const [data, setData] = useState<PublicGymAccount>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const id = useAuth().user?._id

  async function fetchData() {
    if (!id) {
      console.log('gym account can not be deleted as id was not there')
      return
    }
    setLoading(true)
    setError(null)
    const response = await fetchJSON(`/gymAccounts/delete/${id}`, {
      method: 'DELETE',
    }).catch((error) => {
      setError(error.message)
      return []
    })

    console.log(
      'useDeleteGymAccount was called and returned the response ',
      response,
    )

    setData(response)
    setLoading(false)
    logout()
  }

  fetchData()

  return { data, error, loading }
}

export { useReadGymAccount, useUpdateGymAccount, useDeleteGymAccount }
