import { config } from '@/config'
import { PublicUser } from '@models/user'

export async function login(email: string, password: string) {
  const res = await fetch(`${config.BACKEND_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  // Store token in local storage
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(decodeToken(data.token)))
}

export function getUser(): PublicUser | null {
  return JSON.parse(localStorage.getItem('user') || 'null')
}

function decodeToken(token: string) {
  const [, payload] = token.split('.')
  const decoded = atob(payload)
  return JSON.parse(decoded)
}
