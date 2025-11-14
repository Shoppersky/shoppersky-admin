"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Store,
  RefreshCw,
  Download,
  Edit,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// types/order.ts
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  id: string | number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  storeName: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "confirmed"
    | "default"; // fallback for unexpected values
  paymentStatus: "paid" | "pending" | "refunded" | "success" | string;
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber: string;
  category: string;
}

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}) => {
  // Generate page numbers to display
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const showingFrom = ((currentPage - 1) * itemsPerPage) + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows Per Page</span>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
          <SelectTrigger className="w-20 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground ml-4">
          page {currentPage} of {totalPages} 
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((page, index) => (
          page === '...' ? (
            <div key={`ellipsis-${index}`} className="px-2 text-sm text-muted-foreground">
              ...
            </div>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          )
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeNames, setStoreNames] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/orders/all");
        const apiOrders = response.data.data;

        const transformedOrders = apiOrders.map((order) => ({
          id: order.order_id,
          orderNumber: order.order_id,
          customerName: order.user_name,
          customerEmail: order.user_email,
          customerPhone: order.address.phone || "N/A",
          storeName: order.vendor_stores?.join(", ") || "Unknown Store",
          items: order.products.map((product) => ({
            name: product.details.name,
            quantity: product.details.quantity,
            price: product.details.subtotal,
          })),
          totalAmount: order.amount,
          status: order.order_status.toLowerCase(),
          paymentStatus: order.payment_status.toLowerCase(),
          shippingAddress: order.address.street
            ? `${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.postcode}, ${order.address.country}`
            : "N/A",
          orderDate: new Date(order.order_at).toISOString().split("T")[0],
          estimatedDelivery: "N/A",
          trackingNumber: "N/A",
          category: order.products[0]?.details.name.includes("sunscreen")
            ? "Beauty"
            : order.products[0]?.details.name.includes("shirt")
            ? "Fashion"
            : order.products[0]?.details.name.includes("Canvas")
            ? "Home & Garden"
            : "General",
        }));

        setOrders(transformedOrders);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    const fetchStoreNames = async () => {
      try {
        const response = await axiosInstance.get("/vendor/all-vendor-stores");
        setStoreNames(response.data.data); // store array of objects
      } catch (err) {
        console.error("Error fetching store names:", err);
      }
    };

    fetchOrders();
    fetchStoreNames();
  }, []);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, storeFilter, itemsPerPage]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesStore =
      storeFilter === "all" ||
      order.storeName.toLowerCase() === storeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesStore;
  });

  // Paginated orders
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        variant: "secondary",
        icon: Clock,
        text: "Pending",
        color:
          "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
      },
      processing: {
        variant: "default",
        icon: RefreshCw,
        text: "Processing",
        color:
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      },
      shipped: {
        variant: "default",
        icon: Truck,
        text: "Shipped",
        color:
          "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
      },
      delivered: {
        variant: "default",
        icon: CheckCircle,
        text: "Delivered",
        color:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      },
      cancelled: {
        variant: "destructive",
        icon: XCircle,
        text: "Cancelled",
        color:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      },
      confirmed: {
        variant: "default",
        icon: CheckCircle,
        text: "Confirmed",
        color:
          "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const config = {
      paid: {
        color:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
        text: "Paid",
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
        text: "Pending",
      },
      refunded: {
        color:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
        text: "Refunded",
      },
      success: {
        color:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
        text: "Success",
      },
    };

    return (
      <Badge
        className={`px-2.5 py-1 text-xs font-medium border ${
          config[status]?.color ||
          "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
        }`}
      >
        {config[status]?.text || status}
      </Badge>
    );
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    ),
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    completedOrders: orders.filter((order) => order.status === "completed")
      .length,
  };

  // const uniqueStores = [...new Set(orders.map((order) => order.storeName))];

  const calculateOrderBreakdown = (totalAmount) => {
    const subtotal = totalAmount / 1.1;
    const gst = totalAmount - subtotal;
    return {
      subtotal: subtotal.toFixed(2),
      gst: gst.toFixed(2),
      total: totalAmount.toFixed(2),
    };
  };

  const renderOrderDetails = (order) => (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Order {order.orderNumber}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Complete order details
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSelectedOrder(null)}
          className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {getStatusBadge(order.status)}
        {getPaymentStatusBadge(order.paymentStatus)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Name:
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {order.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Email:
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate ml-2">
                  {order.customerEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Phone:
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {order.customerPhone}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-4 lg:p-6">
            <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Order Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Subtotal:
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  ${calculateOrderBreakdown(order.totalAmount).subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  GST (10%):
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  ${calculateOrderBreakdown(order.totalAmount).gst}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Total:
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  ${calculateOrderBreakdown(order.totalAmount).total}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50">
        <CardContent className="p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Order Items
          </h3>
          <div className="space-y-3">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {item.price
                      ? `$${(item.price || 0).toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No items found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50">
        <CardContent className="p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              <Truck className="w-5 h-5" />
            </div>
            Delivery Address
          </h3>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {order.shippingAddress}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {selectedOrder ? (
          renderOrderDetails(selectedOrder)
        ) : (
          <>
            <div className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-indigo-400/10"></div>
              <div className="relative p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                      Orders Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl">
                      Monitor and manage orders from all stores
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Export Orders</span>
                      <span className="sm:hidden">Export</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
                {[{
                    title: "Total Orders",
                    value: stats.totalOrders,
                    icon: ShoppingBag,
                    color: "text-blue-500",
                    bgColor:'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30'
                    
                  },
                  {
                    title: "Total Revenue",
                    value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
                    icon: DollarSign,
                    color: "text-red-500",
                    bgColor:'from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30'
                    
                  },
                  {
                    title: "Pending Orders",
                    value: stats.pendingOrders,
                    icon: Clock,
                    color: "text-yellow-500",
                    bgColor:'from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30'

                    
                  },
                  {
                    title: "Delivered",
                    value: stats.completedOrders,
                    icon: CheckCircle,
                    color: "text-green-500",
                    bgColor:
                      "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
                  },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                   
                    <CardContent className="relative p-4 lg:p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                            {stat.title}
                          </p>
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {stat.value}
                          </p>
                        </div>
                        <div
                          className={`p-2.5 lg:p-3 bg-gradient-to-br ${stat.bgColor} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6  ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search by order number, customer name, or store..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-12 text-base bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-full sm:w-48 h-12 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-base transition-all duration-300">
                          <Filter className="w-4 h-4 mr-2 text-slate-500" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={storeFilter}
                        onValueChange={setStoreFilter}
                      >
                        <SelectTrigger className="w-full sm:w-48 h-12 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 text-base transition-all duration-300">
                          <Store className="w-4 h-4 mr-2 text-slate-500" />
                          <SelectValue placeholder="Filter by store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stores</SelectItem>
                          {storeNames.map((store) => (
                            <SelectItem
                              key={store.vendor_id}
                              value={store.store_name}
                            >
                              {store.store_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-700/50 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Orders List
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                        Manage orders from all stores
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700/30 px-3 py-1.5 text-sm font-medium">
                      {filteredOrders.length} order
                      {filteredOrders.length !== 1 ? "s" : ""} found
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Mobile Cards View */} 
                  <div className="block lg:hidden">
                    <div className="space-y-4 p-4">
                      {paginatedOrders.map((order, index) => (
                        <Card
                          key={order.id}
                          className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                  <Package className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                                    {/* S.No added to mobile card */}
                                    { (currentPage - 1) * itemsPerPage + (index + 1) }. {order.orderNumber}
                                  </p>
                                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    {order.orderDate}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                className="bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Customer:
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate ml-2">
                                  {order.customerName}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Store:
                                </span>
                                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700/30 px-2 py-1 text-xs">
                                  {order.storeName}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Amount:
                                </span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  ${(order.totalAmount || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Status:
                                </span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                  Payment:
                                </span>
                                {getPaymentStatusBadge(order.paymentStatus)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Pagination for Mobile View */}
                    {totalPages > 1 && (
                      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                          totalItems={filteredOrders.length}
                          itemsPerPage={itemsPerPage}
                          onItemsPerPageChange={setItemsPerPage}
                        />
                      </div>
                    )}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          
                          {/* S.No header added (minimal change) */}
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100 py-4">
                            S.No
                          </TableHead>

                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100 py-4">
                            Order ID
                          </TableHead>
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100 py-4">
                            Order Date
                          </TableHead>
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                            Customer
                          </TableHead>
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                            Store
                          </TableHead>
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100">
                            Payment
                          </TableHead>
                          <TableHead className="font-semibold text-slate-900 dark:text-slate-100 text-center">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrders.map((order, index) => (
                          <TableRow
                            key={order.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-200/50 dark:border-slate-700/50"
                          >
                            {/* S.No cell added (minimal change) */}
                            <TableCell className="py-4">
                              {(currentPage - 1) * itemsPerPage + (index + 1)}
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                  <Package className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                                    {order.orderNumber}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                  {formatDate(order.orderDate)}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  {order.customerName}
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm truncate max-w-48">
                                  {order.customerEmail}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700/30 px-3 py-1">
                                {order.storeName}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                              ${(order.totalAmount || 0).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(order.paymentStatus)}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                  className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination for Desktop View */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredOrders.length}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                      />
                    </div>
                  )}

                  {/* Empty State */}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12 lg:py-16">
                      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-10 h-10 lg:w-12 lg:h-12 text-slate-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        No Orders Found
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                        No orders match your current filters.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
