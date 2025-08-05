"use client"

import Image from "next/image";
import type React from "react"
import { useEffect, useState } from "react"
import {
  Upload,
  Plus,
  X,
  Sparkles,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Camera,
  Folder,
  Tag,
  Globe,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import axiosInstance from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
  industry: string
  description: string
  metaTitle: string
  metaDescription: string
  image: string | null
  createdAt: string
  featured: boolean
  showInMenu: boolean
}

interface Industry {
  industry_id: string
  industry_name: string
  industry_slug: string
  is_active: boolean
  timestamp: string
}

export default function CategoryPage() {
  const [categoryName, setCategoryName] = useState("")
   const [slug, setSlug] = useState("")
  const [industry, setIndustry] = useState("")
  const [parentCategory, setParentCategory] = useState("none")
  const [description, setDescription] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [showInMenu, setShowInMenu] = useState(true)
  const [featured, setFeatured] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {

    const slugify = (text: string) => {

      return text

        .toLowerCase()

        .trim()

        .replace(/[^\w\s-]/g, '')

        .replace(/\s+/g, '-')

        .replace(/-+/g, '-')

    }

    setSlug(slugify(categoryName))

  }, [categoryName])

  // Calculate form completion progress
  useEffect(() => {
    const requiredFields = [categoryName, slug, parentCategory === "none" ? industry : "filled"]
    const optionalFields = [description, metaTitle, metaDescription, image]

    const requiredComplete = requiredFields.filter((field) => field.trim()).length
    const optionalComplete = optionalFields.filter((field) => field).length

    const progress = (requiredComplete / requiredFields.length) * 60 + (optionalComplete / optionalFields.length) * 40
    setFormProgress(Math.round(progress))
  }, [categoryName, industry, parentCategory, description, metaTitle, metaDescription, image])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/", {
          params: { status_filter: null },
        })
        if (response.data.statusCode === 200) {
          const fetchedCategories: Category[] = response.data.data.map((cat: any) => ({
            id: cat.category_id,
            name: cat.category_name,
            slug: cat.category_slug || cat.category_name.toLowerCase().replace(/\s+/g, '-'),
            industry: cat.industry_name || "Other",
            description: cat.category_description || "",
            metaTitle: cat.category_meta_title || "",
            metaDescription: cat.category_meta_description || "",
            image: cat.category_img_thumbnail || null,
            createdAt: cat.category_tstamp?.split("T")[0] || new Date().toISOString().split("T")[0],
            status: cat.category_status ? "Active" : "Inactive",
            showInMenu: cat.show_in_menu,
          }))
          setCategories(fetchedCategories)
          setError(null)
        } else {
          throw new Error("Failed to fetch categories")
        }
      } catch (err) {
        setError("Failed to fetch categories. Please try again.")
        console.error(err)
      }
    }

    const fetchIndustries = async () => {
      try {
        const response = await axiosInstance.get("/industries/", {
          params: { is_active: null },
        })
        if (response.data.statusCode === 200) {
          setIndustries(response.data.data)
        } else {
          throw new Error("Failed to fetch industries")
        }
      } catch (err) {
        setError("Failed to fetch industries. Please try again.")
        console.error(err)
      }
    }

    Promise.all([fetchCategories(), fetchIndustries()]).finally(() => setLoading(false))
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    setImage(file)
    toast.success("Image uploaded successfully!")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelection(file)
    }
  }

  const resetForm = () => {
    setCategoryName("")
    setSlug("")
    setIndustry("")
    setParentCategory("none")
    setDescription("")
    setMetaTitle("")
    setMetaDescription("")
    setShowInMenu(true)
    setFeatured(true)
    setImage(null)
    setFormProgress(0)
  }

  const validateForm = () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required")
      return false
    }

    if (parentCategory === "none" && !industry) {
      toast.error("Please select an industry for main categories")
      return false
    }

    return true
  }

  const handleAddCategory = async () => {
    if (!validateForm()) return

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("name", categoryName)
      if (parentCategory === "none") {
        formData.append("industry_id", industry)
      } else {
        formData.append("category_id", parentCategory)
      }
      formData.append("slug", slug)
      formData.append("description", description)
      formData.append("meta_title", metaTitle)
      formData.append("meta_description", metaDescription)
      formData.append("featured", "false")
      formData.append("show_in_menu", showInMenu.toString())
      formData.append("featured", featured.toString())
      if (image) {
        formData.append("file", image)
      }

      const response = await axiosInstance.post("/categories/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.data.statusCode === 201) {
        const newCategory: Category = {
          id: parentCategory !== "none" ? response.data.data.subcategory_id : response.data.data.category_id,
          name: categoryName,
           slug,
          industry:
            parentCategory !== "none"
              ? categories.find((cat) => cat.id === parentCategory)?.industry || "Other"
              : industry,
          description,
          metaTitle,
          metaDescription,
          image: image ? URL.createObjectURL(image) : null,
          createdAt: new Date().toISOString().split("T")[0],
          featured,
          showInMenu,
        }
        setCategories((prev) => [...prev, newCategory])
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>
              {parentCategory !== "none" ? "Subcategory created successfully!" : "Category created successfully!"}
            </span>
          </div>,
        )
        resetForm()

        router.push("/category")
      } else {
        throw new Error(response.data.message || "Failed to create category")
      }
    } catch (error: any) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>{error.response?.data?.message || "Failed to create category. Please try again."}</span>
        </div>,
      )
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 lg:p-8">
        <div className="container mx-auto max-w-7xl space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl animate-pulse" />
              <div className="h-8 w-48 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg animate-pulse" />
            </div>
            <div className="h-6 w-96 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mx-auto" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <div className="h-[800px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl animate-pulse" />
              <div className="h-96 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto max-w-7xl p-4 lg:p-8 space-y-8">
        {/* Error Message */}
        {error && (
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/90 to-rose-100/90 backdrop-blur-sm dark:border-red-800/50 dark:from-red-950/40 dark:to-rose-950/40 shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-2xl bg-red-100 p-3 dark:bg-red-900/40">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-100">Unable to Load Data</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Category Studio
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Design & manage your product categories</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Category Form */}
          <div className="xl:col-span-2">
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-slate-200/50 dark:border-slate-700/50 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {parentCategory !== "none" ? "Create Subcategory" : "Create Category"}
                      </CardTitle>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Fill in the details to create a new {parentCategory !== "none" ? "subcategory" : "category"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {formProgress}% Complete
                  </Badge>
                </div>
                <Progress value={formProgress} className="mt-4 h-2" />
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <label className="text-lg font-semibold text-slate-700 dark:text-slate-300">Category Image</label>
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  </div>

                  <div
                    className={`relative group transition-all duration-300 ${dragActive ? "scale-105" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center h-64 w-full border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
                        dragActive
                          ? "border-blue-400 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30 scale-105"
                          : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                      } bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-950/50 hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30`}
                    >
                      {image ? (
                        <div className="relative w-full h-full group">
                          <Image
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-3xl"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
                            <div className="text-white text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-medium">Change Image</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-4 right-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={(e) => {
                              e.preventDefault()
                              setImage(null)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <div className="p-6 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Upload className="w-10 h-10" />
                          </div>
                          <p className="text-xl font-semibold mb-2">Drop your image here</p>
                          <p className="text-sm text-slate-400 mb-2">or click to browse</p>
                          <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </label>
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        Category Name
                        <Badge className="text-xs bg-red-700">
                          Required
                        </Badge>
                      </label>
                      <Input
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                     <div className="space-y-3">

                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">

                        Slug

                        <Badge className="text-xs bg-red-700">

                          Required

                        </Badge>

                      </label>

                      <Input

                        placeholder="Enter slug"

                        value={slug}

                        onChange={(e) => setSlug(e.target.value)}

                        className="h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

                      />

                    </div>

                    {parentCategory === "none" && (
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          Industry
                          <Badge className="text-xs bg-red-700">
                            Required
                          </Badge>
                        </label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger className="h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind.industry_id} value={ind.industry_id}>
                                {ind.industry_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Folder className="w-4 h-4" />
                        Parent Category
                        <Badge className="text-xs bg-gray-200 text-black">
                          Optional
                        </Badge>
                      </label>
                      <Select value={parentCategory} onValueChange={setParentCategory}>
                        <SelectTrigger className="h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl">
                          <SelectValue placeholder="Select parent category (for subcategory)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Main Category)</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                    <Textarea
                      placeholder="Enter category description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl min-h-[120px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <Separator className="my-8" />

                {/* SEO Settings */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">SEO Settings</h3>
                    <Badge className="text-xs bg-gray-200 text-black">
                      Optional
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Meta Title</label>
                      <Input
                        placeholder="Enter meta title"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Meta Description
                      </label>
                      <Textarea
                        placeholder="Enter meta description"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Visibility Settings */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Visibility Settings</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Show in Menu
                          </label>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Display this category in navigation menus
                        </p>
                      </div>
                      <Switch
                        checked={showInMenu}
                        onCheckedChange={setShowInMenu}
                        className="data-[state=checked]:bg-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border border-green-100 dark:border-green-800/30">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Featured Category
                          </label>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Make this category visible to users
                        </p>
                      </div>
                      <Switch
                        checked={featured}
                        onCheckedChange={setFeatured}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-8">
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 h-14 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 bg-transparent"
                    disabled={submitting}
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Reset Form
                  </Button>
                  <Button
                    onClick={handleAddCategory}
                    className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting || !categoryName.trim() || (parentCategory === "none" && !industry)}
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {parentCategory !== "none" ? "Create Subcategory" : "Create Category"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Progress & Tips */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-slate-200/50 dark:border-slate-700/50">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Form Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completion</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formProgress}%</span>
                  </div>
                  <Progress value={formProgress} className="h-3" />
                  <div className="space-y-2 text-xs">
                    <div
                      className={`flex items-center gap-2 ${categoryName ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Category Name
                    </div>
                    <div
                      className={`flex items-center gap-2 ${parentCategory !== "none" || industry ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Industry/Parent
                    </div>
                    <div
                      className={`flex items-center gap-2 ${description ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Description
                    </div>
                    <div
                      className={`flex items-center gap-2 ${image ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Category Image
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-slate-200/50 dark:border-slate-700/50">
                <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Use descriptive names that clearly identify your category's purpose</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Add high-quality images to make categories more visually appealing</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Write SEO-friendly meta descriptions to improve search visibility</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Organize related categories under parent categories for better structure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
