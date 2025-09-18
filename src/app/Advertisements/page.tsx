

"use client"

import { useState, useEffect } from "react"
import { Plus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ConfirmDialog } from "@/components/ConfirmDialog"
import { createAdvertisementColumns } from "./columns"

import { toast } from "sonner"
import { Advertisement } from "./columns"
import { advertisementService } from "@/services/advertisementService"
import { DataTable } from "@/components/ui/data-table"

const initialAdvertisements: Advertisement[] = []

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(initialAdvertisements)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: "" })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    banner: "",
    target_url: "",
    ad_status: true,
  })
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerDimensions, setBannerDimensions] = useState<{ width: number; height: number } | null>(null)
  const [bannerError, setBannerError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    try {
      setLoading(true)
      const data = await advertisementService.getAdvertisements()
      setAdvertisements(data)
    } catch (error) {
      console.error("Error fetching advertisements:", error)
      toast.error("Failed to fetch advertisements")
    } finally {
      setLoading(false)
    }
  }

  const filteredAdvertisements = advertisements.filter((ad) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && ad.ad_status) ||
      (statusFilter === "inactive" && !ad.ad_status)
    return matchesStatus
  })

  const handleEdit = (advertisement: Advertisement) => {
    setEditingAd(advertisement)
    setFormData({
      title: advertisement.title,
      banner: advertisement.banner,
      target_url: advertisement.target_url,
      ad_status: advertisement.ad_status,
    })
    setBannerPreview(advertisement.banner)
    setBannerFile(null)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm({ open: true, id })
  }

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await advertisementService.toggleAdvertisementStatus(id)
      setAdvertisements((prev) =>
        prev.map((ad) => (ad.ad_id === id ? { ...ad, ad_status: !currentStatus } : ad))
      )
      toast.success(`Advertisement ${currentStatus ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      console.error("Error toggling advertisement status:", error)
      toast.error("Failed to update advertisement status")
    }
  }

  const confirmDelete = async () => {
    if (deleteConfirm.id) {
      try {
        setSubmitting(true)
        await advertisementService.deleteAdvertisement(deleteConfirm.id)
        setAdvertisements((prev) => prev.filter((ad) => ad.ad_id !== deleteConfirm.id))
        setDeleteConfirm({ open: false, id: "" })
        toast.success("Advertisement deleted successfully")
      } catch (error) {
        console.error("Error deleting advertisement:", error)
        toast.error("Failed to delete advertisement")
      } finally {
        setSubmitting(false)
      }
    }
  }

  // ✅ Upload + dimension validation
  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }

      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const width = img.width
        const height = img.height
        setBannerDimensions({ width, height })

        const ratio = width / height
        if (Math.abs(ratio - 12) > 0.3) {
          setBannerError(`Invalid size: ${width}×${height}. Expected ~1920×160 (12:1 ratio).`)
          setBannerPreview(null)
          setBannerFile(null)
          return
        }

        setBannerError(null)
        setBannerFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          setBannerPreview(result)
          setFormData((prev) => ({ ...prev, banner: result }))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeBanner = () => {
    setBannerPreview(null)
    setBannerFile(null)
    setBannerDimensions(null)
    setFormData((prev) => ({ ...prev, banner: "" }))
    const fileInput = document.getElementById("banner-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title) {
      toast.error("Please enter a title")
      return
    }
    if (!editingAd && !bannerFile) {
      toast.error("Please select a banner image")
      return
    }

    try {
      setSubmitting(true)
      if (editingAd) {
        const updateData: any = {
          title: formData.title,
          target_url: formData.target_url || undefined,
          ad_status: formData.ad_status,
        }
        if (bannerFile) updateData.banner = bannerFile

        const updatedAd = await advertisementService.updateAdvertisement(editingAd.ad_id, updateData)
        setAdvertisements((prev) => prev.map((ad) => (ad.ad_id === editingAd.ad_id ? updatedAd : ad)))
        toast.success("Advertisement updated successfully")
      } else {
        if (!bannerFile) {
          toast.error("Please select a banner image")
          return
        }
        const createData = {
          title: formData.title,
          banner: bannerFile,
          target_url: formData.target_url || undefined,
          ad_status: formData.ad_status,
        }
        const newAd = await advertisementService.createAdvertisement(createData)
        setAdvertisements((prev) => [newAd, ...prev])
        toast.success("Advertisement created successfully")
      }

      setIsFormOpen(false)
      setEditingAd(null)
      setFormData({ title: "", banner: "", target_url: "", ad_status: true })
      setBannerPreview(null)
      setBannerFile(null)
      setBannerDimensions(null)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      const errorMessage = error.response?.data?.message || "Failed to save advertisement"
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const openCreateForm = () => {
    setEditingAd(null)
    setFormData({ title: "", banner: "", target_url: "", ad_status: true })
    setBannerPreview(null)
    setBannerFile(null)
    setBannerDimensions(null)
    setIsFormOpen(true)
  }

  const columns = createAdvertisementColumns(handleEdit, handleDelete, handleStatusToggle)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advertisements</h1>
          <p className="text-muted-foreground">Manage your advertisement banners and promotional content</p>
        </div>
        <Button onClick={openCreateForm} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Advertisement
        </Button>
      </div>

      {/* Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Advertisement Management</CardTitle>
          <CardDescription>View and manage all your advertisement banners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1"></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="inactive">Active</SelectItem>
                <SelectItem value="active">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DataTable columns={columns} data={filteredAdvertisements} searchKey="title" searchPlaceholder="Search advertisements..." />
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAd ? "Edit Advertisement" : "Create New Advertisement"}</DialogTitle>
            <DialogDescription>
              {editingAd ? "Update the advertisement details." : "Create a new advertisement banner with title, image, and URL."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input placeholder="Enter advertisement title" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} required />
            </div>

            {/* Target URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target URL</label>
              <Input type="url" placeholder="https://example.com (optional)" value={formData.target_url} onChange={(e) => setFormData((prev) => ({ ...prev, target_url: e.target.value }))} />
            </div>

            {/* Banner Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner Image</label>
              {bannerPreview ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover rounded-lg" />
                      {/* ✅ Dimensions badge */}
                      {bannerDimensions && (
                        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                          {bannerDimensions.width}×{bannerDimensions.height}
                        </span>
                      )}
                      <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeBanner}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* ✅ Error message */}
                    {bannerError && <p className="mt-2 text-red-600 text-sm">{bannerError}</p>}
                  </CardContent>
                </Card>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <div className="mt-4">
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">Upload banner image</span>
                        <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 10MB — Recommended size 1920×160</span>
                      </label>
                      <input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                    </div>
                    {bannerError && <p className="mt-2 text-red-600 text-sm">{bannerError}</p>}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (editingAd ? "Updating..." : "Creating...") : editingAd ? "Update Advertisement" : "Create Advertisement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, id: "" })}
        onConfirm={confirmDelete}
        title="Delete Advertisement"
        description="Are you sure you want to delete this advertisement? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
