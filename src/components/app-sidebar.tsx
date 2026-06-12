"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconCar,
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconReceipt2,
  IconSettings,
  IconSparkles,
  IconBook2,
  IconFlask,
  type Icon,
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
  { title: "Home", url: "/dashboard", icon: IconDashboard },
  { title: "Income", url: "/dashboard/income", icon: IconChartBar },
  { title: "Expenses", url: "/dashboard/expenses", icon: IconReceipt2 },
  { title: "Taxes", url: "/dashboard/taxes", icon: IconFileDescription },
  { title: "Mileage", url: "/dashboard/mileage", icon: IconCar },
]

const NAV_WORKSPACE: { title: string; url: string; icon: Icon }[] = [
  { title: "AI Insights", url: "/dashboard/insights", icon: IconSparkles },
  { title: "Learn", url: "/dashboard/learn", icon: IconBook2 },
  { title: "Demo", url: "/demo", icon: IconFlask },
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
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <ShiftMark className="h-5 w-auto" />
                <span className="text-base font-bold font-space-grotesk tracking-tight">
                  stub
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN} />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_WORKSPACE.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_SECONDARY.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
