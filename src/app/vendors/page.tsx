

"use client";

import type React from "react";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Building,
  Mail,
  Star,
  Users,
  Shield,
  Trash2,
  History,
  Globe,
  FileText,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

interface Vendor {
  id: string;
  email: string;
  vendorId: string;
  role: "Vendor" | "Premium Vendor" | "Partner";
  storeName: string;
  storeUrl: string;
  industryName: string;
  location: string;
  purpose: string;
  paymentPreference: "Bank Transfer" | "PayPal" | "Stripe" | "Direct Deposit";
  abnDetails: {
    entityName: string;
    status: "Active" | "Cancelled" | "Suspended";
    type: "Company" | "Partnership" | "Trust" | "Individual";
    businessLocation: string;
  };
  registrationDate: string;
  lastActivity: string;
  status: "approved" | "pending" | "rejected" | "onhold" | "not onboarded";
  isActive: boolean;
  isEmailVerified: boolean; // Added email verification status
  avatar?: string;
}

// Simplified StatCard Component
function StatCard({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer group">
      <CardContent className="p-3 sm:p-4 lg:p-5">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
              {title}
            </p>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
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

const VendorManagement = () => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [vendorToReject, setVendorToReject] = useState<Vendor | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [vendorToRestore, setVendorToRestore] = useState<Vendor | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [holdDialogOpen, setHoldDialogOpen] = useState(false);
  const [vendorToHold, setVendorToHold] = useState<Vendor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vendorsResponse = await axiosInstance.get("/vendor/vendors/all");
        if (!vendorsResponse.data) {
          throw new Error("Failed to fetch vendors list");
        }

        const vendorResults = vendorsResponse.data.map((vendor: any) => {
          const { vendor_login, business_profile } = vendor;

          // Map is_approved to status
          let status: Vendor["status"];
          switch (business_profile.is_approved) {
            case -2:
              status = "not onboarded";
              break;
            case -1:
              status = "rejected";
              break;
            case 0:
              status = "pending";
              break;
            case 1:
              status = "onhold";
              break;
            case 2:
              status = "approved";
              break;
            default:
              status = "pending"; // Fallback to pending if undefined
          }

          return {
            id: vendor_login.user_id,
            email: vendor_login.email,
            vendorId: vendor_login.user_id,
            role: business_profile.profile_details?.role || "Vendor",
            storeName: business_profile.store_name || "",
            storeUrl:
              business_profile.profile_details?.storeUrl ||
              (business_profile.store_name
                ? business_profile.store_name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                : ""),
            industryName: business_profile.industry_name || "",
            location: business_profile.location || "",
            purpose: Array.isArray(business_profile.purpose)
              ? business_profile.purpose
                  .map((p: any) =>
                    typeof p === "string" ? p.replace(/["[\]]/g, "") : p
                  )
                  .join(", ") || ""
              : (typeof business_profile.purpose === "string"
                  ? business_profile.purpose.replace(/["[\]]/g, "")
                  : "") || "",
            paymentPreference: Array.isArray(
              business_profile.profile_details?.paymentPreference
            )
              ? business_profile.profile_details.paymentPreference
                  .map((p: string) => p.replace(/["[\]]/g, ""))
                  .join(", ")
              : business_profile.profile_details?.paymentPreference?.replace(
                  /["[\]]/g,
                  ""
                ) || "Bank Transfer",
            abnDetails: {
              entityName: business_profile.profile_details?.entity_name || "",
              status: business_profile.profile_details?.status?.includes(
                "Active"
              )
                ? "Active"
                : business_profile.profile_details?.status?.includes(
                    "Cancelled"
                  )
                ? "Cancelled"
                : "Suspended",
              type: business_profile.profile_details?.type?.includes("Company")
                ? "Company"
                : business_profile.profile_details?.type?.includes(
                    "Partnership"
                  )
                ? "Partnership"
                : business_profile.profile_details?.type?.includes("Trust")
                ? "Trust"
                : "Individual",
              businessLocation:
                business_profile.profile_details?.location || "",
            },
            registrationDate: vendor_login.created_at.split("T")[0],
            lastActivity:
              vendor_login.last_login?.split("T")[0] ||
              vendor_login.created_at.split("T")[0],
            status,
            isActive: vendor_login.is_active,
            isEmailVerified: vendor_login.verified_email ? false : true,

            avatar:
              business_profile.profile_details?.avatar ||
              "/placeholder.svg?height=40&width=40",
          };
        });

        setVendors(
          vendorResults.filter((v: Vendor) => v !== null && v.id !== null)
        );
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch data. Please try again."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getVendorStatus = (isActive: boolean) =>
    isActive ? "Inactive" : "Active";

  // Split vendors into onboarded and registered
  const { onboardedVendors, registeredVendors } = useMemo(() => {
    const onboarded = vendors.filter((vendor) => vendor.storeName);
    const registered = vendors.filter((vendor) => !vendor.storeName);
    return { onboardedVendors: onboarded, registeredVendors: registered };
  }, [vendors]);

  // Filtered vendors for each tab
  const filteredOnboardedVendors = useMemo(() => {
    return onboardedVendors.filter((vendor) => {
      const matchesSearch =
        (vendor.storeName
          ? vendor.storeName.toLowerCase().includes(searchTerm.toLowerCase())
          : false) ||
        (vendor.email
          ? vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
          : false) ||
        (vendor.vendorId
          ? vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase())
          : false) ||
        (vendor.industryName
          ? vendor.industryName.toLowerCase().includes(searchTerm.toLowerCase())
          : false);

      const matchesStatus =
        statusFilter === "all" || vendor.status === statusFilter;

      const matchesRole = roleFilter === "all" || vendor.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [onboardedVendors, searchTerm, statusFilter, roleFilter]);

  const filteredRegisteredVendors = useMemo(() => {
    return registeredVendors.filter((vendor) => {
      const matchesSearch =
        (vendor.email
          ? vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
          : false) ||
        (vendor.vendorId
          ? vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase())
          : false) ||
        (vendor.industryName
          ? vendor.industryName.toLowerCase().includes(searchTerm.toLowerCase())
          : false);

      const matchesStatus =
        statusFilter === "all" || vendor.status === statusFilter;

      const matchesRole = roleFilter === "all" || vendor.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [registeredVendors, searchTerm, statusFilter, roleFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalVendors = vendors.length;
    const approvedVendors = vendors.filter(
      (v) => v.status === "approved"
    ).length;
    const pendingVendors = vendors.filter((v) => v.status === "pending").length;
    const rejectedVendors = vendors.filter(
      (v) => v.status === "rejected"
    ).length;
    const onHoldVendors = vendors.filter((v) => v.status === "onhold").length;
    const notOnboardedVendors = vendors.filter(
      (v) => v.status === "not onboarded"
    ).length;

    return {
      total: totalVendors,
      approved: approvedVendors,
      pending: pendingVendors,
      rejected: rejectedVendors,
      onhold: onHoldVendors,
      notOnboarded: notOnboardedVendors,
    };
  }, [vendors]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case "onhold":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            On Hold
          </Badge>
        );
      case "not onboarded":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-0 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Not Onboarded
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEmailVerificationBadge = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Verified
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Unverified
        </Badge>
      );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Premium Vendor":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-0 flex items-center gap-1">
            <Star className="w-3 h-3" />
            Premium
          </Badge>
        );
      case "Partner":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Partner
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400 border-0">
            Vendor
          </Badge>
        );
    }
  };

  const getAbnStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        );
      case "Suspended":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Suspended
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApproveVendor = async (vendor: Vendor) => {
    try {
      const response = await axiosInstance.post(
        `/admin/vendor/approve?user_id=${vendor.id}`
      );
      if (response.status === 200) {
        setVendors((prev) =>
          prev.map((v) =>
            v.id === vendor.id
              ? { ...v, status: "approved", isActive: false }
              : v
          )
        );
        setSelectedVendor((prev) =>
          prev && prev.id === vendor.id
            ? { ...prev, status: "approved", isActive: false }
            : prev
        );
        toast.success("Vendor approved successfully!");
      } else {
        throw new Error(response.data.message || "Failed to approve vendor");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to approve vendor. Please try again."
      );
      console.error(error);
    }
  };

  const handleHoldVendor = async (vendor: Vendor) => {
    setVendorToHold(vendor);
    setHoldDialogOpen(true);
  };

  const confirmHoldVendor = async () => {
    if (vendorToHold) {
      try {
        const response = await axiosInstance.post(
          `/admin/vendor/onhold?user_id=${vendorToHold.id}`
        );

        if (response.status === 200) {
          setVendors((prev) =>
            prev.map((v) =>
              v.id === vendorToHold.id
                ? { ...v, status: "onhold", isActive: false }
                : v
            )
          );
          setSelectedVendor((prev) =>
            prev && prev.id === vendorToHold.id
              ? { ...prev, status: "onhold", isActive: false }
              : prev
          );
          toast.success("Vendor placed on hold successfully!");
        } else {
          throw new Error(
            response.data.message || "Failed to place vendor on hold"
          );
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.detail ||
            "Failed to place vendor on hold. Please try again."
        );
        console.error(error);
      } finally {
        setHoldDialogOpen(false);
        setVendorToHold(null);
      }
    }
  };

  const handleRejectVendor = (vendor: Vendor) => {
    setVendorToReject(vendor);
    setRejectDialogOpen(true);
  };

  const confirmRejectVendor = async () => {
    if (vendorToReject) {
      try {
        const response = await axiosInstance.post(
          `/admin/vendor/reject?user_id=${vendorToReject.id}`,
          {
            comment: rejectionComment.trim(),
          }
        );
        if (response.status === 200) {
          setVendors((prev) =>
            prev.map((v) =>
              v.id === vendorToReject.id
                ? { ...v, status: "rejected", isActive: false }
                : v
            )
          );
          setSelectedVendor((prev) =>
            prev && prev.id === vendorToReject.id
              ? { ...prev, status: "rejected", isActive: false }
              : prev
          );
          toast.success("Vendor rejected successfully!");
        } else {
          console.log(response.data.message || "Failed to reject vendor");
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.detail ||
            "Failed to reject vendor. Please try again."
        );
        console.error(error);
      } finally {
        setRejectDialogOpen(false);
        setVendorToReject(null);
        setRejectionComment("");
      }
    }
  };

  const handleDeleteVendor = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVendor = async () => {
    if (vendorToDelete) {
      try {
        const response = await axiosInstance.put(`/admin/vendor/soft-delete`, {
          user_id: vendorToDelete.id,
        });
        if (response.data.message.includes("successfully")) {
          setVendors((prev) =>
            prev.map((v) =>
              v.id === vendorToDelete.id ? { ...v, isActive: true } : v
            )
          );
          setSelectedVendor((prev) =>
            prev && prev.id === vendorToDelete.id
              ? { ...prev, isActive: true }
              : prev
          );
          toast.success("Vendor deactivated successfully!");
        } else {
          throw new Error(
            response.data.message || "Failed to deactivate vendor"
          );
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.detail ||
            "Failed to deactivate vendor. Please try again."
        );
        console.error(error);
      } finally {
        setDeleteDialogOpen(false);
        setVendorToDelete(null);
      }
    }
  };

  const handleRestoreVendor = (vendor: Vendor) => {
    setVendorToRestore(vendor);
    setRestoreDialogOpen(true);
  };

  const confirmRestoreVendor = async () => {
    if (vendorToRestore) {
      try {
        const response = await axiosInstance.put(`/admin/vendor/restore`, {
          user_id: vendorToRestore.id,
        });
        if (response.data.message.includes("successfully")) {
          setVendors((prev) =>
            prev.map((v) =>
              v.id === vendorToRestore.id ? { ...v, isActive: false } : v
            )
          );
          setSelectedVendor((prev) =>
            prev && prev.id === vendorToRestore.id
              ? { ...prev, isActive: false }
              : prev
          );
          toast.success("Vendor restored successfully!");
        } else {
          throw new Error(response.data.message || "Failed to restore vendor");
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.detail ||
            "Failed to restore vendor. Please try again."
        );
        console.error(error);
      } finally {
        setRestoreDialogOpen(false);
        setVendorToRestore(null);
      }
    }
  };

  const handleExportVendors = (vendorList: Vendor[]) => {
    const csvContent = [
      [
        "Email",
        "Role",
        "Store Name",
        "Store URL",
        "Industry",
        "Location",
        "Purpose",
        "Payment Preference",
        "ABN Entity Name",
        "ABN Status",
        "ABN Type",
        "ABN Location",
        "Registration Date",
        "Status",
      ],
      ...vendorList.map((vendor) => [
        vendor.email,
        vendor.role,
        vendor.storeName,
        vendor.storeUrl,
        vendor.industryName,
        vendor.location,
        vendor.purpose,
        vendor.paymentPreference,
        vendor.abnDetails.entityName,
        vendor.abnDetails.status,
        vendor.abnDetails.type,
        vendor.abnDetails.businessLocation,
        vendor.registrationDate,
        vendor.lastActivity,
        vendor.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendors.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Render vendor table
  const renderVendorTable = (vendorList: Vendor[], isOnboarded: boolean) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/50 dark:border-slate-700/50">
          <tr>
            {!isOnboarded ? (
              <>
                {/* Registered Vendors - Simplified columns */}
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Vendor's Email
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Onboarding Status
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Email Verification
                </th>
              </>
            ) : (
              <>
                {/* Onboarded Vendors - Full columns */}
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Vendor's Email
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Vendor's Store
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell text-xs sm:text-sm">
                  Location
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell text-xs sm:text-sm">
                  Industry
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Approval Status
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Active Status
                </th>
                <th className="text-left p-2 sm:p-3 lg:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                  Actions
                </th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {vendorList.map((vendor) => (
            <tr
              key={vendor.id}
              className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
            >
              {!isOnboarded ? (
                <>
                  {/* Registered Vendors - Simplified row */}
                  <td className="p-2 sm:p-3 lg:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shadow-sm flex-shrink-0">
                        <AvatarImage
                          src={vendor.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold text-xs">
                          {vendor.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm">
                          {vendor.email}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {vendor.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 lg:p-4">
                    {getStatusBadge(vendor.status)}
                  </td>
                  <td className="p-2 sm:p-3 lg:p-4">
                    {getEmailVerificationBadge(vendor.isEmailVerified)}
                  </td>
                </>
              ) : (
                <>
                  {/* Onboarded Vendors - Full row */}
                  <td className="p-2 sm:p-3 lg:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shadow-sm flex-shrink-0">
                        <AvatarImage
                          src={vendor.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold text-xs">
                          {vendor.storeName
                            ? vendor.storeName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : vendor.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm">
                          {vendor.email}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate sm:hidden">
                          {vendor.storeName || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 lg:p-4 hidden sm:table-cell">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm">
                      {vendor.storeName || "N/A"}
                    </p>
                  </td>
                  <td className="p-2 sm:p-3 lg:p-4 hidden sm:table-cell">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm">
                      {vendor.location}
                    </p>
                  </td>
                  <td className="p-2 sm:p-3 lg:p-4 hidden md:table-cell">
                    <p className="text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                      {vendor.industryName}
                    </p>
                  </td>
                  <td className="p-2 sm:p-3 lg:p-4">
                    {getStatusBadge(vendor.status)}
                  </td>
                  <td>
                    <Badge
                      variant={vendor.isActive ? "destructive" : "success"}
                    >
                      {getVendorStatus(vendor.isActive)}
                    </Badge>
                  </td>
                  <td className="p-2 sm:p-3 lg:p-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedVendor(vendor)}
                        className="h-6 sm:h-7 lg:h-8 px-1 sm:px-2 lg:px-3 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {vendor.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => handleHoldVendor(vendor)}
                              className="text-orange-600"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              On Hold
                            </DropdownMenuItem>
                          )}
                          {(vendor.status === "pending" ||
                            vendor.status === "rejected" ||
                            vendor.status === "onhold") && (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handleApproveVendor(vendor)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {(vendor.status === "pending" ||
                            vendor.status === "onhold") && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleRejectVendor(vendor)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          {vendor.status === "approved" && (
                            <>
                              <DropdownMenuSeparator />
                              {vendor.isActive ? (
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleRestoreVendor(vendor)}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Restore
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteVendor(vendor)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-transparent border-t-blue-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedVendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedVendor(null)}
                className="text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Vendors</span>
                <span className="sm:hidden">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                {selectedVendor.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden sm:flex items-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent"
                      onClick={() => handleRejectVendor(selectedVendor)}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleApproveVendor(selectedVendor)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Approve</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-white/30 shadow-2xl ring-4 ring-white/10 flex-shrink-0">
                  <AvatarImage
                    src={selectedVendor.avatar || "/placeholder.svg"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                    {selectedVendor.storeName
                      ? selectedVendor.storeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : selectedVendor.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedVendor.storeName || selectedVendor.email}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                      {selectedVendor.industryName || "Registered Vendor"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {getStatusBadge(selectedVendor.status)}
                    {getRoleBadge(selectedVendor.role)}
                    {getEmailVerificationBadge(selectedVendor.isEmailVerified)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-2 sm:grid-cols-4 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Business</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="abn"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>ABN</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <History className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Activity</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 sm:p-8">
                <TabsContent value="overview" className="space-y-6">
                  <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Contact
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Email Address
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium break-all">
                              {selectedVendor.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Verification Status
                            </label>
                            <div className="mt-2">
                              {getEmailVerificationBadge(
                                selectedVendor.isEmailVerified
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Location
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Store
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store Name
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.storeName || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store URL
                            </label>
                            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 mt-2 break-all bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {selectedVendor.storeUrl || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Industry
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.industryName || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Status & Role */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Status
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              User Role
                            </label>
                            <div className="mt-2">
                              {getRoleBadge(selectedVendor.role)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Onboarding Status
                            </label>
                            <div className="mt-2">
                              {getStatusBadge(selectedVendor.status)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Payment Preference
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.paymentPreference ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Purpose */}
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Business Purpose
                          </h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                          <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                            {selectedVendor.purpose ||
                              "No business purpose specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                  <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Contact
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Email Address
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium break-all">
                              {selectedVendor.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Verification Status
                            </label>
                            <div className="mt-2">
                              {getEmailVerificationBadge(
                                selectedVendor.isEmailVerified
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Location
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Store
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store Name
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.storeName || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store URL
                            </label>
                            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 mt-2 break-all bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {selectedVendor.storeUrl || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Industry
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.industryName || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Status & Role */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Status
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              User Role
                            </label>
                            <div className="mt-2">
                              {getRoleBadge(selectedVendor.role)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Onboarding Status
                            </label>
                            <div className="mt-2">
                              {getStatusBadge(selectedVendor.status)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Payment Preference
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.paymentPreference ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Purpose */}
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Business Purpose
                          </h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                          <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                            {selectedVendor.purpose ||
                              "No business purpose specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="abn" className="mt-0">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        ABN Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Entity Name
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-500">
                              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.entityName ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Business Type
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-indigo-500">
                              <p className="text-lg text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.type ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              ABN Status
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                              <div className="flex items-center">
                                {getAbnStatusBadge(
                                  selectedVendor.abnDetails.status
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Business Location
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-orange-500">
                              <p className="text-lg text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.businessLocation ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                          <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative flex items-start gap-4 p-6 border-l-4 border-green-500 bg-gradient-to-r from-green-50/80 to-emerald-50/40 dark:from-green-950/20 dark:to-emerald-950/10 rounded-r-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="absolute -left-2 top-6 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-sm">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                              Account Created
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Vendor successfully registered on the platform
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                              {new Date(
                                selectedVendor.registrationDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="relative flex items-start gap-4 p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-r-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="absolute -left-2 top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                              Profile Updated
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Business information and profile details were
                              updated
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                              {new Date(
                                selectedVendor.lastActivity
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 rounded-t-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end max-w-md sm:max-w-none mx-auto">
              {selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "onhold") && (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                      onClick={() => handleRejectVendor(selectedVendor)}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </Button>
                    <Button
                      size="lg"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      onClick={() => handleApproveVendor(selectedVendor)}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Vendor
                    </Button>
                  </>
                )}
              {selectedVendor.storeName &&
                selectedVendor.status === "rejected" && (
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => handleApproveVendor(selectedVendor)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Vendor
                  </Button>
                )}
              {selectedVendor.storeName &&
                selectedVendor.status === "approved" && (
                  <>
                    {selectedVendor.isActive ? (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                        onClick={() => handleRestoreVendor(selectedVendor)}
                      >
                        <RotateCcw className="w-5 h-5" />
                        Restore Vendor
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                        onClick={() => handleDeleteVendor(selectedVendor)}
                      >
                        <Trash2 className="w-5 h-5" />
                        Deactivate Vendor
                      </Button>
                    )}
                  </>
                )}
              {!selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "rejected" ||
                  selectedVendor.status === "onhold") && (
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => handleApproveVendor(selectedVendor)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Vendor
                  </Button>
                )}
              {!selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "onhold") && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                    onClick={() => handleRejectVendor(selectedVendor)}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-transparent border-t-blue-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedVendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedVendor(null)}
                className="text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Vendors</span>
                <span className="sm:hidden">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                {selectedVendor.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden sm:flex items-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent"
                      onClick={() => handleRejectVendor(selectedVendor)}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleApproveVendor(selectedVendor)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Approve</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-white/30 shadow-2xl ring-4 ring-white/10 flex-shrink-0">
                  <AvatarImage
                    src={selectedVendor.avatar || "/placeholder.svg"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                    {selectedVendor.storeName
                      ? selectedVendor.storeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : selectedVendor.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedVendor.storeName || selectedVendor.email}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                      {selectedVendor.industryName || "Registered Vendor"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {getStatusBadge(selectedVendor.status)}
                    {getRoleBadge(selectedVendor.role)}
                    {getEmailVerificationBadge(selectedVendor.isEmailVerified)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-2 sm:grid-cols-4 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Business</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="abn"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>ABN</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <History className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Activity</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 sm:p-8">
                <TabsContent value="overview" className="space-y-6">
                  <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Contact
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Email Address
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium break-all">
                              {selectedVendor.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Verification Status
                            </label>
                            <div className="mt-2">
                              {getEmailVerificationBadge(
                                selectedVendor.isEmailVerified
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Location
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Store
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store Name
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.storeName || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store URL
                            </label>
                            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 mt-2 break-all bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {selectedVendor.storeUrl || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Industry
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.industryName || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Status & Role */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Status
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              User Role
                            </label>
                            <div className="mt-2">
                              {getRoleBadge(selectedVendor.role)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Onboarding Status
                            </label>
                            <div className="mt-2">
                              {getStatusBadge(selectedVendor.status)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Payment Preference
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.paymentPreference ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Purpose */}
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Business Purpose
                          </h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                          <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                            {selectedVendor.purpose ||
                              "No business purpose specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                  <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Contact
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Email Address
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium break-all">
                              {selectedVendor.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Verification Status
                            </label>
                            <div className="mt-2">
                              {getEmailVerificationBadge(
                                selectedVendor.isEmailVerified
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Location
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Store
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store Name
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.storeName || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store URL
                            </label>
                            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 mt-2 break-all bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {selectedVendor.storeUrl || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Industry
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.industryName || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Status & Role */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Status
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              User Role
                            </label>
                            <div className="mt-2">
                              {getRoleBadge(selectedVendor.role)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Onboarding Status
                            </label>
                            <div className="mt-2">
                              {getStatusBadge(selectedVendor.status)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Payment Preference
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.paymentPreference ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Purpose */}
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Business Purpose
                          </h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                          <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                            {selectedVendor.purpose ||
                              "No business purpose specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="abn" className="mt-0">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        ABN Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Entity Name
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-500">
                              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.entityName ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Business Type
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-indigo-500">
                              <p className="text-lg text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.type ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              ABN Status
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                              <div className="flex items-center">
                                {getAbnStatusBadge(
                                  selectedVendor.abnDetails.status
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Business Location
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-orange-500">
                              <p className="text-lg text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.businessLocation ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                          <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative flex items-start gap-4 p-6 border-l-4 border-green-500 bg-gradient-to-r from-green-50/80 to-emerald-50/40 dark:from-green-950/20 dark:to-emerald-950/10 rounded-r-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="absolute -left-2 top-6 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-sm">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                              Account Created
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Vendor successfully registered on the platform
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                              {new Date(
                                selectedVendor.registrationDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="relative flex items-start gap-4 p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-r-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="absolute -left-2 top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                              Profile Updated
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Business information and profile details were
                              updated
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                              {new Date(
                                selectedVendor.lastActivity
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 rounded-t-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end max-w-md sm:max-w-none mx-auto">
              {selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "onhold") && (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                      onClick={() => handleRejectVendor(selectedVendor)}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </Button>
                    <Button
                      size="lg"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      onClick={() => handleApproveVendor(selectedVendor)}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Vendor
                    </Button>
                  </>
                )}
              {selectedVendor.storeName &&
                selectedVendor.status === "rejected" && (
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => handleApproveVendor(selectedVendor)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Vendor
                  </Button>
                )}
              {selectedVendor.storeName &&
                selectedVendor.status === "approved" && (
                  <>
                    {selectedVendor.isActive ? (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                        onClick={() => handleRestoreVendor(selectedVendor)}
                      >
                        <RotateCcw className="w-5 h-5" />
                        Restore Vendor
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                        onClick={() => handleDeleteVendor(selectedVendor)}
                      >
                        <Trash2 className="w-5 h-5" />
                        Deactivate Vendor
                      </Button>
                    )}
                  </>
                )}
              {!selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "rejected" ||
                  selectedVendor.status === "onhold") && (
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => handleApproveVendor(selectedVendor)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Vendor
                  </Button>
                )}
              {!selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "onhold") && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                    onClick={() => handleRejectVendor(selectedVendor)}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="flex items-center justify-center py-12 sm:py-16 lg:py-20">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-3 sm:border-4 border-transparent border-t-blue-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedVendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedVendor(null)}
                className="text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Vendors</span>
                <span className="sm:hidden">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                {selectedVendor.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hidden sm:flex items-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent"
                      onClick={() => handleRejectVendor(selectedVendor)}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={() => handleApproveVendor(selectedVendor)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Approve</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-4 border-white/30 shadow-2xl ring-4 ring-white/10 flex-shrink-0">
                  <AvatarImage
                    src={selectedVendor.avatar || "/placeholder.svg"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                    {selectedVendor.storeName
                      ? selectedVendor.storeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : selectedVendor.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedVendor.storeName || selectedVendor.email}
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                      {selectedVendor.industryName || "Registered Vendor"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {getStatusBadge(selectedVendor.status)}
                    {getRoleBadge(selectedVendor.role)}
                    {getEmailVerificationBadge(selectedVendor.isEmailVerified)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50">
                <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-2 sm:grid-cols-4 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Business</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="abn"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>ABN</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md rounded-lg transition-all duration-200 text-xs sm:text-sm font-medium"
                  >
                    <History className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Activity</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 sm:p-8">
                <TabsContent value="overview" className="space-y-6">
                  <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Contact
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Email Address
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium break-all">
                              {selectedVendor.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Verification Status
                            </label>
                            <div className="mt-2">
                              {getEmailVerificationBadge(
                                selectedVendor.isEmailVerified
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Location
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Store
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store Name
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.storeName || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store URL
                            </label>
                            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 mt-2 break-all bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {selectedVendor.storeUrl || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Industry
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.industryName || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Status & Role */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Status
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              User Role
                            </label>
                            <div className="mt-2">
                              {getRoleBadge(selectedVendor.role)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Onboarding Status
                            </label>
                            <div className="mt-2">
                              {getStatusBadge(selectedVendor.status)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Payment Preference
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.paymentPreference ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Purpose */}
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Business Purpose
                          </h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                          <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                            {selectedVendor.purpose ||
                              "No business purpose specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                  <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Contact
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Email Address
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium break-all">
                              {selectedVendor.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Verification Status
                            </label>
                            <div className="mt-2">
                              {getEmailVerificationBadge(
                                selectedVendor.isEmailVerified
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Location
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.location || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Store
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store Name
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.storeName || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Store URL
                            </label>
                            <p className="text-sm font-mono text-slate-900 dark:text-slate-100 mt-2 break-all bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {selectedVendor.storeUrl || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Industry
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.industryName || "Not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Status & Role */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              Status
                            </h3>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              User Role
                            </label>
                            <div className="mt-2">
                              {getRoleBadge(selectedVendor.role)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Onboarding Status
                            </label>
                            <div className="mt-2">
                              {getStatusBadge(selectedVendor.status)}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Payment Preference
                            </label>
                            <p className="text-sm text-slate-900 dark:text-slate-100 mt-2 font-medium">
                              {selectedVendor.paymentPreference ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Purpose */}
                      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Business Purpose
                          </h3>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                          <p className="text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                            {selectedVendor.purpose ||
                              "No business purpose specified"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="abn" className="mt-0">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                          <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        ABN Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Entity Name
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-500">
                              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.entityName ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Business Type
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-indigo-500">
                              <p className="text-lg text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.type ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              ABN Status
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-500">
                              <div className="flex items-center">
                                {getAbnStatusBadge(
                                  selectedVendor.abnDetails.status
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="group">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 block">
                              Business Location
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border-l-4 border-orange-500">
                              <p className="text-lg text-slate-900 dark:text-slate-100">
                                {selectedVendor.abnDetails.businessLocation ||
                                  "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                          <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative flex items-start gap-4 p-6 border-l-4 border-green-500 bg-gradient-to-r from-green-50/80 to-emerald-50/40 dark:from-green-950/20 dark:to-emerald-950/10 rounded-r-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="absolute -left-2 top-6 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-sm">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                              Account Created
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Vendor successfully registered on the platform
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                              {new Date(
                                selectedVendor.registrationDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="relative flex items-start gap-4 p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-r-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="absolute -left-2 top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl shadow-sm">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                              Profile Updated
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Business information and profile details were
                              updated
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                              {new Date(
                                selectedVendor.lastActivity
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 rounded-t-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end max-w-md sm:max-w-none mx-auto">
              {selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "onhold") && (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                      onClick={() => handleRejectVendor(selectedVendor)}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </Button>
                    <Button
                      size="lg"
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      onClick={() => handleApproveVendor(selectedVendor)}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Vendor
                    </Button>
                  </>
                )}
              {selectedVendor.storeName &&
                selectedVendor.status === "rejected" && (
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => handleApproveVendor(selectedVendor)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Vendor
                  </Button>
                )}
              {selectedVendor.storeName &&
                selectedVendor.status === "approved" && (
                  <>
                    {selectedVendor.isActive ? (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                        onClick={() => handleRestoreVendor(selectedVendor)}
                      >
                        <RotateCcw className="w-5 h-5" />
                        Restore Vendor
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                        onClick={() => handleDeleteVendor(selectedVendor)}
                      >
                        <Trash2 className="w-5 h-5" />
                        Deactivate Vendor
                      </Button>
                    )}
                  </>
                )}
              {!selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "rejected" ||
                  selectedVendor.status === "onhold") && (
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => handleApproveVendor(selectedVendor)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Vendor
                  </Button>
                )}
              {!selectedVendor.storeName &&
                (selectedVendor.status === "pending" ||
                  selectedVendor.status === "onhold") && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/50 bg-transparent transition-all duration-200 hover:scale-105 shadow-sm"
                    onClick={() => handleRejectVendor(selectedVendor)}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {error && (
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-rose-100/80 backdrop-blur-sm dark:border-red-800/50 dark:from-red-950/30 dark:to-rose-950/30">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6">
              <div className="rounded-full bg-red-100 p-2 sm:p-3 dark:bg-red-900/30 flex-shrink-0">
                <XCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-red-900 dark:text-red-100 text-sm sm:text-base">
                  Error Loading Data
                </h3>
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="mt-2 sm:mt-3 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Page Header */}
        <div className="relative z-50 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-2 sm:p-3 lg:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Vendor Management
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              Manage vendor registrations and business details
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4">
            <Button
              variant="outline"
              onClick={() => handleExportVendors(vendors)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export Data</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
          <StatCard
            title="Total Vendors"
            value={stats.total.toString()}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Approved"
            value={stats.approved.toString()}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Pending"
            value={stats.pending.toString()}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected.toString()}
            icon={<XCircle className="w-6 h-6" />}
            color="red"
          />
        </div>

        <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <CardContent className="p-2 sm:p-3 lg:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 sm:w-4 sm:h-4" />
                <Input
                  placeholder="Search vendors by name, email, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 h-10 sm:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full xs:w-36 sm:w-40 h-9 sm:h-10 lg:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm">
                      <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="onhold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-slate-500 text-xs sm:text-sm">
                  {filteredOnboardedVendors.length +
                    filteredRegisteredVendors.length}{" "}
                  of {vendors.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-700/20 shadow-xl rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-2 px-2 sm:px-3 lg:px-6 pt-3 sm:pt-4 lg:pt-6">
            <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Vendors (
              {filteredOnboardedVendors.length +
                filteredRegisteredVendors.length}
              )
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-3 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
            <Tabs defaultValue="onboarded" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100/80 dark:bg-slate-700/80 mb-4 sm:mb-6 lg:mb-8 h-10 sm:h-12">
                <TabsTrigger
                  value="onboarded"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 text-xs sm:text-sm"
                >
                  Onboarded Vendors ({filteredOnboardedVendors.length})
                </TabsTrigger>
                <TabsTrigger
                  value="registered"
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 text-xs sm:text-sm"
                >
                  Registered Vendors ({filteredRegisteredVendors.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="onboarded">
                {filteredOnboardedVendors.length === 0 ? (
                  <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-lg sm:rounded-xl lg:rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16">
                      <Users className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-slate-400 mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        No Onboarded Vendors Found
                      </h3>
                      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 text-center mb-4 sm:mb-6 max-w-md px-4">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        roleFilter !== "all"
                          ? "No onboarded vendors match your current filters. Try adjusting your search criteria."
                          : "No onboarded vendors available."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  renderVendorTable(filteredOnboardedVendors, true)
                )}
              </TabsContent>

              <TabsContent value="registered">
                {filteredRegisteredVendors.length === 0 ? (
                  <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-lg sm:rounded-xl lg:rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16">
                      <Users className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-slate-400 mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        No Registered Vendors Found
                      </h3>
                      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 text-center mb-4 sm:mb-6 max-w-md px-4">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        roleFilter !== "all"
                          ? "No registered vendors match your current filters. Try adjusting your search criteria."
                          : "No registered vendors available."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  renderVendorTable(filteredRegisteredVendors, false)
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-3 shadow-lg">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                    Reject Vendor
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Are you sure you want to reject this vendor? This action
                    will mark the vendor as rejected and deactivate their
                    account.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {vendorToReject && (
              <div className="my-6 p-4 bg-red-50/80 dark:bg-red-950/30 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center text-white shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {vendorToReject.storeName || vendorToReject.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {vendorToReject.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="my-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Rejection Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Please provide a reason for rejection..."
                required
              />
            </div>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRejectVendor}
                disabled={!rejectionComment.trim()}
                className="flex-1 h-12 bg-gradient-to-r from-red-600 to-rose-600 shadow-lg hover:from-red-700 hover:to-rose-700 hover:shadow-xl text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Vendor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={holdDialogOpen} onOpenChange={setHoldDialogOpen}>
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-3 shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    Place Vendor on Hold
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Are you sure you want to place this vendor on hold? This
                    action will mark the vendor as on hold and deactivate their
                    account.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {vendorToHold && (
              <div className="my-6 p-4 bg-orange-50/80 dark:bg-orange-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {vendorToHold.storeName || vendorToHold.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {vendorToHold.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmHoldVendor}
                className="flex-1 h-12 bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg hover:from-orange-700 hover:to-amber-700 hover:shadow-xl text-white rounded-xl"
              >
                <Clock className="mr-2 h-4 w-4" />
                Hold Vendor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={restoreDialogOpen}
          onOpenChange={setRestoreDialogOpen}
        >
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 shadow-lg">
                  <RotateCcw className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold text-green-600 dark:text-green-400">
                    Restore Vendor
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Are you sure you want to restore this vendor? This action
                    will reactivate their account and set their status to
                    approved.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {vendorToRestore && (
              <div className="my-6 p-4 bg-green-50/80 dark:bg-green-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {vendorToRestore.storeName || vendorToRestore.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {vendorToRestore.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRestoreVendor}
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl text-white rounded-xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore Vendor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-md">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-3 shadow-lg">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
                    Deactivate Vendor
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Are you sure you want to deactivate this vendor? This will
                    mark the vendor as rejected and deactivate their account.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {vendorToDelete && (
              <div className="my-6 p-4 bg-red-50/80 dark:bg-red-950/30 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-400 flex items-center justify-center text-white shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {vendorToDelete.storeName || vendorToDelete.email}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {vendorToDelete.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="flex-1 h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteVendor}
                className="flex-1 h-12 bg-gradient-to-r from-red-600 to-rose-600 shadow-lg hover:from-red-700 hover:to-rose-700 hover:shadow-xl text-white rounded-xl"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deactivate Vendor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default VendorManagement;
