
"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Download,
  Eye,
  Pencil,
  Trash2,
  Folder,
  FolderOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  Tag,
  Settings,
  Info,
  Globe,
  Calendar,
  Filter,
  Grid3X3,
  List,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


// Enhanced StatCard Component
function StatCard({
  title,
  value,
  icon,
  color = "purple",
  trend,
  trendValue,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: "purple" | "green" | "blue" | "yellow" | "indigo" | "pink" | "red";
  trend?: "up" | "down";
  trendValue?: string;
  description?: string;
}) {
  const colorClasses = {
    purple:
      "from-purple-500/10 to-indigo-500/10 border-purple-200/50 dark:border-purple-800/50",
    green:
      "from-green-500/10 to-emerald-500/10 border-green-200/50 dark:border-green-800/50",
    blue: "from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-800/50",
    yellow:
      "from-yellow-500/10 to-orange-500/10 border-yellow-200/50 dark:border-yellow-800/50",
    indigo:
      "from-indigo-500/10 to-purple-500/10 border-indigo-200/50 dark:border-indigo-800/50",
    pink: "from-pink-500/10 to-rose-500/10 border-pink-200/50 dark:border-pink-800/50",
    red: "from-red-500/10 to-rose-500/10 border-red-200/50 dark:border-red-800/50",
  };

  const iconColors = {
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
    blue: "text-blue-600 dark:text-blue-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    pink: "text-pink-600 dark:text-pink-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <Card
      className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${colorClasses[color]} border shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] cursor-pointer`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </p>
              {trend && trendValue && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 ${iconColors[color]}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Subcategory {
  id: string;
  subcategory_id: string;
  subcategory_name: string;
  subcategory_slug: string;
  subcategory_description: string;
  subcategory_meta_title: string;
  subcategory_meta_description: string;
  subcategory_img_thumbnail: string | null;
  show_in_menu: boolean;
  featured_subcategory: boolean;
  subcategory_status: boolean;
  subcategory_tstamp: string;
  productCount: number;
  totalRevenue: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  status: "Active" | "Inactive";
  createdDate: string;
  lastUpdated: string;
  totalRevenue: string;
  industry: string;
  metaTitle: string;
  metaDescription: string;
  image: string | null;
  showInMenu: boolean;
  subcategories: Subcategory[];
}

interface Industry {
  industry_id: string;
  industry_name: string;
  industry_slug: string;
  is_active: boolean;
  timestamp: string;
}

interface SubcategoryFormData {
  subcategory_id: string;
  subcategory_name: string;
  subcategory_slug: string;
  subcategory_description: string;
  subcategory_meta_title: string;
  subcategory_meta_description: string;
  featured_subcategory: boolean;
  show_in_menu: boolean;
  file?: File | null;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<Category[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categoryToRestore, setCategoryToRestore] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [editFormData, setEditFormData] = useState({
    name: "",
    slug: "",
    description: "",
    productCount: 0,
    status: "Active" as "Active" | "Inactive",
    industry: "",
    metaTitle: "",
    metaDescription: "",
    showInMenu: true,
  });
  const [editSubcategoryModalOpen, setEditSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [deleteSubcategoryDialogOpen, setDeleteSubcategoryDialogOpen] = useState(false);
  const [restoreSubcategoryDialogOpen, setRestoreSubcategoryDialogOpen] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null);
  const [subcategoryToRestore, setSubcategoryToRestore] = useState<Subcategory | null>(null);
  const [subcategoryFormData, setSubcategoryFormData] = useState<SubcategoryFormData>({
    subcategory_id: "",
    subcategory_name: "",
    subcategory_slug: "",
    subcategory_description: "",
    subcategory_meta_title: "",
    subcategory_meta_description: "",
    featured_subcategory: false,
    show_in_menu: true,
    file: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/list-categories");
        if (response.data.statusCode === 200) {
          const fetchedCategories: Category[] = response.data.data.map(
            (cat: any) => ({
              id: cat.category_id,
              slug: cat.category_slug,
              name: cat.category_name,
              industry: cat.industry_name || "Other",
              description: cat.category_description || "",
              metaTitle: cat.category_meta_title || "",
              metaDescription: cat.category_meta_description || "",
              image: cat.category_img_thumbnail || null,
              createdDate:
                cat.category_tstamp?.split("T")[0] ||
                new Date().toISOString().split("T")[0],
              lastUpdated:
                cat.category_tstamp?.split("T")[0] ||
                new Date().toISOString().split("T")[0],
              status: cat.category_status ? "Inactive" : "Active",
              showInMenu: cat.show_in_menu,
              productCount: cat.productCount || 0,
              totalRevenue: cat.totalRevenue || "$0.00",
              subcategories: cat.subcategories.map((sub: any) => ({
                id: sub.id,
                subcategory_id: sub.subcategory_id,
                subcategory_name: sub.subcategory_name,
                subcategory_slug: sub.subcategory_slug,
                subcategory_description: sub.subcategory_description || "",
                subcategory_meta_title: sub.subcategory_meta_title || "",
                subcategory_meta_description:
                  sub.subcategory_meta_description || "",
                subcategory_img_thumbnail:
                  sub.subcategory_img_thumbnail || null,
                show_in_menu: sub.show_in_menu,
                featured_subcategory: sub.featured_subcategory,
                subcategory_status: sub.subcategory_status,
                subcategory_tstamp: sub.subcategory_tstamp,
                productCount: sub.productCount || 0,
                totalRevenue: sub.totalRevenue || "$0.00",
              })),
            })
          );
          setCategories(fetchedCategories);
          setError(null);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err) {
        console.log("Failed to fetch categories. Please try again.");
        console.error(err);
      }
    };

    const fetchIndustries = async () => {
      try {
        const response = await axiosInstance.get("/industries/", {
          params: { is_active: null },
        });
        if (response.data.statusCode === 200) {
          setIndustries(response.data.data);
        } else {
          throw new Error("Failed to fetch industries");
        }
      } catch (err) {
        console.log("Failed to fetch industries. Please try again.");
        console.error(err);
      }
    };

    Promise.all([fetchCategories(), fetchIndustries()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Filtered and sorted categories
  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subcategories.some(
          (sub) =>
            sub.subcategory_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            sub.subcategory_description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            sub.subcategory_slug
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        statusFilter === "all" ||
        category.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "products":
          return b.productCount - a.productCount;
        case "revenue":
          const aRevenue = Number.parseFloat(
            a.totalRevenue.replace("$", "").replace(",", "") || "0"
          );
          const bRevenue = Number.parseFloat(
            b.totalRevenue.replace("$", "").replace(",", "") || "0"
          );
          return bRevenue - aRevenue;
        case "date":
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [categories, searchTerm, statusFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter(
      (c) => c.status === "Active"
    ).length;
    const inactiveCategories = categories.filter(
      (c) => c.status === "Inactive"
    ).length;
    const totalProducts = categories.reduce(
      (sum, c) => sum + c.productCount,
      0
    );
    const totalRevenue = categories.reduce((sum, c) => {
      const revenue = Number.parseFloat(
        c.totalRevenue?.replace("$", "").replace(",", "") || "0"
      );
      return sum + revenue;
    }, 0);
    const totalSubcategories = categories.reduce(
      (sum, c) => sum + c.subcategories.length,
      0
    );
    const avgProductsPerCategory =
      totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0;

    return {
      total: totalCategories,
      active: activeCategories,
      inactive: inactiveCategories,
      products: totalProducts,
      revenue: `$${totalRevenue.toLocaleString()}`,
      subcategories: totalSubcategories,
      avgProducts: avgProductsPerCategory,
    };
  }, [categories]);

  const handleViewCategory = (category: Category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount: category.productCount,
      status: category.status,
      industry: category.industry,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      showInMenu: category.showInMenu,
    });
    setActiveTab("details");
    setEditModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount: category.productCount,
      status: category.status,
      industry: category.industry,
      metaTitle: category.metaTitle,
      metaDescription: category.metaDescription,
      showInMenu: category.showInMenu,
    });
    setActiveTab("edit");
    setEditModalOpen(true);
  };

  const handleSaveEditedCategory = async () => {
    if (!editingCategory) return;

    try {
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("slug", editFormData.slug);
      formData.append("description", editFormData.description);
      formData.append("meta_title", editFormData.metaTitle);
      formData.append("meta_description", editFormData.metaDescription);
      formData.append("show_in_menu", editFormData.showInMenu.toString());

      const response = await axiosInstance.put(
        `/categories/update/by-slug/${editingCategory.slug}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.statusCode === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? {
                  ...cat,
                  name: editFormData.name,
                  slug: editFormData.slug,
                  industry: editFormData.industry,
                  description: editFormData.description,
                  metaTitle: editFormData.metaTitle,
                  metaDescription: editFormData.metaDescription,
                  status: editFormData.status,
                  showInMenu: editFormData.showInMenu,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : cat
          )
        );
        toast.success("Category updated successfully!");
        setEditModalOpen(false);
        setEditingCategory(null);
        resetForm();
      } else {
        throw new Error(response.data.message || "Failed to update category");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update category. Please try again."
      );
      console.error(error);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
  if (categoryToDelete) {
    try {
      const response = await axiosInstance.delete(
        `/categories/soft-delete/by-slug/${categoryToDelete.slug}`
      );
      if (response.data.statusCode === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryToDelete.id
              ? {
                  ...cat,
                  status: "Inactive",
                  subcategories: cat.subcategories.map((sub) => ({
                    ...sub,
                    subcategory_status: true, // Deactivate all subcategories
                  })),
                }
              : cat
          )
        );
        toast.success("Category and subcategories soft-deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete category");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete category. Please try again."
      );
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  }
};

  const handleRestoreCategory = (category: Category) => {
    setCategoryToRestore(category);
    setRestoreDialogOpen(true);
  };

 const confirmRestoreCategory = async () => {
  if (categoryToRestore) {
    try {
      const response = await axiosInstance.put(
        `/categories/restore/by-slug/${categoryToRestore.slug}`
      );
      if (response.data.statusCode === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryToRestore.id
              ? {
                  ...cat,
                  status: "Active",
                  subcategories: cat.subcategories.map((sub) => ({
                    ...sub,
                    subcategory_status: false, // Restore all subcategories
                  })),
                }
              : cat
          )
        );
        toast.success("Category and subcategories restored successfully!");
      } else {
        throw new Error(response.data.message || "Failed to restore category");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to restore category. Please try again."
      );
      console.error(error);
    } finally {
      setRestoreDialogOpen(false);
      setCategoryToRestore(null);
    }
  }
};

  const handleExportCategories = () => {
    const csvContent = [
      [
        "Slug",
        "Name",
        "Description",
        "Product Count",
        "Status",
        "Created Date",
        "Industry",
        "Meta Title",
        "Meta Description",
        "Show in Menu",
        "Subcategories",
      ],
      ...filteredCategories.map((category) => [
        category.slug,
        category.name,
        category.description,
        category.productCount.toString(),
        category.status,
        category.createdDate || "",
        category.industry,
        category.metaTitle,
        category.metaDescription,
        category.showInMenu.toString(),
        category.subcategories.map((sub) => sub.subcategory_name).join(";"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setEditFormData({
      name: "",
      slug: "",
      description: "",
      productCount: 0,
      status: "Active",
      industry: "",
      metaTitle: "",
      metaDescription: "",
      showInMenu: true,
    });
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryFormData({
      subcategory_id: subcategory.subcategory_id,
      subcategory_name: subcategory.subcategory_name,
      subcategory_slug: subcategory.subcategory_slug,
      subcategory_description: subcategory.subcategory_description,
      subcategory_meta_title: subcategory.subcategory_meta_title,
      subcategory_meta_description: subcategory.subcategory_meta_description,
      featured_subcategory: subcategory.featured_subcategory,
      show_in_menu: subcategory.show_in_menu,
      file: null,
    });
    setEditSubcategoryModalOpen(true);
  };

  const handleSaveEditedSubcategory = async () => {
    if (!editingSubcategory) return;

    try {
      const formData = new FormData();
      formData.append("name", subcategoryFormData.subcategory_name);
      formData.append("slug", subcategoryFormData.subcategory_slug);
      formData.append("description", subcategoryFormData.subcategory_description);
      formData.append("meta_title", subcategoryFormData.subcategory_meta_title);
      formData.append("meta_description", subcategoryFormData.subcategory_meta_description);
      formData.append("featured", subcategoryFormData.featured_subcategory.toString());
      formData.append("show_in_menu", subcategoryFormData.show_in_menu.toString());
      if (subcategoryFormData.file) {
        formData.append("file", subcategoryFormData.file);
      }

      const response = await axiosInstance.put(
        `/subcategories/update/${editingSubcategory.subcategory_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.statusCode === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingSubcategory.id
              ? {
                  ...cat,
                  subcategories: cat.subcategories.map((sub) =>
                    sub.subcategory_id === editingSubcategory.subcategory_id
                      ? {
                          ...sub,
                          subcategory_name: subcategoryFormData.subcategory_name,
                          subcategory_slug: subcategoryFormData.subcategory_slug,
                          subcategory_description: subcategoryFormData.subcategory_description,
                          subcategory_meta_title: subcategoryFormData.subcategory_meta_title,
                          subcategory_meta_description: subcategoryFormData.subcategory_meta_description,
                          featured_subcategory: subcategoryFormData.featured_subcategory,
                          show_in_menu: subcategoryFormData.show_in_menu,
                          subcategory_img_thumbnail: response.data.data?.subcategory_img_thumbnail || sub.subcategory_img_thumbnail,
                        }
                      : sub
                  ),
                }
              : cat
          )
        );
        toast.success("Subcategory updated successfully!");
        setEditSubcategoryModalOpen(false);
        setEditingSubcategory(null);
        resetSubcategoryForm();
      } else {
        throw new Error(response.data.message || "Failed to update subcategory");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update subcategory. Please try again."
      );
      console.error(error);
    }
  };

  const handleDeleteSubcategory = (subcategory: Subcategory) => {
    setSubcategoryToDelete(subcategory);
    setDeleteSubcategoryDialogOpen(true);
  };

  const confirmDeleteSubcategory = async () => {
  if (subcategoryToDelete) {
    try {
      const response = await axiosInstance.delete(
        `/subcategories/soft-delete/${subcategoryToDelete.subcategory_id}`
      );
      if (response.data.statusCode === 200) {
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            subcategories: cat.subcategories.map((sub) =>
              sub.subcategory_id === subcategoryToDelete.subcategory_id
                ? { ...sub, subcategory_status: true }
                : sub
            ),
          }))
        );
        toast.success("Subcategory soft-deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete subcategory");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete subcategory. Please try again."
      );
      console.error(error);
    } finally {
      setDeleteSubcategoryDialogOpen(false);
      setSubcategoryToDelete(null);
    }
  }
};

  const handleRestoreSubcategory = (subcategory: Subcategory) => {
    setSubcategoryToRestore(subcategory);
    setRestoreSubcategoryDialogOpen(true);
  };

  const confirmRestoreSubcategory = async () => {
  if (subcategoryToRestore) {
    // Find the parent category
    const parentCategory = categories.find((cat) =>
      cat.subcategories.some(
        (sub) => sub.subcategory_id === subcategoryToRestore.subcategory_id
      )
    );
    if (parentCategory?.status === "Inactive") {
      toast.error("Cannot restore subcategory: Parent category is inactive.");
      setRestoreSubcategoryDialogOpen(false);
      setSubcategoryToRestore(null);
      return;
    }
    try {
      const response = await axiosInstance.put(
        `/subcategories/restore/${subcategoryToRestore.subcategory_id}`
      );
      if (response.data.statusCode === 200) {
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            subcategories: cat.subcategories.map((sub) =>
              sub.subcategory_id === subcategoryToRestore.subcategory_id
                ? { ...sub, subcategory_status: false }
                : sub
            ),
          }))
        );
        toast.success("Subcategory restored successfully!");
      } else {
        throw new Error(response.data.message || "Failed to restore subcategory");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to restore subcategory. Please try again."
      );
      console.error(error);
    } finally {
      setRestoreSubcategoryDialogOpen(false);
      setSubcategoryToRestore(null);
    }
  }
};

  const resetSubcategoryForm = () => {
    setSubcategoryFormData({
      subcategory_id: "",
      subcategory_name: "",
      subcategory_slug: "",
      subcategory_description: "",
      subcategory_meta_title: "",
      subcategory_meta_description: "",
      featured_subcategory: false,
      show_in_menu: true,
      file: null,
    });
  };

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
    );
  }

  // Update the subcategory display in the grid view
  const renderSubcategoryItem = (sub: Subcategory, category: Category) => (
    <div
      key={sub.subcategory_id}
      className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg"
    >
      {sub.subcategory_img_thumbnail ? (
        <Image
          src={sub.subcategory_img_thumbnail}
          alt={sub.subcategory_name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ) : (
        <Tag className="w-12 h-12 text-blue-400 p-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white truncate">
          {sub.subcategory_name}
        </p>
        <p
  className="text-xs text-gray-500 dark:text-gray-400"
  title={sub.subcategory_description}
>
  {sub.subcategory_description
    ? sub.subcategory_description.length > 60
      ? sub.subcategory_description.slice(0, 55) + "..."
      : sub.subcategory_description
    : "No description"}
</p>

        <div className="flex items-center gap-2 mt-1">
          <Badge
            className={
              sub.subcategory_status
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }
          >
            {sub.subcategory_status ? "Inactive" : "Active"}
          </Badge>
          {sub.featured_subcategory && (
            <Badge
              variant="outline"
              className="text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800"
            >
              Featured
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleEditSubcategory(sub)}
          className="rounded-lg p-2 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-950/50"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        {sub.subcategory_status ? (
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleRestoreSubcategory(sub)}
            className="rounded-lg p-2 text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleDeleteSubcategory(sub)}
            className="rounded-lg p-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

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
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Error Loading Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
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
        <div className="text-left space-y-4 px-4 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="relative z-50 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-2 sm:p-3 lg:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                Category Management
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                Organize your products into categories and subcategories, and track performance metrics
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-end justify-end gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={handleExportCategories}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-300 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <Link href="/add-category" passHref className="w-full sm:w-auto">
                <Button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                  <Plus className="w-4 h-4" />
                  Add New Category
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
            <StatCard
              title="Total Categories"
              value={stats.total.toString()}
              icon={<Folder className="w-6 h-6" />}
              color="purple"
              trend="up"
              trendValue="+8%"
              description="All categories in system"
            />
            <StatCard
              title="Active Categories"
              value={stats.active.toString()}
              icon={<FolderOpen className="w-6 h-6" />}
              color="green"
              trend="up"
              trendValue="+12%"
              description="Currently visible categories"
            />
            <StatCard
              title="Total Subcategories"
              value={stats.subcategories.toString()}
              icon={<Tag className="w-6 h-6" />}
              color="blue"
              trend="up"
              trendValue="+10%"
              description="Subcategories across all categories"
            />
          </div>

          {/* Filters and Controls */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 w-full min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-10 sm:h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start w-full lg:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 h-10 sm:h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-40 h-10 sm:h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="date">Last Updated</SelectItem>
                    </SelectContent>
                  </Select> */}

                  {/* View Mode */}
                  <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800 rounded-xl p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 sm:h-10 px-2 sm:px-3"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 sm:h-10 px-2 sm:px-3"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Display */}
        {filteredCategories.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
              {filteredCategories.map((category, index) => (
                <Card
                  key={category.id}
                  className="group backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      {category.image ? (
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Tag className="w-12 h-12 text-indigo-400" />
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {category.name}
                        </h3>
                        <Badge
                          className={`shadow-lg ${
                            category.status === "Active"
                              ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                              : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                          }`}
                        >
                          {category.status === "Active" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {category.status}
                        </Badge>
                      </div>
                     
                    </div>

                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* {category.subcategories.length > 0 && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`subcategories-${category.id}`}>
                          <AccordionTrigger className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Subcategories ({category.subcategories.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {category.subcategories.map((sub) =>
                                renderSubcategoryItem(sub, category)
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )} */}


                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {category.lastUpdated
                            ? new Date(category.lastUpdated).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleViewCategory(category)}
                          className="rounded-lg p-2 sm:p-1 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/50"
                        >
                          <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                          className="rounded-lg p-2 sm:p-1 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-950/50"
                        >
                          <Pencil className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </Button>
                        {category.status === "Active" ? (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category)}
                            className="rounded-lg p-2 sm:p-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleRestoreCategory(category)}
                            className="rounded-lg p-2 sm:p-1 text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50"
                          >
                            <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-gray-200/50 dark:border-slate-800/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      Categories ({filteredCategories.length})
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredCategories.map((category, index) => (
                    <Accordion
                      key={category.id}
                      type="single"
                      collapsible
                      className="w-full"
                    >
                      <AccordionItem
                        value={`category-${category.id}`}
                        className="border-b border-gray-100/50 dark:border-slate-800/50"
                      >
                        <AccordionTrigger className="flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/10 transition-all duration-300">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold shadow-lg">
                              <Tag className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-bold text-gray-900 dark:text-white truncate">
                                  {category.name}
                                </h4>
                                <Badge
                                  className={`shadow-lg ${
                                    category.status === "Active"
                                      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                      : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                  }`}
                                >
                                  {category.status === "Active" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {category.status}
                                </Badge>
                                
                              </div>
                             <p
  className="text-gray-600 dark:text-gray-400 text-sm"
  title={category.description || "No description"}
>
  {category.description
    ? category.description.length > 120
      ? category.description.slice(0, 115).trim() + "..."
      : category.description
    : "No description"}
</p>

                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewCategory(category);
                                }}
                                className="rounded-lg hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCategory(category);
                                }}
                                className="rounded-lg hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-950/50"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              {category.status === "Active" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category);
                                  }}
                                  className="rounded-lg hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestoreCategory(category);
                                  }}
                                  className="rounded-lg hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50 text-green-600 hover:text-green-700"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {category.subcategories.length > 0 ? (
                            <div className="p-6 pt-0 space-y-3">
                              {category.subcategories.map((sub) =>
                                renderSubcategoryItem(sub, category)
                              )}
                            </div>
                          ) : (
                            <div className="p-6 pt-0 text-center text-gray-600 dark:text-gray-400">
                              No subcategories available.
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-12 text-center space-y-6">
              <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl inline-block">
                <Folder className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  No categories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria to find categories."
                    : "Start building your product catalog by creating your first category."}
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/add-category" passHref>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Category
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Enhanced Edit/View Category Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 border-0 shadow-2xl backdrop-blur-2xl">
            {editingCategory && (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-200/50 dark:border-indigo-800/50 p-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      {editingCategory.name}
                    </DialogTitle>
                  </DialogHeader>
                </div>

                {/* Tabbed Content */}
                <div className="flex-1 overflow-hidden">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="h-full flex flex-col"
                  >
                    <div className="border-b border-gray-200/50 dark:border-slate-800/50 px-6">
                      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/50 dark:bg-slate-800/50">
                        <TabsTrigger
                          value="details"
                          className="flex items-center gap-2"
                        >
                          <Info className="w-4 h-4" />
                          Details
                        </TabsTrigger>
                        <TabsTrigger
                          value="edit"
                          className="flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Edit
                        </TabsTrigger>
                        <TabsTrigger
                          value="seo"
                          className="flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4" />
                          SEO
                        </TabsTrigger>
                        <TabsTrigger
                          value="subcategories"
                          className="flex items-center gap-2"
                        >
                          <Tag className="w-4 h-4" />
                          Subcategories
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <TabsContent
                        value="details"
                        className="p-6 space-y-6 m-0"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Category Name
                              </Label>
                              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                {editingCategory.name}
                              </p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Category Slug
                              </Label>
                              <p className="text-lg font-mono text-gray-900 dark:text-white mt-1">
                                {editingCategory.slug}
                              </p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Industry
                              </Label>
                              <p className="text-lg text-indigo-600 dark:text-indigo-400 mt-1">
                                {editingCategory.industry}
                              </p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Description
                              </Label>
                              <p className="text-gray-700 dark:text-gray-300 mt-1">
                                {editingCategory.description ||
                                  "No description provided"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {/* <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Category ID
                              </Label>
                              <p className="text-lg font-mono text-gray-900 dark:text-white mt-1">
                                {editingCategory.id}
                              </p>
                            </div> */}
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Created Date
                              </Label>
                              <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
                                {editingCategory.createdDate
                                  ? new Date(
                                      editingCategory.createdDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Status
                              </Label>
                              <div className="mt-2">
                                <Badge
                                  className={
                                    editingCategory.status === "Active"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  }
                                >
                                  {editingCategory.status === "Active" ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                  )}
                                  {editingCategory.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-4">
                              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Show in Menu
                              </Label>
                              <div className="mt-2">
                                <Badge
                                  variant={
                                    editingCategory.showInMenu
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {editingCategory.showInMenu
                                    ? "Visible"
                                    : "Hidden"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="edit" className="p-6 space-y-6 m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label
                                htmlFor="edit-name"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Category Name *
                              </Label>
                              <Input
                                id="edit-name"
                                value={editFormData.name}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                placeholder="Enter category name"
                                className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="edit-slug"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Category Slug *
                              </Label>
                              <Input
                                id="edit-slug"
                                value={editFormData.slug}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    slug: e.target.value,
                                  }))
                                }
                                placeholder="Enter category slug"
                                className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                              />
                            </div>
                            {/* <div>
                              <Label
                                htmlFor="edit-industry"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Industry *
                              </Label>
                              <Select
                                value={editFormData.industry}
                                onValueChange={(value) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    industry: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                  {industries.map((ind) => (
                                    <SelectItem
                                      key={ind.industry_id}
                                      value={ind.industry_id}
                                    >
                                      {ind.industry_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div> */}

                           
                            <div>
                              <Label
                                htmlFor="edit-status"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Status *
                              </Label>
                              <Select
                                value={editFormData.status}
                                onValueChange={(value: "Active" | "Inactive") =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    status: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Active">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      Active
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="Inactive">
                                    <div className="flex items-center gap-2">
                                      <XCircle className="w-4 h-4 text-red-600" />
                                      Inactive
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label
                                htmlFor="edit-description"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Description
                              </Label>
                              <Textarea
                                id="edit-description"
                                value={editFormData.description}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                placeholder="Enter category description"
                                className="mt-2 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl min-h-[120px] resize-none"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="edit-productCount"
                                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                              >
                                Product Count
                              </Label>
                              <Input
                                id="edit-productCount"
                                type="number"
                                min="0"
                                value={editFormData.productCount}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    productCount:
                                      Number.parseInt(e.target.value) || 0,
                                  }))
                                }
                                placeholder="0"
                                className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                              />
                            </div>
                            <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Show in Menu
                                  </Label>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Display this category in navigation menus
                                  </p>
                                </div>
                                <Switch
                                  checked={editFormData.showInMenu}
                                  onCheckedChange={(value) =>
                                    setEditFormData((prev) => ({
                                      ...prev,
                                      showInMenu: value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="seo" className="p-6 space-y-6 m-0">
                        <div className="space-y-6">
                          <div>
                            <Label
                              htmlFor="edit-metaTitle"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Meta Title
                            </Label>
                            <Input
                              id="edit-metaTitle"
                              value={editFormData.metaTitle}
                              onChange={(e) =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  metaTitle: e.target.value,
                                }))
                              }
                              placeholder="Enter meta title for SEO"
                              className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Recommended length: 50-60 characters
                            </p>
                          </div>
                          <div>
                            <Label
                              htmlFor="edit-metaDescription"
                              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >
                              Meta Description
                            </Label>
                            <Textarea
                              id="edit-metaDescription"
                              value={editFormData.metaDescription}
                              onChange={(e) =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  metaDescription: e.target.value,
                                }))
                              }
                              placeholder="Enter meta description for SEO"
                              className="mt-2 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl min-h-[100px] resize-none"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Recommended length: 150-160 characters
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              SEO Preview
                            </h4>
                            <div className="space-y-2">
                              <div className="text-blue-600 dark:text-blue-400 text-lg font-medium">
                                {editFormData.metaTitle ||
                                  editFormData.name ||
                                  "Category Title"}
                              </div>
                              <div className="text-green-600 dark:text-green-400 text-sm">
                                shoppersky.com.au/
                                {editFormData.slug || editingCategory.id}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-sm">
                                {editFormData.metaDescription ||
                                  editFormData.description ||
                                  "Category description will appear here..."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent
                        value="subcategories"
                        className="p-6 space-y-6 m-0"
                      >
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <Tag className="w-5 h-5" />
                              Subcategories
                            </h4>
                            <Link href={`/add-subcategory?categoryId=${editingCategory.id}`} passHref>
                              {/* <Button
                                size="sm"
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Subcategory
                              </Button> */}
                            </Link>
                          </div>
                          {editingCategory.subcategories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {editingCategory.subcategories.map(
                                (sub, index) => (
                                  <Card
                                    key={sub.subcategory_id}
                                    className="group backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300"
                                    style={{
                                      animationDelay: `${index * 100}ms`,
                                    }}
                                  >
                                    <div className="relative">
                                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                                        {sub.subcategory_img_thumbnail ? (
                                          <Image
                                            src={
                                              sub.subcategory_img_thumbnail ||
                                              "/placeholder.svg"
                                            }
                                            alt={sub.subcategory_name}
                                            width={400}
                                            height={225}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                          />
                                        ) : (
                                          <Tag className="w-12 h-12 text-blue-400" />
                                        )}
                                      </div>
                                    </div>
                                    <CardContent className="p-4 space-y-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                          <h5 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {sub.subcategory_name}
                                          </h5>
                                          <Badge
                                            className={`shadow-lg ${
                                              sub.subcategory_status
                                                ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                                : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                            }`}
                                          >
                                            {sub.subcategory_status ? (
                                              <CheckCircle className="w-3 h-3 mr-1" />
                                            ) : (
                                              <XCircle className="w-3 h-3 mr-1" />
                                            )}
                                            {sub.subcategory_status
                                              ? "Inactive"
                                              : "Active"}
                                          </Badge>
                                        </div>
                                        <Badge
                                          variant="outline"
                                          className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800"
                                        >
                                          {sub.featured_subcategory
                                            ? "Featured"
                                            : "Standard"}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {sub.subcategory_description ||
                                          "No description provided"}
                                      </p>

                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {sub.subcategory_tstamp
                                                ? new Date(
                                                    sub.subcategory_tstamp
                                                  ).toLocaleDateString()
                                                : "N/A"}
                                            </span>
                                          </div>
                                          <Badge
                                            variant={
                                              sub.show_in_menu
                                                ? "default"
                                                : "outline"
                                            }
                                          >
                                            {sub.show_in_menu
                                              ? "Menu Visible"
                                              : "Menu Hidden"}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                            Slug: {sub.subcategory_slug}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="text-center space-y-4">
                              <div className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl inline-block">
                                <Tag className="w-12 h-12 text-blue-400" />
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">
                                No subcategories available for this category.
                              </p>
                              <Link
                                href={`/add-subcategory?categoryId=${editingCategory.id}`}
                                passHref
                              >
                                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Create Subcategory
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-gray-200/50 dark:border-slate-800/50 p-6 bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-indigo-950/50">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                        onClick={() => {
                          setEditModalOpen(false);
                          setEditingCategory(null);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    {activeTab === "edit" && (
                      <Button
                        onClick={handleSaveEditedCategory}
                        disabled={
                          !editFormData.name.trim() ||
                          !editFormData.description.trim() ||
                          !editFormData.industry ||
                          !editFormData.slug.trim()
                        }
                        className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Enhanced Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-md mx-4 sm:mx-auto">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-3 shadow-lg">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    Delete Category
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    This action will soft-delete the category and its subcategories
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>

            {categoryToDelete && (
              <div className="my-6 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center text-white">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {categoryToDelete.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {categoryToDelete.industry} •{" "}
                      {categoryToDelete.productCount} products •{" "}
                      {categoryToDelete.subcategories.length} subcategories
                    </p>
                  </div>
                </div>
              </div>
            )}

            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 transition-all hover:bg-white hover:scale-105 dark:hover:bg-slate-800 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteCategory}
                className="flex-1 h-12 bg-gradient-to-r from-red-600 to-rose-600 shadow-lg transition-all hover:from-red-700 hover:to-rose-700 hover:shadow-xl hover:scale-105 text-white rounded-xl"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Restore Confirmation Dialog */}
        <AlertDialog
          open={restoreDialogOpen}
          onOpenChange={setRestoreDialogOpen}
        >
          <AlertDialogContent className="border-0 bg-gradient-to-br from-white/80 to-green-50/10 dark:from-slate-900/80 dark:to-green-950/10 shadow-2xl backdrop-blur-2xl max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 shadow-lg">
                  <RotateCcw className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Restore Category
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    This will restore the category and its subcategories
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>

            {categoryToRestore && (
              <div className="my-6 p-4 bg-green-50/50 dark:bg-green-950/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {categoryToRestore.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {categoryToRestore.industry} •{" "}
                      {categoryToRestore.productCount} products •{" "}
                      {categoryToRestore.subcategories.length} subcategories
                    </p>
                  </div>
                </div>
              </div>
            )}

            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 transition-all hover:bg-white hover:scale-105 dark:hover:bg-slate-800 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRestoreCategory}
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105 text-white rounded-xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Subcategory Edit Modal */}
        <Dialog open={editSubcategoryModalOpen} onOpenChange={setEditSubcategoryModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 border-0 shadow-2xl backdrop-blur-2xl">
            {editingSubcategory && (
              <div className="flex flex-col h-full">
                <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-200/50 dark:border-indigo-800/50 p-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      Edit Subcategory: {editingSubcategory.subcategory_name}
                    </DialogTitle>
                  </DialogHeader>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subcategory-name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Subcategory Name *
                        </Label>
                        <Input
                          id="subcategory-name"
                          value={subcategoryFormData.subcategory_name}
                          onChange={(e) =>
                            setSubcategoryFormData((prev) => ({
                              ...prev,
                              subcategory_name: e.target.value,
                            }))
                          }
                          placeholder="Enter subcategory name"
                          className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subcategory-slug" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Subcategory Slug *
                        </Label>
                        <Input
                          id="subcategory-slug"
                          value={subcategoryFormData.subcategory_slug}
                          onChange={(e) =>
                            setSubcategoryFormData((prev) => ({
                              ...prev,
                              subcategory_slug: e.target.value,
                            }))
                          }
                          placeholder="Enter subcategory slug"
                          className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subcategory-description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Description
                        </Label>
                        <Textarea
                          id="subcategory-description"
                          value={subcategoryFormData.subcategory_description}
                          onChange={(e) =>
                            setSubcategoryFormData((prev) => ({
                              ...prev,
                              subcategory_description: e.target.value,
                            }))
                          }
                          placeholder="Enter subcategory description"
                          className="mt-2 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl min-h-[100px] resize-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="subcategory-meta-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Meta Title
                        </Label>
                        <Input
                          id="subcategory-meta-title"
                          value={subcategoryFormData.subcategory_meta_title}
                          onChange={(e) =>
                            setSubcategoryFormData((prev) => ({
                              ...prev,
                              subcategory_meta_title: e.target.value,
                            }))
                          }
                          placeholder="Enter meta title for SEO"
                          className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subcategory-meta-description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Meta Description
                        </Label>
                        <Textarea
                          id="subcategory-meta-description"
                          value={subcategoryFormData.subcategory_meta_description}
                          onChange={(e) =>
                            setSubcategoryFormData((prev) => ({
                              ...prev,
                              subcategory_meta_description: e.target.value,
                            }))
                          }
                          placeholder="Enter meta description for SEO"
                          className="mt-2 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl min-h-[100px] resize-none"
                        />
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Featured Subcategory
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Mark as featured for special display
                            </p>
                          </div>
                          <Switch
                            checked={subcategoryFormData.featured_subcategory}
                            onCheckedChange={(value) =>
                              setSubcategoryFormData((prev) => ({
                                ...prev,
                                featured_subcategory: value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Show in Menu
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Display this subcategory in navigation menus
                            </p>
                          </div>
                          <Switch
                            checked={subcategoryFormData.show_in_menu}
                            onCheckedChange={(value) =>
                              setSubcategoryFormData((prev) => ({
                                ...prev,
                                show_in_menu: value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subcategory-image" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Subcategory Image
                        </Label>
                        <Input
                          id="subcategory-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setSubcategoryFormData((prev) => ({
                              ...prev,
                              file: e.target.files ? e.target.files[0] : null,
                            }))
                          }
                          className="mt-2 h-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="border-t border-gray-200/50 dark:border-slate-800/50 p-6 bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-indigo-950/50">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                        onClick={() => {
                          setEditSubcategoryModalOpen(false);
                          setEditingSubcategory(null);
                          resetSubcategoryForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleSaveEditedSubcategory}
                      disabled={
                        !subcategoryFormData.subcategory_name.trim() ||
                        !subcategoryFormData.subcategory_slug.trim()
                      }
                      className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Subcategory Delete Confirmation Dialog */}
        <AlertDialog open={deleteSubcategoryDialogOpen} onOpenChange={setDeleteSubcategoryDialogOpen}>
          <AlertDialogContent className="border-0 bg-gradient-to-br from-white/80 to-red-50/10 dark:from-slate-900/80 dark:to-red-950/10 shadow-2xl backdrop-blur-2xl max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-3 shadow-lg">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    Delete Subcategory
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    This action will soft-delete the subcategory
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {subcategoryToDelete && (
              <div className="my-6 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center text-white">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {subcategoryToDelete.subcategory_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Slug: {subcategoryToDelete.subcategory_slug}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 transition-all hover:bg-white hover:scale-105 dark:hover:bg-slate-800 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteSubcategory}
                className="flex-1 h-12 bg-gradient-to-r from-red-600 to-rose-600 shadow-lg transition-all hover:from-red-700 hover:to-rose-700 hover:shadow-xl hover:scale-105 text-white rounded-xl"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Subcategory
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Subcategory Restore Confirmation Dialog */}
        <AlertDialog open={restoreSubcategoryDialogOpen} onOpenChange={setRestoreSubcategoryDialogOpen}>
          <AlertDialogContent className="border-0 bg-gradient-to-br from-white/80 to-green-50/10 dark:from-slate-900/80 dark:to-green-950/10 shadow-2xl backdrop-blur-2xl max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 shadow-lg">
                  <RotateCcw className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Restore Subcategory
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                    This will restore the subcategory
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {subcategoryToRestore && (
              <div className="my-6 p-4 bg-green-50/50 dark:bg-green-950/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {subcategoryToRestore.subcategory_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Slug: {subcategoryToRestore.subcategory_slug}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 transition-all hover:bg-white hover:scale-105 dark:hover:bg-slate-800 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRestoreSubcategory}
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg transition-all hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105 text-white rounded-xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore Subcategory
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}