import React from 'react'
import ReactDOM from 'react-dom/client'
import MyGyms from './pages/MyGyms.tsx'
import AddGym from './pages/AddGym.tsx'

import './index.css'
import CreateGymAccount from './pages/CreateGymAccount.tsx'
import CreateUserAccount from './pages/CreateUserAccount.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <CreateGymAccount />
  <CreateUserAccount />
  <MyGyms />
  <AddGym />
  </React.StrictMode>,
)