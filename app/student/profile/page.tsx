"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import type { AuthUser } from "@/types/database"

export default function StudentProfile() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const router = useRouter()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/me', { credentials: 'include' })
      const result = await response.json()
      
      if (!result.success || result.data?.role !== 'student') {
        router.push('/login')
        return
      }
      
      setUser(result.data)
      
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError("")
    setPasswordSuccess("")

    try {
      // Validation
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        throw new Error("All password fields are required")
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long")
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("New passwords do not match")
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to change password')
      }

      setPasswordSuccess("Password changed successfully!")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      
      // Close dialog after a short delay
      setTimeout(() => {
        setShowPasswordDialog(false)
        setPasswordSuccess("")
      }, 2000)

    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4A73D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#DB1B28] mb-4">{error || 'Profile not found'}</p>
          <Link href="/student">
            <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-[#4A73D1] transition-colors"
                  aria-label="Back to Dashboard"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600">Manage your account details</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Information Card */}
          <Card className="bg-white border-gray-100 shadow-md rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  Personal Information
                </CardTitle>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Edit className="h-4 w-4" />
                  <span className="text-sm">Read-only</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    Full Name
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email Address
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    Phone Number
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                {/* Account Created */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Member Since
                  </Label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-gray-900 font-medium">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note about editing */}
              <div className="bg-blue-50 border-l-4 border-[#4A73D1] p-4 rounded-r-lg shadow-sm">
                <p className="text-[#4A73D1] text-sm">
                  <strong>Need to update your information?</strong> Contact our support team at <a href="mailto:support@bilvens.com" className="underline hover:text-[#3B5BB8]">support@bilvens.com</a> to modify your name, email, or phone number.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="bg-white border-gray-100 shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-[#4A73D1]" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-600">
                      Update your password to keep your account secure
                    </p>
                  </div>
                  <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="border-gray-200 hover:bg-gray-50 text-gray-900 rounded-lg"
                        aria-label="Change Password"
                      >
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <form onSubmit={handlePasswordChange}>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and choose a new one
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-6">
                          {passwordError && (
                            <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-3 rounded-lg flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              {passwordError}
                            </div>
                          )}
                          
                          {passwordSuccess && (
                            <div className="bg-green-50 border border-green-100 text-green-700 text-sm p-3 rounded-lg flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {passwordSuccess}
                            </div>
                          )}
                          
                          {/* Current Password */}
                          <div className="space-y-2">
                            <Label htmlFor="current-password" className="text-sm font-medium text-gray-600">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="current-password"
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                placeholder="Enter current password"
                                className="pr-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm"
                                required
                                disabled={passwordLoading}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4A73D1] transition-colors"
                                disabled={passwordLoading}
                              >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          
                          {/* New Password */}
                          <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-sm font-medium text-gray-600">
                              New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="new-password"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Enter new password"
                                className="pr-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm"
                                minLength={6}
                                required
                                disabled={passwordLoading}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4A73D1] transition-colors"
                                disabled={passwordLoading}
                              >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <p className="text-xs text-gray-500">
                              Minimum 6 characters
                            </p>
                          </div>
                          
                          {/* Confirm Password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-600">
                              Confirm New Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirm-password"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Confirm new password"
                                className="pr-10 h-12 bg-white border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm"
                                required
                                disabled={passwordLoading}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4A73D1] transition-colors"
                                disabled={passwordLoading}
                              >
                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="sm:justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowPasswordDialog(false)}
                            disabled={passwordLoading}
                            className="border-gray-200 hover:bg-gray-50 rounded-lg"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg"
                            disabled={passwordLoading}
                          >
                            {passwordLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Changing...
                              </>
                            ) : (
                              'Change Password'
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
