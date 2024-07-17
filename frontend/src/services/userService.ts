import { PublicUser } from '@models/user'
import { useEffect, useState } from 'react'
import { fetchJSON } from './utils'
import { AccountType } from '@models/token'

interface User {
  data: PublicUser | undefined
  loading: boolean
  error: string | null
}

//custom hook to allow functional components to hold and manage state
//to easily integrate user data fetching and state management related to a specific user
function useReadUser(id: string | null, accountType: AccountType): User {
  const [data, setData] = useState<PublicUser>() //holds the user information
  const [error, setError] = useState(null) //captures any errors that occured during the fetch process
  const [loading, setLoading] = useState(false) //indicates whether the data is being fetched

  useEffect(() => {
    async function fetchData() {
      if (!id || accountType !== 'USER') return
      setLoading(true)
      setError(null)
      const response = await fetchJSON(`/users/get/${id}`, {
        method: 'GET',
      }).catch((error) => {
        setError(error.message)
        return []
      })

      setData(response)
      setLoading(false)
    }

    fetchData()
  }, [id, accountType])

  return { data, error, loading }
}

export { useReadUser }
