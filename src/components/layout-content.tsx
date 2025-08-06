"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()

  // Hide sidebar on login and change password pages
  const isLoginPage = pathname === "/"
  const isChangePasswordPage = pathname === "/changepassword"
  const isForgotPassword = pathname === "/forgotpassword"
    const isResetPassword = pathname === "/resetpassword"

  if (isLoginPage || isChangePasswordPage || isForgotPassword || isResetPassword) {
    // Render without sidebar for login or change password pages
    return <div className="min-h-screen">{children}</div>
  }

  // Render with sidebar for all other pages
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.02),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.02),transparent_50%)] pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative z-10 lg:ml-64 xl:ml-72 min-h-screen">
          <div className="p-4 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
