"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
  IconSettings,
} from "@tabler/icons-react"

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

export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group relative overflow-hidden rounded-md p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-medium bg-muted/20 backdrop-blur-sm border border-border/40 data-[state=open]:bg-muted data-[state=open]:text-foreground animate-fade-in"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="relative">
                  <Avatar className="h-10 w-10 rounded-md shadow-soft ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                    <AvatarImage
                      src={user.avatar && user.avatar !== '/avatars/user.jpg' ? user.avatar : undefined}
                      alt={user.name}
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md bg-primary text-primary-foreground font-semibold">
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                </div>
                
                <div className="grid flex-1 text-left leading-tight min-w-0">
                  <span className="truncate font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                
                <IconDotsVertical className="ml-auto size-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
              </div>
              
              {/* Hover shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-md shadow-medium border-border/40"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 bg-muted/20 rounded-t-md">
                <Avatar className="h-10 w-10 rounded-md shadow-soft">
                  <AvatarImage
                    src={user.avatar && user.avatar !== '/avatars/user.jpg' ? user.avatar : undefined}
                    alt={user.name}
                    className="rounded-md"
                  />
                  <AvatarFallback className="rounded-md bg-primary text-primary-foreground font-semibold">
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-foreground">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-border/30" />
            
            <div className="p-1">
              <DropdownMenuGroup>
                <DropdownMenuItem className="rounded-md cursor-pointer transition-all duration-200 hover:bg-muted/60">
                  <IconUserCircle className="text-primary" />
                  <span className="font-medium">Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md cursor-pointer transition-all duration-200 hover:bg-muted/60">
                  <IconSettings className="text-medium-gray" />
                  <span className="font-medium">Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md cursor-pointer transition-all duration-200 hover:bg-muted/60">
                  <IconNotification className="text-medium-gray" />
                  <span className="font-medium">Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md cursor-pointer transition-all duration-200 hover:bg-muted/60">
                  <IconCreditCard className="text-green-600" />
                  <span className="font-medium">Billing</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator className="bg-border/30 my-2" />
              
              <DropdownMenuItem className="rounded-md cursor-pointer transition-all duration-200 hover:bg-destructive/10 text-destructive focus:text-destructive">
                <IconLogout />
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
