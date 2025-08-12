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

  ChevronRight
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
  Legend
} from 'recharts';
import Image from 'next/image';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('orders');


  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);




  // Mock data for dashboard
  const dashboardStats = {
    totalRevenue: 2847650,
    totalOrders: 15847,
    totalCustomers: 8934,
    totalVendors: 247,
    activeVendors: 189,
    pendingOrders: 156,
    pendingShipments: 20,
    completedOrders: 15691,
    cancelledOrders: 234,
    totalProducts: 12456,
    lowStockProducts: 89,
    outOfStockProducts: 23,
    totalCommission: 284765,
    pendingPayouts: 45670,
    processedPayouts: 239095,
    flaggedIssues: 5
  };
  // Format number to Indian Rupee format (₹)
const formatIndianRupee = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};


  const revenueGrowth = 15.2;
  const orderGrowth = 8.7;
  const customerGrowth = 12.3;
  const vendorGrowth = 5.8;

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'John Doe',
      vendor: 'TechStore Pro',
      amount: 1299,
      status: 'Processing',
      date: '2024-06-15',
      time: '2 mins ago',
      items: 2
    },
    {
      id: 'ORD-2024-002',
      customer: 'Sarah Wilson',
      vendor: 'Fashion Hub',
      amount: 899,
      status: 'Shipped',
      date: '2024-06-15',
      time: '5 mins ago',
      items: 1
    },
    {
      id: 'ORD-2024-003',
      customer: 'Mike Johnson',
      vendor: 'Home Essentials',
      amount: 2499,
      status: 'Delivered',
      date: '2024-06-14',
      time: '12 mins ago',
      items: 3
    },
    {
      id: 'ORD-2024-004',
      customer: 'Emily Brown',
      vendor: 'Beauty Corner',
      amount: 599,
      status: 'Pending',
      date: '2024-06-14',
      time: '18 mins ago',
      items: 2
    },
    {
      id: 'ORD-2024-005',
      customer: 'David Lee',
      vendor: 'Sports World',
      amount: 1799,
      status: 'Cancelled',
      date: '2024-06-13',
      time: '25 mins ago',
      items: 1
    }
  ];

  const topVendors = [
    {
      name: 'TechStore Pro',
      revenue: 145670,
      orders: 1247,
      growth: 18.5,
      status: 'Verified',
      rating: 4.8,
      image: '/api/placeholder/32/32'
    },
    {
      name: 'Fashion Hub',
      revenue: 98450,
      orders: 892,
      growth: 12.3,
      status: 'Verified',
      rating: 4.6,
      image: '/api/placeholder/32/32'
    },
    {
      name: 'Home Essentials',
      revenue: 87320,
      orders: 654,
      growth: 8.9,
      status: 'Verified',
      rating: 4.7,
      image: '/api/placeholder/32/32'
    },
    {
      name: 'Beauty Corner',
      revenue: 76540,
      orders: 578,
      growth: 15.2,
      status: 'Pending',
      rating: 4.5,
      image: '/api/placeholder/32/32'
    },
    {
      name: 'Sports World',
      revenue: 65890,
      orders: 423,
      growth: 6.7,
      status: 'Verified',
      rating: 4.4,
      image: '/api/placeholder/32/32'
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds Pro',
      unitsSold: 1245,
      revenue: 124500,
      image: '/api/placeholder/40/40',
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Premium Leather Wallet',
      unitsSold: 987,
      revenue: 49350,
      image: '/api/placeholder/40/40',
      category: 'Accessories'
    },
    {
      id: 3,
      name: 'Smart Fitness Tracker',
      unitsSold: 876,
      revenue: 87600,
      image: '/api/placeholder/40/40',
      category: 'Electronics'
    },
    {
      id: 4,
      name: 'Designer Sunglasses',
      unitsSold: 765,
      revenue: 76500,
      image: '/api/placeholder/40/40',
      category: 'Fashion'
    }
  ];

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

  const customerReviews = [
    {
      id: 1,
      customer: 'Rahul Sharma',
      product: 'Wireless Earbuds Pro',
      rating: 5,
      comment: 'Excellent sound quality and battery life. Worth every penny!',
      date: '2 days ago',
      flagged: false
    },
    {
      id: 2,
      customer: 'Priya Patel',
      product: 'Premium Leather Wallet',
      rating: 4,
      comment: 'Great quality leather, but stitching could be better.',
      date: '3 days ago',
      flagged: false
    },
    {
      id: 3,
      customer: 'Amit Kumar',
      product: 'Smart Fitness Tracker',
      rating: 2,
      comment: 'Battery drains too quickly. Not worth the price.',
      date: '1 week ago',
      flagged: true
    }
  ];

  // Chart data
  const revenueData = [
    { name: 'Jan', revenue: 125000 },
    { name: 'Feb', revenue: 145000 },
    { name: 'Mar', revenue: 135000 },
    { name: 'Apr', revenue: 160000 },
    { name: 'May', revenue: 180000 },
    { name: 'Jun', revenue: 210000 },
    { name: 'Jul', revenue: 245000 },
  ];

  const ordersByCategoryData = [
    { name: 'Electronics', orders: 5423 },
    { name: 'Fashion', orders: 4287 },
    { name: 'Home', orders: 3198 },
    { name: 'Beauty', orders: 2154 },
    { name: 'Sports', orders: 785 },
  ];

  const paymentMethodsData = [
    { name: 'UPI', value: 45 },
    { name: 'Credit Card', value: 30 },
    { name: 'Debit Card', value: 15 },
    { name: 'COD', value: 10 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'shipped': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'verified': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
};


 const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'info': return <Bell className="w-4 h-4 text-blue-600" />;
    default: return <Bell className="w-4 h-4 text-gray-600" />;
  }
};


 const handleQuickAction = (action: string) => {
  toast.success(`${action} action triggered!`);
};


const handleDownloadReport = (reportType: string) => {
  toast.success(`Downloading ${reportType} report...`);
};



// Handler for View All buttons
const handleViewAll = (section: string) => {
  toast.info(`Navigating to ${section} page...`);
  // Here you would typically navigate to the respective page
  // For example: router.push(`/${section.toLowerCase().replace(' ', '-')}`);
};

// Handler for customer review actions
const handleReviewAction = (action: string, reviewId: number) => {
  toast.success(`${action} action performed for review #${reviewId}`);
};




  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                <span className="hidden sm:inline">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="sm:hidden">{currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
  {/* Card Template */}
  {[
    {
      title: "Total Orders",
      value: "0",
      growth: orderGrowth,
      color: "blue",
      icon: ShoppingCart,
      gradient: "from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30",
    },
    {
      title: "Total Revenue",
      value: "₹0L",
      growth: revenueGrowth,
      color: "green",
      icon: DollarSign,
      gradient: "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
    },
    {
      title: "Total Customers",
      value: "0",
      growth: customerGrowth,
      color: "purple",
      icon: Users,
      gradient: "from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30",
    },
    {
      title: "Total Vendors",
      value: "0",
      growth: vendorGrowth,
      color: "orange",
      icon: Store,
      gradient: "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30",
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
            {/* <p className={`text-xs text-${card.color}-600 dark:text-${card.color}-400 flex items-center mt-2`}>
              <ArrowUpRight className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate hidden sm:inline">+{card.growth}% from last month</span>
              <span className="truncate sm:hidden">+{card.growth}%</span>
            </p> */}
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



          {/* Pending Shipments */}
          
         

          {/* Flagged Issues */}
      
        </div>

        {/* 3. Analytics Overview - Moved to top for better visibility */}
       {/* <Card
  className="
    backdrop-blur-xl
    bg-white/30 dark:bg-slate-900/30
    border border-white/20 dark:border-slate-700/20
    shadow-xl
    rounded-xl sm:rounded-2xl
    overflow-hidden
    transition-all duration-300
    hover:shadow-2xl hover:shadow-purple-500/20
    w-full
    max-w-full
  "
>

          <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Analytics Overview
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeTab === 'revenue' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveTab('revenue')}
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${activeTab === 'revenue' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''}`}
                >
                  Revenue
                </Button>
                <Button 
                  variant={activeTab === 'orders' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveTab('orders')}
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${activeTab === 'orders' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''}`}
                >
                  Orders
                </Button>
                <Button 
                  variant={activeTab === 'payment' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveTab('payment')}
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 ${activeTab === 'payment' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : ''}`}
                >
                  Payment
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 sm:pt-4 px-3 sm:px-6 pb-4 sm:pb-6 w-full max-w-full">
            {activeTab === 'revenue' && (
              <div className="h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                <ReLineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis 
                    stroke="#888" 
                    fontSize={12}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <ReTooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="url(#colorRevenue)"
                    strokeWidth={3}
                    dot={{ r: 6, strokeWidth: 2 }}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          )}

            {activeTab === 'orders' && (
              <div className="h-48 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ordersByCategoryData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <ReTooltip formatter={(value) => [`${value.toLocaleString()} orders`, 'Orders']} />
                  <Bar dataKey="orders" fill="url(#colorOrders)" radius={[4, 4, 0, 0]}>
                    {ordersByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

            {activeTab === 'payment' && (
              <div className="h-48 sm:h-64 lg:h-80 flex items-center justify-center">
                <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
                  <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => window.innerWidth < 640 ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <ReTooltip formatter={(value) => `${value}%`} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}

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
                {/* <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => handleViewAll('Recent Orders')}
                >
                  View All <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button> */}
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Customer</th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-left font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 font-medium text-gray-900 dark:text-white">
                            <div className="truncate max-w-[70px] xs:max-w-[80px] sm:max-w-none">{order.id}</div>
                            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 truncate">{order.customer}</div>
                          </td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-700 dark:text-gray-300 hidden sm:table-cell">{order.customer}</td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-700 dark:text-gray-300">₹{order.amount}</td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3">
                            <span className={`inline-flex items-center px-1 xs:px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              <span className="truncate">{order.status}</span>
                            </span>
                          </td>
                          <td className="px-1 sm:px-2 lg:px-3 py-2 sm:py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Top Vendors */}
            {/* <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20">
              <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6 flex flex-row items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                  Top Vendors
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => handleViewAll('Top Vendors')}
                >
                  View All <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-3 sm:space-y-4">
                  {topVendors.slice(0, 4).map((vendor, index) => (
                    <div key={index} className="flex items-center p-2 sm:p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden mr-2 sm:mr-3 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        <Image src={vendor.image} alt={vendor.name} width={40} height={40} className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{vendor.name}</p>
                          <span className={`text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${getStatusColor(vendor.status)} ml-2`}>
                            {vendor.status}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-xs sm:text-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-gray-600 dark:text-gray-400 ml-1">{vendor.rating}</span>
                          <span className="mx-1 sm:mx-2 text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-gray-600 dark:text-gray-400">{vendor.orders} orders</span>
                        </div>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                          {formatIndianRupee(vendor.revenue)} revenue
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* System Alerts
            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20">
              <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-3 sm:space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start p-2 sm:p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700">
                      <div className={`p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
                        alert.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        alert.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                        alert.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                        'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{alert.title}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">{alert.time}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>
                        <button 
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2 hover:text-blue-800 dark:hover:text-blue-300"
                          onClick={() => handleQuickAction(alert.action)}
                        >
                          {alert.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

          
          </div>
        </div>

        {/* Bottom Section - Balanced 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {/* Quick Actions Section */}
          {/* <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 ">
            <CardHeader className="pb-1 px-3 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <Button 
                  onClick={() => handleQuickAction('Add Product')}
                  className="flex flex-col items-center justify-center h-24 sm:h-32 lg:h-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-blue-700 dark:text-blue-400"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm lg:text-base font-medium">Add Product</span>
                </Button>
                <Button 
                  onClick={() => handleQuickAction('Add Order')}
                  className="flex flex-col items-center justify-center h-24 sm:h-32 lg:h-40 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 text-green-700 dark:text-green-400"
                >
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm lg:text-base font-medium">Add Order</span>
                </Button>
                <Button 
                  onClick={() => handleQuickAction('View All Orders')}
                  className="flex flex-col items-center justify-center h-24 sm:h-32 lg:h-40 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-100 dark:border-purple-800/30 hover:bg-gradient-to-br hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-900/30 dark:hover:to-violet-900/30 text-purple-700 dark:text-purple-400"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm lg:text-base font-medium">View Orders</span>
                </Button>
                <Button 
                  onClick={() => handleQuickAction('Manage Vendors')}
                  className="flex flex-col items-center justify-center h-24 sm:h-32 lg:h-40 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800/30 hover:bg-gradient-to-br hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 text-orange-700 dark:text-orange-400"
                >
                  <Store className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm lg:text-base font-medium">Manage Vendors</span>
                </Button>
              </div>
            </CardContent>
          </Card> */}
  {/* Top Products */}
            {/* <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
              <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6 flex flex-row items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                  Top Products
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => handleViewAll('Top Products')}
                >
                  View All <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-3 sm:space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center p-2 sm:p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg overflow-hidden mr-2 sm:mr-3 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        <Image src={product.image} alt={product.name} width={40} height={40} className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base pr-2">{product.name}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0">
                            {product.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-xs sm:text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{product.unitsSold.toLocaleString()} units sold</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {formatIndianRupee(product.revenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card></div> */}
          {/* Download Reports */}
          {/* <Card className=" w-full backdrop-blur-xl  bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Download Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <Button 
                  variant="outline"
                  onClick={() => handleDownloadReport('Orders')}
                  className="flex flex-col items-center justify-center h-16 sm:h-20 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 sm:px-3 gap-1 sm:gap-2"
                >
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm text-center leading-tight">Orders Report</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDownloadReport('Sales')}
                  className="flex flex-col items-center justify-center h-16 sm:h-20 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 sm:px-3 gap-1 sm:gap-2"
                >
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm text-center leading-tight">Sales Report</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDownloadReport('Vendors')}
                  className="flex flex-col items-center justify-center h-16 sm:h-20 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 sm:px-3 gap-1 sm:gap-2"
                >
                  <Store className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm text-center leading-tight">Vendors Report</span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDownloadReport('Products')}
                  className="flex flex-col items-center justify-center h-16 sm:h-20 border-dashed hover:bg-gray-50 dark:hover:bg-gray-800/50 px-2 sm:px-3 gap-1 sm:gap-2"
                >
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm text-center leading-tight">Products Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        */}

        {/* Customer Reviews / Feedback */}
        {/* <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-4 sm:pt-6 flex flex-row items-center justify-between">
            <CardTitle className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Recent Customer Reviews
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => handleViewAll('Customer Reviews')}
            >
              View All <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
              {customerReviews.map((review) => (
                <div 
                  key={review.id} 
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${
                    review.flagged 
                      ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20' 
                      : 'bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{review.customer}</p>
                    {review.flagged && (
                      <Badge variant="outline" className="text-red-600 border-red-200 dark:border-red-800 text-xs ml-2">
                        <Flag className="h-2 w-2 sm:h-3 sm:w-3 mr-1" /> Flagged
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{review.product}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          i < review.rating 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{review.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">{review.comment}</p>
                  <div className="flex justify-end mt-3 space-x-1 sm:space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 sm:h-8 px-1 sm:px-2 text-xs"
                      onClick={() => handleReviewAction('Reply', review.id)}
                    >
                      Reply
                    </Button>
                    {review.flagged ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 sm:h-8 px-1 sm:px-2 text-xs text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                        onClick={() => handleReviewAction('Approve', review.id)}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 sm:h-8 px-1 sm:px-2 text-xs text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                        onClick={() => handleReviewAction('Flag', review.id)}
                      >
                        Flag
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
        </div>
  );
};

export default AdminDashboard;
