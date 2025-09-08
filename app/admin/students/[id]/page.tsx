"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  User,
  BookOpen,
  TrendingUp,
  Award
} from "lucide-react"
import type { User as UserType, Enrollment, Course } from "@/types/database"

interface StudentDetail extends UserType {
  enrolled_courses: number
  completed_courses: number
  avg_progress: number
  last_activity: string | null
  total_modules: number
  completed_modules: number
}

interface StudentCourse extends Course {
  enrollment: Enrollment
  modules_count: number
  completed_modules: number
}

export default function ModernStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [studentId, setStudentId] = useState<string>("")

  // Edit state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")

  // Password reset state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false })

  const router = useRouter()

  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params
      setStudentId(resolvedParams.id)
    }
    extractParams()
  }, [params])

  useEffect(() => {
    if (studentId) loadStudentData()
  }, [studentId])

  const loadStudentData = async () => {
    try {
      setLoading(true)

      const [studentRes, coursesRes] = await Promise.all([
        fetch(`/api/admin/students/${studentId}`, { credentials: "include" }),
        fetch(`/api/admin/students/${studentId}/courses`, { credentials: "include" })
      ])

      const studentData = await studentRes.json()
      const coursesData = await coursesRes.json()

      if (!studentData.success) throw new Error(studentData.error || "Student not found")

      setStudent(studentData.data)
      setEditForm({
        name: studentData.data.name,
        email: studentData.data.email,
        phone: studentData.data.phone || ""
      })

      if (coursesData.success) setStudentCourses(coursesData.data || [])
    } catch (error) {
      console.error("Error loading student:", error)
      setError(error instanceof Error ? error.message : "Failed to load student")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError("")
    setEditSuccess("")

    try {
      if (!editForm.name.trim() || !editForm.email.trim()) throw new Error("Name and email are required")

      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim() || null
        })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to update student")

      setEditSuccess("Student updated successfully!")
      setIsEditing(false)
      await loadStudentData()
      setTimeout(() => setEditSuccess(""), 3000)
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Failed to update student")
    } finally {
      setEditLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError("")
    setPasswordSuccess("")

    try {
      if (!passwordForm.newPassword || !passwordForm.confirmPassword)
        throw new Error("Both password fields are required")
      if (passwordForm.newPassword.length < 6) throw new Error("Password must be at least 6 characters long")
      if (passwordForm.newPassword !== passwordForm.confirmPassword)
        throw new Error("Passwords do not match")

      const response = await fetch(`/api/admin/students/${studentId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: passwordForm.newPassword })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Failed to reset password")

      setPasswordSuccess("Password reset successfully!")
      setPasswordForm({ newPassword: "", confirmPassword: "" })
      setTimeout(() => {
        setShowPasswordDialog(false)
        setPasswordSuccess("")
      }, 2000)
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to reset password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  if (!studentId || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4A73D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? "Loading student details..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-[#DB1B28]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Not Found</h3>
          <p className="text-[#DB1B28] mb-6">{error || "Student not found"}</p>
          <Link href="/admin/students">
            <Button className="bg-[#4A73D1] text-white">Back to Students</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressBgColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-100 border-green-200'
    if (progress >= 50) return 'bg-yellow-100 border-yellow-200'
    return 'bg-red-100 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/admin/students" className="flex items-center space-x-3">
                <Image
                  src="/images/bilvens-logo+name.webp"
                  alt="Bilvens Logo"
                  width={140}
                  height={40}
                  className="object-contain"
                />
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-sm text-gray-600">Student Details & Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href="/admin/students">
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Students
                </Button>
              </Link>
              {editSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg">
                  {editSuccess}
                </div>
              )}
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? "border-gray-300" : "bg-[#4A73D1] text-white"}
              >
                {isEditing ? <><X className="h-4 w-4 mr-2" /> Cancel</> : <><Edit className="h-4 w-4 mr-2" /> Edit</>}
              </Button>
              <Button 
                onClick={() => setShowPasswordDialog(true)} 
                className="bg-[#DB1B28] text-white"
                size="sm"
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/admin/students"
          className="inline-flex items-center text-gray-600 mb-6 text-sm font-medium hover:text-[#4A73D1] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Link>

        {/* Student Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Student Info Card */}
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-bold text-xl">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{student.name}</CardTitle>
                  <p className="text-gray-600 mt-1">Student Profile</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        Email Address
                      </Label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg font-medium">{student.email}</p>
                    </div>
                    
                    {student.phone && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          Phone Number
                        </Label>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-lg font-medium">{student.phone}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Join Date
                    </Label>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg font-medium">
                      {new Date(student.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {editError && (
                    <div className="bg-red-50 border border-red-200 text-[#DB1B28] text-sm p-4 rounded-lg font-medium">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>{editError}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-900">
                      Full Name <span className="text-[#DB1B28]">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="pl-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-900">
                      Email Address <span className="text-[#DB1B28]">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                        className="pl-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-900">
                      Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        className="pl-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Button 
                      onClick={handleUpdateStudent}
                      className="bg-[#4A73D1] text-white h-12 px-6 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <BookOpen className="h-6 w-6 text-[#4A73D1] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{student.enrolled_courses}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{student.completed_courses}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Modules Progress</span>
                  <span className="text-sm font-bold text-gray-900">
                    {student.completed_modules}/{student.total_modules}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#4A73D1] to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${student.total_modules > 0 ? (student.completed_modules / student.total_modules) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              {student.enrolled_courses > 0 && (
                <div className={`p-4 rounded-lg border text-center ${getProgressBgColor(student.avg_progress)}`}>
                  <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
                  <p className={`text-2xl font-bold ${getProgressColor(student.avg_progress)}`}>
                    {student.avg_progress}%
                  </p>
                </div>
              )}

              {student.last_activity && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">Last Activity</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(student.last_activity).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses Section */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <BookOpen className="h-6 w-6 mr-3 text-[#4A73D1]" />
              Enrolled Courses ({studentCourses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {studentCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
                <p className="text-gray-600">This student hasn&apos;t been enrolled in any courses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studentCourses.map((course) => (
                  <Card key={course.id} className="bg-gray-50 border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
                          {course.description && (
                            <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className="bg-white border-[#4A73D1] text-[#4A73D1] font-medium"
                          >
                            {course.completed_modules}/{course.modules_count} Modules
                          </Badge>
                          
                          {course.modules_count > 0 && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Progress</p>
                              <p className="font-bold text-[#4A73D1]">
                                {Math.round((course.completed_modules / course.modules_count) * 100)}%
                              </p>
                            </div>
                          )}
                        </div>

                        {course.modules_count > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#4A73D1] to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.round((course.completed_modules / course.modules_count) * 100)}%` 
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Reset Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-[#DB1B28]" />
              Reset Password
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              Create a new password for {student.name}. They will need to use this new password to log in.
            </p>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-[#DB1B28] text-sm p-4 rounded-lg font-medium">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-lg font-medium">
                {passwordSuccess}
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="pr-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="pr-12 h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              className="bg-[#DB1B28] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}