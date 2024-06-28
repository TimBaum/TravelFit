import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/provider/AuthProvider'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const { login } = useAuth()

  function makeLogin() {
    setIsLoading(true)
    login(email, password)
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setError(err.message)
        toast.error(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div>
      <h1 className="text-5xl font-bold mb-6 text-center">Login</h1>
      <div className="flex w-full justify-between gap-8">
        <div className="border border-dashed rounded p-10 pt-4 flex flex-col gap-4 w-full border-primary">
          <img src="src/assets/illustrations/RollerbladeDoodle.svg" />
          <div className="font-bold">Stay healthy during your travels</div>
          <div>Find suitable gyms for your destination</div>
          <div>Easily compare gyms </div>
          <div>Get special offers</div>
        </div>
        <div
          className="w-full flex flex-col justify-between"
          onKeyDown={(event) => (event.key === 'Enter' ? makeLogin() : null)}
        >
          {/* TODO: make fields nice */}
          <div>
            <Label>Email</Label>
            <Input
              className="mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label>Password</Label>
            <Input
              className="mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <Button
              className={`w-full `}
              variant={isLoading ? 'loading' : 'default'}
              onClick={makeLogin}
            >
              Login
            </Button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <i>Don't have an account?</i>
              <Button
                variant={'outline'}
                onClick={() => navigate('/create-user-account')}
              >
                Signup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
