"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Home,
  MessageCircleQuestionMark,
  Box,
  Factory,
  ShoppingBag,
  UsersRound,
  BadgeQuestionMark,
  SquareUserRound,
  ShieldUser,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logo from "../logo";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  isCollapsed?: boolean;
  onMenuClick?: () => void;
  isOverlay?: boolean;
}

export default function Sidebar({
  isOpen = false,
  onClose,
  isMobile = false,
  isCollapsed = false,
  onMenuClick,
  isOverlay = false,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Debug logging

  // Close mobile menu when route changes
  // useEffect(() => {
  //   if (isMobile && onClose) {
  //     onClose();
  //   }
  // }, [pathname, isMobile, onClose]);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current && isMobile && onClose) {
      onClose();
    }
    prevPathname.current = pathname;
  }, [pathname, isMobile, onClose]);
  const navItems = [
    { label: "home", icon: Home, path: "/home" },
    // { label: "employees", icon: ShieldUser  , path: "/employees" },
    { label: "vendors", icon: SquareUserRound, path: "/vendors" },
    { label: "end users", icon: UsersRound, path: "/customers" },
    { label: "orders", icon: Box, path: "/orders" },
    // { label: "payments", icon: CreditCard, path: "/payments" },
    { label: "industries", icon: Factory, path: "/industries" },
    {
      label: "category",
      icon: Box,
      path: "/category",
      relatedPaths: ["/add-category"],
    },
    { label: "products", icon: ShoppingBag, path: "/products" },
    { label: "partners", icon: ShoppingBag, path: "/Partners" },
    { label: "advertisements", icon: ShoppingBag, path: "/Advertisements" },
    {
      label: "Vendor Enquiries",
      icon: MessageCircleQuestionMark,
      path: "/vendor-enquiries",
    },
    {
      label: "End User Queries",
      icon: BadgeQuestionMark,
      path: "/enduserqueries",
    },
  ];

  // Get current page name
  const getCurrentPageName = () => {
    const currentItem = navItems.find((item) => item.path === pathname);
    return currentItem ? currentItem.label : "Dashboard";
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`${
          isOverlay ? "relative" : "sticky top-0"
        } h-screen bg-gradient-to-b from-white to-gray-50/50 dark:from-zinc-900 dark:to-zinc-950/50 border-r border-gray-200/60 dark:border-zinc-800/60 backdrop-blur-xl shadow-2xl dark:shadow-black/20 flex flex-col z-[60] transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] via-transparent to-blue-500/[0.02] pointer-events-none" />

        {/* Brand */}
        <div
          className={`relative py-4 sm:py-6 border-b border-gray-200/60 dark:border-zinc-800/60 bg-gradient-to-r from-purple-50/30 to-blue-50/30 dark:from-purple-950/20 dark:to-blue-950/20 ${
            isCollapsed ? "px-2" : "px-4 sm:px-6"
          }`}
        >
          <div
            className={`flex items-center text-xl sm:text-2xl font-bold tracking-tight select-none group cursor-pointer ${
              isCollapsed ? "justify-center gap-0" : "gap-2 sm:gap-3"
            }`}
            onClick={() => router.push("/home")}
          >
            <div className="relative">
              <span className="text-2xl sm:text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 inline-block">
                <Logo />
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="text-gray-900 dark:text-white font-pacifico bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300 text-lg sm:text-xl">
                SHOPPERSKY
              </span>
            )}
          </div>
        </div>

        {/* Main Nav */}
        <nav
          className={`flex-1 py-4 sm:py-6 relative overflow-y-auto ${
            isCollapsed && !isMobile ? "px-1" : "px-2 sm:px-3"
          }`}
        >
          <div className="space-y-1 sm:space-y-2">
            {navItems.map((item, index) => {
              const active =
                pathname === item.path ||
                (item.relatedPaths && item.relatedPaths.includes(pathname));
              return (
                <div
                  key={item.label}
                  className="relative"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Active indicator line */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-r-full shadow-lg shadow-purple-500/30 animate-pulse" />
                  )}

                  <button
                    onClick={() => router.push(item.path)}
                    className={`relative w-full flex items-center text-sm sm:text-[15px] font-medium
                    transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98]
                    ${
                      isCollapsed && !isMobile
                        ? "justify-center px-2 py-3 rounded-xl"
                        : "gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl"
                    }
                    ${
                      active
                        ? "bg-gradient-to-r from-purple-100 via-purple-50 to-blue-50 dark:from-purple-900/40 dark:via-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-200 shadow-lg shadow-purple-500/10 border border-purple-200/50 dark:border-purple-800/50"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-blue-50/80 dark:hover:from-zinc-800/80 dark:hover:to-zinc-700/80 hover:shadow-md hover:shadow-purple-500/5 hover:border hover:border-purple-200/30 dark:hover:border-purple-800/30"
                    }
                    group overflow-hidden
                  `}
                    title={isCollapsed && !isMobile ? item.label : undefined}
                  >
                    {/* Background shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                    <div
                      className={`relative flex items-center z-10 ${
                        isCollapsed && !isMobile
                          ? "justify-center"
                          : "gap-2 sm:gap-3"
                      }`}
                    >
                      <span
                        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 transform group-hover:rotate-6 group-hover:scale-110
                        ${
                          active
                            ? "bg-gradient-to-br from-purple-200 via-purple-100 to-blue-100 dark:from-purple-800 dark:via-purple-900 dark:to-blue-900 shadow-lg shadow-purple-500/20"
                            : "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-zinc-800 dark:to-zinc-700 group-hover:from-purple-100 group-hover:to-blue-100 dark:group-hover:from-purple-900/50 dark:group-hover:to-blue-900/50 group-hover:shadow-md group-hover:shadow-purple-500/10"
                        }`}
                      >
                        <item.icon
                          size={18}
                          className={`sm:w-5 sm:h-5 transition-all duration-300 ${
                            active
                              ? "text-purple-700 dark:text-purple-300 drop-shadow-sm"
                              : "text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                          }`}
                        />
                      </span>
                      {(!isCollapsed || isMobile) && (
                        <span className="font-medium tracking-wide capitalize">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
