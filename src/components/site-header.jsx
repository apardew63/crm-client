"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User } from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"

export function SiteHeader() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 shadow-soft">
      <div className="flex w-full items-center gap-1 px-6 lg:gap-3 lg:px-8">
        <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors duration-200" />
        <Separator orientation="vertical" className="mx-3 data-[orientation=vertical]:h-5 opacity-50" />
        
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <h1 className="text-lg font-semibold tracking-tight text-primary">
            Infinitum CRM
          </h1>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <NotificationBell />
          
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border transition-all duration-200 hover:bg-muted">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-xs">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="hidden sm:block">
                  <div className="font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {user.role?.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:flex hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
