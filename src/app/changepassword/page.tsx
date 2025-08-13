"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Key, ArrowRight, RefreshCw, XCircle, Mail } from 'lucide-react'
import axiosInstance from "@/lib/axiosInstance"
import SuspenseSearchParamsWrapper from "@/components/SuspenseSearchParamsWrapper"
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Handle email from URL parameters
  const handleParamsFetch = (params: Record<string, string>) => {
    const emailFromParams = params["email"]
    if (emailFromParams) {
      setEmail(emailFromParams)
    }
  }

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5

    setPasswordStrength(Math.min(strength, 100))
  }, [password])

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500"
    if (passwordStrength < 50) return "bg-orange-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak"
    if (passwordStrength < 50) return "Fair"
    if (passwordStrength < 75) return "Good"
    return "Strong"
  }

  const validatePasswords = () => {
    if (!email) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (passwordStrength < 50) {
      setError("Please choose a stronger password")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!validatePasswords()) return

    setIsLoading(true)

    try {
      const response = await axiosInstance.post(`/admin/change-initial-password?email=${email}`, {
        new_password: password,
      })

      if (response.data.statusCode === 200) {
        setIsSuccess(true)
        // Show toast notification
        toast.success(
          "Password Changed successfully, please login.")
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "An error occurred while changing the password. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  // // Success state
  // if (isSuccess) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
  //       <div className="w-full max-w-md mx-auto">
  //         <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl rounded-3xl">
  //           <CardContent className="p-8 lg:p-12 text-center">
  //             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-2xl mb-6">
  //               <CheckCircle className="w-10 h-10 text-white" />
  //             </div>
  //             <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
  //               Password Changed Successfully
  //             </h1>
  //             <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
  //               Your password has been updated successfully. Your account is now more secure.
  //             </p>
  //             <Button
  //               onClick={() => router.back()}
  //               className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold"
  //             >
  //               <ArrowRight className="w-5 h-5 mr-2" />
  //               Continue
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspenseSearchParamsWrapper onParamsFetch={handleParamsFetch}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" />

          <div className="w-full max-w-6xl mx-auto relative z-10">
            <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="grid lg:grid-cols-2 p-0 min-h-[600px]">
                {/* Left Side - Change Password Form */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                        <Key className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-left">
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Change Password
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Update your account password</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                      Choose a strong password to keep your account secure.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 rounded-xl border border-red-200/50 dark:border-red-800/50">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Change Password Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">


                    {/* New Password Field */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="password"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="h-14 pl-12 pr-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Password strength:</span>
                            <span
                              className={`font-medium ${passwordStrength < 25
                                  ? "text-red-600"
                                  : passwordStrength < 50
                                    ? "text-orange-600"
                                    : passwordStrength < 75
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                }`}
                            >
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="h-14 pl-12 pr-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Password Match Indicator */}
                      {confirmPassword && (
                        <div className="flex items-center gap-2 text-sm">
                          {password === confirmPassword ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-red-600">Passwords do not match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Password Requirements */}
                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">
                        Password Requirements:
                      </h4>
                      <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                        <li
                          className={`flex items-center gap-2 ${password.length >= 8 && password.length <= 12 ? "text-green-600" : ""
                            }`}
                        >
                          {password.length >= 8 && password.length <= 12 ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-current" />
                          )}
                          Between 8–12 characters
                        </li>

                        <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                          {/[A-Z]/.test(password) ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-current" />
                          )}
                          One uppercase letter
                        </li>
                        <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                          {/[a-z]/.test(password) ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-current" />
                          )}
                          One lowercase letter
                        </li>
                        <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                          {/[0-9]/.test(password) ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-current" />
                          )}
                          One number
                        </li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex-1 h-14 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-base font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          isLoading ||
                          !email ||
                          !password ||
                          !confirmPassword ||
                          password !== confirmPassword ||
                          passwordStrength < 50
                        }
                        className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Key className="w-5 h-5" />
                            Change Password
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Right Side - Security Information */}
                <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />

                  <div className="relative z-10">
                    {/* Main Feature */}
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl shadow-2xl mb-6">
                        <Shield className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Keep Your Account Secure</h2>
                      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Regular password updates help protect your account from unauthorized access.
                      </p>
                    </div>

                    {/* Security Tips */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Strong Password</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Mix of letters, numbers & symbols</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Unique Password</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Don't reuse from other accounts</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                          <Key className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Regular Updates</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Change password periodically</p>
                        </div>
                      </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 pt-8 border-t border-white/20 dark:border-slate-700/50">
                      <div className="flex items-center justify-center gap-8 text-slate-500 dark:text-slate-400">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">256-bit</div>
                          <div className="text-xs">Encryption</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">Secure</div>
                          <div className="text-xs">Storage</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">24/7</div>
                          <div className="text-xs">Protection</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SuspenseSearchParamsWrapper>
    </Suspense>
  )
}