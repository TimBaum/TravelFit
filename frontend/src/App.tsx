import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GymSearch from './pages/GymSearch'
import MyGyms from './pages/MyGyms'
import CreateGymAccount from './pages/CreateGymAccount'
import CreateUserAccount from './pages/CreateUserAccount'
import AddGym from './pages/AddGym'
import Layout from './components/Layout'
import '../app/globals.css'

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<GymSearch />} />
            {/* TODO: exemplary routes, should be changed */}
            <Route path="/my-gyms/" element={<MyGyms />} />
            <Route path="/create-gym-account/" element={<CreateGymAccount />} />
            <Route
              path="/create-user-account/"
              element={<CreateUserAccount />}
            />
            <Route path="/add-gym/" element={<AddGym />} />
            {/* <Route path="*" element={<NoPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
