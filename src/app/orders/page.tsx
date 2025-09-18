"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { 
  ShoppingBag, 
  Search, 
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Store,
  MapPin,
  RefreshCw,
  Download,
  Edit,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Award,
  Zap
} from 'lucide-react'

// Mock data for orders from different stores
const mockOrders = [
  {
    id: "ORD-001",
    orderNumber: "#12345",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "+1 234-567-8900",
    storeName: "Tech Gadgets Pro",
    storeId: "store_001",
    items: [
      { name: "iPhone 15 Pro", quantity: 1, price: 999.99 },
      { name: "AirPods Pro", quantity: 1, price: 249.99 }
    ],
    totalAmount: 1249.98,
    status: "pending",
    paymentStatus: "paid",
    shippingAddress: "123 Main St, New York, NY 10001",
    orderDate: "2024-01-20",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "TRK123456789",
    category: "Electronics"
  },
  {
    id: "ORD-002",
    orderNumber: "#12346",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    customerPhone: "+1 234-567-8901",
    storeName: "Fashion Forward",
    storeId: "store_002",
    items: [
      { name: "Designer Dress", quantity: 1, price: 199.99 },
      { name: "Leather Handbag", quantity: 1, price: 149.99 }
    ],
    totalAmount: 349.98,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    orderDate: "2024-01-19",
    estimatedDelivery: "2024-01-24",
    trackingNumber: "TRK123456790",
    category: "Fashion"
  },
  {
    id: "ORD-003",
    orderNumber: "#12347",
    customerName: "Mike Wilson",
    customerEmail: "mike@example.com",
    customerPhone: "+1 234-567-8902",
    storeName: "Home & Garden Plus",
    storeId: "store_003",
    items: [
      { name: "Garden Tools Set", quantity: 1, price: 89.99 },
      { name: "Plant Pots", quantity: 3, price: 15.99 }
    ],
    totalAmount: 137.96,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    orderDate: "2024-01-18",
    estimatedDelivery: "2024-01-23",
    trackingNumber: "TRK123456791",
    category: "Home & Garden"
  },
  {
    id: "ORD-004",
    orderNumber: "#12348",
    customerName: "Lisa Brown",
    customerEmail: "lisa@example.com",
    customerPhone: "+1 234-567-8903",
    storeName: "Sports Central",
    storeId: "store_004",
    items: [
      { name: "Running Shoes", quantity: 1, price: 129.99 },
      { name: "Workout Gear", quantity: 2, price: 49.99 }
    ],
    totalAmount: 229.97,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "321 Elm St, Houston, TX 77001",
    orderDate: "2024-01-17",
    estimatedDelivery: "2024-01-22",
    trackingNumber: "TRK123456792",
    category: "Sports"
  },
  {
    id: "ORD-005",
    orderNumber: "#12349",
    customerName: "David Chen",
    customerEmail: "david@example.com",
    customerPhone: "+1 234-567-8904",
    storeName: "Book Haven",
    storeId: "store_005",
    items: [
      { name: "Programming Books", quantity: 3, price: 29.99 },
      { name: "Notebook Set", quantity: 2, price: 12.99 }
    ],
    totalAmount: 115.95,
    status: "cancelled",
    paymentStatus: "refunded",
    shippingAddress: "555 Maple Ave, Boston, MA 02101",
    orderDate: "2024-01-16",
    estimatedDelivery: "2024-01-21",
    trackingNumber: "TRK123456793",
    category: "Books"
  },
  {
    id: "ORD-006",
    orderNumber: "#12350",
    customerName: "Emma Davis",
    customerEmail: "emma@example.com",
    customerPhone: "+1 234-567-8905",
    storeName: "Tech Gadgets Pro",
    storeId: "store_001",
    items: [
      { name: "MacBook Pro", quantity: 1, price: 1999.99 },
      { name: "Magic Mouse", quantity: 1, price: 79.99 }
    ],
    totalAmount: 2079.98,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "777 Broadway, Seattle, WA 98101",
    orderDate: "2024-01-21",
    estimatedDelivery: "2024-01-26",
    trackingNumber: "TRK123456794",
    category: "Electronics"
  }
]

// Analytics data
const ordersByStatus = [
  { status: 'Pending', count: 1, color: '#F59E0B' },
  { status: 'Processing', count: 2, color: '#3B82F6' },
  { status: 'Shipped', count: 1, color: '#8B5CF6' },
  { status: 'Delivered', count: 1, color: '#10B981' },
  { status: 'Cancelled', count: 1, color: '#EF4444' }
]

const ordersByStore = [
  { store: 'Tech Gadgets Pro', orders: 2, revenue: 3329.96, color: '#3B82F6' },
  { store: 'Fashion Forward', orders: 1, revenue: 349.98, color: '#10B981' },
  { store: 'Home & Garden Plus', orders: 1, revenue: 137.96, color: '#F59E0B' },
  { store: 'Sports Central', orders: 1, revenue: 229.97, color: '#EF4444' },
  { store: 'Book Haven', orders: 1, revenue: 115.95, color: '#8B5CF6' }
]

const dailyOrders = [
  { date: 'Jan 16', orders: 1, revenue: 115.95 },
  { date: 'Jan 17', orders: 1, revenue: 229.97 },
  { date: 'Jan 18', orders: 1, revenue: 137.96 },
  { date: 'Jan 19', orders: 1, revenue: 349.98 },
  { date: 'Jan 20', orders: 1, revenue: 1249.98 },
  { date: 'Jan 21', orders: 1, revenue: 2079.98 }
]

const performanceMetrics = [
  { metric: 'Avg. Order Value', value: '$704.97', change: '+12%', trend: 'up' },
  { metric: 'Order Fulfillment Rate', value: '83.3%', change: '+5%', trend: 'up' },
  { metric: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up' },
  { metric: 'Processing Time', value: '2.1 days', change: '-15%', trend: 'down' }
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [storeFilter, setStoreFilter] = useState('all')

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.storeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesStore = storeFilter === 'all' || order.storeName === storeFilter
    return matchesSearch && matchesStatus && matchesStore
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock, text: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      processing: { variant: 'default', icon: RefreshCw, text: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      shipped: { variant: 'default', icon: Truck, text: 'Shipped', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      delivered: { variant: 'default', icon: CheckCircle, text: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
      cancelled: { variant: 'destructive', icon: XCircle, text: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const config = {
      paid: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Paid' },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pending' },
      refunded: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Refunded' }
    }
    
    return (
      <Badge className={`${config[status].color}`}>
        {config[status].text}
      </Badge>
    )
  }

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length
  }

  const uniqueStores = [...new Set(orders.map(order => order.storeName))]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="relative z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-3 sm:p-4 lg:p-6 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Orders Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Monitor and manage orders from all stores
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <Button variant="outline" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export Orders</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

      <Tabs defaultValue="orders" className="space-y-4 sm:space-y-6 lg:space-y-8">
        <TabsList className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl p-1 sm:p-2 rounded-lg sm:rounded-xl w-full sm:w-auto">
          <TabsTrigger 
            value="orders" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-md sm:rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">All Orders</span>
            <span className="sm:hidden">Orders</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-md sm:rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Analytics Dashboard</span>
            <span className="sm:hidden">Analytics</span>
          </TabsTrigger>
        </TabsList>

          <TabsContent value="orders" className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 cursor-pointer group">
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Orders</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalOrders}</p>
                    </div>
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:scale-105 cursor-pointer group">
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Revenue</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-105 cursor-pointer group">
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Pending Orders</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingOrders}</p>
                    </div>
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 cursor-pointer group">
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Delivered</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.deliveredOrders}</p>
                    </div>
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01]">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="w-full">
                    <div className="relative">
                      <Search className="absolute left-3 sm:left-4 top-3 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        placeholder="Search by order number, customer name, or store..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base lg:text-lg backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/30 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/30 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base transition-all duration-300">
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={storeFilter} onValueChange={setStoreFilter}>
                      <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-600/30 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base transition-all duration-300">
                        <Store className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <SelectValue placeholder="Filter by store" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stores</SelectItem>
                        {uniqueStores.map(store => (
                          <SelectItem key={store} value={store}>{store}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.01]">
              <CardHeader className="backdrop-blur-sm bg-white/20 dark:bg-slate-800/20 border-b border-white/20 dark:border-slate-700/20 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">Orders List</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                      Manage orders from all stores
                    </CardDescription>
                  </div>
                  <Badge className="backdrop-blur-sm bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-700/30 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                    {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile Card View */}
                <div className="block sm:hidden">
                  <div className="space-y-3 p-4">
                    {filteredOrders.map((order) => (
                      <Card key={order.id} className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                                <Package className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-base">{order.orderNumber}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{order.orderDate}</p>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                  className="backdrop-blur-sm bg-white/20 dark:bg-slate-800/20 border-white/30 dark:border-slate-600/30 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[95vw] max-w-md max-h-[85vh] overflow-y-auto">
                                <DialogHeader className="pb-4 border-b border-gray-200">
                                  <div className="flex flex-col gap-3">
                                    <div>
                                      <DialogTitle className="text-xl font-bold text-gray-900">
                                        Order {selectedOrder?.orderNumber}
                                      </DialogTitle>
                                      <DialogDescription className="text-sm text-gray-600 mt-1">
                                        Complete order details
                                      </DialogDescription>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedOrder && getStatusBadge(selectedOrder.status)}
                                      {selectedOrder && getPaymentStatusBadge(selectedOrder.paymentStatus)}
                                    </div>
                                  </div>
                                </DialogHeader>
                                
                                {selectedOrder && (
                                  <div className="space-y-4 pt-4">
                                    {/* Customer Info */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                                      <h3 className="text-base font-semibold text-gray-900 mb-3">Customer Information</h3>
                                      <div className="space-y-2">
                                        <p className="text-gray-700 text-sm"><strong>Name:</strong> {selectedOrder.customerName}</p>
                                        <p className="text-gray-700 text-sm"><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                        <p className="text-gray-700 text-sm"><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                                      </div>
                                    </div>

                                    {/* Store Info */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                      <h3 className="text-base font-semibold text-gray-900 mb-3">Store & Order Info</h3>
                                      <div className="space-y-2">
                                        <p className="text-gray-700 text-sm"><strong>Store:</strong> {selectedOrder.storeName}</p>
                                        <p className="text-gray-700 text-sm"><strong>Category:</strong> {selectedOrder.category}</p>
                                        <p className="text-gray-700 text-sm"><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                                        <p className="text-gray-700 text-sm"><strong>Total:</strong> ${selectedOrder.totalAmount.toLocaleString()}</p>
                                      </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-blue-600" />
                                        Order Items
                                      </h3>
                                      <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-3">
                                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Package className="w-4 h-4 text-blue-600" />
                                              </div>
                                              <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-semibold text-gray-900 text-sm">${item.price.toLocaleString()}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        Shipping Address
                                      </h3>
                                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-700 text-sm">{selectedOrder.shippingAddress}</p>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                                      <Button variant="outline" className="w-full">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Order
                                      </Button>
                                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                                        <Truck className="w-4 h-4 mr-2" />
                                        Update Status
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Customer:</span>
                              <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Store:</span>
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-2 py-1 text-xs">
                                {order.storeName}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Amount:</span>
                              <span className="text-sm font-semibold text-gray-900">${order.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Status:</span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Payment:</span>
                              {getPaymentStatusBadge(order.paymentStatus)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold text-gray-900 py-3 sm:py-4 text-xs sm:text-sm">Order Details</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm">Store</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm">Amount</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-xs sm:text-sm hidden lg:table-cell">Payment</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-center text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-blue-50/50 transition-colors border-b border-gray-100">
                          <TableCell className="py-3 sm:py-4 lg:py-6">
                            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">{order.orderNumber}</p>
                                <p className="text-gray-500 text-xs sm:text-sm">{order.orderDate}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base">{order.customerName}</p>
                              <p className="text-gray-500 text-xs sm:text-sm">{order.customerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                              {order.storeName}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-gray-900 text-sm sm:text-base">
                            ${order.totalAmount.toLocaleString()}
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="hidden lg:table-cell">{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    className="hover:bg-blue-50 hover:border-blue-200 transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                                  >
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader className="pb-4 sm:pb-6 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                                      <div>
                                        <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                          Order {selectedOrder?.orderNumber}
                                        </DialogTitle>
                                        <DialogDescription className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 sm:mt-2">
                                          Complete order details and management
                                        </DialogDescription>
                                      </div>
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                        {selectedOrder && getStatusBadge(selectedOrder.status)}
                                        {selectedOrder && getPaymentStatusBadge(selectedOrder.paymentStatus)}
                                      </div>
                                    </div>
                                  </DialogHeader>
                                  
                                  {selectedOrder && (
                                    <div className="space-y-4 sm:space-y-6 lg:space-y-8 pt-4 sm:pt-6">
                                      {/* Order Header */}
                                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-blue-100">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                          <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Customer Information</h3>
                                            <div className="space-y-1 sm:space-y-2">
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Name:</strong> {selectedOrder.customerName}</p>
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Store Information</h3>
                                            <div className="space-y-1 sm:space-y-2">
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Store:</strong> {selectedOrder.storeName}</p>
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Category:</strong> {selectedOrder.category}</p>
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Delivery Information</h3>
                                            <div className="space-y-1 sm:space-y-2">
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Estimated:</strong> {selectedOrder.estimatedDelivery}</p>
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Tracking:</strong> {selectedOrder.trackingNumber}</p>
                                              <p className="text-gray-700 text-sm sm:text-base"><strong>Total:</strong> ${selectedOrder.totalAmount.toLocaleString()}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Order Items */}
                                      <Card className="shadow-lg border-gray-200">
                                        <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 lg:p-6">
                                          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                            Order Items
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                                          <div className="space-y-3 sm:space-y-4">
                                            {selectedOrder.items.map((item, index) => (
                                              <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                                                <div className="flex items-center gap-3 sm:gap-4">
                                                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                                    <Package className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                                                  </div>
                                                  <div>
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                  </div>
                                                </div>
                                                <div className="text-right">
                                                  <p className="font-semibold text-gray-900 text-sm sm:text-base">${item.price.toLocaleString()}</p>
                                                  <p className="text-xs sm:text-sm text-gray-500">each</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Shipping Address */}
                                      <Card className="shadow-lg border-gray-200">
                                        <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4 lg:p-6">
                                          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                            Shipping Address
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                                          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                                            <p className="text-gray-700 text-sm sm:text-base">{selectedOrder.shippingAddress}</p>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      {/* Action Buttons */}
                                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 gap-3 sm:gap-4">
                                        <div className="text-gray-500 text-sm sm:text-base">
                                          Order placed on {selectedOrder.orderDate}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                                          <Button variant="outline" className="px-4 sm:px-6 py-2 text-sm sm:text-base w-full sm:w-auto">
                                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            Edit Order
                                          </Button>
                                          <Button className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg text-sm sm:text-base w-full sm:w-auto">
                                            <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                            Update Status
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* No Orders Found - Both Mobile and Desktop */}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 sm:py-12 lg:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
                    <p className="text-gray-500 text-sm sm:text-base">No orders match your current filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Analytics Header */}
          <div className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.01] p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Orders Analytics
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                  Comprehensive insights into order performance across all stores
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 shadow-lg text-xs sm:text-sm">
                  Live Data
                </Badge>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-105 cursor-pointer group">
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-2.5 lg:p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${
                      metric.trend === 'up' ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30' : 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30'
                    }`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
                      ) : (
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      metric.trend === 'up' ? 'bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}>
                      {metric.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">{metric.metric}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                  </div>
                </CardContent>
                </Card>
              ))}
            </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Orders by Status */}
            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-5 lg:p-6">
                <CardTitle className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  Orders by Status
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Distribution of orders across different statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
                  <ChartContainer
                    config={{
                      pending: { label: "Pending", color: "#F59E0B" },
                      processing: { label: "Processing", color: "#3B82F6" },
                      shipped: { label: "Shipped", color: "#8B5CF6" },
                      delivered: { label: "Delivered", color: "#10B981" },
                      cancelled: { label: "Cancelled", color: "#EF4444" }
                    }}
                    className="h-[200px] sm:h-[250px] lg:h-[300px]"
                  >
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        fontSize={10}
                      >
                        {ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

            {/* Orders by Store */}
            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02]">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-5 lg:p-6">
                <CardTitle className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                  Orders by Store
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Order volume and revenue by store
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
                  <ChartContainer
                    config={{
                      orders: { label: "Orders", color: "#3B82F6" },
                      revenue: { label: "Revenue", color: "#10B981" }
                    }}
                    className="h-[200px] sm:h-[250px] lg:h-[300px]"
                  >
                    <BarChart data={ordersByStore}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="store" 
                        stroke="#6B7280" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60} 
                        fontSize={10}
                        interval={0}
                      />
                      <YAxis stroke="#6B7280" fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" fill="var(--color-orders)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

            {/* Daily Orders Trend */}
            <Card className="lg:col-span-2 backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:scale-[1.01]">
              <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-5 lg:p-6">
                <CardTitle className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  Daily Orders & Revenue Trend
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Daily order volume and revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
                  <ChartContainer
                    config={{
                      orders: { label: "Orders", color: "#3B82F6" },
                      revenue: { label: "Revenue ($)", color: "#10B981" }
                    }}
                    className="h-[250px] sm:h-[300px] lg:h-[350px]"
                  >
                    <AreaChart data={dailyOrders}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" stroke="#6B7280" fontSize={10} />
                      <YAxis stroke="#6B7280" fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#3B82F6" 
                        fillOpacity={1} 
                        fill="url(#colorOrders)"
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

          {/* Store Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 cursor-pointer group">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Top Performing Store</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Tech Gadgets Pro</p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs">₹3,329.96 revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 cursor-pointer group">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Avg. Order Value</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">₹704.97</p>
                    <p className="text-purple-600 dark:text-purple-400 text-xs">Across all stores</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:scale-105 cursor-pointer group sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Fulfillment Rate</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">83.3%</p>
                    <p className="text-green-600 dark:text-green-400 text-xs">Orders delivered on time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}