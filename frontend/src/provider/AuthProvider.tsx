import { config } from '@/config'
import { fetchJSON } from '@/services/utils'
import { TokenPayload, AccountType } from '@models/token'
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: TokenPayload | null
  hasActiveSubscription: boolean | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkSubscriptionStatus: () => Promise<void>
  getAccountType: () => AccountType
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  hasActiveSubscription: false,
  login: async () => {},
  logout: () => {},
  checkSubscriptionStatus: async () => {},
  getAccountType: () => 'NOT_LOGGED_IN',
})

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TokenPayload | null>(
    localStorage.getItem('token')
      ? decodeToken(localStorage.getItem('token')!)
      : null,
  )

  const [hasActiveSubscription, setHasActiveSubscription] = useState<
    boolean | null
  >(false)

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

  useEffect(() => {
    if (!user) {
      setHasActiveSubscription(false)
      return
    } else if (user.accountType === 'USER') {
      checkSubscriptionStatus()
    } // 'displayName' exists in PublicUser but not in PublicGymAccount
    else {
      setHasActiveSubscription(false)
      return
    }
  }, [user])

  const navigate = useNavigate()

  function getAccountType(): AccountType {
    return user?.accountType ?? 'NOT_LOGGED_IN'
  }

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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasActiveSubscription,
        checkSubscriptionStatus,
        getAccountType,
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
