"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useClerk, useUser, UserButton } from "@clerk/clerk-react"

export function NavUser() {
  const { isMobile } = useSidebar()

  // Clerk hooks
  const { user } = useUser()

  if (!user) {
    return null; // You can handle a loading state or redirect here
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
       
          
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
              <UserButton />
               
              </Avatar>
              
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.fullName}</span>
                <span className="truncate text-xs">{user.emailAddresses[0]?.emailAddress}</span>
              </div>
             
            </SidebarMenuButton>
          
         
      
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
