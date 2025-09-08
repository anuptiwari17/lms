"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Phone } from "lucide-react"
import type { ApiResponse, AuthUser } from "@/types/database"

export default function ModernSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // NEW: Add phone field
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return false
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        setError("Please enter a valid phone number")
        return false
      }
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
          phone: formData.phone.trim() || null, // NEW: Send phone or null
          password: formData.password
        }),
        credentials: 'include'
      })

      const result: ApiResponse<AuthUser> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Signup failed')
      }

      // Redirect based on user role (new signups are typically students)
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
                      formData.password && 
                      formData.confirmPassword

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full px-6 py-6 z-10">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/bilvens-logo+name.webp"
              alt="Bilvens Logo"
              width={160}
              height={45}
              className="object-contain"
            />
          </Link>
        </div>
      </nav>

      {/* Main Signup Card */}
      <div className="w-full max-w-md mt-8">
        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-8 pt-10 px-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 text-base font-medium">
              Join Bilvens and start your learning journey
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-900 font-semibold text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/20 text-gray-900 transition-all duration-200 rounded-xl font-medium"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-900 font-semibold text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/20 text-gray-900 transition-all duration-200 rounded-xl font-medium"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-gray-900 font-semibold text-sm">
                  Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/20 text-gray-900 transition-all duration-200 rounded-xl font-medium"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Used for important course notifications
                </p>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-900 font-semibold text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a password"
                    className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/20 text-gray-900 transition-all duration-200 rounded-xl font-medium"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-gray-900 font-semibold text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/20 text-gray-900 transition-all duration-200 rounded-xl font-medium"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-12 font-bold text-base bg-[#4A73D1] text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>

            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600 text-sm font-medium">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#4A73D1] font-bold transition-colors"
                >
                  Sign in
                </Link>
              </p>

              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-500 hover:text-[#4A73D1] transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to homepage
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Notice */}
        <div className="mt-6 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-600 text-center">
            By creating an account, you agree to our{" "}
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