"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Shield,
  Store,
  Camera,
  Upload,
  X,
  Key,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Calendar,
  Globe,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance"; // Adjust path to your axios instance
import useStore from "@/lib/Zustand";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  
  avatar?: string | null;
  joinDate: string;
  
}

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  digit: boolean;
  special: boolean;
}

export default function ProfilePage() {
  const { userId } = useStore();

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    role: "",
    
    avatar: "/placeholder.svg?height=120&width=120&text=JD",
    joinDate: "",
   
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  });

  // Fetch profile data on component mount
  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/admin-users/${userId}/admin-profile-details`);
      const { data } = response.data; // Assuming api_response structure
      setProfileData({
        name: data.username || "Unknown",
        email: data.email || "",
        role: data.role_name || "Unknown",
        
        avatar: data.profile_picture_url || "/placeholder.svg?height=120&width=120&text=JD",
        joinDate: data.join_date || "Unknown",
        
      });
     
    } catch (error) {
      
      console.error("Error fetching profile:", error);
    }
  };

  // Password validation function
  const validatePassword = (password: string): PasswordValidation => {
    return {
      length: password.length >= 8 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  // Handle password input change
  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (field === "newPassword") {
      setPasswordValidation(validatePassword(value));
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture update
  const handleUpdateProfilePicture = async () => {
    if (!selectedImage || !userId) {
      toast.error("No image selected or user not authenticated");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await axiosInstance.post(`/vendor/${userId}/profile-picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileData((prev) => ({
        ...prev,
        avatar: response.data.data.profile_picture_url || imagePreview,
      }));
      setSelectedImage(null);
      setImagePreview(null);
      toast.success(response.data.message || "Profile picture updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile picture");
      console.error("Error uploading profile picture:", error);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    const isValid = Object.values(passwordValidation).every(Boolean);

    if (!passwordData.oldPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!isValid) {
      toast.error("Please ensure your new password meets all requirements");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post(`/vendor/update-password?user_id=${userId}`, {
        user_id: userId,
        current_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });

      setChangePasswordOpen(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordValidation({
        length: false,
        uppercase: false,
        lowercase: false,
        digit: false,
        special: false,
      });
      toast.success(response.data.message || "Password changed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
      console.error("Error changing password:", error);
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div
      className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
        isValid ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isValid ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        {isValid ? (
          <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
        ) : (
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        )}
      </div>
      <span className={isValid ? "font-medium" : ""}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-100 dark:border-indigo-800/30">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center space-y-6">
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 border-4 border-white/50 dark:border-slate-700/50 shadow-2xl">
                  <AvatarImage
                    src={imagePreview || profileData.avatar || "/placeholder.svg"}
                    alt={profileData.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl font-bold">
                    {profileData.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {imagePreview && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0 shadow-lg"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl cursor-pointer hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50 transition-all duration-300 text-indigo-700 dark:text-indigo-300 font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Choose New Photo
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG up to 5MB
                </p>
              </div>

              {selectedImage && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateProfilePicture}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Update Photo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Information Section */}
          <Card className="lg:col-span-2 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-100 dark:border-indigo-800/30">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <User className="w-5 h-5 text-white" />
                </div>
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <div className="h-12 px-4 bg-gray-50/80 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{profileData.name}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <div className="h-12 px-4 bg-gray-50/80 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{profileData.email}</span>
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </Label>
                  <div className="h-12 px-4 bg-gray-50/80 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center">
                    <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-300 dark:border-indigo-800">
                      {profileData.role}
                    </Badge>
                  </div>
                </div>

              


                
              </div>

              

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {profileData.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="lg:col-span-3 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-100 dark:border-indigo-800/30">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Key className="w-5 h-5 text-white" />
                </div>
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep your account secure with a strong password
                  </p>
                </div>
                <Button
                  onClick={() => setChangePasswordOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Change Password Modal */}
        <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Key className="w-5 h-5 text-white" />
                </div>
                Change Password
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="old-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="old-password"
                    type={showPasswords.old ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                    className="h-12 pr-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, old: !prev.old }))}
                  >
                    {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className="h-12 pr-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className="h-12 pr-12 bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-800 rounded-xl"
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              {passwordData.newPassword && (
                <div className="bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-indigo-950/50 rounded-xl p-4 border border-gray-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Password Requirements
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <ValidationItem isValid={passwordValidation.length} text="8-12 characters long" />
                    <ValidationItem isValid={passwordValidation.uppercase} text="One uppercase letter" />
                    <ValidationItem isValid={passwordValidation.lowercase} text="One lowercase letter" />
                    <ValidationItem isValid={passwordValidation.digit} text="One number" />
                    <ValidationItem isValid={passwordValidation.special} text="One special character" />
                  </div>
                </div>
              )}

              {/* Password Match Indicator */}
              {passwordData.confirmPassword && (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    passwordData.newPassword === passwordData.confirmPassword
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {passwordData.newPassword === passwordData.confirmPassword ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>
                    {passwordData.newPassword === passwordData.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <DialogFooter className="gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordValidation({
                      length: false,
                      uppercase: false,
                      lowercase: false,
                      digit: false,
                      special: false,
                    });
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleChangePassword}
                disabled={
                  !passwordData.oldPassword ||
                  !Object.values(passwordValidation).every(Boolean) ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}