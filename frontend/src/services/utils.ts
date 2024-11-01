import { config } from '@/config'
import { toast } from 'sonner'

/**
 * fetchJSON is a wrapper for fetch that abstracts authorization, base url, error handling and JSON parsing
 * Could be extended by using typescript generics to return the correct type
 * @param url the url to fetch
 * @param options any fetch options
 * @returns the parsed response
 */
export async function fetchJSON(url: string, options?: RequestInit) {
  // Token is send to the client with every request
  const authToken = localStorage.getItem('token')

  const headers = new Headers()

  authToken ? headers.append('Authorization', `Bearer ${authToken}`) : ''
  headers.append('Content-Type', 'application/json')

  options = { ...options, headers }

  return (
    fetch(`${config.BACKEND_URL}${url}`, options)
      // async in required because await is used because res.json() returns a Promise
      // because the result body might not be fully received when res.json() is called
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message ? error.message : error.error)
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
  )
}
