import { Outlet, useNavigate } from 'react-router-dom'
import { NavigationMenuManager } from './ui/navigation-menu'
import { Separator } from './ui/separator'
import { useAuth } from '@/provider/AuthProvider'

function Layout() {
  return (
    <div>
      <NavigationMenuManager className="w-full mb-10" />
      <Main />
      <Footer />
    </div>
  )
}

function Main() {
  return (
    <main className="flex">
      <Advertisement />

      <div className="w-3/5" style={{ minHeight: '60vh' }}>
        <Outlet />
      </div>

      <Advertisement />
    </main>
  )
}

function Advertisement() {
  const { hasActiveSubscription, getAccountType } = useAuth()

  const showAds = !hasActiveSubscription && getAccountType() !== 'GYM_USER'

  return (
    <div className="flex-1 px-6 w-full pb-10">
      {showAds && (
        <img
          className="sticky top-20 w-full"
          src="/src/assets/placeholder_ad.svg"
          alt="Advertisement"
        />
      )}
    </div>
  )
}

//TODO: Implement footer
function Footer() {
  const navigate = useNavigate()

  return (
    <main className="bg-secondary px-6 pt-10 mt-10 pb-4">
      <div className="mb-12 flex justify-evenly">
        <div className="flex gap-2 items-center">
          <img src="/src/assets/TravelFitIcon.svg" className="w-20 h-20 " />
          <div className="text-6xl font-medium">TravelFit</div>
        </div>
        <Separator orientation="vertical" className="flex h-auto" />
        <div className="flex gap-8">
          <div className="flex flex-col">
            <div className="font-bold">Contact</div>
            <a href="tel:+4917643440297">Call us</a>
            <a href="mailto: contact@travelfit.com">Email us</a>
            <a href="https://www.instagram.com/leonie_popk/">Instagram</a>
          </div>
          <div className="flex flex-col">
            <div className="font-bold">Users</div>
            <a className="cursor-pointer" onClick={() => navigate('/')}>
              Find gyms
            </a>
            <a
              className="cursor-pointer"
              onClick={() => navigate('/favourites')}
            >
              Favorites
            </a>
            <a
              className="cursor-pointer"
              onClick={() => navigate('/change-user-account')}
            >
              Your profile
            </a>
          </div>
          <div className="flex flex-col">
            <div className="font-bold">Business partners</div>
            <a className="cursor-pointer" onClick={() => navigate('/my-gyms')}>
              My gyms
            </a>
            <a
              className="cursor-pointer"
              onClick={() => navigate('/favourites')}
            >
              Favorites
            </a>
            <a
              className="cursor-pointer"
              onClick={() => navigate('/change-user-account')}
            >
              Your profile
            </a>
          </div>
        </div>
      </div>
      <div className="text-sm">
        © 2024 TravelFit. All rights reserved. Google AdSense may earn a
        portion of sales from products that are purchased through our site as
        part of our Partnerships with retailers. The material on this site may
        not be reproduced, distributed, transmitted, cached or otherwise used,
        except with the prior written permission of TravelFit.
      </div>
    </main>
  )
}

export default Layout
