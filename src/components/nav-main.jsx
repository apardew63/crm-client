"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1 px-2">
        <SidebarMenu>
          {items.map((item, index) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + '/');
            
            return (
              <React.Fragment key={item.title}>
                <SidebarMenuItem 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    asChild
                    className={`
                      group relative overflow-hidden rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-soft
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-medium'
                        : 'hover:bg-muted/60 hover:text-foreground'
                      }
                    `}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                      {item.icon && (
                        <div className={`
                          flex items-center justify-center w-5 h-5 transition-all duration-300
                          ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                        `}>
                          <item.icon className="w-5 h-5" />
                        </div>
                      )}
                      <span className={`
                        font-medium transition-all duration-300 text-sm
                        ${isActive ? 'text-primary-foreground' : 'text-foreground'}
                      `}>
                        {item.title}
                      </span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground/90 animate-pulse" />
                      )}
                      
                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </React.Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
