import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GymSearch from './pages/GymSearch'
import GymSearchResults from './pages/GymSearchResults'
import MyGyms from './pages/MyGyms'
import CreateGymAccount from './pages/CreateGymAccount'
import CreateUserAccount from './pages/CreateUserAccount'
import ChangeUserAccount from './pages/ChangeUserAccount'
import AddGym from './pages/AddGym'
import Layout from './components/Layout'
import '../app/globals.css'
import GymOverview from './pages/GymOverview'
import DeleteUserAccounts from './pages/DeleteUserAccounts'
import Login from './pages/Login'
import DeleteGymAccounts from './pages/DeleteGymAccounts'

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<GymSearch />} />
            <Route path="/find-gyms/" element={<GymSearchResults />} />
            {/* TODO: exemplary routes, should be changed */}
            <Route path="/my-gyms/" element={<MyGyms />} />
            <Route path="/create-gym-account/" element={<CreateGymAccount />} />
            <Route
              path="/create-user-account/"
              element={<CreateUserAccount />}
            />
            <Route path="login" element={<Login />} />
            <Route
              path="/change-user-account/"
              element={<ChangeUserAccount />}
            />
            <Route
              path="/delete-gym-accounts/"
              element={<DeleteGymAccounts />}
            />
            {/* DeleteGymAccounts is a page for us for testing that the gym account deletion works. This option has to be removed in the final app. */}
            <Route
              path="/delete-user-accounts/"
              element={<DeleteUserAccounts />}
            />
            {/* DeleteUserAccounts is a page for us for testing that the user account deletion works. This option has to be removed in the final app. */}
            <Route path="/add-gym/" element={<AddGym />} />
            <Route path="/gymoverview" element={<GymOverview />} />
            {/* <Route path="*" element={<NoPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
