"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Shield,
  Crown,
  User,
  Store,
  Grid3X3,
  List,
  TrendingUp,
  Activity,
  DollarSign,
  Loader2,
  Eye,
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-bold">{value}</p>
              {trend && trendValue && (
                <div
                  className={`flex items-center text-xs font-medium ${
                    trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}
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

// Mobile User Card Component
function UserCard({
  user,
  onDeactivate,
  onReactivate,
}: { user: any; onDeactivate: (userId: string) => void; onReactivate: (userId: string) => void }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white font-semibold">
              {user.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{user.name}</h3>
              <p className="text-xs text-muted-foreground">ID: {user.user_id}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {user.status === "Active" ? (
                <DropdownMenuItem onClick={() => onDeactivate(user.user_id)} className="text-red-600">
                  <UserX className="w-4 h-4 mr-2" />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onReactivate(user.user_id)} className="text-emerald-600">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Reactivate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone_number && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              {user.phone_number}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={user.status === "Active" ? "default" : "secondary"} className="text-xs">
              {user.status}
            </Badge>
            <span className="text-xs font-medium">{user.role}</span>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold">{user.totalOrders || 0} orders</div>
            <div className="text-xs text-muted-foreground">{user.totalSpent || "$0"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
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
  totalOrders?: number
  totalSpent?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          status: user.status ? "Inactive" : "Active",
          phone_number: user.phone_number,
          created_at: user.created_at,
          last_active: user.last_active || user.created_at,
          totalOrders: user.totalOrders || 0,
          totalSpent: user.totalSpent || "$0",
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
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter

      return matchesSearch && matchesStatus && matchesRole
    })
  }, [users, searchTerm, statusFilter, roleFilter])

  // Enhanced statistics with trends
  const stats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "Active").length
    const inactiveUsers = users.filter((u) => u.status === "Inactive").length
    const adminUsers = users.filter((u) => u.role === "Admin").length
    const managerUsers = users.filter((u) => u.role === "Manager").length
    const employeeUsers = users.filter((u) => u.role === "Employee").length
    const vendorUsers = users.filter((u) => u.role === "Vendor").length
    const totalRevenue = users.reduce((sum, user) => {
      const spent = Number.parseFloat(user.totalSpent?.replace("$", "").replace(",", "") || "0")
      return sum + spent
    }, 0)

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      admin: adminUsers,
      customers: managerUsers,
      employee: employeeUsers,
      vendor: vendorUsers,
      revenue: totalRevenue,
    }
  }, [users])

  const handleDeactivateUser = async (userId: string) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/soft-delete`)
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((user) =>
            user.user_id === userId ? { ...user, status: "Inactive" } : user
          )
        )
      }
    } catch (error) {
      console.error("Error deactivating user:", error)
    }
  }

  const handleReactivateUser = async (userId: string) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/restore`)
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((user) =>
            user.user_id === userId ? { ...user, status: "Active" } : user
          )
        )
      }
    } catch (error) {
      console.error("Error reactivating user:", error)
    }
  }

  const handleExportUsers = () => {
    const csvContent = [
      ["ID", "Name", "Email", "Phone", "Role", "Status", "Join Date", "Last Active", "Total Orders", "Total Spent"],
      ...filteredUsers.map((user) => [
        user.user_id,
        user.name,
        user.email,
        user.phone_number || "",
        user.role,
        user.status,
        user.created_at,
        user.last_active,
        user.totalOrders?.toString() || "0",
        user.totalSpent || "$0",
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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="relative z-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-3 sm:p-4 lg:p-6 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0 ">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Customer Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              View and manage customer accounts
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={handleExportUsers}
              className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 bg-transparent"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Users"
            value={stats.total.toString()}
            icon={<Users className="w-6 h-6" />}
            color="slate"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Active Users"
            value={stats.active.toString()}
            icon={<UserCheck className="w-6 h-6" />}
            color="emerald"
            trend="up"
            trendValue="+5%"
          />
          <StatCard
            title="Inactive Users"
            value={stats.inactive.toString()}
            icon={<UserX className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            title="New Users"
            value={stats.customers.toString()}
            icon={<User className="w-6 h-6" />}
            color="violet"
          />
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Filters Toggle */}
              <div className="flex lg:hidden items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>

                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {mobileFiltersOpen && (
              <div className="lg:hidden mt-4 pt-4 border-t grid grid-cols-2 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Display */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-semibold">Users ({filteredUsers.length})</h3>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {filteredUsers.length} of {users.length}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-red-600 mb-2">{error}</h3>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Activity</TableHead>
                        <TableHead>Performance</TableHead> */}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.user_id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold">{user.name}</div>
                                {/* <div className="text-xs text-muted-foreground">ID: {user.user_id}</div> */}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                <span className="truncate max-w-[200px]">{user.email}</span>
                              </div>
                              {user.phone_number && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {user.phone_number}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {user.role === "Admin" && <Crown className="w-4 h-4 text-amber-600" />}
                              {user.role === "Manager" && <Shield className="w-4 h-4 text-blue-600" />}
                              {user.role === "Employee" && <User className="w-4 h-4 text-emerald-600" />}
                              {user.role === "Vendor" && <Store className="w-4 h-4 text-violet-600" />}
                              <span className="font-medium">{user.role}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === "Active" ? "default" : "secondary"}
                              className={
                                user.status === "Active"
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Activity className="w-3 h-3" />
                                <span>Active {new Date(user.last_active).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </TableCell> */}
                          {/* <TableCell>
                            <div className="text-center">
                              <div className="font-semibold">{user.totalOrders || 0}</div>
                              <div className="text-xs text-muted-foreground">orders</div>
                              <div className="text-sm font-medium text-emerald-600">{user.totalSpent || "$0"}</div>
                            </div>
                          </TableCell> */}
                          <TableCell>
                            <div className="flex justify-end gap-1">
                             
                              {user.status === "Active" ? (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeactivateUser(user.user_id)}
                                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                                >
                                  <UserX className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleReactivateUser(user.user_id)}
                                  className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                                >
                                  <UserCheck className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden p-4 space-y-4">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user.user_id}
                      user={user}
                      onDeactivate={handleDeactivateUser}
                      onReactivate={handleReactivateUser}
                    />
                  ))}
                </div>
              </>
            )}

            {filteredUsers.length === 0 && !isLoading && !error && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No users found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}