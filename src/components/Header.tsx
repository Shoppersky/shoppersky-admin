"use client";

import { useState, useEffect, memo } from "react";
import { Bell, Search, AlertTriangle, XCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from 'sonner';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import useStore from "@/lib/Zustand";
import axiosInstance from "@/lib/axiosInstance";






interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  sidebarCollapsed?: boolean;
  isTablet?: boolean;
  sidebarOpen?: boolean;
}
  type ProfileData = {
    name: string,
    email: string,
    role: string,
    avatar: string,
    joinDate: string
  }
const Header = memo(function Header({ onMenuClick, isMobile, sidebarCollapsed, isTablet, sidebarOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null); 
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { userId, logout } = useStore();
  
  // Debug logging - only log when props actually change
  useEffect(() => {
    console.log('Header props changed:', { isMobile, sidebarCollapsed, isTablet, sidebarOpen });
  }, [isMobile, sidebarCollapsed, isTablet, sidebarOpen]);
  
  useEffect(() => {
    console.log('User ID from store:', userId);
  }, [userId]);

  const fetchProfileData = async () => {
    if (!userId) {
      console.log('No userId available, skipping profile fetch');
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError(null);
      
      console.log('Fetching profile for userId:', userId);
      const response = await axiosInstance.get(`/admin-users/admin-profile-details/${userId}`);
      console.log('Profile API response:', response.data);
      
      const { data } = response.data; // Assuming api_response structure
      setProfileData({
        name: data.username || "Unknown",
        email: data.email || "",
        role: data.role_name || "Unknown",
        avatar: data.profile_picture_url || "/placeholder.svg?height=120&width=120&text=JD",
        joinDate: data.join_date || "Unknown",
      });
     
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setProfileError(error.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setProfileLoading(false);
    }
  };
  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Employees", path: "/employees" },
    { label: "Vendors", path: "/vendors" },
    { label: "End Users", path: "/customers" },
    { label: "Industries", path: "/industries" },
    { label: "Category", path: "/category" },
    { label: "Products", path: "/products" },
    { label: "Vendor Enquiries", path: "/vendor-enquiries" },
    { label: "End User Queries", path: "/enduserqueries" },
  ];

  // Get current page name
  const getCurrentPageName = () => {
    const currentItem = navItems.find(item => item.path === pathname);
    return currentItem ? currentItem.label : "Dashboard";
  };



  const handleLogout = async () => {
  try {
    // Assume logoutUser is an API call that logs out on the server
    // await logoutUser();

    // If success, clear local state/store and redirect
    const { logout } = useStore.getState();
    logout();
    localStorage.removeItem('id');

    router.push('/');  // Redirect after successful logout
  } catch (err) {
    // Fallback: clear localStorage, Zustand store, and redirect
    try {
      const { logout } = useStore.getState();
      logout();
      localStorage.removeItem('id');
    } catch {
      // swallow any errors here silently
    }
    toast.error('Logout failed with server, fallback logout applied.');
    window.location.href = '/';
  }
};


  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  // Debug logging for profile data
  useEffect(() => {
    console.log('Profile state updated:', { profileData, profileLoading, profileError });
  }, [profileData, profileLoading, profileError]);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
        setShowAllNotifications(false);
      }
      if (showProfileDropdown && !target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileDropdown]);

  // Mock system alerts data
  const systemAlerts = [
    {
      type: 'warning',
      title: 'Low Stock Alert',
      message: '89 products are running low on stock',
      time: '10 mins ago',
      action: 'View Products'
    },
    {
      type: 'error',
      title: 'Payment Gateway Issue',
      message: 'Stripe gateway experiencing delays',
      time: '25 mins ago',
      action: 'Check Status'
    },
    {
      type: 'success',
      title: 'Payout Processed',
      message: '₹45,670 paid to 12 vendors successfully',
      time: '1 hour ago',
      action: 'View Details'
    },
    {
      type: 'info',
      title: 'New Vendor Application',
      message: '3 new vendor applications pending review',
      time: '2 hours ago',
      action: 'Review Applications'
    },
    {
      type: 'success',
      title: 'Order Delivered',
      message: 'Order #ORD-2024-001 has been delivered successfully',
      time: '3 hours ago',
      action: 'View Order'
    },
    {
      type: 'warning',
      title: 'Server Load High',
      message: 'Server CPU usage is above 85%',
      time: '4 hours ago',
      action: 'Check Server'
    },
    {
      type: 'info',
      title: 'New Customer Registration',
      message: '15 new customers registered today',
      time: '5 hours ago',
      action: 'View Customers'
    },
    {
      type: 'error',
      title: 'Failed Login Attempts',
      message: 'Multiple failed login attempts detected',
      time: '6 hours ago',
      action: 'Security Check'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setShowAllNotifications(false);
    }
    // toast.info('Notifications panel toggled');
  };

  const handleViewAllNotifications = () => {
    setShowAllNotifications(!showAllNotifications);
    // toast.info(showAllNotifications ? 'Showing recent notifications' : 'Showing all notifications');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-zinc-800/60 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
        {/* Left side - Menu button and current page indicator */}
        <div className={`flex items-center gap-4 transition-all duration-300 ${
          // Only apply margin on desktop when sidebar is not overlay
          (!isMobile && !isTablet) ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
        }`}>
          {/* Menu Toggle Button */}
          <button
            onClick={() => {
              console.log('Header menu button clicked');
              onMenuClick?.();
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 group"
          >
            {/* Show chevron based on sidebar state - for mobile/tablet use overlay state, for desktop use collapsed state */}
            {(isMobile || isTablet) ? (
              // For mobile/tablet: show right chevron when closed, left when open
              sidebarOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              )
            ) : (
              // For desktop: show right chevron when collapsed, left when expanded
              sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              )
            )}
          </button>

          {/* Current Page Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {getCurrentPageName()}
            </span>
          </div>
        </div>

        {/* Center - Search bar (hidden on mobile) */}
        {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
        </div> */}

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search button for mobile */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Notifications */}
          <div className="relative notifications-dropdown">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                {systemAlerts.length}
              </span>
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-700 z-[9999] overflow-y-auto transition-all duration-300 ${
                showAllNotifications ? 'max-h-[500px]' : 'max-h-96'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {showAllNotifications ? `${systemAlerts.length} total` : `${Math.min(3, systemAlerts.length)} recent`}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  {(showAllNotifications ? systemAlerts : systemAlerts.slice(0, 3)).map((alert, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md cursor-pointer transition-colors duration-200">
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full flex-shrink-0 ${
                          alert.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                          alert.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                          alert.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                          'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 text-center border-t border-gray-200 dark:border-slate-700 mt-2">
                    <button 
                      className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
                      onClick={handleViewAllNotifications}
                    >
                      {showAllNotifications ? 'Show Less' : 'View All Notifications'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          {/* <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button> */}

          {/* Profile */}
          <div className="relative profile-dropdown">
            <button 
              onClick={handleProfileClick}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {profileData?.avatar ? (
                <img 
                  src={profileData.avatar} 
                  alt={profileData.name || 'Profile'} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profileData?.name ? profileData.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {profileLoading ? 'Loading...' : (profileData?.name || 'Admin')}
              </span>
            </button>
            
            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-[9999]">
                <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                  {profileLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                  ) : profileError ? (
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400 text-sm">Error loading profile</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{profileError}</p>
                    </div>
                  ) : (
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{profileData?.name || 'Admin User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate break-all">{profileData?.email || 'admin@example.com'}</p>
                      {profileData?.role && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 capitalize truncate">{profileData.role}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-2">
                <Link href="/profile" passHref>
  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md">
    Profile
  </button>
</Link>
                  {/* <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md">
                    Account Settings
                  </button> */}
                 <button
      onClick={handleLogout}
      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
    >
      Logout
    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;