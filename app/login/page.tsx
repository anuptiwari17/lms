"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowLeft } from "lucide-react"
import type { ApiResponse, AuthUser } from "@/types/database"

export default function ModernLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!formData.email.trim() || !formData.password) {
        setError("Please enter both email and password")
        return
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
        credentials: 'include' // Important for cookies
      })

      const result: ApiResponse<AuthUser> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Login failed')
      }

      // Redirect based on user role
      if (result.data.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/student')
      }

    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.email.trim() && formData.password

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center px-6 py-12 relative">
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

      {/* Main Login Card */}
      <div className="w-full max-w-md mt-8">
        <Card className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-8 pt-10 px-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-600 text-base font-medium">
              Sign in to your account to continue learning
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <div className="space-y-6">
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isFormValid) {
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-900 font-semibold text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    className="pl-12 h-12 bg-gray-50 border-gray-200 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/20 text-gray-900 transition-all duration-200 rounded-xl font-medium"
                    required
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isFormValid) {
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full h-12 font-bold text-base bg-[#4A73D1] text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>

            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600 text-sm font-medium">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#4A73D1] font-bold transition-colors"
                >
                  Create one
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
      </div>
    </div>
  )
}