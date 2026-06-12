"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconDashboard,
  IconFileDescription,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { ShiftMark } from "@/components/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_MAIN = [
  { title: "Overview", url: "/dashboard", icon: IconDashboard },
  { title: "Taxes", url: "/dashboard/taxes", icon: IconFileDescription },
  { title: "Ask AI", url: "/dashboard/ask", icon: IconSparkles },
]

const NAV_SECONDARY = [
  { title: "Settings", url: "/dashboard/settings", icon: IconSettings },
]

export function AppSidebar({
  user,
  onLogout,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string }
  onLogout: () => void
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              render={<Link href="/dashboard" />}
            >
              <span className="flex items-center">
                <ShiftMark className="!h-8 !w-auto" />
              </span>
              <span className="text-xl font-bold font-space-grotesk tracking-tight">
                Stub
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN} />
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_SECONDARY.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    render={<Link href={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
