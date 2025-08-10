"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MessageSquare, Calendar, Clock, Phone, Mail, User, TrendingUp, CheckCircle2, RefreshCw, Users, AlertCircle, BarChart3, Activity } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path as needed

interface Enquiry {
  enquiry_id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  message: string;
  enquiry_status: string;
  created_at: string;
  updated_at: string;
}

// Enhanced Responsive StatCard Component
function StatCard({
  title,
  value,
  icon,
  color = "slate",
  trend,
  trendValue,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "slate" | "emerald" | "blue" | "violet" | "amber" | "rose" | "purple" | "indigo";
  trend?: "up" | "down";
  trendValue?: string;
  description?: string;
}) {
  const colorClasses = {
    slate:
      "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700",
    emerald:
      "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700",
    blue: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700",
    violet:
      "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 border-violet-200 dark:border-violet-700",
    amber:
      "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700",
    rose: "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-700",
    purple:
      "from-purple-500/10 to-indigo-500/10 border-purple-200/50 dark:border-purple-800/50",
    indigo:
      "from-indigo-500/10 to-purple-500/10 border-indigo-200/50 dark:border-indigo-800/50",
  };

  const iconColors = {
    slate: "text-slate-600 dark:text-slate-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    violet: "text-violet-600 dark:text-violet-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-600 dark:text-rose-400",
    purple: "text-purple-600 dark:text-purple-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
  };

  return (
    <Card
      className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${colorClasses[color]} border shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-3 sm:p-4 lg:p-6 relative">
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              {title}
            </p>
            <div className="flex flex-col xs:flex-row xs:items-baseline gap-1 xs:gap-2">
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {value}
              </p>
              {trend && trendValue && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold self-start xs:self-auto ${
                    trend === "up"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  <TrendingUp
                    className={`w-3 h-3 ${
                      trend === "down" ? "rotate-180" : ""
                    }`}
                  />
                  {trendValue}
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 ${iconColors[color]} flex-shrink-0 self-center xs:self-start`}
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton component for enquiry cards
const EnquirySkeleton = () => (
  <div className="border-b border-slate-200 dark:border-slate-700 pb-4 sm:pb-6 last:border-b-0">
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
          <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 self-start xs:self-auto" />
        </div>
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
          <Skeleton className="h-4 sm:h-5 w-12 sm:w-16 self-start xs:self-auto" />
          <Skeleton className="h-3 sm:h-4 w-28 sm:w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-3/4" />
        </div>
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
          <Skeleton className="h-3 w-24 sm:w-32" />
          <Skeleton className="h-3 w-24 sm:w-32" />
        </div>
      </div>
    </div>
  </div>
);

export default function EndUserQueries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "/users/CustomerContactPage?skip=0&limit=100"
        );
        setEnquiries(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch enquiries");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      `${enquiry.firstname} ${enquiry.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate enhanced statistics with responsive metrics
  const stats = useMemo(() => {
    const total = enquiries.length;
    const pending = enquiries.filter(e => e.enquiry_status.toLowerCase() === 'pending').length;
    const inProgress = enquiries.filter(e => ['in_progress', 'in-progress'].includes(e.enquiry_status.toLowerCase())).length;
    const resolved = enquiries.filter(e => ['resolved', 'completed'].includes(e.enquiry_status.toLowerCase())).length;
    const closed = enquiries.filter(e => e.enquiry_status.toLowerCase() === 'closed').length;
    
    // Calculate today's enquiries
    const today = new Date().toISOString().split('T')[0];
    const todayEnquiries = enquiries.filter(e => 
      e.created_at && e.created_at.split('T')[0] === today
    ).length;
    
    // Calculate this week's enquiries
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekEnquiries = enquiries.filter(e => 
      e.created_at && new Date(e.created_at) >= weekAgo
    ).length;
    
    // Calculate response rate (resolved + closed / total)
    const responseRate = total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0;
    
    // Calculate unique customers
    const uniqueCustomers = new Set(enquiries.map(e => e.email.toLowerCase())).size;
    
    return {
      total,
      pending,
      inProgress,
      resolved,
      closed,
      todayEnquiries,
      thisWeekEnquiries,
      responseRate,
      uniqueCustomers,
    };
  }, [enquiries]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return {
          color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        };
      case "in_progress":
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        };
      case "resolved":
      case "completed":
        return {
          color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        };
      case "closed":
        return {
          color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
        };
      default:
        return {
          color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-purple-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950/20">
      <div className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-7xl">
        {/* Enhanced Responsive Page Header */}
        <div className="text-center space-y-3 sm:space-y-4 px-2 sm:px-4 lg:px-6">
          {/* Title Section */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Customer Enquiries
            </h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto leading-relaxed">
            Manage and respond to customer enquiries with comprehensive analytics
          </p>
        </div>

        {/* Enhanced Responsive Statistics */}
        {!isLoading && !error && (
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Primary Statistics Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
              <StatCard
                title="Total Enquiries"
                value={stats.total.toString()}
                icon={<MessageSquare className="w-6 h-6" />}
                color="purple"
                trend="up"
                trendValue="+12%"
                description="All customer enquiries"
              />
              <StatCard
                title="Pending Review"
                value={stats.pending.toString()}
                icon={<Clock className="w-6 h-6" />}
                color="amber"
                trend="down"
                trendValue="-8%"
                description="Awaiting response"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress.toString()}
                icon={<RefreshCw className="w-6 h-6" />}
                color="blue"
                trend="up"
                trendValue="+15%"
                description="Currently being handled"
              />
              <StatCard
                title="Resolved"
                value={stats.resolved.toString()}
                icon={<CheckCircle2 className="w-6 h-6" />}
                color="emerald"
                trend="up"
                trendValue="+23%"
                description="Successfully resolved"
              />
            </div>
          </div>
        )}

        {/* Enhanced Responsive Main Content */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-2xl rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden">
          <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Enhanced Search and Stats */}
            <div className="space-y-3 sm:space-y-4">
              {/* Search */}
              <div className="relative w-full">
                {isLoading ? (
                  <Skeleton className="h-10 sm:h-12 lg:h-14 w-full rounded-lg sm:rounded-xl" />
                ) : (
                  <>
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5 z-10 flex-shrink-0" />
                    <Input
                      placeholder="Search enquiries by name, email, or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 sm:pl-12 pr-4 h-10 sm:h-12 lg:h-14 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </>
                )}
              </div>
              
              {/* Results Count */}
              {!isLoading && !error && (
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
                  <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-purple-600 dark:text-purple-400">{filteredEnquiries.length}</span> 
                    <span className="ml-1">enquiries found</span>
                    {searchTerm && (
                      <span className="ml-2 text-xs sm:text-sm text-slate-500 dark:text-slate-500">
                        for "<span className="font-medium text-slate-700 dark:text-slate-300">{searchTerm}</span>"
                      </span>
                    )}
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-3 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 self-start xs:self-auto"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Enquiries List */}
            <div className="space-y-4 sm:space-y-6">
              {isLoading ? (
                <div className="space-y-4 sm:space-y-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <EnquirySkeleton key={index} />
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                    Error Loading Enquiries
                  </h3>
                  <p className="text-sm sm:text-base text-red-500 dark:text-red-400">{error}</p>
                </div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No enquiries found
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-500 max-w-md mx-auto">
                    {searchTerm
                      ? "Try adjusting your search criteria or clear the search to see all enquiries"
                      : "No customer enquiries have been submitted yet"}
                  </p>
                </div>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.enquiry_id}
                    className="group border-b border-slate-200 dark:border-slate-700 pb-4 sm:pb-6 last:border-b-0 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-purple-50/30 dark:hover:from-slate-800/30 dark:hover:to-purple-900/10 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                        {/* Enhanced Header */}
                        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3">
                          <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-200">
                              {enquiry.firstname} {enquiry.lastname}
                            </h3>
                            <Badge className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0 self-start xs:self-auto group-hover:bg-purple-100 group-hover:text-purple-700 dark:group-hover:bg-purple-900/30 dark:group-hover:text-purple-300 transition-colors duration-200">
                              ENQ-{enquiry.enquiry_id}
                            </Badge>
                          </div>
                          <Badge
                            className={`${getStatusConfig(enquiry.enquiry_status).color} border-0 text-xs font-medium self-start xs:self-auto flex-shrink-0`}
                          >
                            {enquiry.enquiry_status.charAt(0).toUpperCase() +
                              enquiry.enquiry_status.slice(1).replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {/* Enhanced Contact Info */}
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 lg:gap-6">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 min-w-0">
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-slate-400" />
                            <span className="truncate font-medium">{enquiry.email}</span>
                          </div>
                          {enquiry.phone_number && (
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-slate-400" />
                              <span className="font-medium">{enquiry.phone_number}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Enhanced Message */}
                        <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 group-hover:bg-white/50 dark:group-hover:bg-slate-700/30 transition-colors duration-200">
                          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 lg:line-clamp-4 leading-relaxed">
                            {enquiry.message}
                          </p>
                        </div>
                        
                        {/* Enhanced Timestamps */}
                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4 lg:gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-slate-400" />
                            <span className="font-medium">Created:</span>
                            <span className="truncate">{formatDate(enquiry.created_at)}</span>
                          </div>
                          {enquiry.updated_at !== enquiry.created_at && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-slate-400" />
                              <span className="font-medium">Updated:</span>
                              <span className="truncate">{formatDate(enquiry.updated_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
