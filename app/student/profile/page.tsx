// app/student/profile/page.tsx - Student Profile Page
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
  EyeOff
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
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <Link href="/student">
            <Button className="btn-primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--ui-card-border)] shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student">
                <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-[var(--ui-card-border)]"></div>
              <div>
                <h1 className="text-xl font-bold text-[var(--fg-primary)]">My Profile</h1>
                <p className="text-sm text-[var(--text-secondary)]">View and manage your account</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Profile Information Card */}
          <Card className="bg-white border-[var(--ui-card-border)] shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[var(--fg-primary)]">Personal Information</CardTitle>
                <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                  <Edit className="h-4 w-4" />
                  <span className="text-sm">Read-only</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[var(--fg-primary)] flex items-center">
                    <User className="h-4 w-4 mr-2 text-[var(--text-secondary)]" />
                    Full Name
                  </Label>
                  <div className="p-3 bg-[var(--ui-input-bg)] border border-[var(--ui-card-border)] rounded-lg">
                    <p className="text-[var(--fg-primary)] font-medium">{user.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[var(--fg-primary)] flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-[var(--text-secondary)]" />
                    Email Address
                  </Label>
                  <div className="p-3 bg-[var(--ui-input-bg)] border border-[var(--ui-card-border)] rounded-lg">
                    <p className="text-[var(--fg-primary)] font-medium">{user.email}</p>
                  </div>
                </div>

                {/* Phone (if available) */}
                {user.phone && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[var(--fg-primary)] flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-[var(--text-secondary)]" />
                      Phone Number
                    </Label>
                    <div className="p-3 bg-[var(--ui-input-bg)] border border-[var(--ui-card-border)] rounded-lg">
                      <p className="text-[var(--fg-primary)] font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                {/* Account Created */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-[var(--fg-primary)] flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-[var(--text-secondary)]" />
                    Member Since
                  </Label>
                  <div className="p-3 bg-[var(--ui-input-bg)] border border-[var(--ui-card-border)] rounded-lg">
                    <p className="text-[var(--fg-primary)] font-medium">
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
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-700 text-sm">
                  <strong>Need to update your information?</strong> Contact your administrator to make changes to your name, email, or phone number.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="bg-white border-[var(--ui-card-border)] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[var(--fg-primary)] flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-[var(--ui-card-border)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--fg-primary)]">Password</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Change your account password for better security
                    </p>
                  </div>
                  <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-[var(--ui-card-border)]">
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <form onSubmit={handlePasswordChange}>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Enter your current password and choose a new one
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          {passwordError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                              {passwordError}
                            </div>
                          )}
                          
                          {passwordSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
                              {passwordSuccess}
                            </div>
                          )}
                          
                          {/* Current Password */}
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                              <Input
                                id="current-password"
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                placeholder="Enter current password"
                                className="pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--fg-primary)]"
                              >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          
                          {/* New Password */}
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                              <Input
                                id="new-password"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                placeholder="Enter new password"
                                className="pr-10"
                                minLength={6}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--fg-primary)]"
                              >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)]">
                              Must be at least 6 characters long
                            </p>
                          </div>
                          
                          {/* Confirm Password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <div className="relative">
                              <Input
                                id="confirm-password"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="Confirm new password"
                                className="pr-10"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--fg-primary)]"
                              >
                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowPasswordDialog(false)}
                            disabled={passwordLoading}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="btn-primary"
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