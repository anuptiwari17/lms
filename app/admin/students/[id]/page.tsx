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
  Award,
  Sparkles,
  ArrowRight
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
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-[#4A73D1] border-r-[#DB1B28] rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-[#4A73D1]" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Loading Student Details</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-gray-600">Preparing your content</span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[#4A73D1] rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 bg-[#4A73D1] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-md">
            <div className="w-10 h-10 border-4 border-[#DB1B28] rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-6 w-6 text-[#DB1B28]" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Student Not Found</h3>
            <p className="text-[#DB1B28] mb-6 text-lg">{error || "Student not found"}</p>
            <Link href="/admin/students">
              <Button className="bg-[#4A73D1] text-white px-6 py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200">
                Back to Students
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-[#DB1B28]'
  }

  const getProgressBgColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-50 border-green-100'
    if (progress >= 50) return 'bg-yellow-50 border-yellow-100'
    return 'bg-red-50 border-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-sm text-gray-600">Student Details & Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {editSuccess && (
                <div className="bg-green-50 border border-green-100 text-green-700 text-sm px-3 py-2 rounded-lg shadow-sm">
                  {editSuccess}
                </div>
              )}
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? 
                  "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200" : 
                  "bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 rounded-lg transition-all duration-200"}
              >
                {isEditing ? <><X className="h-4 w-4 mr-2" /> Cancel</> : <><Edit className="h-4 w-4 mr-2" /> Edit</>}
              </Button>
              <Button 
                onClick={() => setShowPasswordDialog(true)} 
                className="bg-[#DB1B28] text-white hover:bg-red-600 hover:scale-105 rounded-lg transition-all duration-200"
                size="sm"
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Student Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Student Info Card */}
          <Card className="lg:col-span-2 bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">{student.name}</CardTitle>
                  <p className="text-sm text-gray-600">Student Profile</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        Email Address
                      </Label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm font-medium">{student.email}</p>
                    </div>
                    
                    {student.phone && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          Phone Number
                        </Label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm font-medium">{student.phone}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Join Date
                    </Label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm font-medium">
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
                    <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>{editError}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Full Name <span className="text-[#DB1B28]">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Email Address <span className="text-[#DB1B28]">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                        className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">
                      Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        className="pl-10 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                    <Button 
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateStudent}
                      className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 rounded-lg transition-all duration-200"
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
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#4A73D1]" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                  <BookOpen className="h-6 w-6 text-[#4A73D1] mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                  <p className="text-xl font-bold text-gray-900">{student.enrolled_courses}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100 shadow-sm">
                  <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-gray-900">{student.completed_courses}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Modules Progress</span>
                  <span className="text-sm font-bold text-gray-900">
                    {student.completed_modules}/{student.total_modules}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 border border-gray-200">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-300 ${student.total_modules > 0 ? 'bg-gradient-to-r from-[#4A73D1] to-[#DB1B28]' : 'bg-transparent'}`}
                    style={{ 
                      width: `${student.total_modules > 0 ? (student.completed_modules / student.total_modules) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              {student.enrolled_courses > 0 && (
                <div className={`p-4 rounded-lg border text-center ${getProgressBgColor(student.avg_progress)} shadow-sm`}>
                  <p className="text-sm font-medium text-gray-600 mb-1">Overall Progress</p>
                  <p className={`text-xl font-bold ${getProgressColor(student.avg_progress)}`}>
                    {student.avg_progress}%
                  </p>
                </div>
              )}

              {student.last_activity && (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Last Activity</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(student.last_activity).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses Section */}
        <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-[#4A73D1]" />
              Enrolled Courses ({studentCourses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {studentCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Enrolled</h3>
                <p className="text-gray-600 text-sm">This student hasn&#39;t been enrolled in any courses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentCourses.map((course) => (
                  <Card key={course.id} className="bg-white border-gray-100 shadow-sm rounded-lg hover:shadow-md transition-all duration-200 group">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-base text-gray-900 group-hover:text-[#4A73D1] transition-colors">{course.title}</h3>
                          {course.description && (
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{course.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className="bg-blue-50 border-blue-100 text-[#4A73D1] text-xs font-medium"
                          >
                            {course.completed_modules}/{course.modules_count} Modules
                          </Badge>
                          
                          {course.modules_count > 0 && (
                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-600">Progress</p>
                              <p className="text-sm font-semibold text-[#4A73D1]">
                                {Math.round((course.completed_modules / course.modules_count) * 100)}%
                              </p>
                            </div>
                          )}
                        </div>

                        {course.modules_count > 0 && (
                          <div className="w-full bg-gray-100 rounded-full h-2.5 border border-gray-200 group-hover:border-[#4A73D1] transition-all duration-300">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-300 ${course.modules_count > 0 ? 'bg-gradient-to-r from-[#4A73D1] to-[#DB1B28]' : 'bg-transparent'}`}
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
        <DialogContent className="bg-white border-gray-100 shadow-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-[#DB1B28]" />
              Reset Password
            </DialogTitle>
            <p className="text-gray-600 text-sm">
              Create a new password for {student.name}. They will need to use this new password to log in.
            </p>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-100 text-green-700 text-sm p-4 rounded-lg shadow-sm">
                {passwordSuccess}
              </div>
            )}
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">New Password <span className="text-[#DB1B28]">*</span></Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                  className="pr-12 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-[#4A73D1]"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Confirm Password <span className="text-[#DB1B28]">*</span></Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="pr-12 h-12 border-gray-200 focus:border-[#4A73D1] focus:ring-0 rounded-lg text-sm font-medium shadow-sm"
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-500 hover:text-[#4A73D1]"
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
              className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              className="bg-[#DB1B28] text-white hover:bg-red-600 hover:scale-105 rounded-lg transition-all duration-200"
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