import { config } from '@/config'

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
}
