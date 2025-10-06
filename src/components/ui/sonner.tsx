"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      expand={true}
      richColors
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-300",
          success: "group-[.toaster]:bg-green-900/90 group-[.toaster]:border-green-500/20",
          error: "group-[.toaster]:bg-red-900/90 group-[.toaster]:border-red-500/20",
          info: "group-[.toaster]:bg-blue-900/90 group-[.toaster]:border-blue-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
