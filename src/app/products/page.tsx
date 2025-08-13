"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  Tag,
  Store,
  LayoutGrid,
  Table,
  ArrowLeft,
  Search,
  TrendingUp,
  Eye,
  ShoppingBag,
  Building2,
  Layers,
  BarChart3,
  Users,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axiosInstance from "@/lib/axiosInstance"
import { cn } from "@/lib/utils"

interface ProductResponse {
  vendor_id: string
  store_name: string | null
  product_id: string
  product_name: string
  product_image: string
  product_slug: string
  category_id: string
  category_name: string
  subcategory_id: string | null
  subcategory_name: string | null
  industry_name: string
}

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  subcategory: string | null;
  storeName: string | null;
  vendorId: string; // Add this to link products to vendors
}

interface Vendor {
  id: string
  storeName: string | null
  productCount: number
}

interface ApiResponse {
  products: ProductResponse[]
  total_count: number
  page: number
  per_page: number
  total_pages: number
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
  className={cn(
    "bg-gradient-to-br",
    colorClasses[color],
    "border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group w-full"
  )}
>
  <CardContent className="p-3 sm:p-5 md:p-6">
    <div className="flex items-center justify-between flex-wrap gap-3">
      {/* Left Section */}
      <div className="space-y-1 flex-1 min-w-[140px]">
        <p className="text-[0.8rem] sm:text-sm font-medium text-muted-foreground">
          {title}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
            {value}
          </p>
          {trend && trendValue && (
            <div
              className={cn(
                "flex items-center text-xs font-medium flex-shrink-0",
                trend === "up" ? "text-emerald-600" : "text-rose-600"
              )}
            >
              <TrendingUp
                className={cn(
                  "w-3 h-3 mr-1",
                  trend === "down" && "rotate-180"
                )}
              />
              <span className="hidden xs:inline">{trendValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Icon */}
      <div
        className={cn(
          "p-2 sm:p-3 rounded-lg sm:rounded-xl",
          iconColors[color],
          "group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
        )}
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

// Enhanced Vendor Card Component
function VendorCard({ vendor, onClick }: { vendor: Vendor; onClick: () => void }) {
  return (
   <Card
  className="group cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] 
             bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg rounded-2xl"
  onClick={onClick}
>
  <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-5">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

    {/* Top Row: Icon + Store name */}
    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
      <div
        className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white 
                   group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300 ease-out flex-shrink-0"
      >
        <Store className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="font-bold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-slate-100 
                     group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors 
                     truncate sm:whitespace-normal sm:line-clamp-2"
        >
          {vendor.storeName || "Unnamed Store"}
        </h3>
      </div>
    </div>

    {/* Dropdown Menu — moves below on mobile */}
    <div className="flex sm:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 
                       sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 sm:w-48 max-w-[90vw] sm:max-w-xs"
        >
          <DropdownMenuItem className="text-sm sm:text-base">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="text-sm sm:text-base">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

  </div>
</CardHeader>

  <CardContent className="pt-0 p-3 sm:p-5">
    <div className="space-y-2 sm:space-y-3">
      {/* Products Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="h-4 w-4" />
          <span className="text-xs sm:text-sm">Products</span>
        </div>
        <Badge
          variant="secondary"
          className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-xs sm:text-sm"
        >
          {vendor.productCount}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min((vendor.productCount / 20) * 100, 100)}%` }}
        />
      </div>

      {/* Performance */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Performance</span>
        <span>{Math.min((vendor.productCount / 20) * 100, 100).toFixed(0)}%</span>
      </div>
    </div>
  </CardContent>
</Card>

  )
}

// Enhanced Product Card Component
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={192}
          className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="icon" variant="secondary" className="h-6 w-6 sm:h-8 sm:w-8 bg-white/90 hover:bg-white">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-6 w-6 sm:h-8 sm:w-8 bg-white/90 hover:bg-white">
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div> */}
        {/* <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm">
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">View Details</span>
            <span className="xs:hidden">View</span>
          </Button>
        </div> */}
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-violet-600 transition-colors">
              {product.name}
            </h3>
           
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Badge variant="outline" className="text-xs">
              <Tag className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
              <span className="truncate max-w-[80px] sm:max-w-none">{product.category || "Uncategorized"}</span>
            </Badge>
            {product.subcategory && (
              <Badge variant="outline" className="text-xs">
                <Layers className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                <span className="truncate max-w-[80px] sm:max-w-none">{product.subcategory}</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground min-w-0 flex-1">
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{product.storeName || "Unknown Store"}</span>
            </div>
            {/* <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
              <span className="text-xs sm:text-sm font-medium">4.5</span>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton Components
function VendorSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-xl" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-6 w-8 bg-muted rounded-full" />
          </div>
          <div className="h-2 w-full bg-muted rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function ProductSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <div className="h-48 bg-muted" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-5 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted rounded-full" />
            <div className="h-6 w-20 bg-muted rounded-full" />
          </div>
          <div className="flex justify-between pt-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductsView() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

 useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ApiResponse>(`/admin/products/all?page=1&per_page=100`);
      console.log("API response:", response.data);

      if (!response.data?.products || !Array.isArray(response.data.products)) {
        setVendors([]);
        setProducts([]);
        setError("No products available.");
        setLoading(false);
        return;
      }

      const mappedProducts: Product[] = response.data.products.map((product) => ({
        id: product.product_id,
        name: product.product_name,
        image: (product.product_image ? product.product_image.replace(/\\/g, "/") : "/placeholder.svg?height=192&width=300"),
        category: product.category_name,
        subcategory: product.subcategory_name,
        storeName: product.store_name,
        vendorId: product.vendor_id, // Add vendorId to Product interface
      }));

      const vendorMap = response.data.products.reduce(
        (acc, product) => {
          const vendorId = product.vendor_id;
          const storeName = product.store_name || "Unnamed Store";
          if (!acc[vendorId]) {
            acc[vendorId] = { id: vendorId, storeName, productCount: 0 };
          }
          acc[vendorId].productCount += 1;
          return acc;
        },
        {} as Record<string, Vendor>,
      );

      console.log("Vendors:", Object.values(vendorMap));
      setVendors([...Object.values(vendorMap)]);
      setProducts(mappedProducts);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  const handleVendorClick = (vendorId: string) => {
    setSelectedVendor(vendorId)
  }

  const handleBackClick = () => {
    setSelectedVendor(null)
    setSearchTerm("")
    setCategoryFilter("all")
  }

const filteredProducts = useMemo(() => {
  if (!selectedVendor) return [];

  let filtered = products.filter((product) => product.vendorId === selectedVendor);

  if (searchTerm) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (categoryFilter !== "all") {
    filtered = filtered.filter((product) => product.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  return filtered;
}, [selectedVendor, products, searchTerm, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats).filter(Boolean)
  }, [products])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalVendors = vendors.length
    const avgProductsPerVendor = totalVendors > 0 ? Math.round(totalProducts / totalVendors) : 0
    const topVendor = vendors.reduce(
      (max, vendor) => (vendor.productCount > max.productCount ? vendor : max),
      vendors[0],
    )

    return {
      totalProducts,
      totalVendors,
      avgProductsPerVendor,
      topVendor: topVendor?.storeName || "N/A",
    }
  }, [vendors, products])

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
        {error && (
          <Card className="border-rose-200 bg-rose-50 dark:bg-rose-900/20">
            <CardContent className="p-4">
              <p className="text-rose-700 dark:text-rose-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Page Header */}
        <div className="relative z-50 flex flex-col gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            {selectedVendor && (
              <Button variant="outline" onClick={handleBackClick} size="sm" className="shrink-0 bg-white/80 dark:bg-slate-800/80 h-8 w-8 sm:h-9 sm:w-9 p-0">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                {selectedVendor
                  ? `${vendors.find((v) => v.id === selectedVendor)?.storeName || "Vendor"} Products`
                  : "Product Management"}
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
                {selectedVendor ? `Browse products from this vendor` : "Manage your vendors and their product catalogs"}
              </p>
            </div>
          </div>

          {selectedVendor && (
            <div className="flex items-center justify-between sm:justify-end">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 sm:hidden">
                {filteredProducts.length} products
              </span>
              <div className="flex items-center border rounded-lg p-1 bg-white/80 dark:bg-slate-800/80">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Table className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        {!selectedVendor && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<ShoppingBag className="w-6 h-6" />}
              color="blue"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title="Active Vendors"
              value={stats.totalVendors}
              icon={<Users className="w-6 h-6" />}
              color="emerald"
              trend="up"
              trendValue="+5%"
            />
            <StatCard
              title="Avg Products/Vendor"
              value={stats.avgProductsPerVendor}
              icon={<BarChart3 className="w-6 h-6" />}
              color="violet"
            />
            {/* <StatCard
              title="Top Vendor"
              value={stats.topVendor}
              icon={<Star className="w-6 h-6" />}
              color="amber"
            /> */}
          </div>
        )}


        {/* Search and Filters */}
        {selectedVendor && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 sm:h-11"
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-center">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-50 he">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="hidden sm:flex items-center text-sm text-gray-600 dark:text-gray-400">
                    {filteredProducts.length} products found
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {!selectedVendor ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Vendors</h2>
              <Badge variant="secondary" className="text-xs sm:text-sm self-start xs:self-auto">
                {vendors.length} vendors
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} onClick={() => handleVendorClick(vendor.id)} />
              ))}
            </div>
          </div>
        ) : viewMode === "cards" ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Products</h2>
              <Badge variant="secondary" className="text-xs sm:text-sm self-start xs:self-auto">
                {filteredProducts.length} products
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Products Table</h2>
                <Badge variant="secondary" className="text-xs sm:text-sm self-start xs:self-auto">{filteredProducts.length} products</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <TableComponent>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 sm:w-20">Image</TableHead>
                      <TableHead className="min-w-[150px]">Name</TableHead>
                      
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="hidden md:table-cell min-w-[120px]">Subcategory</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[120px]">Store</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <TableCell>
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="max-w-[200px]">
                            <div className="truncate">{product.name}</div>
                          
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{product.category || "Uncategorized"}</Badge>
                          <div className="md:hidden mt-1">
                            {product.subcategory ? (
                              <Badge variant="outline" className="text-xs">{product.subcategory}</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">No subcategory</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.subcategory ? (
                            <Badge variant="outline" className="text-xs">{product.subcategory}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{product.storeName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableComponent>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty States */}
        {selectedVendor && filteredProducts.length === 0 && !loading && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="py-12 sm:py-16 text-center px-4 sm:px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "This vendor hasn't added any products yet"}
              </p>
              {(searchTerm || categoryFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                  }}
                  className="h-9 sm:h-10 px-4 sm:px-6 text-sm sm:text-base"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {!selectedVendor && vendors.length === 0 && !loading && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardContent className="py-12 sm:py-16 text-center px-4 sm:px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <Store className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No vendors found</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">Your vendor list is empty. Add some vendors to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
