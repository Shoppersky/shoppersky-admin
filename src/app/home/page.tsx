// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// import { 
//   DollarSign, 
//   Users, 
//   ShoppingCart, 
//   Store, 

//   ArrowUpRight,

//   Package,

//   Calendar,
//   Clock,

//   AlertTriangle,
//   CheckCircle,
//   XCircle,

//   BarChart3,

//   Bell,

//   Plus,
//   Star,
//   Flag,

//   ShoppingBag,

//   FileText,

//   ChevronRight
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { 
//   LineChart as ReLineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip as ReTooltip, 
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart as RePieChart,
//   Pie,
//   Cell,
//   Legend
// } from 'recharts';
// import Image from 'next/image';

// const AdminDashboard = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [activeTab, setActiveTab] = useState('orders');


//   // Update time every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);




//   // Mock data for dashboard
//   const dashboardStats = {
//     totalRevenue: 2847650,
//     totalOrders: 15847,
//     totalCustomers: 8934,
//     totalVendors: 247,
//     activeVendors: 189,
//     pendingOrders: 156,
//     pendingShipments: 20,
//     completedOrders: 15691,
//     cancelledOrders: 234,
//     totalProducts: 12456,
//     lowStockProducts: 89,
//     outOfStockProducts: 23,
//     totalCommission: 284765,
//     pendingPayouts: 45670,
//     processedPayouts: 239095,
//     flaggedIssues: 5
//   };
//   // Format number to Indian Rupee format (₹)
// const formatIndianRupee = (amount: number): string => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0
//   }).format(amount);
// };


//   const revenueGrowth = 15.2;
//   const orderGrowth = 8.7;
//   const customerGrowth = 12.3;
//   const vendorGrowth = 5.8;

//   const recentOrders = [
//     {
//       id: 'ORD-2024-001',
//       customer: 'John Doe',
//       vendor: 'TechStore Pro',
//       amount: 1299,
//       status: 'Processing',
//       date: '2024-06-15',
//       time: '2 mins ago',
//       items: 2
//     },
//     {
//       id: 'ORD-2024-002',
//       customer: 'Sarah Wilson',
//       vendor: 'Fashion Hub',
//       amount: 899,
//       status: 'Shipped',
//       date: '2024-06-15',
//       time: '5 mins ago',
//       items: 1
//     },
//     {
//       id: 'ORD-2024-003',
//       customer: 'Mike Johnson',
//       vendor: 'Home Essentials',
//       amount: 2499,
//       status: 'Delivered',
//       date: '2024-06-14',
//       time: '12 mins ago',
//       items: 3
//     },
//     {
//       id: 'ORD-2024-004',
//       customer: 'Emily Brown',
//       vendor: 'Beauty Corner',
//       amount: 599,
//       status: 'Pending',
//       date: '2024-06-14',
//       time: '18 mins ago',
//       items: 2
//     },
//     {
//       id: 'ORD-2024-005',
//       customer: 'David Lee',
//       vendor: 'Sports World',
//       amount: 1799,
//       status: 'Cancelled',
//       date: '2024-06-13',
//       time: '25 mins ago',
//       items: 1
//     }
//   ]
 

//   const getStatusColor = (status: string) => {
//   switch (status.toLowerCase()) {
//     case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
//     case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
//     case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
//     case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
//     case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
//     case 'verified': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
//     default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
//   }
// };


//  const getAlertIcon = (type: string) => {
//   switch (type) {
//     case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
//     case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
//     case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
//     case 'info': return <Bell className="w-4 h-4 text-blue-600" />;
//     default: return <Bell className="w-4 h-4 text-gray-600" />;
//   }
// };


//  const handleQuickAction = (action: string) => {
//   toast.success(`${action} action triggered!`);
// };


// const handleDownloadReport = (reportType: string) => {
//   toast.success(`Downloading ${reportType} report...`);
// };



// // Handler for View All buttons
// const handleViewAll = (section: string) => {
//   toast.info(`Navigating to ${section} page...`);
//   // Here you would typically navigate to the respective page
//   // For example: router.push(`/${section.toLowerCase().replace(' ', '-')}`);
// };

// // Handler for customer review actions
// const handleReviewAction = (action: string, reviewId: number) => {
//   toast.success(`${action} action performed for review #${reviewId}`);
// };




//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
//         {/* 1. Dashboard Header */}
//         <div className="relative z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-3 sm:p-4 lg:p-6 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
//           <div className="flex-1 min-w-0">
//             <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
//               Welcome back, Admin
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
//               Here's what's happening with your marketplace today.
//             </p>
//             <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
//                 <span className="hidden sm:inline">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
//                 <span className="sm:hidden">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
//                 <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 2. Quick Stats / Summary Cards */}
//      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
//   {/* Card Template */}
//   {[
//     {
//       title: "Total Orders",
//       value: "0",
//       growth: orderGrowth,
//       color: "blue",
//       icon: ShoppingCart,
//       gradient: "from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30",
//     },
//     {
//       title: "Total Revenue",
//       value: "₹0L",
//       growth: revenueGrowth,
//       color: "green",
//       icon: DollarSign,
//       gradient: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
//     },
//     {
//       title: "Total Customers",
//       value: "0",
//       growth: customerGrowth,
//       color: "purple",
//       icon: Users,
//       gradient: "from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30",
//     },
//     {
//       title: "Total Vendors",
//       value: "0",
//       growth: vendorGrowth,
//       color: "orange",
//       icon: Store,
//       gradient: "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
//     },
//   ].map((card, index) => (
//     <Card
//       key={index}
//       className={`backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-${card.color}-500/20 hover:scale-105 cursor-pointer group`}
//     >
//       <CardContent className="p-4 lg:p-5">
//         <div className="flex items-center justify-between gap-3">
//           <div className="min-w-0 flex-1">
//             <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{card.title}</p>
//             <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
//             {/* <p className={`text-xs text-${card.color}-600 dark:text-${card.color}-400 flex items-center mt-2`}>
//               <ArrowUpRight className="w-3 h-3 mr-1 flex-shrink-0" />
//               <span className="truncate hidden sm:inline">+{card.growth}% from last month</span>
//               <span className="truncate sm:hidden">+{card.growth}%</span>
//             </p> */}
//           </div>
//           <div
//             className={`p-2 lg:p-3 bg-gradient-to-br ${card.gradient} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
//           >
//             <card.icon className={`w-5 lg:w-6 h-5 lg:h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   ))}

//         </div>

       
//         {/* Main Content Grid - Balanced 2-Column Layout */}
//         <div className="w-full">
//           {/* Left Column */}
//           <div className="space-y-4 sm:space-y-6">
//             {/* Recent Orders Table */}
//             <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
//               <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6 flex flex-row items-center justify-between">
//                 <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
//                   Recent Orders
//                 </CardTitle>
//                 {/* <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs sm:text-sm px-2 sm:px-3"
//                   onClick={() => handleViewAll('Recent Orders')}
//                 >
//                   View All <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
//                 </Button> */}
//               </CardHeader>
//               <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-xs sm:text-sm">
//                     <thead>
//                       <tr className="border-b border-gray-200 dark:border-gray-700">
//                         <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Order ID</th>
//                         <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Customer</th>
//                         <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
//                         <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
//                         <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {recentOrders.map((order) => (
//                         <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
//                           <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 font-medium text-gray-900 dark:text-white">
//                             <div className="truncate max-w-[70px] xs:max-w-[80px] sm:max-w-none">{order.id}</div>
//                             <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 truncate">{order.customer}</div>
//                           </td>
//                           <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-700 dark:text-gray-300 hidden sm:table-cell">{order.customer}</td>
//                           <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-700 dark:text-gray-300">₹{order.amount}</td>
//                           <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3">
//                             <span className={`inline-flex items-center px-1 xs:px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                               <span className="truncate">{order.status}</span>
//                             </span>
//                           </td>
//                           <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{order.date}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </CardContent>
//             </Card>

          
//           </div>

//           {/* Right Column */}
//           <div className="space-y-4 sm:space-y-6">
          

          
//           </div>
//         </div>

//         {/* Bottom Section - Balanced 2-Column Layout */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
//           {/* Quick Actions Section */}
        

         

       
//       </div>
//     </div>
//         </div>
//   );
// };

// export default AdminDashboard;


'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Users,
  ShoppingCart,
  Store,
  ArrowUpRight,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Bell,
  Plus,
  Star,
  Flag,
  ShoppingBag,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Image from 'next/image';
import axiosInstance from '@/lib/axiosInstance';

// Interface for API response
interface AdminAnalytics {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  total_vendors: number;
  recent_orders: {
    order_id: string;
    customer_name: string;
    amount: number;
    order_status: string;
    order_at: string;
  }[];
}

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('orders');
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch admin analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get('orders/admin-analytics');

      
          setAnalytics(response.data.data);
       
      } catch (error) {
        toast.error('Error fetching analytics data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Format number to Indian Rupee format (₹)
  const formatIndianRupee = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock growth percentages (since API doesn't provide them)
  const revenueGrowth = 15.2;
  const orderGrowth = 8.7;
  const customerGrowth = 12.3;
  const vendorGrowth = 5.8;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'verified':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'info':
        return <Bell className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleQuickAction = (action: string) => {
    toast.success(`${action} action triggered!`);
  };

  const handleDownloadReport = (reportType: string) => {
    toast.success(`Downloading ${reportType} report...`);
  };

  const handleViewAll = (section: string) => {
    toast.info(`Navigating to ${section} page...`);
  };

  const handleReviewAction = (action: string, reviewId: number) => {
    toast.success(`${action} action performed for review #${reviewId}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* 1. Dashboard Header */}
        <div className="relative z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-3 sm:p-4 lg:p-6 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Welcome back, Admin
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your marketplace today.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="sm:hidden">
                  {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Quick Stats / Summary Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
          {[
            {
              title: 'Total Orders',
              value: analytics?.total_orders || 0,
              growth: orderGrowth,
              color: 'blue',
              icon: ShoppingCart,
              gradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
            },
            {
              title: 'Total Revenue',
              value:analytics?.total_revenue || 0,
              growth: revenueGrowth,
              color: 'green',
              icon: DollarSign,
              gradient: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
            },
            {
              title: 'Total Customers',
              value: analytics?.total_customers || 0,
              growth: customerGrowth,
              color: 'purple',
              icon: Users,
              gradient: 'from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30',
            },
            {
              title: 'Total Vendors',
              value: analytics?.total_vendors || 0,
              growth: vendorGrowth,
              color: 'orange',
              icon: Store,
              gradient: 'from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30',
            },
          ].map((card, index) => (
            <Card
              key={index}
              className={`backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-${card.color}-500/20 hover:scale-105 cursor-pointer group`}
            >
              <CardContent className="p-4 lg:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{card.title}</p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                    <p className={`text-xs text-${card.color}-600 dark:text-${card.color}-400 flex items-center mt-2`}>
                      <ArrowUpRight className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate hidden sm:inline">+{card.growth}% from last month</span>
                      <span className="truncate sm:hidden">+{card.growth}%</span>
                    </p>
                  </div>
                  <div
                    className={`p-2 lg:p-3 bg-gradient-to-br ${card.gradient} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    <card.icon className={`w-5 lg:w-6 h-5 lg:h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid - Balanced 2-Column Layout */}
        <div className="w-full">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Orders Table */}
            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
              <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6 flex flex-row items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                  Recent Orders
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => handleViewAll('Recent Orders')}
                >
                  View All <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                          Customer
                        </th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.recent_orders.map((order) => (
                        <tr
                          key={order.order_id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                        >
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 font-medium text-gray-900 dark:text-white">
                            <div className="truncate max-w-[70px] xs:max-w-[80px] sm:max-w-none">{order.order_id}</div>
                            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 truncate">{order.customer_name}</div>
                          </td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                            {order.customer_name}
                          </td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-700 dark:text-gray-300">
                           $ {order.amount}
                          </td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3">
                            <span className={`inline-flex items-center px-1 xs:px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                              <span className="truncate">{order.order_status}</span>
                            </span>
                          </td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                            {new Date(order.order_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">{/* Placeholder for right column content */}</div>
        </div>

        {/* Bottom Section - Balanced 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">{/* Placeholder for bottom section content */}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;