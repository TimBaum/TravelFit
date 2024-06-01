import React from 'react'
import ReactDOM from 'react-dom/client'
import MyGyms from './pages/MyGyms.tsx'
import AddGym from './pages/AddGym.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MyGyms />
    <AddGym />
  </React.StrictMode>,
)
