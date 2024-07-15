import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'
import GymSearch from './pages/GymSearch'
import GymSearchResults from './pages/GymSearchResults'
import MyGyms from './pages/MyGyms'
import CreateGymAccount from './pages/CreateGymAccount'
import CreateUserAccount from './pages/CreateUserAccount'
import ChangeUserAccount from './pages/ChangeUserAccount'
import AddGym from './pages/AddGym'
import CreateGym from './pages/CreateGym'
import Layout from './components/Layout'
import '../app/globals.css'
import GymOverview from './pages/GymOverview'
import DeleteUserAccounts from './pages/DeleteUserAccounts'
import Login from './pages/Login'
import AuthProvider, { useAuth } from './provider/AuthProvider'
import { Toaster } from './components/ui/sonner'
import DeleteGymAccounts from './pages/DeleteGymAccounts'
import Favourites from './pages/Favourites'
import ChangeGymAccount from './pages/ChangeGymAccount'

/* is the root component that accesses all other components */

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route index element={<GymSearch />} />
              <Route path="/find-gyms/" element={<GymSearchResults />} />
              {/* TODO: exemplary routes, should be changed */}
              <Route path="/my-gyms/" element={<MyGyms />} />
              <Route
                path="/create-gym-account/"
                element={<CreateGymAccount />}
              />
              <Route
                path="/create-user-account/"
                element={<CreateUserAccount />}
              />
              <Route element={<PrivateRoute />}>
                <Route
                  path="/change-user-account/"
                  element={<ChangeUserAccount />}
                />
                <Route
                  path="/change-gym-account/"
                  element={<ChangeGymAccount />}
                />
              </Route>
              {/* add-gym is a sandbox page for outsourcing form problems */}
              <Route path="/add-gym/" element={<AddGym />} />

              <Route path="/create-gym/" element={<CreateGym />} />
              <Route path="/edit-gym/:id" element={<CreateGym />} />
              <Route path="/gyms/:id" element={<GymOverview />} />
              <Route path="/favourites" element={<Favourites />} />
              {/* <Route path="*" element={<NoPage />} /> */}
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

const PrivateRoute = () => {
  // If the user is not logged in, redirect to the login page
  // TODO: add functionality, which user type should see which page
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return <Outlet />
}

export default App
