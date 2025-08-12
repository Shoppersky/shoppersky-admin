"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  Crown,
  User,
  Save,
  X,
  Info,
  Store,
  Sparkles,
  Grid3X3,
  List,
  RotateCcw,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// StatCard Component with consistent theme
function StatCard({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "indigo";
}) {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
    purple: "text-purple-600 dark:text-purple-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {value}
            </p>
          </div>
          <div
            className={`p-2 sm:p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl shadow-lg ${colorClasses[color]}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mobile User Card Component
function UserCard({
  user,
  onEdit,
  onDelete,
  onRestore,
  getRoleBadge,
  getStatusBadge,
}: {
  user: UserInterface;
  onEdit: (user: UserInterface) => void;
  onDelete: (user: UserInterface) => void;
  onRestore: (user: UserInterface) => void;
  getRoleBadge: (role: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shadow-sm flex-shrink-0">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold text-xs sm:text-sm">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm sm:text-base">
                {user.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit User
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              {user.status === "Active" ? (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDelete(user)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Deactivate User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => onRestore(user)}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restore User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Role
            </span>
            {getRoleBadge(user.role)}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Status
            </span>
            {getStatusBadge(user.status)}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
            <Calendar className="w-3 h-3" />
            <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  joinDate: string;
  lastActive: string;
}

interface RoleInterface {
  id: string;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserInterface | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserInterface | null>(null);
  const [userToRestore, setUserToRestore] = useState<UserInterface | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",

    role: "",
    role_id: "",
  });

  // Fetch roles
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const response = await axiosInstance.get("/roles/?is_active=false");
        setRoles(
          response.data.data
            .filter((role: any) => role.role_name !== "SUPERADMIN")
            .map((role: any) => ({
              id: role.role_id,
              name: role.role_name,
            }))
        );
      } catch (err) {
        setError("Failed to fetch roles");
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
          "/admin-users/?include_inactive=true"
        );
        const apiUsers = response.data.data.admins.map((user: any) => ({
          id: user.user_id,
          name: user.username,
          email: user.email,
          role: roles.find((r) => r.id === user.role_id)?.name || "Unknown",
          status: user.is_active ? "Inactive" : "Active",
          joinDate: user.created_at,
          lastActive: user.created_at,
        }));
        setUsers(apiUsers);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };
    if (roles.length > 0) {
      fetchUsers();
    }
  }, [roles]);

  // Filtered users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status.toLowerCase() === statusFilter;
      const matchesRole =
        roleFilter === "all" || user.role.toLowerCase() === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
    const adminUsers = users.filter((u) => u.role === "Admin").length;

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      admin: adminUsers,
    };
  }, [users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleAddUser = async () => {
  //   try {
  //     const payload = {
  //       username: formData.name,
  //       email: formData.email,
  //       role_id: formData.role_id,
  //     };

  //     let response;
  //     if (editingUser) {
  //       response = await axiosInstance.put(
  //         `/admin-users/${editingUser.id}`,
  //         payload
  //       );
  //     } else {
  //       response = await axiosInstance.post("/admin-users/register", payload);
  //     }

  //     const newUser: UserInterface = {
  //       id: response.data.data.user_id,
  //       name: response.data.data.username,
  //       email: response.data.data.email,
  //       role: roles.find((r) => r.id === formData.role_id)?.name || "Unknown",
  //       status: response.data.data.is_active ? "Inactive" : "Active",
  //       joinDate:
  //         response.data.data.created_at ||
  //         new Date().toISOString().split("T")[0],
  //       lastActive:
  //         response.data.data.created_at ||
  //         new Date().toISOString().split("T")[0],
  //     };

  //     if (editingUser) {
  //       setUsers((prev) =>
  //         prev.map((user) =>
  //           user.id === editingUser.id ? { ...user, ...newUser } : user
  //         )
  //       );
  //     } else {
  //       setUsers((prev) => [...prev, newUser]);
  //     }

  //     setFormData({
  //       name: "",
  //       email: "",

  //       role: "",
  //       role_id: "",
  //     });
  //     setEditingUser(null);
  //     setOpen(false);
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || "Failed to create/update user");
  //   }
  // };


  const handleAddUser = async () => {
  try {
    const payload = {
      username: formData.name,
      email: formData.email,
      role_id: formData.role_id,
    };

    let response;
    if (editingUser) {
      response = await axiosInstance.put(`/admin-users/${editingUser.id}`, payload);
    } else {
      response = await axiosInstance.post("/admin-users/register", payload);
    }

    const responseUser = response.data.data;
    const newUser: UserInterface = {
      id: responseUser.user_id,
      name: responseUser.username,
      email: responseUser.email,
      role: roles.find((r) => r.id === formData.role_id)?.name || "Unknown",
      status: responseUser.is_active ? "Inactive" : "Active", // Adjust based on API response
      joinDate: responseUser.created_at || new Date().toISOString().split("T")[0],
      lastActive: responseUser.created_at || new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => {
      // Check if the user already exists in the state (by id or email)
      const existingUserIndex = prev.findIndex(
        (user) => user.id === newUser.id || user.email === newUser.email
      );

      if (existingUserIndex !== -1) {
        // If user exists (likely restored), update the existing user
        return prev.map((user, index) =>
          index === existingUserIndex ? { ...user, ...newUser } : user
        );
      } else {
        // If user is new, append to the list
        return [...prev, newUser];
      }
    });

    setFormData({
      name: "",
      email: "",
      role: "",
      role_id: "",
    });
    setEditingUser(null);
    setOpen(false);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to create/update user");
  }
};

  const handleEditUser = (user: UserInterface) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,

      role: user.role,
      role_id: roles.find((r) => r.name === user.role)?.id || "",
    });
    setOpen(true);
  };

  const handleDeactivateUser = (user: UserInterface) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeactivateUser = async () => {
    if (userToDelete) {
      try {
        await axiosInstance.delete(`/admin-users/soft/${userToDelete.id}`);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userToDelete.id ? { ...user, status: "Inactive" } : user
          )
        );
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to deactivate user");
      }
    }
  };

  const handleRestoreUser = (user: UserInterface) => {
    setUserToRestore(user);
    setRestoreDialogOpen(true);
  };

  const confirmRestoreUser = async () => {
    if (userToRestore) {
      try {
        await axiosInstance.post(`/admin-users/restore/${userToRestore.id}`);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userToRestore.id ? { ...user, status: "Active" } : user
          )
        );
        setRestoreDialogOpen(false);
        setUserToRestore(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to restore user");
      }
    }
  };

  const handleExportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Status", "Join Date", "Last Active"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,

        user.role,
        user.status,
        user.joinDate,
        user.lastActive,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0 flex items-center gap-1 text-xs">
            <Crown className="w-3 h-3" />
            Admin
          </Badge>
        );
      case "Manager":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0 flex items-center gap-1 text-xs">
            <Shield className="w-3 h-3" />
            Manager
          </Badge>
        );
      case "Employee":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 flex items-center gap-1 text-xs">
            <User className="w-3 h-3" />
            Employee
          </Badge>
        );
      case "Vendor":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-0 flex items-center gap-1 text-xs">
            <Store className="w-3 h-3" />
            Vendor
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 flex items-center gap-1 text-xs">
            <UserCheck className="w-3 h-3" />
            Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0 flex items-center gap-1 text-xs">
            <UserX className="w-3 h-3" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-xl">{error}</div>
        )}
        {/* Header */}
        <div className="relative z-50 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-700/50 p-2 sm:p-3 lg:p-6 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Employee Management
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              View and manage employee accounts
            </p>
          </div>

          
        

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-end gap-3 sm:gap-4 px-3 sm:px-4 lg:px-0">
          <Button
            variant="outline"
            onClick={handleExportUsers}
            className="flex items-end justify-end gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 h-10 sm:h-11 md:h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="hidden xs:inline">Export Data</span>
            <span className="xs:hidden">Export</span>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-end justify-end gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 h-10 sm:h-11 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl"
                onClick={() => {
                  setEditingUser(null);
                  setFormData({
                    name: "",
                    email: "",
                    role: "",
                    role_id: "",
                  });
                }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline">Add Employee</span>
                <span className="xs:hidden">Add Employee</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl backdrop-blur-sm m-2 sm:m-4">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  {editingUser ? (
                    <>
                      <Pencil className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                      Edit User
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                      Add New User
                    </>
                  )}
                </DialogTitle>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2">
                  {editingUser
                    ? "Update user information"
                    : "Fill in the details to add a new user"}
                </p>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name *
                      </Label>
                      <Input
                        placeholder="Enter full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-11 md:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        placeholder="Enter email address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-11 md:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Role Section */}
                <div className="space-y-4">
                  <h3 className="text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                    Role & Access
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Role *
                      </Label>
                      <Select
                        value={formData.role_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, role_id: value }))
                        }
                      >
                        <SelectTrigger className="h-11 md:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl text-sm md:text-base">
                          <SelectValue
                            placeholder={
                              isLoadingRoles
                                ? "Loading roles..."
                                : "Select role"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingRoles ? (
                            <SelectItem value="" disabled>
                              Loading roles...
                            </SelectItem>
                          ) : roles.length === 0 ? (
                            <SelectItem value="" disabled>
                              No roles available
                            </SelectItem>
                          ) : (
                            roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex items-center gap-2">
                                  {role.name === "SUPERADMIN" && (
                                    <Crown className="w-4 h-4 text-red-600" />
                                  )}
                                  {role.name === "ADMIN" && (
                                    <Shield className="w-4 h-4 text-blue-600" />
                                  )}
                                  {role.name}
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {!editingUser && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Welcome Email
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          A welcome email with login credentials will be sent to
                          the user's email address.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-3 flex-col sm:flex-row">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:flex-1 h-11 md:h-12 rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 text-sm md:text-base"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleAddUser}
                  disabled={
                    !formData.name || !formData.email || !formData.role_id
                  }
                  className="w-full sm:flex-1 h-11 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {editingUser ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Employee
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6">
          <StatCard
            title="Total Users"
            value={stats.total.toString()}
            icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.active.toString()}
            icon={<UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="green"
          />
          <StatCard
            title="Inactive Users"
            value={stats.inactive.toString()}
            icon={<UserX className="w-5 h-5 sm:w-6 sm:h-6" />}
            color="red"
          />
          
        </div>

        {/* Filters and Search */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 md:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full xs:w-36 sm:w-40 h-11 md:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl text-sm md:text-base">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full xs:w-36 sm:w-40 h-11 md:h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl text-sm md:text-base">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map((role) => (
                        <SelectItem
                          key={role.id}
                          value={role.name.toLowerCase()}
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                  <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1">
                    <Button
                      variant={viewMode === "cards" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("cards")}
                      className="h-9 md:h-10 px-3"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="h-9 md:h-10 px-3"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-slate-500 text-xs md:text-sm">
                    {filteredUsers.length} of {users.length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Display */}
        {viewMode === "cards" ? (
          filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEditUser}
                  onDelete={handleDeactivateUser}
                  onRestore={handleRestoreUser}
                  getRoleBadge={getRoleBadge}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                No Users Found
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 text-center mb-4 sm:mb-6 max-w-md mx-auto px-4">
                {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                  ? "No users match your current filters. Try adjusting your search criteria."
                  : "Get started by adding your first user to manage your team."}
              </p>
            </div>
          )
        ) : (
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/50 dark:border-slate-700/50">
              <CardTitle className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="text-left p-2 sm:p-3 md:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm md:text-base">
                        User
                      </th>
                      <th className="text-left p-2 sm:p-3 md:p-4 font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell text-xs sm:text-sm md:text-base">
                        Contact
                      </th>
                      <th className="text-left p-2 sm:p-3 md:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm md:text-base">
                        Role
                      </th>
                      <th className="text-left p-2 sm:p-3 md:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm md:text-base">
                        Status
                      </th>
                      <th className="text-left p-2 sm:p-3 md:p-4 font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell text-xs sm:text-sm md:text-base">
                        Activity
                      </th>

                      <th className="text-left p-2 sm:p-3 md:p-4 font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm md:text-base">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                      >
                        <td className="p-2 sm:p-3 md:p-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 shadow-sm flex-shrink-0">
                              <AvatarImage
                                src={user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold text-xs">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm md:text-base">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate md:hidden">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 md:p-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 md:p-4">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="p-2 sm:p-3 md:p-4 hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              Joined:{" "}
                              {new Date(user.joinDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Last active:{" "}
                              {new Date(user.lastActive).toLocaleDateString()}
                            </div>
                          </div>
                        </td>

                        <td className="p-2 sm:p-3 md:p-4">
                          <div className="flex items-center gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                  <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                {user.status === "Active" ? (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeactivateUser(user)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Deactivate User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() => handleRestoreUser(user)}
                                  >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Restore User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 sm:py-12 md:py-16">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    No Users Found
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400 text-center mb-4 sm:mb-6 max-w-md mx-auto px-4">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    roleFilter !== "all"
                      ? "No users match your current filters. Try adjusting your search criteria."
                      : "Get started by adding your first user to manage your team."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Deactivate Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-[95vw] sm:max-w-md mx-2 sm:mx-auto">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 p-3 shadow-lg flex-shrink-0">
                  <Trash2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <AlertDialogTitle className="text-lg md:text-xl font-bold text-red-600 dark:text-red-400">
                    Deactivate User
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                    This will deactivate the user account. The user can be
                    restored later.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {userToDelete && (
              <div className="my-6 p-4 bg-red-50/80 dark:bg-red-950/30 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                    <AvatarImage
                      src={userToDelete.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-red-400 to-rose-400 text-white font-bold text-sm">
                      {userToDelete.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                      {userToDelete.name}
                    </p>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                      {userToDelete.role} • {userToDelete.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="gap-3 flex-col sm:flex-row">
              <AlertDialogCancel className="w-full sm:flex-1 h-11 md:h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm md:text-base">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeactivateUser}
                className="w-full sm:flex-1 h-11 md:h-12 bg-gradient-to-r from-red-600 to-rose-600 shadow-lg hover:from-red-700 hover:to-rose-700 hover:shadow-xl text-white rounded-xl text-sm md:text-base"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deactivate User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Restore Confirmation Dialog */}
        <AlertDialog
          open={restoreDialogOpen}
          onOpenChange={setRestoreDialogOpen}
        >
          <AlertDialogContent className="border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-sm max-w-[95vw] sm:max-w-md mx-2 sm:mx-auto">
            <AlertDialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 shadow-lg flex-shrink-0">
                  <RotateCcw className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <AlertDialogTitle className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
                    Restore User
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                    This will restore the user account to active status.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {userToRestore && (
              <div className="my-6 p-4 bg-green-50/80 dark:bg-green-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                    <AvatarImage
                      src={userToRestore.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-400 text-white font-bold text-sm">
                      {userToRestore.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
                      {userToRestore.name}
                    </p>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                      {userToRestore.role} • {userToRestore.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AlertDialogFooter className="gap-3 flex-col sm:flex-row">
              <AlertDialogCancel className="w-full sm:flex-1 h-11 md:h-12 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm md:text-base">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRestoreUser}
                className="w-full sm:flex-1 h-11 md:h-12 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl text-white rounded-xl text-sm md:text-base"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
