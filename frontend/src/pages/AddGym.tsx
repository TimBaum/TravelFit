import React from 'react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import '../styles/AddGym.css'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
const AddGym: React.FC = () => {
  return (
    <>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-gyms">My Gyms</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/add-gym">Add Gym</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="container">
        <h1 className="title">Add Gym</h1>
        <div>
          <Button variant="outline">+ add pictures</Button>
        </div>
        <div>
          <label>Name</label>
          <Input placeholder="Your gym name" />
        </div>
        <div>
          <label>URL</label>
          <Input placeholder="https://your-gym.de" />
        </div>
        <div>
          <label>Highlights</label>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Type to search</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Highlight 1</DropdownMenuItem>
                <DropdownMenuItem>Highlight 2</DropdownMenuItem>
                <DropdownMenuItem>Highlight 3</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Highlight 4</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>{' '}
          </div>
        </div>
        <div>
          <label>Address</label>
          <Input placeholder="Type to search" />
        </div>
        <div>
          <label>Offers</label>
          <div>
            <Button variant="outline">+</Button>
          </div>
        </div>
        <div>
          <label>Special offers</label>
          <Input placeholder="" />
          <Button variant="outline">+</Button>
        </div>
        <div className="save-button">
          <Button variant="outline">Save and publish</Button>
        </div>
      </div>
    </>
  )
}
export default AddGym
