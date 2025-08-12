'use client';

import { useState, useEffect } from "react";

import Sidebar from "./ui/sidebar";
import AuthGuard from "@/lib/AuthGuard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-900">
      {/* Sidebar - responsive positioning */}
      <div className={`
        ${isMobile 
          ? 'fixed inset-y-0 left-0 z-50 w-64' 
          : 'sticky top-0 h-screen w-64'
        }
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main content area */}
      <main className={`
        flex-1 min-w-0
        ${!isMobile ? 'ml-0' : ''}
        transition-all duration-300
      `}>
        {/* Background layers */}
        <div className="relative min-h-screen overflow-y-auto bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/40 dark:from-zinc-900 dark:via-purple-950/20 dark:to-blue-950/30">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-blue-100/20 dark:from-purple-900/10 dark:via-transparent dark:to-blue-900/10 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />

          {/* Page content with Header */}
          <div className="relative z-10">
           
            <div className={`${isMobile ? 'pt-0' : 'pt-0'}`}>
              <AuthGuard>
              {children}
              </AuthGuard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
