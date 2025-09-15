"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus, Save, X, Copy, Eye, EyeOff, Mail } from "lucide-react"
import type { ApiResponse, User } from "@/types/database"

export default function CreateStudentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
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
    setFormData({ name: "", email: "", password: "" })
    setSuccess(null)
    setError("")
  }

  const isFormValid =
    formData.name.trim() && formData.email.trim() && (generatePassword || formData.password)

  if (success) {
    const studentEmail = success.user.email
    const tempPassword = success.tempPassword

    const subject = `Registration on LearnHub`
    const body = `Hello ${success.user.name},

You have been successfully registered on LearnHub.

Here are your login credentials:

Email: ${studentEmail}
Password: ${tempPassword}

Please login and start exploring the courses.

Best regards,
LearnHub Team`

    const mailtoLink = `mailto:${studentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-10">
          <div className="mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg transition-all duration-200 px-4 py-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Student Created Successfully</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 w-full max-w-full sm:max-w-lg">
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader className="text-center p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900">Student Account Created</CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Share these login credentials with the student.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-4 sm:p-6">
              <div>
                <Label className="text-sm font-medium text-gray-600">Name</Label>
                <p className="text-sm sm:text-base font-medium text-gray-900">{success.user.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="text-sm sm:text-base font-medium text-gray-900">{success.user.email}</p>
              </div>
              {success.tempPassword && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Temporary Password</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-mono text-gray-900">{success.tempPassword}</p>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(success.tempPassword!)}
                      className="h-10 w-10 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4">
                <Button 
                  onClick={handleCreateAnother}
                  className="w-full sm:w-auto bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg transition-all duration-200 px-4 py-2"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Another
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/admin")}
                  className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                {success.tempPassword && (
                  <a href={mailtoLink}>
                    <Button 
                      variant="outline"
                      className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
                    >
                      <Mail className="h-4 w-4 mr-2" />
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg transition-all duration-200 px-4 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Create New Student</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 w-full max-w-full sm:max-w-3xl">
        <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Create Student Account</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              Fill in the details to create a new student.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-600">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  required
                  className="w-full h-12 pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-600">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  required
                  className="w-full h-12 pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                />
              </div>

              {!generatePassword && (
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-600">Password</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={e => handleInputChange("password", e.target.value)}
                      className="w-full h-12 pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowPassword(p => !p)}
                      className="h-10 w-10 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-[#DB1B28] p-3 rounded-lg flex items-center">
                  <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
                  </div>
                  <span className="ml-2 text-sm">{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={!isFormValid || isLoading}
                  className="w-full sm:w-auto bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg transition-all duration-200 px-4 py-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Student
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGeneratePassword(p => !p)}
                  className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
                >
                  {generatePassword ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Use Custom Password
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Generate Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
