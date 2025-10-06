"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900 group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-400",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-slate-800 group-[.toast]:text-slate-300",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
