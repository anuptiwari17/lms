"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Filter,
  Download,
  Eye
} from "lucide-react"
import type { User, Enrollment } from "@/types/database"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

interface StudentWithStats extends User {
  enrolled_courses: number
  completed_courses: number
  avg_progress: number
  last_activity: string | null
  total_modules: number
  completed_modules: number
}

export default function ModernAdminStudentsPage() {
  const [students, setStudents] = useState<StudentWithStats[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'enrolled' | 'not_enrolled'>('all')
  
  const router = useRouter()

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, filterType])

  const loadStudents = async () => {
    try {
      setLoading(true)
      
      // Get all students with their enrollment statistics
      const response = await fetch('/api/admin/students/stats', {
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load students')
      }
      
      setStudents(result.data || [])
      
    } catch (error) {
      console.error('Error loading students:', error)
      setError(error instanceof Error ? error.message : 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const filterStudents = () => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.phone && student.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (filterType === 'enrolled') {
      filtered = filtered.filter(student => student.enrolled_courses > 0)
    } else if (filterType === 'not_enrolled') {
      filtered = filtered.filter(student => student.enrolled_courses === 0)
    }

    setFilteredStudents(filtered)
  }

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return
    
    const csvHeaders = ['Name', 'Email', 'Phone', 'Enrolled Courses', 'Completed Courses', 'Average Progress', 'Completed Modules', 'Total Modules', 'Last Activity', 'Created Date']
    
    const csvData = filteredStudents.map(student => [
      student.name,
      student.email,
      student.phone || 'N/A',
      student.enrolled_courses.toString(),
      student.completed_courses.toString(),
      `${student.avg_progress}%`,
      student.completed_modules.toString(),
      student.total_modules.toString(),
      student.last_activity ? new Date(student.last_activity).toLocaleDateString() : 'No activity',
      new Date(student.created_at).toLocaleDateString()
    ])
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `students-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  if (loading) {
    return (
      <LoadingSpinner message="Getting Student Details"/>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-3">
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
                <h1 className="text-xl font-bold text-gray-900">Student Management</h1>
                <p className="text-sm text-gray-600">View and manage all students</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="border-gray-300"
                disabled={filteredStudents.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Link href="/admin/students/new">
                <Button className="bg-[#4A73D1] text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-600 mb-6 text-sm font-medium hover:text-[#4A73D1] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-[#DB1B28] p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
              </div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="h-6 w-6 text-[#4A73D1]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.enrolled_courses > 0).length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <BookOpen className="h-6 w-6 text-[#4A73D1]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Not Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.filter(s => s.enrolled_courses === 0).length}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <UserPlus className="h-6 w-6 text-[#DB1B28]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {students.length > 0 
                      ? Math.round(students.reduce((sum, s) => sum + s.avg_progress, 0) / students.length)
                      : 0
                    }%
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search students by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-[#4A73D1] h-11"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex space-x-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'bg-[#4A73D1] text-white' : 'border-gray-300'}
              >
                All ({students.length})
              </Button>
              <Button
                variant={filterType === 'enrolled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('enrolled')}
                className={filterType === 'enrolled' ? 'bg-[#4A73D1] text-white' : 'border-gray-300'}
              >
                Enrolled ({students.filter(s => s.enrolled_courses > 0).length})
              </Button>
              <Button
                variant={filterType === 'not_enrolled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('not_enrolled')}
                className={filterType === 'not_enrolled' ? 'bg-[#4A73D1] text-white' : 'border-gray-300'}
              >
                Not Enrolled ({students.filter(s => s.enrolled_courses === 0).length})
              </Button>
            </div>
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No students found' : 'No students yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or filter options.'
                  : 'Add your first student to get started with the platform.'
                }
              </p>
              {!searchTerm && (
                <Link href="/admin/students/new">
                  <Button className="bg-[#4A73D1] text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Student
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-semibold text-lg">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Student Info */}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {student.name}
                          </h3>
                          {student.enrolled_courses === 0 && (
                            <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                              Not Enrolled
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-2" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-2" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-2" />
                            <span>Joined {new Date(student.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center space-x-6">
                      {/* Stats */}
                      <div className="text-right space-y-2">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Courses</p>
                            <p className="font-bold text-gray-900">{student.enrolled_courses}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Completed</p>
                            <p className="font-bold text-gray-900">{student.completed_courses}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Modules</p>
                            <p className="font-bold text-gray-900">{student.completed_modules}/{student.total_modules}</p>
                          </div>
                        </div>
                        
                        {student.enrolled_courses > 0 && (
                          <div className={`px-3 py-1 rounded-full border ${getProgressBgColor(student.avg_progress)}`}>
                            <p className={`text-xs font-medium ${getProgressColor(student.avg_progress)}`}>
                              {student.avg_progress}% Progress
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link href={`/admin/students/${student.id}`}>
                        <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}