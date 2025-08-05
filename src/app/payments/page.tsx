"use client";

import React, { useState, useMemo } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Download, 
  Search, 
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Eye,
  Edit,
  Store,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");

  // Admin payment overview stats
  const stats = {
    totalRevenue: 2847650,
    totalCommission: 156750,
    activeStores: 247,
    totalTransactions: 8947
  };

  // Payment data from all stores (admin perspective)
  const paymentsData = [
    {
      id: "TXN001",
      orderId: "ORD-2024-001",
      customer: "John Doe",
      store: "TechStore Pro",
      storeId: "ST001",
      amount: 25999,
      commission: 2599, // 10% commission
      method: "UPI",
      status: "Success",
      date: "2024-01-15",
      category: "Electronics"
    },
    {
      id: "TXN002",
      orderId: "ORD-2024-002",
      customer: "Sarah Wilson",
      store: "Fashion Hub",
      storeId: "ST002",
      amount: 12999,
      commission: 1299,
      method: "Card",
      status: "Success",
      date: "2024-01-14",
      category: "Fashion"
    },
    {
      id: "TXN003",
      orderId: "ORD-2024-003",
      customer: "Mike Johnson",
      store: "BookWorld",
      storeId: "ST003",
      amount: 1999,
      commission: 199,
      method: "Net Banking",
      status: "Pending",
      date: "2024-01-13",
      category: "Books"
    },
    {
      id: "TXN004",
      orderId: "ORD-2024-004",
      customer: "Emily Brown",
      store: "Home Essentials",
      storeId: "ST004",
      amount: 8999,
      commission: 899,
      method: "Wallet",
      status: "Failed",
      date: "2024-01-12",
      category: "Home & Garden"
    },
    {
      id: "TXN005",
      orderId: "ORD-2024-005",
      customer: "David Lee",
      store: "Sports Zone",
      storeId: "ST005",
      amount: 15999,
      commission: 1599,
      method: "UPI",
      status: "Success",
      date: "2024-01-11",
      category: "Sports"
    },
    {
      id: "TXN006",
      orderId: "ORD-2024-006",
      customer: "Lisa Chen",
      store: "Beauty Corner",
      storeId: "ST006",
      amount: 4999,
      commission: 499,
      method: "Card",
      status: "Success",
      date: "2024-01-10",
      category: "Beauty"
    }
  ];

  // Get unique stores for filter dropdown
  const stores = [...new Set(paymentsData.map(p => p.store))];

  // Filter payments
  const filteredPayments = useMemo(() => {
    return paymentsData.filter(payment => {
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        payment.status.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesStore = storeFilter === 'all' || 
        payment.store === storeFilter;
      
      return matchesSearch && matchesStatus && matchesStore;
    });
  }, [searchTerm, statusFilter, storeFilter, paymentsData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const handleAction = (action: string, paymentId: string) => {
    toast.success(`${action} payment ${paymentId}`);
  };

  const handleExportPayments = () => {
    toast.success("Exporting payment data...");
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
            Admin Payment Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor payments and commissions from all stores
          </p>
        </div>
        <Button onClick={handleExportPayments} variant="outline" className="backdrop-blur-sm bg-white/20 dark:bg-slate-800/20 border-white/30 dark:border-slate-600/30">
          <Download className="w-4 h-4 mr-2" />
          Export All Payments
        </Button>
      </div>

      {/* Admin Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl hover:shadow-2xl hover:shadow-green-500/20 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Platform Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.5% from last month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Commission Earned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.totalCommission.toLocaleString()}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.3% from last month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Stores</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.activeStores}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-2">
                  <Store className="w-3 h-3 mr-1" />
                  +15 new this month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl">
                <Store className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalTransactions}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center mt-2">
                  <Activity className="w-3 h-3 mr-1" />
                  96.8% success rate
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Payments List */}
      <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Store Payments ({filteredPayments.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/30"
                />
              </div>
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger className="w-[180px] backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/30">
                  <SelectValue placeholder="Filter by store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store} value={store}>{store}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 border-white/30">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <Card key={payment.id} className="backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="space-y-1">
                      <Badge variant="outline" className="font-mono text-xs">{payment.id}</Badge>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{payment.date}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 dark:text-white">{payment.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.orderId}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <p className="font-medium text-purple-700 dark:text-purple-300">{payment.store}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.category}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900 dark:text-white">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Commission: ₹{payment.commission.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.method}</p>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => handleAction('View', payment.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleAction('Manage', payment.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No payments found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}