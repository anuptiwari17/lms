"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
// import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
// import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Users, 
  Search, 
  UserCheck, 
  UserPlus,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react"
import type { User, Course } from "@/types/database"

interface StudentWithEnrollment extends User {
  enrolled: boolean
  enrollment_date?: string
}

export default function StudentEnrollmentPage() {
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [students, setStudents] = useState<StudentWithEnrollment[]>([])
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  // const router = useRouter()

  useEffect(() => {
    if (courseId) {
      loadData()
    }
  }, [courseId])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const courseRes = await fetch(`/api/courses/${courseId}`, {
        credentials: 'include'
      })
      const courseData = await courseRes.json()
      
      if (!courseData.success) {
        throw new Error(courseData.error || 'Course not found')
      }
      
      setCourse(courseData.data)

      const studentsRes = await fetch(`/api/admin/students/enrollment-status/${courseId}`, {
        credentials: 'include'
      })
      
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        if (studentsData.success) {
          setStudents(studentsData.data || [])
        }
      }

    } catch (err) {
      console.error("Error loading data:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSelect = (studentId: string, checked: boolean) => {
    const newSelection = new Set(selectedStudents)
    if (checked) {
      newSelection.add(studentId)
    } else {
      newSelection.delete(studentId)
    }
    setSelectedStudents(newSelection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const unenrolledStudents = filteredStudents.filter(s => !s.enrolled)
      setSelectedStudents(new Set(unenrolledStudents.map(s => s.id)))
    } else {
      setSelectedStudents(new Set())
    }
  }

  const handleEnrollSelected = async () => {
    if (selectedStudents.size === 0) return

    setProcessing(true)
    setError("")
    setMessage("")

    try {
      const enrollmentRequests = Array.from(selectedStudents).map(studentId => 
        fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            studentId,
            courseId: courseId
          })
        })
      )

      const results = await Promise.all(enrollmentRequests)
      
      let successCount = 0
      let errorCount = 0

      for (const result of results) {
        const data = await result.json()
        if (data.success) {
          successCount++
        } else {
          errorCount++
        }
      }

      if (successCount > 0) {
        setMessage(`Successfully enrolled ${successCount} student(s)`)
        await loadData()
        setSelectedStudents(new Set())
      }

      if (errorCount > 0) {
        setError(`Failed to enroll ${errorCount} student(s)`)
      }

    } catch (err) {
      console.error("Enrollment error: ", err)
      setError("Failed to enroll students")
    } finally {
      setProcessing(false)
    }
  }

  const handleUnenroll = async (studentId: string) => {
    if (!confirm('Are you sure you want to unenroll this student?')) return

    try {
      const response = await fetch('/api/enrollments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          studentId,
          courseId: courseId
        })
      })

      const result = await response.json()

      if (result.success) {
        setMessage('Student unenrolled successfully')
        await loadData()
      } else {
        setError(result.error || 'Failed to unenroll student')
      }

    } catch (err) {
      console.error("Unenroll error:", err)
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const enrolledStudents = filteredStudents.filter(s => s.enrolled)
  const unenrolledStudents = filteredStudents.filter(s => !s.enrolled)

  if (loading) {
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
            <h3 className="text-xl font-semibold text-gray-900">Loading Enrollment Data</h3>
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

  if (error && !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-md">
            <div className="w-10 h-10 border-4 border-[#DB1B28] rounded-full flex items-center justify-center animate-pulse">
              <div className="w-4 h-4 bg-[#DB1B28] rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Something went wrong</h3>
            <p className="text-[#DB1B28] mb-6 text-lg">{error}</p>
            <Link href="/admin">
              <Button className="bg-[#4A73D1] text-white px-6 py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200">
                Back to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/admin/courses/${courseId}`}>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 transition-all duration-200 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enroll Students</h1>
                <p className="text-sm text-gray-600">{course?.title}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-100 text-green-700 text-sm p-4 rounded-xl mb-6 shadow-sm">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-[#DB1B28] text-sm p-4 rounded-xl mb-6 shadow-sm">
            {error}
          </div>
        )}

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border-gray-200 h-12 pl-10 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleSelectAll(selectedStudents.size === 0)}
              variant="outline"
              className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
              disabled={unenrolledStudents.length === 0}
            >
              {selectedStudents.size === 0 ? 'Select All Available' : 'Clear Selection'}
            </Button>
            
            <Button
              onClick={handleEnrollSelected}
              disabled={selectedStudents.size === 0 || processing}
              className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enroll Selected ({selectedStudents.size})
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-[#4A73D1]" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Enrolled</p>
                  <p className="text-xl font-bold text-gray-900">{enrolledStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <UserPlus className="h-6 w-6 text-[#4A73D1]" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-xl font-bold text-gray-900">{unenrolledStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Students */}
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <UserPlus className="h-5 w-5 text-[#4A73D1]" />
                <span>Available Students ({unenrolledStudents.length})</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Select students to enroll in this course</p>
            </CardHeader>
            <CardContent className="p-0">
              {unenrolledStudents.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600 text-base">All students are enrolled in this course</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {unenrolledStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-4 p-4 hover:bg-blue-50 transition-all duration-200 group">
                      <Checkbox
                        checked={selectedStudents.has(student.id)}
                        onCheckedChange={(checked) => handleStudentSelect(student.id, checked as boolean)}
                        className="border-gray-300 data-[state=checked]:bg-[#4A73D1] data-[state=checked]:border-[#4A73D1] group-hover:scale-105 transition-all duration-200"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-[#4A73D1] transition-colors">{student.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{student.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enrolled Students */}
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span>Enrolled Students ({enrolledStudents.length})</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Manage currently enrolled students</p>
            </CardHeader>
            <CardContent className="p-0">
              {enrolledStudents.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600 text-base">No students enrolled yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {enrolledStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 hover:bg-blue-50 transition-all duration-200 group">
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-[#4A73D1] transition-colors">{student.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{student.email}</span>
                          </div>
                          {student.enrollment_date && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>Enrolled {new Date(student.enrollment_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleUnenroll(student.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-[#DB1B28] hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                      >
                        Unenroll
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}