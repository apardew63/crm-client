"use client";
import * as React from "react"
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider px-3 mb-2">
        Quick Access
      </SidebarGroupLabel>
      <SidebarGroupContent className="px-2">
        <SidebarMenu>
          {items.map((item, index) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + '/');
            
            return (
              <SidebarMenuItem 
                key={item.title}
                className="animate-slide-up"
                style={{ animationDelay: `${(index + 5) * 0.05}s` }}
              >
                <SidebarMenuButton 
                  asChild
                  className={`
                    group relative overflow-hidden rounded-md transition-all duration-300 hover:scale-[1.02]
                    ${isActive
                      ? 'bg-muted text-foreground shadow-soft'
                      : 'hover:bg-muted/40 hover:text-foreground'
                    }
                  `}
                >
                  <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                    <div className={`
                      flex items-center justify-center w-4 h-4 transition-all duration-300
                      ${isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                    `}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className={`
                      text-sm font-medium transition-all duration-300
                      ${isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                    `}>
                      {item.title}
                    </span>
                    
                    {/* Hover shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
