"use client"

import * as React from "react"
import logo from "../../public/logo.svg"

import {
  IconDashboard,
  IconUsers,
  IconFileText,
  IconCalendar,
  IconPhone,
  IconAward,
  IconSettings,
  IconHelp,
  IconSearch,
  IconChartBar,
  IconUserCheck,
  IconBuilding,
  IconBriefcase,
  IconClock,
  IconBell
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

// Role-based navigation configuration
const getNavigationData = (user) => {
  const baseNav = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    }
  ];

  const adminNav = [
    {
      title: "Employee Management",
      url: "/employees",
      icon: IconUsers,
    },
    {
      title: "Task Management",
      url: "/tasks",
      icon: IconFileText,
    },
    {
      title: "Project Management",
      url: "/projects",
      icon: IconBriefcase,
    },
    {
      title: "Attendance Management",
      url: "/attendance",
      icon: IconClock,
    },
    {
      title: "Performance",
      url: "/performance",
      icon: IconAward,
    },
    {
      title: "Announcements",
      url: "/announcements",
      icon: IconBell,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: IconChartBar,
    }
  ];

  const salesNav = [
    {
      title: "Sales Calls",
      url: "/sales/calls",
      icon: IconPhone,
    },
    {
      title: "Leads",
      url: "/sales/leads",
      icon: IconUserCheck,
    },
    {
      title: "Sales Reports",
      url: "/sales/reports",
      icon: IconChartBar,
    }
  ];

  const employeeNav = [
    {
      title: "My Tasks",
      url: "/tasks",
      icon: IconFileText,
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: IconClock,
    },
    {
      title: "Time Tracking",
      url: "/time-tracking",
      icon: IconClock,
    }
  ];

  const commonNav = [
    {
      title: "Profile",
      url: "/profile",
      icon: IconUserCheck,
    }
  ];

  let navMain = [...baseNav];

  // Add role-specific navigation
  if (user?.role === 'admin') {
    navMain = [...navMain, ...adminNav];
  } else if (user?.role === 'project_manager' || (user?.role === 'employee' && user?.designation === 'project_manager')) {
    // Project managers get admin nav but with attendance upload instead of management
    const projectManagerNav = adminNav.map(item => {
      if (item.title === 'Attendance Management') {
        return { ...item, title: 'Attendance Upload', url: '/attendance/upload' };
      }
      return item;
    });
    navMain = [...navMain, ...projectManagerNav];
  } else if (user?.designation === 'sales') {
    navMain = [...navMain, ...salesNav];
  } else {
    navMain = [...navMain, ...employeeNav];
  }

  // Add common navigation
  navMain = [...navMain, ...commonNav];

  return {
    user: {
      name: user?.firstName + ' ' + user?.lastName || "User",
      email: user?.email || "",
      avatar: user?.avatar || undefined,
    },
    navMain,
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: IconSettings,
      },
      {
        title: "Help",
        url: "/help",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "/search",
        icon: IconSearch,
      },
    ],
    documents: []
  };
};

export function AppSidebar({
  ...props
}) {
  const { user } = useAuth();

  // Get role-based navigation data
  const data = getNavigationData(user);

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-border/30 bg-[#2d2d2d] shadow-soft"
      {...props}
    >
      <SidebarHeader className="border-b border-border/20 bg-[#2d2d2d] backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              asChild
              className="group relative overflow-hidden rounded-xl p-3 hover:bg-accent/30 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-earth-brown shadow-medium group-hover:shadow-soft transition-all duration-300">
                  <Image 
                    src={logo} 
                    alt="Infinitum CRM" 
                    className="w-8 h-8 filter brightness-0 invert"
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-bold text-lg bg-gradient-to-r from-primary to-earth-brown bg-clip-text text-transparent">
                    Infinitum
                  </span>
                  <span className="truncate text-xs text-muted-foreground font-medium">
                    CRM System
                  </span>
                </div>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4 space-y-4 bg-[#2d2d2d]">
        <NavMain items={data.navMain} />
        <div className="px-3">
          <div className="h-px bg-[#2d2d2d]" />
        </div>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/20 bg-[#2d2d2d] backdrop-blur-sm p-3">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
