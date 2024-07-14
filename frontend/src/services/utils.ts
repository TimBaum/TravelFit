import { config } from '@/config'
import { toast } from 'sonner'

export async function fetchJSON(url: string, options?: RequestInit) {
  /* Token is send to the client with every request */
  const authToken = localStorage.getItem('token')

  const headers = new Headers()

  authToken ? headers.append('Authorization', `Bearer ${authToken}`) : ''
  headers.append('Content-Type', 'application/json')

  options = { ...options, headers }

  return fetch(`${config.BACKEND_URL}${url}`, options)
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      return res.json()
    })
    .then((data) => {
      if (data.error) {
        throw new Error(data.error)
      }
      return data
    })
    .catch((error) => {
      toast.error(`Error fetching data: ${error}`)
      throw error
    })
}
