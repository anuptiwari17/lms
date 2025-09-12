// app/admin/profile/page.tsx - Admin Profile Management
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
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4A73D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#DB1B28] mb-4">{error || "Profile not found"}</p>
          <Link href="/admin">
            <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--ui-card-border)] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#4A73D1]">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <h1 className="text-xl font-bold text-[var(--fg-primary)]">Admin Profile</h1>
              <p className="text-sm text-[var(--text-secondary)]">Manage your account settings</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {(editSuccess || addAdminSuccess) && (
              <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] text-sm px-3 py-2 rounded-lg">
                {editSuccess || addAdminSuccess}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Profile Information Card */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#4A73D1]" />
                  <span>Profile Information</span>
                </CardTitle>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Update your personal details and contact information
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="sm"
                className={isEditing ? "border-gray-200" : "bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white"}
              >
                {isEditing ? <><X className="h-4 w-4 mr-2" /> Cancel</> : <><Edit className="h-4 w-4 mr-2" /> Edit</>}
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Full Name</p>
                      <p className="font-medium text-[var(--fg-primary)]">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Email Address</p>
                      <p className="font-medium text-[var(--fg-primary)]">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Phone Number</p>
                        <p className="font-medium text-[var(--fg-primary)]">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Account Created</p>
                      <p className="font-medium text-[var(--fg-primary)]">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Role</p>
                      <p className="font-medium text-[var(--fg-primary)] capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {editError && (
                    <div className="bg-[#DB1B28]/10 border border-[#DB1B28]/20 text-[#DB1B28] p-3 rounded-lg">
                      {editError}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="Optional"
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white" disabled={editLoading}>
                    {editLoading ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Security Settings Card */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-[#4A73D1]" />
                <span>Security Settings</span>
              </CardTitle>
              <p className="text-sm text-[var(--text-secondary)]">
                Manage your password and account security
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowPasswordDialog(true)}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Admin Management Card */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-[#4A73D1]" />
                <span>Admin Management</span>
              </CardTitle>
              <p className="text-sm text-[var(--text-secondary)]">
                Add new administrators to the system
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowAddAdminDialog(true)}
                className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="bg-[#DB1B28]/10 border border-[#DB1B28]/20 text-[#DB1B28] p-3 rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] p-3 rounded-lg">
                {passwordSuccess}
              </div>
            )}
            <div>
              <Label>Current Password</Label>
              <div className="relative flex">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <div className="relative flex">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <div className="relative flex">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white" disabled={passwordLoading}>
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Administrator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            {addAdminError && (
              <div className="bg-[#DB1B28]/10 border border-[#DB1B28]/20 text-[#DB1B28] p-3 rounded-lg">
                {addAdminError}
              </div>
            )}
            {addAdminSuccess && (
              <div className="bg-[#4A73D1]/10 border border-[#4A73D1]/20 text-[#4A73D1] p-3 rounded-lg">
                {addAdminSuccess}
              </div>
            )}
            <div>
              <Label>Full Name</Label>
              <Input
                value={addAdminForm.name}
                onChange={(e) => setAddAdminForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Enter admin's full name"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={addAdminForm.email}
                onChange={(e) => setAddAdminForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Enter admin's email"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={addAdminForm.phone}
                onChange={(e) => setAddAdminForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative flex">
                <Input
                  type={showAddAdminPassword ? "text" : "password"}
                  value={addAdminForm.password}
                  onChange={(e) => setAddAdminForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter secure password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePasswordVisibility("addAdmin")}
                >
                  {showAddAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white" disabled={addAdminLoading}>
                {addAdminLoading ? "Creating..." : "Create Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


































































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
//   Lock,
//   Sparkles,
//   AlertTriangle
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
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center space-y-6">
//           <div className="relative w-20 h-20 mx-auto">
//             <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin"></div>
//             <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-[#4A73D1] border-r-[#DB1B28] rounded-full animate-spin"></div>
//             <div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
//               <Sparkles className="h-8 w-8 text-[#4A73D1]" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <h3 className="text-xl font-semibold text-gray-900">Loading Profile</h3>
//             <div className="flex items-center justify-center space-x-2">
//               <span className="text-gray-600">Preparing your content</span>
//               <div className="flex space-x-1">
//                 <div className="w-1.5 h-1.5 bg-[#4A73D1] rounded-full animate-pulse"></div>
//                 <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
//                 <div className="w-1.5 h-1.5 bg-[#4A73D1] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center space-y-6">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-md">
//             <div className="w-10 h-10 border-4 border-[#DB1B28] rounded-full flex items-center justify-center animate-pulse">
//               <AlertTriangle className="h-6 w-6 text-[#DB1B28]" />
//             </div>
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-3">Profile Not Found</h3>
//             <p className="text-[#DB1B28] mb-6 text-lg">{error || "Profile not found"}</p>
//             <Link href="/admin">
//               <Button className="bg-[#4A73D1] text-white px-6 py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200">
//                 Back to Dashboard
//                 <ArrowLeft className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {/* Header */}
//       <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <Link href="/admin">
//               <Button 
//                 variant="ghost" 
//                 className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 transition-all duration-200 rounded-lg"
//               >
//                 <ArrowLeft className="h-5 w-5 mr-2" /> 
//                 Back to Dashboard
//               </Button>
//             </Link>
//             <div className="h-6 w-px bg-gray-200"></div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
//               <p className="text-sm text-gray-600">Manage your account settings</p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             {(editSuccess || addAdminSuccess) && (
//               <div className="bg-green-50 border border-green-100 text-green-700 text-sm px-3 py-2 rounded-lg shadow-sm">
//                 {editSuccess || addAdminSuccess}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         <div className="space-y-6">
//           {/* Profile Information Card */}
//           <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//             <CardHeader className="border-b border-gray-100">
//               <div className="flex flex-row items-center justify-between">
//                 <div>
//                   <CardTitle className="flex items-center space-x-2 text-lg">
//                     <User className="h-5 w-5 text-[#4A73D1]" />
//                     <span>Profile Information</span>
//                   </CardTitle>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Update your personal details and contact information
//                   </p>
//                 </div>
//                 <Button
//                   onClick={() => setIsEditing(!isEditing)}
//                   variant={isEditing ? "outline" : "default"}
//                   className={isEditing ? 
//                     "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200" : 
//                     "bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 rounded-lg transition-all duration-200"}
//                 >
//                   {isEditing ? <><X className="h-4 w-4 mr-2" /> Cancel</> : <><Edit className="h-4 w-4 mr-2" /> Edit</>}
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="p-6">
//               {!isEditing ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-3">
//                     <User className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Full Name</p>
//                       <p className="text-base font-semibold text-gray-900">{user.name}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Mail className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Email Address</p>
//                       <p className="text-base font-semibold text-gray-900">{user.email}</p>
//                     </div>
//                   </div>
//                   {user.phone && (
//                     <div className="flex items-center space-x-3">
//                       <Phone className="h-4 w-4 text-gray-500" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-600">Phone Number</p>
//                         <p className="text-base font-semibold text-gray-900">{user.phone}</p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-3">
//                     <Calendar className="h-4 w-4 text-gray-500" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Account Created</p>
//                       <p className="text-base font-semibold text-gray-900">
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
//                       <p className="text-sm font-medium text-gray-600">Role</p>
//                       <p className="text-base font-semibold text-gray-900 capitalize">{user.role}</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <form onSubmit={handleUpdateProfile} className="space-y-6">
//                   {editError && (
//                     <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-4 rounded-lg shadow-sm">
//                       <div className="flex items-center space-x-2">
//                         <AlertTriangle className="h-4 w-4 flex-shrink-0" />
//                         <span>{editError}</span>
//                       </div>
//                     </div>
//                   )}
//                   <div className="space-y-2">
//                     <Label htmlFor="name" className="text-sm font-medium text-gray-600">
//                       Full Name <span className="text-[#DB1B28]">*</span>
//                     </Label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <Input
//                         id="name"
//                         value={editForm.name}
//                         onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
//                         className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                         placeholder="Enter full name"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email" className="text-sm font-medium text-gray-600">
//                       Email Address <span className="text-[#DB1B28]">*</span>
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <Input
//                         id="email"
//                         type="email"
//                         value={editForm.email}
//                         onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
//                         className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                         placeholder="Enter email address"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="phone" className="text-sm font-medium text-gray-600">
//                       Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
//                     </Label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                       <Input
//                         id="phone"
//                         value={editForm.phone}
//                         onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
//                         className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                         placeholder="Enter phone number"
//                       />
//                     </div>
//                   </div>
//                   <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
//                     <Button 
//                       onClick={() => setIsEditing(false)}
//                       variant="outline"
//                       className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
//                     >
//                       <X className="h-4 w-4 mr-2" />
//                       Cancel
//                     </Button>
//                     <Button 
//                       type="submit"
//                       className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 rounded-lg transition-all duration-200"
//                       disabled={editLoading}
//                     >
//                       {editLoading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 mr-2" />
//                           Save Changes
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               )}
//             </CardContent>
//           </Card>

//           {/* Security Settings Card */}
//           <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2 text-lg">
//                 <Lock className="h-5 w-5 text-[#4A73D1]" />
//                 <span>Security Settings</span>
//               </CardTitle>
//               <p className="text-sm text-gray-600">
//                 Manage your password and account security
//               </p>
//             </CardHeader>
//             <CardContent>
//               <Button
//                 onClick={() => setShowPasswordDialog(true)}
//                 variant="outline"
//                 className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-[#4A73D1] rounded-lg transition-all duration-200"
//               >
//                 <Lock className="h-4 w-4 mr-2" />
//                 Change Password
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Admin Management Card */}
//           <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2 text-lg">
//                 <Settings className="h-5 w-5 text-[#4A73D1]" />
//                 <span>Admin Management</span>
//               </CardTitle>
//               <p className="text-sm text-gray-600">
//                 Add new administrators to the system
//               </p>
//             </CardHeader>
//             <CardContent>
//               <Button
//                 onClick={() => setShowAddAdminDialog(true)}
//                 className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 rounded-lg transition-all duration-200"
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
//         <DialogContent className="bg-white border-gray-100 shadow-md rounded-xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-bold text-gray-900 flex items-center">
//               <Lock className="h-5 w-5 mr-2 text-[#4A73D1]" />
//               Change Password
//             </DialogTitle>
//             <p className="text-sm text-gray-600">
//               Update your password to keep your account secure
//             </p>
//           </DialogHeader>
//           <form onSubmit={handleChangePassword} className="space-y-6">
//             {passwordError && (
//               <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-4 rounded-lg shadow-sm">
//                 <div className="flex items-center space-x-2">
//                   <AlertTriangle className="h-4 w-4 flex-shrink-0" />
//                   <span>{passwordError}</span>
//                 </div>
//               </div>
//             )}
//             {passwordSuccess && (
//               <div className="bg-green-50 border border-green-100 text-green-700 text-sm p-4 rounded-lg shadow-sm">
//                 {passwordSuccess}
//               </div>
//             )}
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-gray-600">Current Password <span className="text-[#DB1B28]">*</span></Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.current ? "text" : "password"}
//                   value={passwordForm.currentPassword}
//                   onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
//                   className="pr-12 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                   placeholder="Enter current password"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-[#4A73D1]"
//                   onClick={() => togglePasswordVisibility("current")}
//                 >
//                   {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-gray-600">New Password <span className="text-[#DB1B28]">*</span></Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.new ? "text" : "password"}
//                   value={passwordForm.newPassword}
//                   onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
//                   className="pr-12 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                   placeholder="Enter new password"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-[#4A73D1]"
//                   onClick={() => togglePasswordVisibility("new")}
//                 >
//                   {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-gray-600">Confirm New Password <span className="text-[#DB1B28]">*</span></Label>
//               <div className="relative">
//                 <Input
//                   type={showPasswords.confirm ? "text" : "password"}
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
//                   className="pr-12 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                   placeholder="Confirm new password"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-[#4A73D1]"
//                   onClick={() => togglePasswordVisibility("confirm")}
//                 >
//                   {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <DialogFooter className="gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowPasswordDialog(false)}
//                 className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit"
//                 className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 rounded-lg transition-all duration-200"
//                 disabled={passwordLoading}
//               >
//                 {passwordLoading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Changing...
//                   </>
//                 ) : (
//                   "Change Password"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Add Admin Dialog */}
//       <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
//         <DialogContent className="bg-white border-gray-100 shadow-md rounded-xl sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-bold text-gray-900 flex items-center">
//               <UserPlus className="h-5 w-5 mr-2 text-[#4A73D1]" />
//               Add New Administrator
//             </DialogTitle>
//             <p className="text-sm text-gray-600">
//               Create a new admin account for the system
//             </p>
//           </DialogHeader>
//           <form onSubmit={handleAddAdmin} className="space-y-6">
//             {addAdminError && (
//               <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-4 rounded-lg shadow-sm">
//                 <div className="flex items-center space-x-2">
//                   <AlertTriangle className="h-4 w-4 flex-shrink-0" />
//                   <span>{addAdminError}</span>
//                 </div>
//               </div>
//             )}
//             {addAdminSuccess && (
//               <div className="bg-green-50 border border-green-100 text-green-700 text-sm p-4 rounded-lg shadow-sm">
//                 {addAdminSuccess}
//               </div>
//             )}
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-gray-600">Full Name <span className="text-[#DB1B28]">*</span></Label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <Input
//                   value={addAdminForm.name}
//                   onChange={(e) => setAddAdminForm(f => ({ ...f, name: e.target.value }))}
//                   className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                   placeholder="Enter admin's full name"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-gray-600">Email Address <span className="text-[#DB1B28]">*</span></Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <Input
//                   type="email"
//                   value={addAdminForm.email}
//                   onChange={(e) => setAddAdminForm(f => ({ ...f, email: e.target.value }))}
//                   className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                   placeholder="Enter admin's email"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-gray-600">Phone Number <span className="text-gray-500 font-normal">(Optional)</span></Label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <Input
//                   value={addAdminForm.phone}
//                   onChange={(e) => setAddAdminForm(f => ({ ...f, phone: e.target.value }))}
//                   className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                   placeholder="Enter phone number"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label className="text-sm font-medium text-gray-600">Password <span className="text-[#DB1B28]">*</span></Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <Input
//                   type={showAddAdminPassword ? "text" : "password"}
//                   value={addAdminForm.password}
//                   onChange={(e) => setAddAdminForm(f => ({ ...f, password: e.target.value }))}
//                   className="pl-10 pr-12 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
//                   placeholder="Enter secure password"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-[#4A73D1]"
//                   onClick={() => togglePasswordVisibility("addAdmin")}
//                 >
//                   {showAddAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <DialogFooter className="gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowAddAdminDialog(false)}
//                 className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit"
//                 className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 rounded-lg transition-all duration-200"
//                 disabled={addAdminLoading}
//               >
//                 {addAdminLoading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Creating...
//                   </>
//                 ) : (
//                   "Create Admin"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }