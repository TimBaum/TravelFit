import React from 'react'
import ReactDOM from 'react-dom/client'
import MyGyms from './pages/MyGyms.tsx'
import { NavigationMenuUser } from './components/ui/navigation-menu.tsx'

import './index.css'
import CreateUserAccount from './pages/CreateUserAccount.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <CreateUserAccount />
  </React.StrictMode>,
)
