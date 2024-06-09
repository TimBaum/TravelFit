import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GymSearch from './pages/GymSearch'
import GymSearchResults from './pages/GymSearchResults'
import MyGyms from './pages/MyGyms'
import CreateGymAccount from './pages/CreateGymAccount'
import CreateUserAccount from './pages/CreateUserAccount'
import ManageUserAccount from './pages/ManageUserAccount'
import AddGym from './pages/AddGym'
import Layout from './components/Layout'
import '../app/globals.css'
import GymOverview from './pages/GymOverview'
import DeleteUserAccounts from './pages/DeleteUserAccounts'

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
            />{' '}
            <Route
              path="/manage-user-account/"
              element={<ManageUserAccount />}
            />
            <Route
              path="/delete-user-accounts/"
              element={<DeleteUserAccounts />}
            />
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
