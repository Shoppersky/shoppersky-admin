"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  TrendingUp, 
  CheckCircle2, 
  RefreshCw, 
  Users, 
  AlertCircle, 
  BarChart3, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
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
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
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
            </div>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <div
            className={`p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${
              color === "blue"
                ? "from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30"
                : color === "green"
                ? "from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
                : color === "yellow"
                ? "from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30"
                : color === "red"
                ? "from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30"
                : "from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30"
            }`}
          >
            <div className={colorClasses[color]}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton component for table rows
const TableSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
    {/* <TableCell><Skeleton className="h-8 w-8" /></TableCell> */}
  </TableRow>
);

export default function EndUserQueries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    <div className="min-h-screen">
      <div className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8 max-w-7xl">
        {/* Enhanced Responsive Page Header */}
        <div className="relative z-50 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-2 sm:p-3 lg:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Customer Enquiries
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
               Manage and respond to customer enquiries with comprehensive analytics
            </p>
          </div>
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
                color="yellow"
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
                color="green"
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

            {/* Enquiries Table */}
            <div className="rounded-md border">
              {isLoading ? (
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">S.No</TableHead>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Created</TableHead>
                        {/* <TableHead className="text-right">Actions</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <TableSkeleton key={index} />
                      ))}
                    </TableBody>
                  </Table>
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
                <>
                  <div className="w-full overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b bg-muted/50">
                          <TableHead className="w-[50px]">S.No</TableHead>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden sm:table-cell">Created</TableHead>
                          {/* <TableHead className="text-right">Actions</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEnquiries.map((enquiry, index) => (
                          <TableRow key={enquiry.enquiry_id} className="border-b transition-colors hover:bg-muted/50">
                            <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                            <TableCell className="font-mono text-xs">
                              ENQ-{enquiry.enquiry_id}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{enquiry.firstname} {enquiry.lastname}</div>
                              <div className="text-xs text-slate-500 md:hidden truncate max-w-[150px]">{enquiry.email}</div>
                              {enquiry.phone_number && (
                                <div className="text-xs text-slate-500 lg:hidden">{enquiry.phone_number}</div>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="truncate max-w-[200px]">{enquiry.email}</div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {enquiry.phone_number || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusConfig(enquiry.enquiry_status).color} border-0 text-xs font-medium`}
                              >
                                {enquiry.enquiry_status.charAt(0).toUpperCase() +
                                  enquiry.enquiry_status.slice(1).replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="text-xs text-slate-500">
                                {formatDate(enquiry.created_at)}
                              </div>
                            </TableCell>
                            {/* <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4">
                      <div className="text-sm text-slate-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="sr-only">Previous page</span>
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNumber = i + 1;
                            const isActive = pageNumber === currentPage;
                            
                            // Adjust page numbers for better pagination display
                            let displayPage = pageNumber;
                            if (totalPages > 5 && currentPage > 3) {
                              displayPage = currentPage - 3 + pageNumber;
                              if (displayPage > totalPages) displayPage = totalPages - 5 + pageNumber;
                            }
                            
                            return (
                              <Button
                                key={displayPage}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className={`h-8 w-8 p-0 ${isActive ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                                onClick={() => setCurrentPage(displayPage)}
                              >
                                {displayPage}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                          <span className="sr-only">Next page</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}