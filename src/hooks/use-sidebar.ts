"use client";

import { useState, useEffect } from "react";

export function useSidebarState() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize mobile detection and sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Only set initial state if not already initialized
      if (!isInitialized) {
        setIsOpen(!mobile); // Open on desktop, closed on mobile
        setIsInitialized(true);
      }
      
      console.log('Mobile check:', { 
        width: window.innerWidth, 
        isMobile: mobile, 
        isOpen: !mobile,
        isInitialized 
      });
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isInitialized]);

  const toggleSidebar = () => {
    console.log('Toggling sidebar from:', isOpen, 'to:', !isOpen);
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    console.log('Closing sidebar');
    setIsOpen(false);
  };

  return {
    isMobile,
    isOpen,
    isInitialized,
    toggleSidebar,
    closeSidebar
  };
}