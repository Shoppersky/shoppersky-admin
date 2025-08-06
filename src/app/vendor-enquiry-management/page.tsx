"use client"

import type React from "react"

import { useState, useMemo } from "react"
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
  CheckCircle,
  User,
  Calendar,
  Archive,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Timer,
  CheckCircle2,
  XCircle,
  Mail,
  Tag,
  Zap,
  Eye,
  UserCheck,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
}

interface FollowUp {
  id: string
  message: string
  sender: "vendor" | "admin"
  senderName: string
  createdAt: string
}

// Enhanced StatCard Component
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
    slate: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700",
    emerald:
      "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700",
    blue: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700",
    violet:
      "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 border-violet-200 dark:border-violet-700",
    amber:
      "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700",
    rose: "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-700",
  }

  const iconColors = {
    slate: "text-slate-600 dark:text-slate-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    violet: "text-violet-600 dark:text-violet-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-600 dark:text-rose-400",
  }

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && trendValue && (
                <div
                  className={`flex items-center text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-rose-600"}`}
                >
                  <TrendingUp className={`w-3 h-3 mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
                  {trendValue}
                </div>
              )}
            </div>
          </div>
          <div
            className={`p-3 rounded-xl ${iconColors[color]} group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Query Card Component
function QueryCard({
  query,
  onClick,
}: {
  query: Query
  onClick: () => void
}) {
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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${priorityConfig.color}`} />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors line-clamp-1">
                {query.title}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{query.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserCheck className="w-4 h-4 mr-2" />
                Assign to Me
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-violet-400 to-blue-400 text-white text-xs">
                {query.vendorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{query.vendorName}</p>
              <p className="text-xs text-muted-foreground truncate">{query.vendorEmail}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {query.category}
              </Badge>
              <Badge className={`${statusConfig.color} text-xs border`}>
                {statusConfig.icon}
                <span className="ml-1">{query.status}</span>
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">{new Date(query.createdAt).toLocaleDateString()}</div>
          </div>

          {query.assignedTo && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserCheck className="w-3 h-3" />
              <span>Assigned to {query.assignedTo}</span>
            </div>
          )}

          {query.followUps.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <MessageCircle className="w-3 h-3" />
              <span>
                {query.followUps.length} follow-up{query.followUps.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  // Mock data with enhanced fields
  const [queries, setQueries] = useState<Query[]>([
    {
      id: "QRY-001",
      title: "Event Setup Issue",
      category: "Technical",
      status: "pending",
      priority: "high",
      description:
        "Having trouble setting up the event venue details. The location field is not accepting my input and keeps showing validation errors.",
      vendorEmail: "vendor@example.com",
      vendorName: "John Vendor",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      followUps: [],
    },
    {
      id: "QRY-002",
      title: "Payment Gateway Integration",
      category: "Payment",
      status: "in-progress",
      priority: "urgent",
      description:
        "Need assistance with integrating the payment gateway for ticket sales. Getting error codes during checkout process.",
      vendorEmail: "vendor@example.com",
      vendorName: "John Vendor",
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
      adminResponse: "We're looking into this issue. Our technical team is working on a solution.",
      adminName: "Sarah Admin",
      assignedTo: "Sarah Admin",
      followUps: [
        {
          id: "FU-001",
          message:
            "The solution you provided didn't work. I'm still getting the same error. Can you provide more specific steps?",
          sender: "vendor",
          senderName: "John Vendor",
          createdAt: "2024-01-16T15:30:00Z",
        },
      ],
    },
    {
      id: "QRY-003",
      title: "Bulk Ticket Upload",
      category: "Feature Request",
      status: "resolved",
      priority: "medium",
      description:
        "How can I upload multiple ticket types at once? The current interface only allows single ticket creation.",
      vendorEmail: "vendor@example.com",
      vendorName: "John Vendor",
      createdAt: "2024-01-13T11:20:00Z",
      updatedAt: "2024-01-14T16:45:00Z",
      adminResponse:
        "You can use the bulk upload feature in the ticket management section. I've sent you a detailed guide via email.",
      adminName: "Mike Admin",
      assignedTo: "Mike Admin",
      followUps: [],
    },
    {
      id: "QRY-004",
      title: "Account Verification Documents",
      category: "Account",
      status: "pending",
      priority: "medium",
      description:
        "What documents are required for business account verification? I've submitted my business license but haven't heard back.",
      vendorEmail: "jane@business.com",
      vendorName: "Jane Smith",
      createdAt: "2024-01-16T08:45:00Z",
      updatedAt: "2024-01-16T08:45:00Z",
      followUps: [],
    },
    {
      id: "QRY-005",
      title: "Commission Structure Clarification",
      category: "Billing",
      status: "closed",
      priority: "low",
      description:
        "Can you explain how the commission structure works for different event categories? The documentation is unclear.",
      vendorEmail: "mike@events.com",
      vendorName: "Mike Johnson",
      createdAt: "2024-01-12T14:30:00Z",
      updatedAt: "2024-01-13T10:15:00Z",
      adminResponse:
        "Our commission structure varies by category: Music Events (8%), Sports (10%), Conferences (12%). You can find detailed information in your vendor dashboard under 'Commission Rates'.",
      adminName: "Sarah Admin",
      assignedTo: "Sarah Admin",
      followUps: [],
    },
  ])

  const categories = ["Technical", "Payment", "Feature Request", "Account", "Billing", "Other"]
  const admins = ["Sarah Admin", "Mike Admin", "Alex Rodriguez", "Emma Wilson"]

  const filteredQueries = useMemo(() => {
    return queries.filter((query) => {
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
  }, [queries, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const stats = useMemo(() => {
    const totalQueries = queries.length
    const pendingQueries = queries.filter((q) => q.status === "pending").length
    const inProgressQueries = queries.filter((q) => q.status === "in-progress").length
    const resolvedQueries = queries.filter((q) => q.status === "resolved").length
    const urgentQueries = queries.filter((q) => q.priority === "urgent").length
    const avgResponseTime = "2.5 hrs" // Mock data

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
      setSelectedQuery({ ...selectedQuery, status: newStatus as any, updatedAt: new Date().toISOString() })
    }
  }

  const handleAssignQuery = (queryId: string, adminName: string) => {
    setQueries(
      queries.map((query) =>
        query.id === queryId ? { ...query, assignedTo: adminName, updatedAt: new Date().toISOString() } : query,
      ),
    )
    if (selectedQuery?.id === queryId) {
      setSelectedQuery({ ...selectedQuery, assignedTo: adminName, updatedAt: new Date().toISOString() })
    }
  }

  const handleSubmitResponse = async () => {
    if (!responseMessage.trim() || !selectedQuery) return

    setIsSubmitting(true)
    setTimeout(() => {
      const updatedQuery = {
        ...selectedQuery,
        adminResponse: responseMessage,
        adminName: "Current Admin",
        status: "in-progress" as const,
        updatedAt: new Date().toISOString(),
      }
      setQueries(queries.map((query) => (query.id === selectedQuery.id ? updatedQuery : query)))
      setSelectedQuery(updatedQuery)
      setResponseMessage("")
      setIsSubmitting(false)
    }, 1000)
  }

  const handleSubmitFollowUpResponse = async (followUpMessage: string) => {
    if (!followUpMessage.trim() || !selectedQuery) return

    const newFollowUp: FollowUp = {
      id: `FU-${Date.now()}`,
      message: followUpMessage,
      sender: "admin",
      senderName: "Current Admin",
      createdAt: new Date().toISOString(),
    }

    const updatedQuery = {
      ...selectedQuery,
      followUps: [...selectedQuery.followUps, newFollowUp],
      updatedAt: new Date().toISOString(),
    }
    setQueries(queries.map((query) => (query.id === selectedQuery.id ? updatedQuery : query)))
    setSelectedQuery(updatedQuery)
  }

  if (currentView === "details" && selectedQuery) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentView("list")}
              className="shrink-0 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-violet-700 to-blue-700 bg-clip-text text-transparent">
                Query Details
              </h1>
              <p className="text-muted-foreground mt-1">Manage query communication and resolution</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Query Information */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-900/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedQuery.title}</h2>
                      <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                        {selectedQuery.id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{selectedQuery.vendorName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{selectedQuery.vendorEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedQuery.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        selectedQuery.status === "pending"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : selectedQuery.status === "in-progress"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : selectedQuery.status === "resolved"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-700"
                      }
                    >
                      {selectedQuery.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Description</h4>
                    <p className="text-muted-foreground leading-relaxed">{selectedQuery.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Category</span>
                      <p className="text-slate-900 dark:text-slate-100">{selectedQuery.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Priority</span>
                      <p className="text-slate-900 dark:text-slate-100 capitalize">{selectedQuery.priority}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Assigned To</span>
                      <p className="text-slate-900 dark:text-slate-100">{selectedQuery.assignedTo || "Unassigned"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversation Thread */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                  Conversation Thread
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Original Query */}
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-violet-400 text-white">
                        {selectedQuery.vendorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {selectedQuery.vendorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedQuery.createdAt).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Original Query
                        </Badge>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <p className="text-slate-700 dark:text-slate-300">{selectedQuery.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Response */}
                  {selectedQuery.adminResponse && (
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-400 text-white">
                          {selectedQuery.adminName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {selectedQuery.adminName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(selectedQuery.updatedAt).toLocaleString()}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            Admin Response
                          </Badge>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                          <p className="text-slate-700 dark:text-slate-300">{selectedQuery.adminResponse}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Follow-ups */}
                  {selectedQuery.followUps.map((followUp) => (
                    <div key={followUp.id} className="flex gap-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback
                          className={`${followUp.sender === "vendor" ? "bg-gradient-to-br from-blue-400 to-violet-400" : "bg-gradient-to-br from-emerald-400 to-blue-400"} text-white`}
                        >
                          {followUp.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {followUp.senderName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(followUp.createdAt).toLocaleString()}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${followUp.sender === "vendor" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
                          >
                            {followUp.sender === "vendor" ? "Follow-up" : "Admin Follow-up"}
                          </Badge>
                        </div>
                        <div
                          className={`rounded-lg p-4 border ${followUp.sender === "vendor" ? "bg-slate-50 dark:bg-slate-800" : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"}`}
                        >
                          <p className="text-slate-700 dark:text-slate-300">{followUp.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Response Form */}
                  <div className="border-t pt-6">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-violet-400 to-blue-400 text-white">
                          CA
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">Current Admin</span>
                          <Badge variant="outline" className="text-xs">
                            Composing Response
                          </Badge>
                        </div>
                        <Textarea
                          placeholder="Type your response here..."
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          className="min-h-[120px] resize-none"
                        />
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={handleSubmitResponse}
                            disabled={!responseMessage.trim() || isSubmitting}
                            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                          >
                            {isSubmitting ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Send Response
                              </>
                            )}
                          </Button>
                          <Button variant="outline" onClick={() => setResponseMessage("")}>
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Change Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleStatusChange(selectedQuery.id, "pending")}>
                        <Clock className="w-4 h-4 mr-2" />
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(selectedQuery.id, "in-progress")}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(selectedQuery.id, "resolved")}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(selectedQuery.id, "closed")}>
                        <Archive className="w-4 h-4 mr-2" />
                        Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <User className="w-4 h-4 mr-2" />
                        Assign To
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {admins.map((admin) => (
                        <DropdownMenuItem key={admin} onClick={() => handleAssignQuery(selectedQuery.id, admin)}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          {admin}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="relative z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-3 sm:p-4 lg:p-6 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Query Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Manage and respond to vendor queries efficiently
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <Button variant="outline" className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Queries"
            value={stats.total}
            icon={<MessageSquare className="w-6 h-6" />}
            color="slate"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="w-6 h-6" />}
            color="amber"
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
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="emerald"
            trend="up"
            trendValue="+15%"
          />
          <StatCard
            title="Urgent"
            value={stats.urgent}
            icon={<Zap className="w-6 h-6" />}
            color="rose"
            trend="down"
            trendValue="-3%"
          />
          <StatCard
            title="Avg Response"
            value={stats.avgResponseTime}
            icon={<Timer className="w-6 h-6" />}
            color="violet"
            trend="down"
            trendValue="-20%"
          />
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search queries by title, description, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
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
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
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
          </CardContent>
        </Card>

        {/* Queries Display */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Queries</h2>
            <Badge variant="secondary" className="text-sm">
              {filteredQueries.length} queries
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQueries.map((query) => (
              <QueryCard
                key={query.id}
                query={query}
                onClick={() => {
                  setSelectedQuery(query)
                  setCurrentView("details")
                }}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredQueries.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No queries found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No queries have been submitted yet"}
              </p>
              {(searchTerm || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setPriorityFilter("all")
                    setCategoryFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
