"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";


export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate email format client-side
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Create form data for API request
    const formData = new FormData();
    formData.append("email", email);

    try {
      // Make API call to forgot-password endpoint with form data
      const response = await axiosInstance.post("/admin/forgot-password", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if the response indicates success
      if (response.data.statusCode === 200) {
        setIsSuccess(true);
      } else {
        setError(response.data.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response) {
        const { status, data } = err.response;
        if (status === 404) {
          setError("No account found with this email address.");
        } else if (status === 403 && data.message?.includes("inactive")) {
          setError("This account is inactive. Please contact support.");
        } else if (status === 403 && data.message?.includes("verified")) {
          setError("This account is not verified. Please verify your account.");
        } else if (status === 422) {
          // Handle validation errors (e.g., missing or invalid email)
          const errors = data.detail || [];
          const emailError = errors.find((e: any) => e.loc.includes("email"));
          if (emailError) {
            setError(emailError.msg || "Please enter a valid email address.");
          } else {
            setError("Invalid request. Please try again.");
          }
        } else {
          setError(data.message || "An error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Resend email by calling the same endpoint
      const response = await axiosInstance.post("/vendor/forgot-password", { email });

      if (response.data.statusCode === 200) {
        setError(""); // Clear any previous errors
      } else {
        setError(response.data.message || "Failed to resend email. Please try again.");
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err.response) {
        const { status, data } = err.response;
        if (status === 404) {
          setError("No account found with this email address.");
        } else if (status === 403 && data.message.includes("inactive")) {
          setError("This account is inactive. Please contact support.");
        } else if (status === 403 && data.message.includes("verified")) {
          setError("This account is not verified. Please verify your account.");
        } else if (status === 422) {
          setError("Please enter a valid email address.");
        } else {
          setError(data.message || "Failed to resend email. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />

        <div className="w-full max-w-md mx-auto relative z-10">
          <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-2xl mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                  Check Your Email
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  We've sent a password reset link to
                </p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg mt-2">
                  {email}
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-6 mb-8">
                <div className="p-6 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-2xl border border-cyan-200/50 dark:border-cyan-800/50">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl">
                      <Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                        Check your inbox
                      </h3>
                      <p className="text-sm text-cyan-700 dark:text-cyan-300">
                        Click the reset link in the email to create a new
                        password. The link will expire in 60 minutes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        Didn't receive it?
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                        Check your spam folder or click below to resend the
                        email.
                      </p>
                      <Button
                        onClick={handleResendEmail}
                        disabled={isLoading}
                        variant="outline"
                        size="sm"
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/20 bg-transparent"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Resend Email
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 text-base font-semibold bg-transparent"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(85, 83, 233, 0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(114, 150, 230, 0.05),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="grid lg:grid-cols-2 p-0 min-h-[600px]">
            {/* Left Side - Forgot Password Form */}
         <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-cyan-500/10 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-cyan-950/30 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />

              <div className="relative z-10">
                {/* Main Feature */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                    Secure Reset
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your account security is our priority. We'll send you a
                    secure reset link.
                  </p>
                </div>

                {/* Security Features */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Secure Link
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        One-time use reset link
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Time Limited
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Expires in 60 minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-xl shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Account Protected
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Your data stays secure
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-white/20 dark:border-slate-700/50">
                  <div className="flex items-center justify-center gap-8 text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        256-bit
                      </div>
                      <div className="text-xs">Encryption</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        60min
                      </div>
                      <div className="text-xs">Link Expiry</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        24/7
                      </div>
                      <div className="text-xs">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Security Information */}
               <div className="flex flex-col justify-center p-8 lg:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Forgot Password?
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Reset your password securely
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 rounded-xl border border-red-200/50 dark:border-red-800/50">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 pl-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-base"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full h-14 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Reset Link...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Reset Link
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400">
                      Remember your password?
                    </span>
                  </div>
                </div>

                {/* Back to Sign In */}
                <Link href="/">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-14 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 text-base font-semibold bg-transparent"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}