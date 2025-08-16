"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/lib/Zustand";
import { toast } from "sonner";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const { login } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };

  // Validate email whenever it changes
  useEffect(() => {
    validateEmail(email);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!emailValid) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/admin-login/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { access_token, user } = response.data;

        const decoded: { rid: string } = jwtDecode(access_token);
        console.log(decoded.rid)

       if (decoded.rid !== "c6vnr5" && decoded.rid !== "ol5u67") {
  toast.error("Unauthorized role. Only admins can log in here.");
  return;
}

        if (!access_token) {
          throw new Error("Invalid response: Missing access token");
        }

        login(access_token, user || null);

        toast.success("Login successful");
        router.push("/home");
      }
    } catch (error: any) {
      console.log(error.response);
      if (error.response?.status === 423) {
        toast.success("Your account has been locked. Please contact support.");
      }
      if (error.response?.status === 428) {
       
        router.push(`/changepassword?email=${encodeURIComponent(email)}`);
      }
      if (error.response?.status === 403) {
        toast.success(
          "Your account has been deactivated. Please contact support."
        );
      } else {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Something went wrong. Please try again.";

        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none" /> */}

      <div
        className={cn("w-full max-w-6xl mx-auto relative z-10", className)}
        {...props}
      >
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="grid lg:grid-cols-2 p-0 min-h-[600px]">
            {/* Left Side - Feature Showcase */}
            <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />

              <div className="relative z-10">
                {/* Main Feature */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl shadow-2xl mb-6">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                    Secure & Powerful
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Access your comprehensive business management platform with
                    enterprise-grade security.
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Vendor Management
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Manage all your business partners
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Category Studio
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Design & organize categories
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Industry Analytics
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Real-time business insights
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 pt-8 border-t border-white/20 dark:border-slate-700/50">
                  <div className="flex items-center justify-center gap-8 text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        99.9%
                      </div>
                      <div className="text-xs">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        256-bit
                      </div>
                      <div className="text-xs">Encryption</div>
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

            {/* Right Side - Login Form */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Welcome Back
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Sign in to your account
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 pl-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Password
                    </Label>
                    <Link
                      href="/forgotpassword"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !email || !password || !emailValid}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>

                {/* Divider */}
                {/* <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400">
                      New to our platform?
                    </span>
                  </div>
                </div> */}

                {/* Sign Up Link */}
                {/* <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 text-base font-semibold bg-transparent"
                >
                  Create an Account
                </Button> */}
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 px-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            By signing in, you agree to our{" "}
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
