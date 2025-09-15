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
  Eye,
  Plus
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
      <LoadingSpinner message="Getting Student Details" />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile-First Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          {/* Mobile Layout */}
          <div className="flex items-center sm:hidden">
            {/* Left: Back button */}
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Center: Logo - with flex-1 to center properly */}
            <div className="flex-1 flex justify-center px-2">
              <Link href="/admin">
                <Image
                  src="/images/bilvens-logo+name.webp"
                  alt="Bilvens Logo"
                  width={100}
                  height={30}
                  className="object-contain"
                />
              </Link>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center space-x-1">
              <Button
                onClick={handleExportCSV}
                variant="ghost"
                size="sm"
                className="p-2 text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg"
                disabled={filteredStudents.length === 0}
              >
                <Download className="h-5 w-5" />
              </Button>
              <Link href="/admin/students/new">
                <Button size="sm" className="p-2 bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg">
                  <Plus className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Image
                  src="/images/bilvens-logo+name.webp"
                  alt="Bilvens Logo"
                  width={120}
                  height={36}
                  className="object-contain lg:w-[140px] lg:h-[40px]"
                />
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">Student Management</h1>
                <p className="text-sm text-gray-600">View and manage all students</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                disabled={filteredStudents.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Link href="/admin/students/new">
                <Button 
                  size="sm"
                  className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Title */}
          <div className="mt-3 text-center sm:hidden">
            <h1 className="text-lg font-bold text-gray-900">Student Management</h1>
            <p className="text-sm text-gray-600">View and manage all students</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-10 max-w-7xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-[#DB1B28] p-3 rounded-lg mb-4 flex items-start">
            <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
            </div>
            <span className="ml-2 text-sm">{error}</span>
          </div>
        )}

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{students.length}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg sm:rounded-xl mt-2 sm:mt-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#4A73D1]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Enrolled</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {students.filter(s => s.enrolled_courses > 0).length}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg sm:rounded-xl mt-2 sm:mt-0">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#4A73D1]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Not Enrolled</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {students.filter(s => s.enrolled_courses === 0).length}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg sm:rounded-xl mt-2 sm:mt-0">
                  <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#DB1B28]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Avg Progress</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {students.length > 0 
                      ? Math.round(students.reduce((sum, s) => sum + s.avg_progress, 0) / students.length)
                      : 0
                    }%
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg sm:rounded-xl mt-2 sm:mt-0">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter - Mobile Optimized */}
        <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border-gray-200 h-10 sm:h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm text-sm sm:text-base"
            />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div className="flex gap-1 sm:gap-2 flex-1">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm ${filterType === 'all' ? 'bg-[#4A73D1] text-white hover:bg-[#3B5BB8]' : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'} rounded-lg transition-all duration-200`}
              >
                All ({students.length})
              </Button>
              <Button
                variant={filterType === 'enrolled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('enrolled')}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm ${filterType === 'enrolled' ? 'bg-[#4A73D1] text-white hover:bg-[#3B5BB8]' : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'} rounded-lg transition-all duration-200`}
              >
                <span className="hidden sm:inline">Enrolled </span>({students.filter(s => s.enrolled_courses > 0).length})
              </Button>
              <Button
                variant={filterType === 'not_enrolled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('not_enrolled')}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm ${filterType === 'not_enrolled' ? 'bg-[#4A73D1] text-white hover:bg-[#3B5BB8]' : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900'} rounded-lg transition-all duration-200`}
              >
                <span className="hidden sm:inline">Not </span>({students.filter(s => s.enrolled_courses === 0).length})
              </Button>
            </div>
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <Card className="bg-white border-gray-100 shadow-md rounded-xl">
            <CardContent className="p-6 sm:p-12 text-center">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No students found' : 'No students yet'}
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or filter options.'
                  : 'Add your first student to get started with the platform.'
                }
              </p>
              {!searchTerm && (
                <Link href="/admin/students/new">
                  <Button className="w-full sm:w-auto bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg transition-all duration-200">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Student
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-semibold text-sm sm:text-lg flex-shrink-0">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Student Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                            {student.name}
                          </h3>
                          {student.enrolled_courses === 0 && (
                            <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 text-xs w-fit">
                              Not Enrolled
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span>Joined {new Date(student.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats and Actions - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Stats */}
                      <div className="flex justify-between sm:justify-end items-center gap-4 sm:gap-6">
                        <div className="flex items-center gap-4 text-center">
                          <div>
                            <p className="text-xs text-gray-600">Courses</p>
                            <p className="font-bold text-gray-900 text-sm">{student.enrolled_courses}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Done</p>
                            <p className="font-bold text-gray-900 text-sm">{student.completed_courses}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Modules</p>
                            <p className="font-bold text-gray-900 text-sm">{student.completed_modules}/{student.total_modules}</p>
                          </div>
                        </div>
                        
                        {/* Progress Badge */}
                        {student.enrolled_courses > 0 && (
                          <div className={`px-2 py-1 rounded-full border ${getProgressBgColor(student.avg_progress)} flex-shrink-0`}>
                            <p className={`text-xs font-medium ${getProgressColor(student.avg_progress)}`}>
                              {student.avg_progress}%
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <Link href={`/admin/students/${student.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          <span className="sm:hidden">View</span>
                          <span className="hidden sm:inline">View Details</span>
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