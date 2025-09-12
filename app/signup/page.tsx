"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Phone, AlertTriangle } from "lucide-react"
import type { ApiResponse, AuthUser } from "@/types/database"

export default function ModernSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your full name")
      return false
    }
    
    if (!formData.email.trim()) {
      setError("Please enter your email address")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    // Mandatory phone validation
    if (!formData.phone.trim()) {
      setError("Please enter your phone number")
      return false
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      setError("Please enter a valid phone number")
      return false
    }

    if (!formData.password) {
      setError("Please enter a password")
      return false
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password
        }),
        credentials: 'include'
      })

      const result: ApiResponse<AuthUser> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Signup failed')
      }

      // Redirect based on user role
      if (result.data.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/student')
      }

    } catch (error) {
      console.error('Signup error:', error)
      setError(error instanceof Error ? error.message : 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.name.trim() && 
                      formData.email.trim() && 
                      formData.phone.trim() && 
                      formData.password && 
                      formData.confirmPassword

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-6 lg:px-8 py-4 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm z-50">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/bilvens-logo+name.webp"
              alt="Bilvens Logo"
              width={140}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>
      </nav>

      {/* Main Signup Card */}
      <div className="w-full max-w-md mt-20">
        <Card className="bg-white border-gray-100 shadow-md rounded-xl overflow-hidden">
          <CardHeader className="text-center pb-6 pt-8 px-6 sm:px-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm sm:text-base">
              Join Bilvens to start your learning journey
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-600">
                  Full Name <span className="text-[#DB1B28]">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-600">
                  Email Address <span className="text-[#DB1B28]">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-600">
                  Phone Number <span className="text-[#DB1B28]">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="pl-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Required for important course notifications
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-600">
                  Password <span className="text-[#DB1B28]">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a password"
                    className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4A73D1] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-600">
                  Confirm Password <span className="text-[#DB1B28]">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4A73D1] transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#4A73D1] text-white font-semibold rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-[#4A73D1] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>

              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-600 text-sm hover:text-[#4A73D1] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to homepage
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Notice */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-600">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-[#4A73D1] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#4A73D1] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}