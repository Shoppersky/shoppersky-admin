"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Eye, Calendar, Clock } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance" // Adjust path as needed

interface Enquiry {
  enquiry_id: number
  firstname: string
  lastname: string
  email: string
  phone_number: string
  message: string
  enquiry_status: string
  created_at: string
  updated_at: string
}

export default function EndUserQueries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/users/CustomerContactPage?skip=0&limit=100")
        setEnquiries(response.data.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch enquiries")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEnquiries()
  }, [])

  const filteredEnquiries = enquiries.filter((enquiry) =>
    `${enquiry.firstname} ${enquiry.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusConfig = {
    pending: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    // Add other statuses if needed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto max-w-7xl p-4 lg:p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Customer Enquiries
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            {/* Enquiries List */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="p-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">Loading enquiries...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No enquiries found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    {searchTerm ? "Try adjusting your search" : "No enquiries available"}
                  </p>
                </div>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.enquiry_id}
                    className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {enquiry.firstname} {enquiry.lastname}
                          </h3>
                          <Badge className="text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-0">
                            ENQ-{enquiry.enquiry_id}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <Badge className={`${statusConfig.pending.color} border-0 text-xs`}>
                            {enquiry.enquiry_status.charAt(0).toUpperCase() + enquiry.enquiry_status.slice(1)}
                          </Badge>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{enquiry.email}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                          {enquiry.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {formatDate(enquiry.created_at)}
                          </div>
                          {enquiry.updated_at !== enquiry.created_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Updated: {formatDate(enquiry.updated_at)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}