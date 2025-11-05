"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function DashboardLayout({ children }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 85)",
          "--header-height": "calc(var(--spacing) * 20)"
        }
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col min-h-0">
          <div className="@container/main flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-background via-background to-muted/20 animate-fade-in">
            <div className="max-w-8xl mx-auto w-full space-y-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}