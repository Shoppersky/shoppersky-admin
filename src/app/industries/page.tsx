"use client"

import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  Plus,
  Search,
  Download,
  Pencil,
  Trash2,
  Building2,
  Grid3X3,
  List,
  Filter,
  CheckCircle,
  XCircle,
  Sparkles,
  RotateCcw,

} from "lucide-react"
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
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"

interface Industry {
  id: string
  name: string
  slug: string
  status: "Active" | "Inactive"
  createdDate: string
  lastUpdated: string
}

// Simplified StatCard Component with consistent theme
function StatCard({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string
  value: string
  icon: React.ReactNode
  color?: "blue" | "indigo" | "purple" | "green"
}) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          </div>
          <div className={`p-2 sm:p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl shadow-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Simplified IndustryCard Component
function IndustryCard({
  industry,
  onEdit,
  onDelete,
  onRestore,

}: {
  industry: Industry
  onEdit: (industry: Industry) => void
  onDelete: (industry: Industry) => void
  onRestore: (industry: Industry) => void
  onView: (industry: Industry) => void
}) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">{industry.name}</CardTitle>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded truncate">
              {industry.slug}
            </p>
          </div>
          <Badge
            className={`${industry.status === "Active"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              } border-0 text-xs flex-shrink-0 self-start sm:self-auto`}
          >
            {industry.status === "Active" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {industry.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-0 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
          <span className="truncate">Created: {new Date(industry.createdDate).toLocaleDateString()}</span>
          <span className="truncate">Updated: {new Date(industry.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(industry)}
            className="flex-1 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-950/50 text-xs sm:text-sm h-8 sm:h-9"
          >
            <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">Edit</span>
            <span className="xs:hidden">Edit</span>
          </Button>
          {industry.status === "Active" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(industry)}
              className="hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 h-8 sm:h-9 px-2 sm:px-3"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore(industry)}
              className="hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50 h-8 sm:h-9 px-2 sm:px-3"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function IndustriesPage() {
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null)
  const [viewingIndustry, setViewingIndustry] = useState<Industry | null>(null)
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(null)
  const [industryToRestore, setIndustryToRestore] = useState<Industry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  const [newIndustry, setNewIndustry] = useState({
    name: "",
    slug: "",
    status: "Active" as "Active" | "Inactive",
  })

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Fetch industries on mount
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true)
        const params: { is_active?: boolean } = {}
        if (statusFilter === "active") {
          params.is_active = false
        } else if (statusFilter === "inactive") {
          params.is_active = true
        }
        // When statusFilter is "all", omit is_active to fetch all industries
        const response = await axiosInstance.get("/industries/", { params })
        if (response.data.statusCode === 200) {
          const fetchedIndustries: Industry[] = response.data.data.map((ind: any) => ({
            id: ind.industry_id,
            name: ind.industry_name,
            slug: ind.industry_slug,
            status: ind.is_active ? "Inactive" : "Active", // Corrected status mapping
            createdDate: ind.timestamp.split("T")[0],
            lastUpdated: ind.timestamp.split("T")[0],
          }))
          setIndustries(fetchedIndustries)
          setError(null)
        } else {
          throw new Error(response.data.message || "Failed to fetch industries")
        }
      } catch (err: any) {
        console.log(err.response?.data?.message || "Failed to fetch industries. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchIndustries()
  }, [statusFilter])


  // Filtered industries
  const filteredIndustries = useMemo(() => {
    return industries.filter((industry) => {
      const matchesSearch =
        industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        industry.slug.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || industry.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [industries, searchTerm, statusFilter])

  // Statistics
  const stats = useMemo(() => {
    const totalIndustries = industries.length
    const activeIndustries = industries.filter((i) => i.status === "Active").length
    const inactiveIndustries = industries.filter((i) => i.status === "Inactive").length

    return {
      total: totalIndustries,
      active: activeIndustries,
      inactive: inactiveIndustries,
    }
  }, [industries])


  const handleAddIndustry = async () => {
    if (!newIndustry.name.trim()) {
      toast.error("Industry name is required")
      return
    }

    const finalSlug = newIndustry.slug || generateSlug(newIndustry.name)

    try {
      const payload = {
        industry_name: newIndustry.name,
        industry_slug: finalSlug,
      }

      let response
      if (editingIndustry) {
        response = await axiosInstance.put(`/industries/${editingIndustry.id}`, payload)
      } else {
        response = await axiosInstance.post("/industries/", payload)
      }

      if (response.data.statusCode === 200 || response.data.statusCode === 201) {
        const industryData = response.data.data
        const currentDate = new Date().toISOString().split("T")[0]

        if (editingIndustry) {
          const updatedIndustry: Industry = {
            id: industryData.industry_id,
            name: newIndustry.name,
            slug: finalSlug,
            status: editingIndustry ? newIndustry.status : "Active",
            createdDate: editingIndustry ? editingIndustry.createdDate : currentDate,
            lastUpdated: currentDate,
          }

          // Update status if editing and status has changed
          if (editingIndustry && editingIndustry.status !== newIndustry.status) {
            await axiosInstance.patch(`/industries/status/${industryData.industry_id}`, null, {
              params: { is_active: newIndustry.status === "Active" },
            })
          }

          setIndustries((prev) =>
            prev.map((industry) =>
              industry.id === editingIndustry.id ? updatedIndustry : industry
            )
          )
          toast.success("Industry updated successfully!")
        } else {
          const existingIndex = industries.findIndex((i) => i.id === industryData.industry_id)
          if (existingIndex !== -1) {
            // Restored existing deactivated industry
            setIndustries((prev) => {
              const newList = [...prev]
              newList[existingIndex] = {
                ...newList[existingIndex],
                name: newIndustry.name,
                slug: finalSlug,
                status: "Active",
                lastUpdated: currentDate,
              }
              return newList
            })
            toast.success("Industry restored successfully!")
          } else {
            // Truly new industry
            const newIndustryEntry: Industry = {
              id: industryData.industry_id,
              name: newIndustry.name,
              slug: finalSlug,
              status: "Active",
              createdDate: currentDate,
              lastUpdated: currentDate,
            }
            setIndustries([...industries, newIndustryEntry])
            toast.success("Industry created successfully!")
          }
        }

        setNewIndustry({
          name: "",
          slug: "",
          status: "Active",
        })
        setIsSlugManuallyEdited(false)
        setOpen(false)
        setEditingIndustry(null)
      } else {
        throw new Error(response.data.message || "Failed to save industry")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save industry. Please try again.")
      console.error(error)
    }
  }


  const handleOpenAddDialog = () => {
    console.log("Opening add dialog, editingIndustry:", editingIndustry)
    setEditingIndustry(null)
    setNewIndustry({ name: "", slug: "", status: "Active" })
    setIsSlugManuallyEdited(false)
    setOpen(true)
  }

  const handleEditIndustry = (industry: Industry) => {
    console.log("Opening edit dialog for industry:", industry)
    setEditingIndustry(industry)
    setNewIndustry({
      name: industry.name,
      slug: industry.slug,
      status: industry.status,
    })
    setIsSlugManuallyEdited(true)
    setOpen(true)
  }


  const handleViewIndustry = (industry: Industry) => {
    setViewingIndustry(industry)
    setViewOpen(true)
  }

  const handleDeleteIndustry = (industry: Industry) => {
    setIndustryToDelete(industry)
    setDeleteDialogOpen(true)
  }

  const handleRestoreIndustry = (industry: Industry) => {
    setIndustryToRestore(industry)
    setRestoreDialogOpen(true)
  }

  const confirmDeleteIndustry = async () => {
    if (industryToDelete) {
      try {
        const response = await axiosInstance.patch(`/industries/status/${industryToDelete.id}`, null, {
          params: { is_active: true },
        })
        if (response.data.statusCode === 200) {
          setIndustries((prev) =>
            prev.map((industry) =>
              industry.id === industryToDelete.id ? { ...industry, status: "Inactive" } : industry
            )
          )
          toast.success("Industry deactivated successfully!")
        } else {
          throw new Error(response.data.message || "Failed to deactivate industry")
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to deactivate industry. Please try again.")
        console.error(error)
      } finally {
        setDeleteDialogOpen(false)
        setIndustryToDelete(null)
      }
    }
  }

  const confirmRestoreIndustry = async () => {
    if (industryToRestore) {
      try {
        const response = await axiosInstance.patch(`/industries/status/${industryToRestore.id}`, null, {
          params: { is_active: false },
        })
        if (response.data.statusCode === 200) {
          setIndustries((prev) =>
            prev.map((industry) =>
              industry.id === industryToRestore.id ? { ...industry, status: "Active" } : industry
            )
          )
          toast.success("Industry restored successfully!")
        } else {
          throw new Error(response.data.message || "Failed to restore industry")
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to restore industry. Please try again.")
        console.error(error)
      } finally {
        setRestoreDialogOpen(false)
        setIndustryToRestore(null)
      }
    }
  }

  const handleExportIndustries = () => {
    const csvContent = [
      ["Name", "Slug", "Status", "Created Date", "Last Updated"],
      ...filteredIndustries.map((industry) => [

        industry.name,
        industry.slug,
        industry.status,
        industry.createdDate,
        industry.lastUpdated,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "industries.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 sm:space-y-6">
        {/* Error Message */}
        {error && (
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-rose-100/80 backdrop-blur-sm dark:border-red-800/50 dark:from-red-950/30 dark:to-rose-950/30">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Error Loading Data</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="relative z-50 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-2 sm:p-3 lg:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Industry Management
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              Manage your business industries
            </p>
          </div>



          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-end gap-3 sm:gap-4 px-4 sm:px-0">
            <Button
              variant="outline"
              onClick={handleExportIndustries}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 h-11 sm:h-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 text-sm sm:text-base"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Export Data</span>
              <span className="xs:hidden">Export</span>
            </Button>
            <Dialog open={open} onOpenChange={(isOpen) => {
              setOpen(isOpen)
              if (!isOpen) {
                setNewIndustry({ name: "", slug: "", status: "Active" })
                setIsSlugManuallyEdited(false)
                setEditingIndustry(null)
              }
            }}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleOpenAddDialog}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 h-11 sm:h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  <Plus className="w-4 h-4" />
                  <span className="hidden xs:inline">Add New Industry</span>
                  <span className="xs:hidden">Add Industry</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4 sm:mx-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                    {editingIndustry ? "Edit Industry" : "Add New Industry"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Industry Name *
                    </Label>
                    <Input
                      id="name"
                      value={newIndustry.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setNewIndustry({
                          ...newIndustry,
                          name,
                          slug: isSlugManuallyEdited ? newIndustry.slug : generateSlug(name),
                        })
                      }}
                      placeholder="e.g., Technology"
                      className="h-10 sm:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Slug *
                    </Label>
                    <Input
                      id="slug"
                      value={newIndustry.slug}
                      onChange={(e) => {
                        setNewIndustry({ ...newIndustry, slug: e.target.value })
                        setIsSlugManuallyEdited(true)
                      }}
                      placeholder="e.g., technology"
                      className="h-10 sm:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      URL-friendly version of the name (auto-generated unless manually edited)
                    </p>
                  </div>

                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-3">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 sm:h-12 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 text-sm sm:text-base"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleAddIndustry}
                    disabled={!newIndustry.name.trim() || !newIndustry.slug.trim()}
                    className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-sm sm:text-base"
                  >
                    {editingIndustry ? "Update Industry" : "Add Industry"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Total Industries"
            value={stats.total.toString()}
            icon={<Building2 className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Active Industries"
            value={stats.active.toString()}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Inactive Industries"
            value={stats.inactive.toString()}
            icon={<XCircle className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Filters and Search */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="justify-between items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative w-full max-w-screen-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search industries by name or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-12 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-6 items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 sm:h-12 flex items-center rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center justify-end gap-3 w-full">
                  <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 h-10 sm:h-12">
                    <Button
                      variant={viewMode === "cards" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("cards")}
                      className="h-full px-2 sm:px-3"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="h-full px-2 sm:px-3"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-slate-500 text-xs sm:text-sm">
                    {filteredIndustries.length} of {industries.length}
                  </span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Industries Display */}
        {filteredIndustries.length > 0 ? (
          viewMode === "cards" ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 sm:gap-6">
              {filteredIndustries.map((industry) => (
                <IndustryCard
                  key={industry.id}
                  industry={industry}
                  onEdit={handleEditIndustry}
                  onDelete={handleDeleteIndustry}
                  onRestore={handleRestoreIndustry}
                  onView={handleViewIndustry}
                />
              ))}
            </div>
          ) : (
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/50 dark:border-slate-700/50">
                      <tr>
                        <th className="text-left p-2 sm:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Name</th>
                        <th className="text-left p-2 sm:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden xs:table-cell">Slug</th>
                        <th className="text-left p-2 sm:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Status</th>
                        <th className="text-left p-2 sm:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden md:table-cell">
                          Created
                        </th>
                        <th className="text-left p-2 sm:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                          Updated
                        </th>
                        <th className="text-left p-2 sm:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIndustries.map((industry) => (
                        <tr
                          key={industry.id}
                          className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                        >
                          <td className="p-2 sm:p-4">
                            <div className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{industry.name}</div>
                            <div className="xs:hidden mt-1">
                              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300 truncate block max-w-[100px]">
                                {industry.slug}
                              </code>
                            </div>
                          </td>
                          <td className="p-2 sm:p-4 hidden xs:table-cell">
                            <code className="text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300 truncate block max-w-[120px] sm:max-w-none">
                              {industry.slug}
                            </code>
                          </td>
                          <td className="p-2 sm:p-4">
                            <Badge
                              className={`text-xs border-0 ${industry.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                            >
                              {industry.status === "Active" ? (
                                <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                              ) : (
                                <XCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                              )}
                              <span className="hidden sm:inline">{industry.status}</span>
                              <span className="sm:hidden">{industry.status === "Active" ? "A" : "I"}</span>
                            </Badge>
                          </td>
                          <td className="p-2 sm:p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
                            {new Date(industry.createdDate).toLocaleDateString()}
                          </td>
                          <td className="p-2 sm:p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                            {new Date(industry.lastUpdated).toLocaleDateString()}
                          </td>
                          <td className="p-2 sm:p-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditIndustry(industry)}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                              >
                                <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              {industry.status === "Active" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteIndustry(industry)}
                                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/50"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRestoreIndustry(industry)}
                                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-green-50 dark:hover:bg-green-950/50"
                                >
                                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">No Industries Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-6 max-w-md">
                {searchTerm || statusFilter !== "all"
                  ? "No industries match your current filters. Try adjusting your search criteria."
                  : "Get started by adding your first industry to organize your business sectors."}
              </p>

            </CardContent>
          </Card>
        )}

        {/* View Industry Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-md mx-4 sm:mx-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {viewingIndustry && (
                  <>
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Building2 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{viewingIndustry.name}</h3>
                      <p className="text-sm text-slate-500 font-mono">{viewingIndustry.slug}</p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {viewingIndustry && (
              <div className="space-y-4">
                <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-xl p-4 space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</Label>
                    <div className="mt-1">
                      <Badge
                        className={`text-xs border-0 ${viewingIndustry.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                      >
                        {viewingIndustry.status === "Active" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {viewingIndustry.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Created</Label>
                      <p className="text-sm mt-1 text-slate-900 dark:text-slate-100">
                        {new Date(viewingIndustry.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Updated</Label>
                      <p className="text-sm mt-1 text-slate-900 dark:text-slate-100">
                        {new Date(viewingIndustry.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex-1 h-10 sm:h-12 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 text-sm sm:text-base"
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                onClick={() => viewingIndustry && handleEditIndustry(viewingIndustry)}
                className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-sm sm:text-base"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-md mx-4 sm:mx-auto">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-3 shadow-lg">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                    Deactivate Industry
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    This will deactivate the industry, marking it as inactive.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {industryToDelete && (
              <div className="my-6 p-4 bg-red-50/80 dark:bg-red-950/30 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center text-white shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{industryToDelete.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{industryToDelete.slug}</p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel className="flex-1 h-10 sm:h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm sm:text-base">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteIndustry}
                className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-red-600 to-rose-600 shadow-lg hover:from-red-700 hover:to-rose-700 hover:shadow-xl text-white rounded-xl text-sm sm:text-base"
              >
                <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Deactivate Industry</span>
                <span className="xs:hidden">Deactivate</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Restore Confirmation Dialog */}
        <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-md mx-4 sm:mx-auto">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 shadow-lg">
                  <RotateCcw className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold text-green-600 dark:text-green-400">
                    Restore Industry
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    This will restore the industry to active status.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {industryToRestore && (
              <div className="my-6 p-4 bg-green-50/80 dark:bg-green-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{industryToRestore.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{industryToRestore.slug}</p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-3">
              <AlertDialogCancel className="flex-1 h-10 sm:h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm sm:text-base">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRestoreIndustry}
                className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl text-white rounded-xl text-sm sm:text-base"
              >
                <RotateCcw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Restore Industry</span>
                <span className="xs:hidden">Restore</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}