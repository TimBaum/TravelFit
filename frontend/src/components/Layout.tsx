import { Outlet } from 'react-router-dom'
import { NavigationMenuManager } from './ui/navigation-menu'

function Layout() {
  return (
    <div>
      <NavigationMenuManager className="w-full" />
      <Main />
      <Footer />
    </div>
  )
}

function Main() {
  return (
    <main className="flex">
      <div className="flex-1"></div>
      <div className="w-2/3">
        <Outlet />
      </div>
      <div className="flex-1"></div>
    </main>
  )
}

function Footer() {
  return <main>{/* <p>Footer</p> */}</main>
}

export default Layout
