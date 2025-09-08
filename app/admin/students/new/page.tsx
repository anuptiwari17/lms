"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus, Save, X, Copy, Eye, EyeOff, Mail, Phone, User as UserIcon } from "lucide-react"
import type { ApiResponse, User } from "@/types/database"

export default function ModernCreateStudentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // NEW: Add phone field
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ user: User; tempPassword?: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [generatePassword, setGeneratePassword] = useState(true)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(null)

    try {
      if (!formData.name.trim() || !formData.email.trim()) {
        setError("Name and email are required")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }

      // Phone validation (if provided)
      if (formData.phone.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '')
        if (!phoneRegex.test(cleanPhone)) {
          setError("Please enter a valid phone number")
          return
        }
      }

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null, // NEW: Include phone
        ...(generatePassword ? {} : { password: formData.password })
      }

      const response = await fetch("/api/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      })

      const result: ApiResponse<{ user: User; tempPassword?: string }> = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to create student")
      }

      setSuccess(result.data!)
    } catch (err) {
      console.error("Create student error:", err)
      setError(err instanceof Error ? err.message : "Failed to create student")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleCreateAnother = () => {
    const currentPassword = formData.password // Store current password state
    setFormData({ name: "", email: "", phone: "", password: currentPassword }) // Reset but keep password if it was manual
    setSuccess(null)
    setError("")
  }

  const isFormValid =
    formData.name.trim() && formData.email.trim() && (generatePassword || formData.password)

  if (success) {
    const studentEmail = success.user.email
    const studentPhone = success.user.phone
    const tempPassword = success.tempPassword

    // Email subject & body with phone info
    const subject = `Registration on Bilvens`
    const body = `Hello ${success.user.name},

You have been successfully registered on Bilvens.

Here are your login credentials:

Email: ${studentEmail}
Password: ${tempPassword}
${studentPhone ? `Phone: ${studentPhone}\n` : ''}
Please login and start exploring the courses.

Best regards,
Bilvens Team`

    const mailtoLink = `mailto:${studentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/admin" className="flex items-center space-x-3">
                <Image
                  src="/images/bilvens-logo+name.webp"
                  alt="Bilvens Logo"
                  width={160}
                  height={45}
                  className="object-contain"
                />
                <div className="text-xs text-gray-600 font-medium ml-2">
                  Admin Dashboard
                </div>
              </Link>

              <Link href="/admin">
                <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Link */}
          <Link
            href="/admin"
            className="inline-flex items-center text-gray-600 mb-6 text-sm font-medium hover:text-[#4A73D1] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Student Account Created</CardTitle>
              <CardDescription className="text-gray-600">
                Share these login credentials with the student.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Name</Label>
                  <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{success.user.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Email</Label>
                  <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{success.user.email}</p>
                </div>
              </div>

              {/* NEW: Display phone if available */}
              {success.user.phone && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Phone Number</Label>
                  <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">{success.user.phone}</p>
                </div>
              )}

              {success.tempPassword && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Temporary Password</Label>
                  <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-mono font-medium text-gray-900 flex-1">{success.tempPassword}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(success.tempPassword!)}
                      className="border-blue-300 text-[#4A73D1] hover:bg-blue-100"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <Button onClick={handleCreateAnother} className="bg-[#4A73D1] text-white">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Another Student
                </Button>
                <Button variant="outline" onClick={() => router.push("/admin")} className="border-gray-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                {success.tempPassword && (
                  <a href={mailtoLink}>
                    <Button className="bg-[#DB1B28] text-white">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="flex items-center space-x-3">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens Logo"
                width={160}
                height={45}
                className="object-contain"
              />
              <div className="text-xs text-gray-600 font-medium ml-2">
                Admin Dashboard
              </div>
            </Link>

            <Link href="/admin">
              <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-600 mb-6 text-sm font-medium hover:text-[#4A73D1] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <UserPlus className="h-6 w-6 text-[#4A73D1]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Student</h1>
              <p className="text-gray-600">Add a new student to your platform</p>
            </div>
          </div>
        </div>

        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-[#4A73D1]" />
              <CardTitle className="text-xl font-bold text-gray-900">Student Details</CardTitle>
            </div>
            <CardDescription className="text-gray-600 mt-2">
              Fill in the student information. They will receive login credentials after creation.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
                  Full Name <span className="text-[#DB1B28]">*</span>
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleInputChange("name", e.target.value)}
                    placeholder="Enter student's full name"
                    required
                    className="pl-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                  Email Address <span className="text-[#DB1B28]">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange("email", e.target.value)}
                    placeholder="Enter student's email address"
                    required
                    className="pl-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                  />
                </div>
              </div>

              {/* NEW: Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">
                  Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="pl-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  For important notifications and course updates
                </p>
              </div>

              {/* Custom Password Field */}
              {!generatePassword && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-900">Custom Password</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={e => handleInputChange("password", e.target.value)}
                      placeholder="Enter custom password"
                      className="h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowPassword(p => !p)}
                      className="h-12 w-12 border-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-[#DB1B28] text-sm p-4 rounded-lg font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
                    </div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!isFormValid || isLoading}
                  className="bg-[#4A73D1] text-white h-12 px-6 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Student
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGeneratePassword(p => !p)}
                  className="h-12 px-6 font-semibold border-gray-300 rounded-lg"
                >
                  {generatePassword ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Use Custom Password
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Generate Password
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-[#4A73D1] mb-2">After Creation</h3>
          <p className="text-sm text-gray-700">
            The student will receive their login credentials and can immediately access assigned courses. 
            You can send the credentials via email using the send button after creation.
          </p>
        </div>
      </main>
    </div>
  )
}