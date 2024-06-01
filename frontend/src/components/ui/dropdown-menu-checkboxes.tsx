import React from "react"
import '@/styles/GymAccountForm.css'
import '@/styles/DropdownMenuCheckboxes.css'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function DropdownMenuCheckboxes() {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)
   
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
            className="dropdown-menu-checkbox-item"
          >
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showActivityBar}
            onCheckedChange={setShowActivityBar}
            disabled
            className="dropdown-menu-checkbox-item"
          >
            Activity Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showPanel}
            onCheckedChange={setShowPanel}
            className="dropdown-menu-checkbox-item"
          >
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }