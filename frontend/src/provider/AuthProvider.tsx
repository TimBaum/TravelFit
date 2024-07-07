import { config } from '@/config'
import { fetchJSON } from '@/services/utils'
import { PublicUser } from '@models/user'
import { PublicGymAccount } from '@models/gymAccount'
import { useContext, createContext, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: PublicUser | PublicGymAccount | null
  hasActiveSubscription: boolean | null
  accountType: 'GYM_USER' | 'USER' | 'NOT_LOGGED_IN'
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkSubscriptionStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  hasActiveSubscription: false,
  accountType: 'NOT_LOGGED_IN',
  login: async () => {},
  logout: () => {},
  checkSubscriptionStatus: async () => {},
})

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PublicUser | PublicGymAccount | null>(
    localStorage.getItem('token')
      ? decodeToken(localStorage.getItem('token')!)
      : null,
  )

  const [hasActiveSubscription, setHasActiveSubscription] = useState<
    boolean | null
  >(null)

  let accountType: 'GYM_USER' | 'USER' | 'NOT_LOGGED_IN'

  //TODO: this returns accountType 'USER' for 'GYM_ACCOUNTS' -> fix this
  if (!user) {
    accountType = 'NOT_LOGGED_IN'
  } else if ('displayName' in user) {
    accountType = 'USER'
  } // 'displayName' exists in PublicUser but not in PublicGymAccount
  else {
    accountType = 'GYM_USER'
  }

  checkSubscriptionStatus()

  const navigate = useNavigate()

  async function login(email: string, password: string) {
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
    const decodedToken = decodeToken(data.token)
    setUser(decodedToken)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  async function checkSubscriptionStatus() {
    return fetchJSON('/subscriptions/active')
      .then((data) => {
        setHasActiveSubscription(data.hasPremiumSubscription)
      })
      .catch((error) => {
        console.error('Failed to check subscription status:', error)
        setHasActiveSubscription(false)
      })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accountType,
        login,
        logout,
        hasActiveSubscription,
        checkSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext)
}

function decodeToken(token: string) {
  const [, payload] = token.split('.')
  const decoded = atob(payload)
  return JSON.parse(decoded)
}
