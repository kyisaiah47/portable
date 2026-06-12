"use client"

import { usePathname } from "next/navigation"
import { Upload } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const TITLES: Record<string, string> = {
  "/dashboard": "Home",
  "/dashboard/income": "Income",
  "/dashboard/expenses": "Expenses",
  "/dashboard/taxes": "Taxes",
  "/dashboard/mileage": "Mileage",
  "/dashboard/insights": "AI Insights",
  "/dashboard/learn": "Learn",
  "/dashboard/settings": "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = TITLES[pathname] ?? "Dashboard"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("stub:upload"))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload CSV
          </button>
        </div>
      </div>
    </header>
  )
}
