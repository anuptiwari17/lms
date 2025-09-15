"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  UserPlus,
  Settings,
  Lock
} from "lucide-react"
import type { AuthUser } from "@/types/database"

export default function AdminProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  // Password change state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })

  // Add admin state
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false)
  const [addAdminForm, setAddAdminForm] = useState({ name: "", email: "", phone: "", password: "" })
  const [addAdminLoading, setAddAdminLoading] = useState(false)
  const [addAdminError, setAddAdminError] = useState("")
  const [addAdminSuccess, setAddAdminSuccess] = useState("")
  const [showAddAdminPassword, setShowAddAdminPassword] = useState(false)

  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/me', { credentials: 'include' })
      const result = await response.json()

      if (!result.success || result.data?.role !== 'admin') {
        router.push('/login')
        return
      }

      setUser(result.data)
      setEditForm({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || ""
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError("")
    setEditSuccess("")

    try {
      if (!editForm.name.trim() || !editForm.email.trim()) {
        throw new Error("Name and email are required")
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim() || null
        })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Failed to update profile')

      setEditSuccess('Profile updated successfully!')
      setIsEditing(false)
      await loadProfile()
      setTimeout(() => setEditSuccess(""), 3000)
    } catch (error) {
      setEditError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setEditLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError("")
    setPasswordSuccess("")

    try {
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
      if (!result.success) throw new Error(result.error || 'Failed to change password')

      setPasswordSuccess('Password changed successfully!')
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
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

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddAdminLoading(true)
    setAddAdminError("")
    setAddAdminSuccess("")

    try {
      if (!addAdminForm.name.trim() || !addAdminForm.email.trim() || !addAdminForm.password) {
        throw new Error("Name, email, and password are required")
      }
      if (addAdminForm.password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: addAdminForm.name.trim(),
          email: addAdminForm.email.trim(),
          phone: addAdminForm.phone.trim() || null,
          password: addAdminForm.password
        })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Failed to create admin')

      setAddAdminSuccess('New admin created successfully!')
      setAddAdminForm({ name: "", email: "", phone: "", password: "" })
      setTimeout(() => {
        setShowAddAdminDialog(false)
        setAddAdminSuccess("")
      }, 2000)
    } catch (error) {
      setAddAdminError(error instanceof Error ? error.message : 'Failed to create admin')
    } finally {
      setAddAdminLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm' | 'addAdmin') => {
    if (field === 'addAdmin') {
      setShowAddAdminPassword(!showAddAdminPassword)
    } else {
      setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4A73D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#DB1B28] text-sm mb-4">{error || "Profile not found"}</p>
          <Link href="/admin">
            <Button className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
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
              <div className="text-center sm:text-left">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Profile</h1>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </div>
            </div>
            {(editSuccess || addAdminSuccess) && (
              <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] text-sm px-3 py-2 rounded-lg w-full sm:w-auto text-center">
                {editSuccess || addAdminSuccess}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 w-full max-w-full sm:max-w-4xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Profile Information Card */}
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900">
                  <User className="h-5 w-5 text-[#4A73D1]" />
                  Profile Information
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Update your personal details and contact information
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="sm"
                className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-200 ${isEditing ? 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900' : 'bg-[#4A73D1] hover:bg-[#3B5BB8] text-white'}`}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900 truncate">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Account Created</p>
                      <p className="font-medium text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium text-gray-900 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {editError && (
                    <div className="bg-red-50 border border-red-200 text-[#DB1B28] p-3 rounded-lg flex items-center">
                      <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
                      </div>
                      <span className="ml-2 text-sm">{editError}</span>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-600">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-12 pl-4 pr-4 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-600">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full h-12 pl-4 pr-4 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-600">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="Optional"
                      className="w-full h-12 pl-4 pr-4 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2" 
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900">
                <Lock className="h-5 w-5 text-[#4A73D1]" />
                Security Settings
              </CardTitle>
              <p className="text-sm text-gray-600">
                Manage your password and account security
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Button
                onClick={() => setShowPasswordDialog(true)}
                variant="outline"
                className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Admin Management Card */}
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-gray-900">
                <Settings className="h-5 w-5 text-[#4A73D1]" />
                Admin Management
              </CardTitle>
              <p className="text-sm text-gray-600">
                Add new administrators to the system
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <Button
                onClick={() => setShowAddAdminDialog(true)}
                className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="w-full max-w-full sm:max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-gray-900">Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-[#DB1B28] p-3 rounded-lg flex items-center">
                <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
                </div>
                <span className="ml-2 text-sm">{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] p-3 rounded-lg text-sm text-center">
                {passwordSuccess}
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-600">Current Password</Label>
              <div className="relative flex">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                  className="w-full h-12 pl-4 pr-10 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-10 w-10 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">New Password</Label>
              <div className="relative flex">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="w-full h-12 pl-4 pr-10 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-10 w-10 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Confirm New Password</Label>
              <div className="relative flex">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full h-12 pl-4 pr-10 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-10 w-10 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2" 
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent className="w-full max-w-full sm:max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-gray-900">Add New Administrator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            {addAdminError && (
              <div className="bg-red-50 border border-red-200 text-[#DB1B28] p-3 rounded-lg flex items-center">
                <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
                </div>
                <span className="ml-2 text-sm">{addAdminError}</span>
              </div>
            )}
            {addAdminSuccess && (
              <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] p-3 rounded-lg text-sm text-center">
                {addAdminSuccess}
              </div>
            )}
            <div>
              <Label className="text-sm font-medium text-gray-600">Full Name</Label>
              <Input
                value={addAdminForm.name}
                onChange={(e) => setAddAdminForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Enter admin's full name"
                className="w-full h-12 pl-4 pr-4 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Email Address</Label>
              <Input
                type="email"
                value={addAdminForm.email}
                onChange={(e) => setAddAdminForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Enter admin's email"
                className="w-full h-12 pl-4 pr-4 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Phone Number</Label>
              <Input
                value={addAdminForm.phone}
                onChange={(e) => setAddAdminForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Optional"
                className="w-full h-12 pl-4 pr-4 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Password</Label>
              <div className="relative flex">
                <Input
                  type={showAddAdminPassword ? "text" : "password"}
                  value={addAdminForm.password}
                  onChange={(e) => setAddAdminForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter secure password"
                  className="w-full h-12 pl-4 pr-10 mt-1 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 h-10 w-10 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                  onClick={() => togglePasswordVisibility("addAdmin")}
                >
                  {showAddAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2" 
                disabled={addAdminLoading}
              >
                {addAdminLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}








































// // app/admin/profile/page.tsx - Admin Profile Management
// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   ArrowLeft,
//   User,
//   Mail,
//   Phone,
//   Calendar,
//   Edit,
//   Save,
//   X,
//   Eye,
//   EyeOff,
//   Shield,
//   UserPlus,
//   Settings,
//   Lock
// } from "lucide-react"
// import type { AuthUser } from "@/types/database"

// export default function AdminProfilePage() {
//   const [user, setUser] = useState<AuthUser | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")

//   // Edit profile state
//   const [isEditing, setIsEditing] = useState(false)
//   const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" })
//   const [editLoading, setEditLoading] = useState(false)
//   const [editError, setEditError] = useState("")
//   const [editSuccess, setEditSuccess] = useState("")

//   // Password change state
//   const [showPasswordDialog, setShowPasswordDialog] = useState(false)
//   const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
//   const [passwordLoading, setPasswordLoading] = useState(false)
//   const [passwordError, setPasswordError] = useState("")
//   const [passwordSuccess, setPasswordSuccess] = useState("")
//   const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })

//   // Add admin state
//   const [showAddAdminDialog, setShowAddAdminDialog] = useState(false)
//   const [addAdminForm, setAddAdminForm] = useState({ name: "", email: "", phone: "", password: "" })
//   const [addAdminLoading, setAddAdminLoading] = useState(false)
//   const [addAdminError, setAddAdminError] = useState("")
//   const [addAdminSuccess, setAddAdminSuccess] = useState("")
//   const [showAddAdminPassword, setShowAddAdminPassword] = useState(false)

//   const router = useRouter()

//   useEffect(() => {
//     loadProfile()
//   }, [])

//   const loadProfile = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch('/api/auth/me', { credentials: 'include' })
//       const result = await response.json()

//       if (!result.success || result.data?.role !== 'admin') {
//         router.push('/login')
//         return
//       }

//       setUser(result.data)
//       setEditForm({
//         name: result.data.name,
//         email: result.data.email,
//         phone: result.data.phone || ""
//       })
//     } catch (error) {
//       console.error('Error loading profile:', error)
//       setError('Failed to load profile')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setEditLoading(true)
//     setEditError("")
//     setEditSuccess("")

//     try {
//       if (!editForm.name.trim() || !editForm.email.trim()) {
//         throw new Error("Name and email are required")
//       }

//       const response = await fetch('/api/admin/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           name: editForm.name.trim(),
//           email: editForm.email.trim(),
//           phone: editForm.phone.trim() || null
//         })
//       })

//       const result = await response.json()
//       if (!result.success) throw new Error(result.error || 'Failed to update profile')

//       setEditSuccess('Profile updated successfully!')
//       setIsEditing(false)
//       await loadProfile()
//       setTimeout(() => setEditSuccess(""), 3000)
//     } catch (error) {
//       setEditError(error instanceof Error ? error.message : 'Failed to update profile')
//     } finally {
//       setEditLoading(false)
//     }
//   }

//   const handleChangePassword = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setPasswordLoading(true)
//     setPasswordError("")
//     setPasswordSuccess("")

//     try {
//       if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
//         throw new Error("All password fields are required")
//       }
//       if (passwordForm.newPassword.length < 6) {
//         throw new Error("New password must be at least 6 characters long")
//       }
//       if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//         throw new Error("New passwords do not match")
//       }

//       const response = await fetch('/api/auth/change-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           currentPassword: passwordForm.currentPassword,
//           newPassword: passwordForm.newPassword
//         })
//       })

//       const result = await response.json()
//       if (!result.success) throw new Error(result.error || 'Failed to change password')

//       setPasswordSuccess('Password changed successfully!')
//       setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
//       setTimeout(() => {
//         setShowPasswordDialog(false)
//         setPasswordSuccess("")
//       }, 2000)
//     } catch (error) {
//       setPasswordError(error instanceof Error ? error.message : 'Failed to change password')
//     } finally {
//       setPasswordLoading(false)
//     }
//   }

//   const handleAddAdmin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setAddAdminLoading(true)
//     setAddAdminError("")
//     setAddAdminSuccess("")

//     try {
//       if (!addAdminForm.name.trim() || !addAdminForm.email.trim() || !addAdminForm.password) {
//         throw new Error("Name, email, and password are required")
//       }
//       if (addAdminForm.password.length < 6) {
//         throw new Error("Password must be at least 6 characters long")
//       }

//       const response = await fetch('/api/admin/create-admin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({
//           name: addAdminForm.name.trim(),
//           email: addAdminForm.email.trim(),
//           phone: addAdminForm.phone.trim() || null,
//           password: addAdminForm.password
//         })
//       })

//       const result = await response.json()
//       if (!result.success) throw new Error(result.error || 'Failed to create admin')

//       setAddAdminSuccess('New admin created successfully!')
//       setAddAdminForm({ name: "", email: "", phone: "", password: "" })
//       setTimeout(() => {
//         setShowAddAdminDialog(false)
//         setAddAdminSuccess("")
//       }, 2000)
//     } catch (error) {
//       setAddAdminError(error instanceof Error ? error.message : 'Failed to create admin')
//     } finally {
//       setAddAdminLoading(false)
//     }
//   }

//   const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm' | 'addAdmin') => {
//     if (field === 'addAdmin') {
//       setShowAddAdminPassword(!showAddAdminPassword)
//     } else {
//       setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-8 h-8 border-4 border-[#4A73D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-[var(--text-secondary)]">Loading profile...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !user) {
//     return (
//       <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-[#DB1B28] mb-4">{error || "Profile not found"}</p>
//           <Link href="/admin">
//             <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">Back to Dashboard</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[var(--bg-primary)]">
//       {/* Header */}
//       <header className="bg-white border-b border-[var(--ui-card-border)] shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <Link href="/admin">
//               <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#4A73D1]">
//                 <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
//               </Button>
//             </Link>
//             <div className="h-6 w-px bg-gray-200"></div>
//             <div>
//               <h1 className="text-xl font-bold text-[var(--fg-primary)]">Admin Profile</h1>
//               <p className="text-sm text-[var(--text-secondary)]">Manage your account settings</p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             {(editSuccess || addAdminSuccess) && (
//               <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] text-sm px-3 py-2 rounded-lg">
//                 {editSuccess || addAdminSuccess}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-6 py-8">
//         <div className="space-y-8">
//           {/* Profile Information Card */}
//           <Card className="bg-white border-gray-200 shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle className="flex items-center space-x-2">
//                   <User className="h-5 w-5 text-[#4A73D1]" />
//                   <span>Profile Information</span>
//                 </CardTitle>
//                 <p className="text-sm text-[var(--text-secondary)] mt-1">
//                   Update your personal details and contact information
//                 </p>
//               </div>
//               <Button
//                 onClick={() => setIsEditing(!isEditing)}
//                 variant={isEditing ? "outline" : "default"}
//                 size="sm"
//                 className={isEditing ? "border-gray-200" : "bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white"}
//               >
//                 {isEditing ? <><X className="h-4 w-4 mr-2" /> Cancel</> : <><Edit className="h-4 w-4 mr-2" /> Edit</>}
//               </Button>
//             </CardHeader>
//             <CardContent className="pt-0">
//               {!isEditing ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <User className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-sm text-[var(--text-secondary)]">Full Name</p>
//                       <p className="font-medium text-[var(--fg-primary)]">{user.name}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Mail className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-sm text-[var(--text-secondary)]">Email Address</p>
//                       <p className="font-medium text-[var(--fg-primary)]">{user.email}</p>
//                     </div>
//                   </div>
//                   {user.phone && (
//                     <div className="flex items-center space-x-3">
//                       <Phone className="h-4 w-4 text-gray-500" />
//                       <div>
//                         <p className="text-sm text-[var(--text-secondary)]">Phone Number</p>
//                         <p className="font-medium text-[var(--fg-primary)]">{user.phone}</p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-3">
//                     <Calendar className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-sm text-[var(--text-secondary)]">Account Created</p>
//                       <p className="font-medium text-[var(--fg-primary)]">
//                         {new Date(user.created_at).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Shield className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-sm text-[var(--text-secondary)]">Role</p>
//                       <p className="font-medium text-[var(--fg-primary)] capitalize">{user.role}</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <form onSubmit={handleUpdateProfile} className="space-y-4">
//                   {editError && (
//                     <div className="bg-[#DB1B28]/10 border border-[#DB1B28]/20 text-[#DB1B28] p-3 rounded-lg">
//                       {editError}
//                     </div>
//                   )}
//                   <div>
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input
//                       id="name"
//                       value={editForm.name}
//                       onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="email">Email Address</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={editForm.email}
//                       onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="phone">Phone Number</Label>
//                     <Input
//                       id="phone"
//                       value={editForm.phone}
//                       onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
//                       placeholder="Optional"
//                       className="mt-1"
//                     />
//                   </div>
//                   <Button type="submit" className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white" disabled={editLoading}>
//                     {editLoading ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
//                   </Button>
//                 </form>
//               )}
//             </CardContent>
//           </Card>

//           {/* Security Settings Card */}
//           <Card className="bg-white border-gray-200 shadow-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Lock className="h-5 w-5 text-[#4A73D1]" />
//                 <span>Security Settings</span>
//               </CardTitle>
//               <p className="text-sm text-[var(--text-secondary)]">
//                 Manage your password and account security
//               </p>
//             </CardHeader>
//             <CardContent>
//               <Button
//                 onClick={() => setShowPasswordDialog(true)}
//                 variant="outline"
//                 className="border-gray-200 hover:bg-gray-50"
//               >
//                 <Lock className="h-4 w-4 mr-2" />
//                 Change Password
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Admin Management Card */}
//           <Card className="bg-white border-gray-200 shadow-sm">
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Settings className="h-5 w-5 text-[#4A73D1]" />
//                 <span>Admin Management</span>
//               </CardTitle>
//               <p className="text-sm text-[var(--text-secondary)]">
//                 Add new administrators to the system
//               </p>
//             </CardHeader>
//             <CardContent>
//               <Button
//                 onClick={() => setShowAddAdminDialog(true)}
//                 className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white"
//               >
//                 <UserPlus className="h-4 w-4 mr-2" />
//                 Add New Admin
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </main>

//       {/* Change Password Dialog */}
//       <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Change Password</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleChangePassword} className="space-y-4">
//             {passwordError && (
//               <div className="bg-[#DB1B28]/10 border border-[#DB1B28]/20 text-[#DB1B28] p-3 rounded-lg">
//                 {passwordError}
//               </div>
//             )}
//             {passwordSuccess && (
//               <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] p-3 rounded-lg">
//                 {passwordSuccess}
//               </div>
//             )}
//             <div>
//               <Label>Current Password</Label>
//               <div className="relative flex">
//                 <Input
//                   type={showPasswords.current ? "text" : "password"}
//                   value={passwordForm.currentPassword}
//                   onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
//                   className="pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => togglePasswordVisibility("current")}
//                 >
//                   {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <div>
//               <Label>New Password</Label>
//               <div className="relative flex">
//                 <Input
//                   type={showPasswords.new ? "text" : "password"}
//                   value={passwordForm.newPassword}
//                   onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
//                   className="pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => togglePasswordVisibility("new")}
//                 >
//                   {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <div>
//               <Label>Confirm New Password</Label>
//               <div className="relative flex">
//                 <Input
//                   type={showPasswords.confirm ? "text" : "password"}
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
//                   className="pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => togglePasswordVisibility("confirm")}
//                 >
//                   {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit" className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white" disabled={passwordLoading}>
//                 {passwordLoading ? "Changing..." : "Change Password"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Admin Dialog */}
//       <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add New Administrator</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleAddAdmin} className="space-y-4">
//             {addAdminError && (
//               <div className="bg-[#DB1B28]/10 border border-[#DB1B28]/20 text-[#DB1B28] p-3 rounded-lg">
//                 {addAdminError}
//               </div>
//             )}
//             {addAdminSuccess && (
//               <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] p-3 rounded-lg">
//                 {addAdminSuccess}
//               </div>
//             )}
//             <div>
//               <Label>Full Name</Label>
//               <Input
//                 value={addAdminForm.name}
//                 onChange={(e) => setAddAdminForm(f => ({ ...f, name: e.target.value }))}
//                 placeholder="Enter admin's full name"
//               />
//             </div>
//             <div>
//               <Label>Email Address</Label>
//               <Input
//                 type="email"
//                 value={addAdminForm.email}
//                 onChange={(e) => setAddAdminForm(f => ({ ...f, email: e.target.value }))}
//                 placeholder="Enter admin's email"
//               />
//             </div>
//             <div>
//               <Label>Phone Number</Label>
//               <Input
//                 value={addAdminForm.phone}
//                 onChange={(e) => setAddAdminForm(f => ({ ...f, phone: e.target.value }))}
//                 placeholder="Optional"
//               />
//             </div>
//             <div>
//               <Label>Password</Label>
//               <div className="relative flex">
//                 <Input
//                   type={showAddAdminPassword ? "text" : "password"}
//                   value={addAdminForm.password}
//                   onChange={(e) => setAddAdminForm(f => ({ ...f, password: e.target.value }))}
//                   placeholder="Enter secure password"
//                   className="pr-10"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => togglePasswordVisibility("addAdmin")}
//                 >
//                   {showAddAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit" className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white" disabled={addAdminLoading}>
//                 {addAdminLoading ? "Creating..." : "Create Admin"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }









