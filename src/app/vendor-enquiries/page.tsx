"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  RefreshCw,
  Search,
  MoreHorizontal,
  Send,
  MessageSquare,
  Clock,
  User,
  Calendar,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Mail,
  Tag,
  Eye,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useStore from "@/lib/Zustand"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableCaption } from "@/components/ui/table"

// API Response interfaces
interface ThreadMessage {
  type: "query" | "response" | "followup"
  sender_type: "vendor" | "admin"
  user_id: string
  username: string
  message: string
  timestamp: string
}

interface ApiQuery {
  id: number
  sender_user_id: string
  receiver_user_id: string | null
  title: string
  category: string
  thread: ThreadMessage[]
  query_status: "open" | "in_progress" | "resolved" | "closed"
  created_at: string
  updated_at: string
  last_message: string
  unread_count: number
}

interface ApiResponse {
  statusCode: number
  message: string
  timestamp: string
  method: string
  path: string
  data: {
    queries: ApiQuery[]
  }
}

// Component interfaces
interface Query {
  id: string
  title: string
  category: string
  status: "pending" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  description: string
  vendorEmail: string
  vendorName: string
  createdAt: string
  updatedAt: string
  adminResponse?: string
  adminName?: string
  assignedTo?: string
  followUps: FollowUp[]
  thread: ThreadMessage[]
  lastMessage: string
  unreadCount: number
}

interface FollowUp {
  id: string
  message: string
  sender: "vendor" | "admin"
  senderName: string
  createdAt: string
}

// Skeleton Components
function SkeletonCard() {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 animate-pulse">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
            <div className="flex items-baseline gap-2">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 w-12 h-12"></div>
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonQueryCard() {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonFilters() {
  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-pulse">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="relative w-full">
            <div className="h-9 sm:h-10 lg:h-11 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          </div>
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-3 flex-1">
              <div className="w-full sm:w-auto sm:min-w-[140px] lg:min-w-[160px]">
                <div className="h-9 sm:h-10 lg:h-11 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[140px] lg:min-w-[160px]">
                <div className="h-9 sm:h-10 lg:h-11 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              </div>
            </div>
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-3">
              <div className="h-6 sm:h-7 w-24 sm:w-28 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({
  title,
  value,
  icon,
  color = "slate",
  trend,
  trendValue,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: "slate" | "emerald" | "blue" | "violet" | "amber" | "rose"
  trend?: "up" | "down"
  trendValue?: string
}) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <Card
      className={` border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{value}</p>
              {trend && trendValue && (
                <div
                  className={`flex items-center text-xs font-medium flex-shrink-0 ${
                    trend === "up" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  <TrendingUp className={`w-3 h-3 mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
                  <span className="hidden xs:inline">{trendValue}</span>
                </div>
              )}
            </div>
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
  )
}

function QueryCard({ query, onClick }: { query: Query; onClick: () => void }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
          icon: <Clock className="w-3 h-3" />,
        }
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <RefreshCw className="w-3 h-3" />,
        }
      case "resolved":
        return {
          color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
          icon: <CheckCircle2 className="w-3 h-3" />,
        }
      case "closed":
        return {
          color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400",
          icon: <XCircle className="w-3 h-3" />,
        }
      default:
        return {
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: <AlertCircle className="w-3 h-3" />,
        }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { color: "bg-red-500", label: "Urgent" }
      case "high":
        return { color: "bg-orange-500", label: "High" }
      case "medium":
        return { color: "bg-yellow-500", label: "Medium" }
      case "low":
        return { color: "bg-green-500", label: "Low" }
      default:
        return { color: "bg-gray-500", label: "Normal" }
    }
  }

  const statusConfig = getStatusConfig(query.status)
  const priorityConfig = getPriorityConfig(query.priority)

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg"
      onClick={onClick}
    >
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${priorityConfig.color} flex-shrink-0`} />
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors line-clamp-1">
                {query.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">{query.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-violet-400 to-blue-400 text-white text-xs">
                {query.vendorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {query.vendorName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{query.vendorEmail}</p>
            </div>
          </div>
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                <Tag className="w-2 w-2 sm:w-3 sm:h-3 mr-1" />
                <span className="truncate max-w-[80px] sm:max-w-none">{query.category}</span>
              </Badge>
              <Badge className={`${statusConfig.color} text-xs border`}>
                {statusConfig.icon}
                <span className="ml-1 hidden xs:inline">{query.status}</span>
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">{new Date(query.createdAt).toLocaleDateString()}</div>
          </div>
          {query.assignedTo && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserCheck className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Assigned to {query.assignedTo}</span>
            </div>
          )}
          {query.followUps.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <MessageCircle className="w-3 h-3 flex-shrink-0" />
              <span>
                {query.followUps.length} follow-up
                {query.followUps.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
  onItemsPerPageChange: (itemsPerPage: number) => void
}) {
  const maxVisiblePages = 5
  const pages = []

  // Calculate range of visible page numbers
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  // Adjust start page if end page is at the limit
  if (endPage === totalPages && startPage > 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page:</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>page {currentPage} of {totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function AdminEnquiryManagement() {
  const [currentView, setCurrentView] = useState<"list" | "details">("list")
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [responseMessage, setResponseMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)
  const { userId, isAuthenticated } = useStore()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const transformApiQueryToQuery = (apiQuery: ApiQuery): Query => {
    const initialQuery = apiQuery.thread.find((msg) => msg.type === "query")
    const description = initialQuery?.message || ""

    const vendorInfo = apiQuery.thread[0]

    const statusMap: Record<string, "pending" | "in-progress" | "resolved" | "closed"> = {
      open: "pending",
      in_progress: "in-progress",
      resolved: "resolved",
      closed: "closed",
    }

    const getPriority = (category: string): "low" | "medium" | "high" | "urgent" => {
      const lowerCategory = category.toLowerCase()
      if (lowerCategory.includes("urgent") || lowerCategory.includes("critical")) return "urgent"
      if (lowerCategory.includes("payment") || lowerCategory.includes("billing")) return "high"
      if (lowerCategory.includes("technical") || lowerCategory.includes("application")) return "medium"
      return "low"
    }

    // Deduplicate thread messages based on message content, prioritizing the first occurrence
    const uniqueThread = Array.from(
      new Map(apiQuery.thread.map((msg) => [`${msg.message}-${msg.sender_type}-${msg.type}`, msg])).values(),
    )

    const adminMessage = uniqueThread.find((msg) => msg.sender_type === "admin")

    return {
      id: apiQuery.id.toString(),
      title: apiQuery.title,
      category: apiQuery.category,
      status: statusMap[apiQuery.query_status] || "pending",
      priority: getPriority(apiQuery.category),
      description,
      vendorEmail: "",
      vendorName: vendorInfo?.username || "Unknown Vendor",
      createdAt: apiQuery.created_at,
      updatedAt: apiQuery.updated_at,
      adminResponse: adminMessage?.message,
      adminName: adminMessage?.username,
      assignedTo: apiQuery.receiver_user_id ? "Admin" : undefined,
      followUps: uniqueThread
        .filter((msg) => msg.type === "followup")
        .map((msg, index) => ({
          id: `${apiQuery.id}-${index}`,
          message: msg.message,
          sender: msg.sender_type,
          senderName: msg.username,
          createdAt: msg.timestamp,
        })),
      thread: uniqueThread,
      lastMessage: apiQuery.last_message,
      unreadCount: apiQuery.unread_count,
    }
  }

  const fetchQueries = async () => {
    try {
      setLoading(true)
      setError(null)
      setQueries([]) // Clear existing queries

      const response = await axiosInstance.get<ApiResponse>(`/vendor/vendor_admin_queries/all`)

      console.log("API Response:", response.data)

      if (response.data.statusCode === 200) {
        // Deduplicate queries based on id
        const uniqueApiQueries = Array.from(
          new Map(response.data.data.queries.map((query) => [query.id, query])).values(),
        )
        const transformedQueries = uniqueApiQueries.map(transformApiQueryToQuery)
        setQueries(transformedQueries)
      } else {
        setError("Failed to fetch queries")
      }
    } catch (err: any) {
      console.error("Error fetching queries:", err)
      setError(err.response?.data?.message || "Failed to fetch queries")
    } finally {
      setLoading(false)
    }
  }

  const sendResponse = async (queryId: string, message: string, messageType: "response" | "followup" = "response") => {
    try {
      setIsSubmitting(true)
      const response = await axiosInstance.post(`/vendor/vendor_admin_queries/messages/${queryId}`, {
        user_id: userId,
        message: message,
        message_type: messageType,
      })
      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        await fetchQueries()
        if (selectedQuery?.id === queryId) {
          const updatedQuery = queries.find((q) => q.id === queryId)
          if (updatedQuery) setSelectedQuery(updatedQuery)
        }
        setResponseMessage("")
        showNotification("Response sent successfully!", "success")
        return true
      } else {
        const errorMsg = "Failed to send response"
        setError(errorMsg)
        showNotification(errorMsg, "error")
        return false
      }
    } catch (err: any) {
      console.error("Error sending response:", err)
      const errorMsg = err.response?.data?.message || "Failed to send response"
      setError(errorMsg)
      showNotification(errorMsg, "error")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  const categories = ["Technical", "Payment", "Feature Request", "Account", "Billing", "Other"]
  const admins = ["Sarah Admin", "Mike Admin", "Alex Rodriguez", "Emma Wilson"]

  const filteredQueries = useMemo(() => {
    const result = queries.filter((query) => {
      const matchesSearch =
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || query.status === statusFilter
      const matchesPriority = priorityFilter === "all" || query.priority === priorityFilter
      const matchesCategory = categoryFilter === "all" || query.category === categoryFilter
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
    // Ensure no duplicates by id
    return Array.from(new Map(result.map((query) => [query.id, query])).values())
  }, [queries, searchTerm, statusFilter, priorityFilter, categoryFilter])

  // Pagination calculations
  const totalPages = Math.ceil(filteredQueries.length / itemsPerPage)
  const paginatedQueries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredQueries.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredQueries, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, priorityFilter, categoryFilter])

  const stats = useMemo(() => {
    const totalQueries = queries.length
    const pendingQueries = queries.filter((q) => q.status === "pending").length
    const inProgressQueries = queries.filter((q) => q.status === "in-progress").length
    const resolvedQueries = queries.filter((q) => q.status === "closed").length
    const urgentQueries = queries.filter((q) => q.priority === "urgent").length
    const avgResponseTime = "2.5 hrs"
    return {
      total: totalQueries,
      pending: pendingQueries,
      inProgress: inProgressQueries,
      resolved: resolvedQueries,
      urgent: urgentQueries,
      avgResponseTime,
    }
  }, [queries])

  const handleStatusChange = (queryId: string, newStatus: string) => {
    setQueries(
      queries.map((query) =>
        query.id === queryId ? { ...query, status: newStatus as any, updatedAt: new Date().toISOString() } : query,
      ),
    )
    if (selectedQuery?.id === queryId) {
      setSelectedQuery({
        ...selectedQuery,
        status: newStatus as any,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  const handleAssignQuery = (queryId: string, adminName: string) => {
    setQueries(
      queries.map((query) =>
        query.id === queryId ? { ...query, assignedTo: adminName, updatedAt: new Date().toISOString() } : query,
      ),
    )
    if (selectedQuery?.id === queryId) {
      setSelectedQuery({
        ...selectedQuery,
        assignedTo: adminName,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  const handleSubmitResponse = async () => {
    if (!responseMessage.trim() || !selectedQuery) return
    const success = await sendResponse(selectedQuery.id, responseMessage, "response")
    if (success) console.log("Response sent successfully")
    else console.error("Failed to send response")
  }

  const handleSubmitFollowUpResponse = async (followUpMessage: string) => {
    if (!followUpMessage.trim() || !selectedQuery) return
    const success = await sendResponse(selectedQuery.id, followUpMessage, "followup")
    if (success) console.log("Follow-up response sent successfully")
    else console.error("Failed to send follow-up response")
  }

  if (currentView === "details" && selectedQuery) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6 max-w-5xl">
          {notification && (
            <Card
              className={`border-l-4 ${
                notification.type === "success"
                  ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                  : notification.type === "error"
                    ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium ${
                      notification.type === "success"
                        ? "text-green-800 dark:text-green-200"
                        : notification.type === "error"
                          ? "text-red-800 dark:text-red-200"
                          : "text-blue-800 dark:text-blue-200"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => setNotification(null)} className="h-6 w-6 p-0">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentView("list")}
              className="shrink-0 bg-transparent h-8 w-8 sm:h-9 sm:w-9"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl p-2 lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-violet-700 to-blue-700 bg-clip-text text-transparent">
                Query Details
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Manage query communication and resolution
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-900/20 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
                          {selectedQuery.title}
                        </h2>
                        <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-xs sm:text-sm self-start xs:self-auto">
                          {selectedQuery.id}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Badge
                        variant="outline"
                        className={`text-xs sm:text-sm ${
                          selectedQuery.status === "pending"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : selectedQuery.status === "in-progress"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : selectedQuery.status === "resolved"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {selectedQuery.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{selectedQuery.vendorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{selectedQuery.vendorEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{new Date(selectedQuery.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">
                      Description
                    </h4>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {selectedQuery.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t">
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Category</span>
                      <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {selectedQuery.category}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Priority</span>
                      <p className="text-slate-900 dark:text-slate-100 capitalize text-sm sm:text-base">
                        {selectedQuery.priority}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Assigned To</span>
                      <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {selectedQuery.assignedTo || "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                  Conversation Thread
                </h3>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex gap-3 sm:gap-4">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-violet-400 text-white text-xs sm:text-sm">
                        {selectedQuery.vendorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                          {selectedQuery.vendorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedQuery.createdAt).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs self-start xs:self-auto">
                          Original Query
                        </Badge>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 sm:p-4">
                        <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                          {selectedQuery.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {selectedQuery.thread.slice(1).map((message, index) => (
                    <div key={`${message.user_id}-${index}-${message.timestamp}`} className="flex gap-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                        <AvatarFallback
                          className={`${
                            message.sender_type === "vendor"
                              ? "bg-gradient-to-br from-blue-400 to-violet-400"
                              : "bg-gradient-to-br from-emerald-400 to-blue-400"
                          } text-white`}
                        >
                          {message.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{message.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              message.sender_type === "vendor"
                                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400"
                            }`}
                          >
                            {message.type === "query"
                              ? "Query"
                              : message.type === "response"
                                ? "Response"
                                : message.type === "followup"
                                  ? "Follow-up"
                                  : message.type}
                          </Badge>
                        </div>
                        <div
                          className={`rounded-lg p-4 border ${
                            message.sender_type === "vendor"
                              ? "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                              : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          <p className="text-slate-700 dark:text-slate-300">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedQuery.status !== "closed" && (
                    <div className="border-t pt-4 sm:pt-6">
                      <div className="flex gap-3 sm:gap-4">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-violet-400 to-blue-400 text-white text-xs sm:text-sm">
                            CA
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                              Current Admin
                            </span>
                            <Badge variant="outline" className="text-xs self-start xs:self-auto">
                              Composing Response
                            </Badge>
                          </div>
                          <Textarea
                            placeholder="Type your response here..."
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            className="min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                          />
                          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
                            <Button
                              onClick={handleSubmitResponse}
                              disabled={!responseMessage.trim() || isSubmitting}
                              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 h-9 sm:h-10 text-sm sm:text-base"
                            >
                              {isSubmitting ? (
                                <>
                                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                                  <span className="hidden xs:inline">Sending...</span>
                                  <span className="xs:hidden">Send...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                  <span className="hidden xs:inline">Send Response</span>
                                  <span className="xs:hidden">Send</span>
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setResponseMessage("")}
                              className="h-9 sm:h-10 text-sm sm:text-base"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6">
        {notification && (
          <Card
            className={`border-l-4 ${
              notification.type === "success"
                ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                : notification.type === "error"
                  ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p
                  className={`font-medium ${
                    notification.type === "success"
                      ? "text-green-800 dark:text-green-200"
                      : notification.type === "error"
                        ? "text-red-800 dark:text-red-200"
                        : "text-blue-800 dark:text-blue-200"
                  }`}
                >
                  {notification.message}
                </p>
                <Button variant="ghost" size="sm" onClick={() => setNotification(null)} className="h-6 w-6 p-0">
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="relative z-50 flex flex-col gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg p-2 sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Query Management
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
                Manage and respond to vendor queries efficiently
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchQueries()}
              disabled={loading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300 h-8 sm:h-9 lg:h-10"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
        {loading && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
            <SkeletonFilters />
            <div className="space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <SkeletonQueryCard key={index} />
                ))}
              </div>
            </div>
          </>
        )}
        <div
          className="
    grid
    gap-3
    sm:gap-4
    lg:gap-6
    grid-cols-[repeat(auto-fit,minmax(240px,1fr))]
  "
        >
          <StatCard
            title="Total Queries"
            value={stats.total}
            icon={<MessageSquare className="w-6 h-6" />}
            color="red"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
            trend="down"
            trendValue="-5%"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<RefreshCw className="w-6 h-6" />}
            color="blue"
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Closed"
            value={stats.resolved}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="green"
            trend="up"
            trendValue="+15%"
          />
        </div>
        {!loading && !error && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Input
                    placeholder="Search queries by title, description, or vendor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9 sm:h-10 lg:h-11 w-full text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-3 flex-1">
                    <div className="w-full sm:w-auto sm:min-w-[140px] lg:min-w-[160px]">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-auto sm:min-w-[140px] lg:min-w-[160px]">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full h-9 sm:h-10 lg:h-11 text-sm sm:text-base">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                        {filteredQueries.length} queries found
                      </span>
                    </div>
                    {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("")
                          setStatusFilter("all")
                          setCategoryFilter("all")
                        }}
                        className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {!loading && !error && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Queries</h2>
              <Badge variant="secondary" className="text-xs sm:text-sm self-start xs:self-auto">
                {filteredQueries.length} queries
              </Badge>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                      <TableHead className="w-[60px] font-medium">S.No</TableHead>
                      <TableHead className="w-[90px] font-medium">ID</TableHead>
                      <TableHead className="font-medium">Title</TableHead>
                      <TableHead className="font-medium">Vendor</TableHead>
                      <TableHead className="font-medium">Category</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Priority</TableHead>
                      <TableHead className="hidden md:table-cell font-medium">Created</TableHead>
                      <TableHead className="hidden lg:table-cell font-medium">Unread</TableHead>
                      <TableHead className="hidden lg:table-cell font-medium">Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center">
                            <MessageSquare className="w-12 h-12 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">No queries found</p>
                            <p className="text-sm text-muted-foreground">
                              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                                ? "Try adjusting your search or filter criteria"
                                : "No queries have been submitted yet"}
                            </p>
                            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSearchTerm("")
                                  setStatusFilter("all")
                                  setCategoryFilter("all")
                                }}
                                className="mt-4"
                              >
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedQueries.map((query, index) => (
                        <TableRow
                          key={query.id}
                          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          onClick={() => {
                            setSelectedQuery(query)
                            setCurrentView("details")
                          }}
                        >
                          <TableCell className="font-mono text-xs font-medium">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>
                          <TableCell className="font-mono text-xs font-medium">{query.id}</TableCell>

                          <TableCell className="max-w-[320px]">
                            <div className="font-medium truncate">{query.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{query.description}</div>
                          </TableCell>

                          <TableCell className="max-w-[220px]">
                            <div className="flex items-center gap-2">
                              <div className="truncate">
                                <div className="font-medium text-sm">{query.vendorName}</div>
                                {query.vendorEmail ? (
                                  <div className="text-xs text-muted-foreground truncate">{query.vendorEmail}</div>
                                ) : null}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {query.category}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${
                                query.status === "pending"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : query.status === "in-progress"
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : query.status === "resolved"
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border-slate-200 bg-slate-50 text-slate-700"
                              }`}
                            >
                              {query.status}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  query.priority === "urgent"
                                    ? "bg-red-500"
                                    : query.priority === "high"
                                      ? "bg-orange-500"
                                      : query.priority === "medium"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                }`}
                              />
                              <span className="capitalize text-xs">{query.priority}</span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden md:table-cell text-xs">
                            {new Date(query.createdAt).toLocaleDateString()}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            {query.unreadCount > 0 ? (
                              <Badge variant="destructive" className="text-xs">
                                {query.unreadCount}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">0</span>
                            )}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell text-xs">
                            {query.assignedTo || (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination Component */}
              {filteredQueries.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredQueries.length}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}