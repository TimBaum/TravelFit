import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar' //could potentially be used for the user's image
import { PersonIcon } from '@radix-ui/react-icons'
import '@/index.css'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/provider/AuthProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn('relative z-10 flex flex-1 items-center', className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className,
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  `cursor-pointer group inline-flex h-10 w-max items-center rounded-md px-4 py-2 underline-offset-4
  text-md font-medium transition-colors
  hover:text-accent-foreground hover:text-emerald-600 hover:underline
  focus:bg-accent focus:text-accent-foreground focus:outline-none 
  disabled:pointer-events-none disabled:opacity-50 
  data-[active]:bg-accent/50 data-[state=open]:bg-accent/50`,
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ',
      className,
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

function NavigationMenuManager({ className }: { className: string }) {
  // We display different menu items based on the user's role

  const navigate = useNavigate()

  const { user, hasActiveSubscription, logout, getAccountType } = useAuth()

  const accountType = getAccountType()

  console.log('User has active subscription: ', hasActiveSubscription)
  console.log('AccountType is: ', accountType)

  function navigateToAccount() {
    console.log('Navigating to change gym account')
    if (accountType === 'USER') {
      console.log('User???????????')
      navigate('/change-user-account')
    } else if (accountType === 'GYM_USER') {
      navigate('/change-gym-account')
    }
  }

  return (
    <NavigationMenu
      className={`navigationmenu w-full text-black ${className} flex align-center w-full justify-center gap-8 shadow-emerald-10 sticky top-0 z-50 bg-white shadow shadow-emerald-500`}
      style={{ boxShadow: '-.5px .25px 0 #059669' }}
    >
      <div className="grow basis-0 flex justify-start ml-6">
        <NavigationMenuList>
          <NavigationMenuLink
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img src="/src/assets/TravelFitIcon.svg" className="w-8 h-8 " />
            <div className="text-xl font-bold">TravelFit</div>
          </NavigationMenuLink>
        </NavigationMenuList>
      </div>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            onClick={() => navigate('/')}
          >
            Find gyms
          </NavigationMenuLink>
        </NavigationMenuItem>
        {user && accountType === 'USER' && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              onClick={() => navigate('/favourites')}
            >
              Favourites
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {accountType === 'GYM_USER' && (
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              onClick={() => navigate('/my-gyms')}
            >
              My gyms
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
      <div className="grow basis-0 flex justify-end mr-6">
        <NavigationMenuList>
          {accountType === 'NOT_LOGGED_IN' && (
            <div className="flex gap-2">
              <Button
                variant={'outline'}
                className=""
                onClick={() => navigate('/create-gym-account')}
              >
                Become a partner
              </Button>
              <Button className="bg-black" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button
                className="bg-black"
                onClick={() => navigate('/create-user-account')}
              >
                Signup
              </Button>
            </div>
          )}
          {accountType !== 'NOT_LOGGED_IN' && (
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <PersonIcon className="h-6 w-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                  <DropdownMenuLabel>
                    <h1 className="text-xl font-bold">My Account</h1>
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigateToAccount()}
                    >
                      Manage your account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => logout()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}

export { NavigationMenuManager }
