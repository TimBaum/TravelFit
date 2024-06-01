import React from 'react'
import ReactDOM from 'react-dom/client'
import MyGyms from './pages/MyGyms.tsx'
<<<<<<< HEAD
=======
import AddGym from './pages/AddGym.tsx'
>>>>>>> manage-gyms

import './index.css'
import CreateGymAccount from './pages/CreateGymAccount.tsx'
import CreateUserAccount from './pages/CreateUserAccount.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
<<<<<<< HEAD
  <CreateGymAccount />
  <CreateUserAccount />
  <MyGyms />
=======
    <MyGyms />
    <AddGym />
>>>>>>> manage-gyms
  </React.StrictMode>,
)