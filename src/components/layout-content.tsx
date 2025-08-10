"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/ui/sidebar"
import Header from "@/components/Header"

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // Start expanded on desktop
  const [sidebarOpen, setSidebarOpen] = useState(false) // For overlay behavior on mobile/tablet
  const [isClient, setIsClient] = useState(false)

  // Check screen size and set mobile/tablet states
  useEffect(() => {
    setIsClient(true)
    
    // Debounce function to limit resize event calls
    let timeoutId: NodeJS.Timeout
    const debouncedCheckScreenSize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const width = window.innerWidth
        const mobile = width < 768 // Mobile: < 768px
        const tablet = width >= 768 && width < 1024 // Tablet: 768px - 1023px
        
        // Only update if values actually changed
        setIsMobile(prev => prev !== mobile ? mobile : prev)
        setIsTablet(prev => prev !== tablet ? tablet : prev)
        
        // Close sidebar overlay when switching to desktop
        if (width >= 1024) {
          setSidebarOpen(false)
        }
      }, 150) // 150ms debounce
    }
    
    // Initial check
    debouncedCheckScreenSize()
    
    window.addEventListener('resize', debouncedCheckScreenSize)
    return () => {
      window.removeEventListener('resize', debouncedCheckScreenSize)
      clearTimeout(timeoutId)
    }
  }, [])

  // Close sidebar overlay when route changes on mobile/tablet
  useEffect(() => {
    if ((isMobile || isTablet) && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile, isTablet, sidebarOpen])

  // Don't render until we know the screen size
  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
  }

  // Hide sidebar on login and change password pages
  const isLoginPage = pathname === "/"
  const isChangePasswordPage = pathname === "/changepassword"
  const isForgotPassword = pathname === "/forgotpassword"
  const isResetPassword = pathname === "/resetpassword"

  if (isLoginPage || isChangePasswordPage || isForgotPassword || isResetPassword) {
    // Render without sidebar for login or change password pages
    return <div className="min-h-screen">{children}</div>
  }

  const isDesktop = !isMobile && !isTablet
  const shouldUseOverlay = isMobile || isTablet

  // Handle menu click based on screen size
  const handleMenuClick = () => {

    console.log(sidebarOpen)
    if (shouldUseOverlay) {
      // Mobile/Tablet: Toggle overlay
      setSidebarOpen(!sidebarOpen)
    } else {
      // Desktop: Toggle collapse/expand
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  // Close overlay
  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Render with sidebar and header for all other pages
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Desktop Sidebar - Always visible, can collapse */}
      {isDesktop && (
        <div className="relative">
          <div className={`h-full transition-all duration-300 ${
            sidebarCollapsed 
              ? 'w-16' 
              : 'w-64'
          }`}>
            <Sidebar 
              isOpen={true}
              onClose={() => {}}
              isMobile={false}
              isCollapsed={sidebarCollapsed}
              onMenuClick={handleMenuClick}
              isOverlay={false}
            />
          </div>
        </div>
      )}

      {/* Mobile/Tablet Sidebar - Overlay */}
      {shouldUseOverlay && (
        <>
          {/* Sidebar Overlay */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-300 ease-in-out
          `}>
            <Sidebar 
              isOpen={sidebarOpen}
              onClose={closeSidebar}
              isMobile={shouldUseOverlay}
              isCollapsed={false}
              onMenuClick={handleMenuClick}
              isOverlay={true}
            />
          </div>

          {/* Backdrop Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeSidebar}
            />
          )}
        </>
      )}

      {/* Fixed Header */}
      <Header 
        onMenuClick={handleMenuClick}
        isMobile={isMobile}
        isTablet={isTablet}
        sidebarCollapsed={isDesktop ? sidebarCollapsed : false}
        sidebarOpen={shouldUseOverlay ? sidebarOpen : false}
      />

      {/* Main content */}
      <main className={`flex-1 flex flex-col overflow-hidden pt-16 lg:pt-20 ${
        shouldUseOverlay ? 'w-full' : ''
      }`}>
        {/* Content area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Subtle animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.02),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.02),transparent_50%)] pointer-events-none" />

          {/* Content wrapper */}
          <div className="relative z-10 p-4 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
