"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Plus,
  Search,
  ExternalLink,
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Loader2,
} from "lucide-react";
import {
  usePartners,
  usePartnerFilters,
  usePartnerStats,
  usePartnerActions,
} from "./hooks";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { PartnerFormDialog } from "./components/PartnerFormDialog";

import { PartnerStats } from "./components/PartnerStats";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Partner } from "./types";

// Enhanced StatCard Component
function StatCard({
  title,
  value,
  icon,
  color = "slate",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}) {
  const colorClasses = {
    slate:
      "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700",
    emerald:
      "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700",
  };
  const iconColors = {
    slate: "text-slate-600 dark:text-slate-400",
    emerald: "text-emerald-600 hard:text-emerald-400",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group`}
    >
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{value}</p>
          </div>
          <div
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${iconColors[color]} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6">{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PartnerActions({
  partner,
  onEdit,
  onDelete,
}: {
  partner: Partner;
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(partner.website_url)}
          className="text-sm"
        >
          Copy URL
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => window.open(partner.website_url, "_blank")}
          className="text-sm"
        >
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Visit Website
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onEdit(partner)} className="text-sm">
          <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(partner)}
          className="text-red-600 text-sm"
        >
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PartnersPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Hooks
  const { partners, setPartners, loading, error, refetch } = usePartners();
  const { filters, filteredPartners, updateFilter } =
    usePartnerFilters(partners);
  const stats = usePartnerStats(partners);
  const { handleAddPartner, handleUpdatePartner, handleDeletePartner } =
    usePartnerActions(setPartners);

  // Open Edit dialog
  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowEditDialog(true);
  };

  // Open Delete dialog
  const handleDelete = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowDeleteDialog(true);
  };

  // Handle status toggle
  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await axiosInstance.patch(`/partners/status/${id}`);
      setPartners((prev) =>
        prev.map((partner) =>
          partner.partner_id === id
            ? { ...partner, partner_status: !currentStatus }
            : partner
        )
      );
      const message = currentStatus
        ? "Partner deactivated successfully"
        : "Partner activated successfully";
      toast.success(message, { description: "Partner Status Updated" });
    } catch (error) {
      console.error("Error toggling partner status:", error);
      toast.error("Failed to toggle partner status. Please try again.", {
        description: "Error",
      });
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (selectedPartner) {
      const success = await handleDeletePartner(selectedPartner.partner_id);
      if (success) {
        setShowDeleteDialog(false);
        setSelectedPartner(null);
      }
    }
  };

  // Handle update partner
  const handleUpdate = async (formData: any) => {
    if (selectedPartner) {
      const success = await handleUpdatePartner(
        selectedPartner.partner_id,
        formData
      );
      if (success) {
        setShowEditDialog(false);
        setSelectedPartner(null);
      }
      return success;
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 sm:py-12">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-2">
          {error}
        </h3>
        <Button
          variant="outline"
          onClick={refetch}
          className="mt-3 sm:mt-4 text-sm px-3 py-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Page Header */}
        <div className="relative z-50 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-2 sm:p-3 lg:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Partners Management
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              Manage your business partners and their information
            </p>
          </div>
          <div className="flex-shrink-0 self-end xs:self-auto">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="w-32 gap-2  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add Partner
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
          {Object.entries(stats).map(([key, value]) => (
            <StatCard
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value.toString()}
              icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
              color="emerald"
            />
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-900/20 p-3 sm:p-4 lg:p-6">
            <h3 className="text-base sm:text-lg font-semibold">
              Search Partners
            </h3>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3 sm:w-4 sm:h-4" />
              <Input
                placeholder="Search by URL..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="pl-8 sm:pl-10 h-9 sm:h-10 lg:h-11 transition-all duration-300 focus:ring-2 focus:ring-violet-500/20 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Partners Table */}
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-violet-50 dark:from-slate-800 dark:to-violet-900/20 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                <h3 className="text-base sm:text-lg font-semibold">
                  All Partners ({filteredPartners.length})
                </h3>
              </div>
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex text-xs"
              >
                {filteredPartners.length} of {partners.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPartners.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-2">
                  No partners found
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {partners.length === 0
                    ? "Get started by adding your first partner."
                    : "Try adjusting your search criteria."}
                </p>
                {partners.length === 0 && (
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="mt-3 sm:mt-4 text-sm px-3 py-2"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Add First Partner
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm font-semibold">
                        S.No
                      </TableHead>
                      <TableHead className="text-sm font-semibold">
                        Logo
                      </TableHead>
                      <TableHead className="text-sm font-semibold">
                        Website URL
                      </TableHead>
                      <TableHead className="text-sm font-semibold">
                        Created Date
                      </TableHead>
                      <TableHead className="text-sm font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-sm font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.map((partner) => (
                      <TableRow
                        key={partner.partner_id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell className="py-3 w-12">
                          {filteredPartners.indexOf(partner) + 1}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={partner.logo || "/placeholder-logo.svg"}
                              alt="Partner Logo"
                              fill
                              className="object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-logo.svg";
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <a
                            href={partner.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1 text-sm lg:text-base truncate max-w-[150px] lg:max-w-[200px]"
                          >
                            {partner.website_url
                              .replace(/^https?:\/\//, "")
                              .replace(/\/$/, "")}
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          </a>
                        </TableCell>
                        <TableCell className="py-3 text-sm lg:text-base">
                          {partner.created_at
                            ? new Date(partner.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={!partner.partner_status}
                              onCheckedChange={() =>
                                handleStatusToggle(
                                  partner.partner_id,
                                  partner.partner_status
                                )
                              }
                              className="h-4 w-7 sm:h-5 sm:w-9"
                            />
                            <Badge
                              variant={
                                !partner.partner_status
                                  ? "default"
                                  : "secondary"
                              }
                              className={`text-xs ${
                                !partner.partner_status
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {partner.partner_status ? "Inactive" : "Active"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <PartnerActions
                            partner={partner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Partner Dialog */}
        <PartnerFormDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddPartner}
          title="Add New Partner"
          submitText="Add Partner"
        />

        {/* Edit Partner Dialog */}
        <PartnerFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={handleUpdate}
          initialData={
            selectedPartner
              ? {
                  url: selectedPartner.website_url,
                  logo: null,
                  existingLogo: selectedPartner.logo,
                }
              : undefined
          }
          title="Edit Partner"
          submitText="Update Partner"
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Partner</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the partner "
                {selectedPartner?.website_url}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
