
"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  Crown,
  User,
  Store,
  Grid3X3,
  List,
  TrendingUp,
  Loader2,
  MoreHorizontal,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"

// Enhanced StatCard Component with better responsive design
function StatCard({
  title,
  value,
  icon,
  color = "slate",
  trend,
  trendValue,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color?: "slate" | "emerald" | "red" | "blue" | "amber" | "violet" | "cyan"
  trend?: "up" | "down"
  trendValue?: string
}) {
  const colorClasses = {
    slate: "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700",
    emerald:
      "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700",
    red: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700",
    blue: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700",
    amber:
      "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700",
    violet:
      "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 border-violet-200 dark:border-violet-700",
    cyan: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border-cyan-200 dark:border-cyan-700",
  }

  const iconColors = {
    slate: "text-slate-600 dark:text-slate-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    red: "text-red-600 dark:text-red-400",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    violet: "text-violet-600 dark:text-violet-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
  }

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}
    >
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{value}</p>
              {trend && trendValue && (
                <div
                  className={`flex items-center text-xs font-medium ${
                    trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp className={`w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
                  <span className="hidden sm:inline">{trendValue}</span>
                </div>
              )}
            </div>
          </div>
          <div
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${iconColors[color]} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mobile User Card Component
function UserCard({
  user,
  onDeactivate,
  onReactivate,
}: { user: any; onDeactivate: (userId: string) => void; onReactivate: (userId: string) => void }) {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [showReactivateDialog, setShowReactivateDialog] = useState(false)

  const handleDeactivateConfirm = async () => {
    await onDeactivate(user.user_id)
    setShowDeactivateDialog(false)
    toast.success(`${user.name} has been successfully deactivated.`, {
      description: "User Deactivated",
    })
  }

  const handleReactivateConfirm = async () => {
    await onReactivate(user.user_id)
    setShowReactivateDialog(false)
    toast.success(`${user.name} has been successfully reactivated.`, {
      description: "User Reactivated",
    })
  }

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-xs sm:text-sm truncate">{user.name}</h3>
                {/* <p className="text-xs text-muted-foreground truncate">ID: {user.user_id}</p> */}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                  <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {user.status === "Active" ? (
                  <DropdownMenuItem onClick={() => setShowDeactivateDialog(true)} className="text-red-600 text-sm">
                    <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Deactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setShowReactivateDialog(true)} className="text-emerald-600 text-sm">
                    <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Reactivate
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone_number && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{user.phone_number}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Badge variant={user.status === "Active" ? "default" : "secondary"} className="text-xs flex-shrink-0">
              {user.status}
            </Badge>
            <span className="text-xs font-medium truncate">{user.role}</span>
          </div>
        </CardContent>
      </Card>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {user.name}? This will restrict their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateConfirm} className="bg-red-600 hover:bg-red-700">
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate Confirmation Dialog */}
      <AlertDialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reactivate {user.name}? This will restore their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReactivateConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              Reactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface UserInterface {
  user_id: string
  name: string
  email: string
  role: string
  status: string
  phone_number?: string
  created_at: string
  last_active: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState<string | null>(null)
  const [showReactivateDialog, setShowReactivateDialog] = useState<string | null>(null)

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/users/users")
        const usersData = response.data.data.users.map((user: any) => ({
          user_id: user.user_id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          email: user.email,
          role: user.role || "User",
          status: user.is_active ? "Inactive" : "Active",
          phone_number: user.phone_number,
          created_at: user.created_at,
          last_active: user.last_active || user.created_at,
        }))
        setUsers(usersData)
      } catch (err) {
        setError("Failed to fetch users. Please try again later.")
        console.error("Error fetching users:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filtered users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [users, searchTerm, statusFilter])

  // Enhanced statistics with trends
  const stats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "Active").length
    const inactiveUsers = users.filter((u) => u.status === "Inactive").length
    const adminUsers = users.filter((u) => u.role === "Admin").length
    const managerUsers = users.filter((u) => u.role === "Manager").length
    const employeeUsers = users.filter((u) => u.role === "Employee").length
    const vendorUsers = users.filter((u) => u.role === "Vendor").length
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      admin: adminUsers,
      customers: managerUsers,
      employee: employeeUsers,
      vendor: vendorUsers,
    }
  }, [users])

  const handleDeactivateUser = async (userId: string) => {
    try {
      const response = await axiosInstance.patch(`/users/soft-delete/${userId}`)
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((user) =>
            user.user_id === userId ? { ...user, status: "Inactive" } : user
          )
        )
        const user = users.find(u => u.user_id === userId)
        toast.success(`${user?.name} has been successfully deactivated.`, {
          description: "User Deactivated",
        })
      }
    } catch (error) {
      console.error("Error deactivating user:", error)
      toast.error("Failed to deactivate user. Please try again.", {
        description: "Error",
      })
    } finally {
      setShowDeactivateDialog(null)
    }
  }

  const handleReactivateUser = async (userId: string) => {
    try {
      const response = await axiosInstance.patch(`/users/restore/${userId}`)
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((user) =>
            user.user_id === userId ? { ...user, status: "Active" } : user
          )
        )
        const user = users.find(u => u.user_id === userId)
        toast.success(`${user?.name} has been successfully reactivated.`, {
          description: "User Reactivated",
        })
      }
    } catch (error) {
      console.error("Error reactivating user:", error)
      toast.error("Failed to reactivate user. Please try again.", {
        description: "Error",
      })
    } finally {
      setShowReactivateDialog(null)
    }
  }

  const handleExportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Role", "Status", "Join Date", "Last Active"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.phone_number || "",
        user.role,
        user.status,
        user.created_at,
        user.last_active,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Page Header */}
        <div className="relative z-50 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-2 sm:p-3 lg:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              End Users Management
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              View and manage end user accounts
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end ml-20 gap-3 sm:gap-4 px-3 sm:px-4 lg:px-0">
            <Button
              variant="outline"
              onClick={handleExportUsers}
              className="flex items-center gap-1 sm:gapORN:2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 bg-transparent px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
          <StatCard
            title="Total Users"
            value={stats.total.toString()}
            icon={<Users />}
            color="cyan"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Active Users"
            value={stats.active.toString()}
            icon={<UserCheck />}
            color="emerald"
            trend="up"
            trendValue="+5%"
          />
          <StatCard
            title="Inactive Users"
            value={stats.inactive.toString()}
            icon={<UserX />}
            color="red"
          />
          {/* <StatCard
            title="New Users"
            value={stats.customers.toString()}
            icon={<User />}
            color="violet"
          /> */}
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3 sm:w-4 sm:h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 h-9 sm:h-10 lg:h-11 transition-all duration-300 focus:ring-2 focus:ring-violet-500/20 text-sm"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-2 sm:gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 sm:w-40 h-9 sm:h-10 lg:h-11 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-lg p-0.5 sm:p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <List className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Filters Toggle */}
              <div className="flex md:hidden items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  Filters
                </Button>

                <div className="flex items-center border rounded-lg p-0.5 sm:p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <List className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {mobileFiltersOpen && (
              <div className="md:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t grid grid-cols-2 gap-2 sm:gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 sm:h-10 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Display */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-900/20 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                <h3 className="text-base sm:text-lg font-semibold">Users ({filteredUsers.length})</h3>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                {filteredUsers.length} of {users.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
  {isLoading ? (
    <div className="flex justify-center items-center py-8 sm:py-12">
      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-violet-600" />
    </div>
  ) : error ? (
    <div className="text-center py-8 sm:py-12 px-4">
      <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-2">{error}</h3>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="mt-3 sm:mt-4 text-sm px-3 py-2"
      >
        Retry
      </Button>
    </div>
  ) : viewMode === "grid" ? (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 sm:gap-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.user_id}
            user={user}
            onDeactivate={handleDeactivateUser}
            onReactivate={handleReactivateUser}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-sm font-semibold">User</TableHead>
            <TableHead className="text-sm font-semibold">Contact</TableHead>
            <TableHead className="text-sm font-semibold">Role</TableHead>
            <TableHead className="text-sm font-semibold">Status</TableHead>
            <TableHead className="text-right text-sm font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.user_id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white font-semibold text-xs lg:text-sm flex-shrink-0">
                    {user.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm lg:text-base truncate">{user.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs lg:text-sm">
                    <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate max-w-[150px] lg:max-w-[200px]">{user.email}</span>
                  </div>
                  {user.phone_number && (
                    <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{user.phone_number}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center gap-2">
                  {user.role === "Admin" && <Crown className="w-3 h-3 lg:w-4 lg:h-4 text-amber-600 flex-shrink-0" />}
                  {user.role === "Manager" && <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 flex-shrink-0" />}
                  {user.role === "Employee" && <User className="w-3 h-3 lg:w-4 lg:h-4 text-emerald-600 flex-shrink-0" />}
                  {user.role === "Vendor" && <Store className="w-3 h-3 lg:w-4 lg:h-4 text-violet-600 flex-shrink-0" />}
                  <span className="font-medium text-sm lg:text-base">{user.role}</span>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <Badge
                  variant={user.status === "Active" ? "default" : "secondary"}
                  className={`text-xs ${
                    user.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="py-3">
                <div className="flex justify-end gap-1">
                  {user.status === "Active" ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowDeactivateDialog(user.user_id)}
                      className="h-7 w-7 lg:h-8 lg:w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                    >
                      <UserX className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowReactivateDialog(user.user_id)}
                      className="h-7 w-7 lg:h-8 lg:w-8 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                    >
                      <UserCheck className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )}
  {filteredUsers.length === 0 && !isLoading && !error && (
    <div className="text-center py-8 sm:py-12 px-4">
      <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-2">No users found</h3>
      <p className="text-sm sm:text-base text-muted-foreground">Try adjusting your search or filter criteria</p>
    </div>
  )}
</CardContent>
        </Card>

        {/* Desktop Confirmation Dialogs */}
        {showDeactivateDialog && (
          <AlertDialog open={!!showDeactivateDialog} onOpenChange={() => setShowDeactivateDialog(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to deactivate {users.find(u => u.user_id === showDeactivateDialog)?.name}? This will restrict their access to the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeactivateUser(showDeactivateDialog!)} className="bg-red-600 hover:bg-red-700">
                  Deactivate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {showReactivateDialog && (
          <AlertDialog open={!!showReactivateDialog} onOpenChange={() => setShowReactivateDialog(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reactivate User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reactivate {users.find(u => u.user_id === showReactivateDialog)?.name}? This will restore their access to the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleReactivateUser(showReactivateDialog!)} className="bg-emerald-600 hover:bg-emerald-700">
                  Reactivate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}