"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Plus, 
  BookOpen, 
  Users, 
  BarChart3, 
  Search,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  UserPlus
} from "lucide-react"
import type { AuthUser, DashboardStats, CourseWithStats } from "@/types/database"

export default function ModernAdminDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [courses, setCourses] = useState<CourseWithStats[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Check authentication first
      const authRes = await fetch('/api/auth/check', { credentials: 'include' })
      const authData = await authRes.json()
      
      if (!authData.success || authData.data?.role !== 'admin') {
        router.push('/login')
        return
      }
      
      setUser(authData.data)

      // Get dashboard stats
      const statsRes = await fetch('/api/analytics/dashboard')
      const statsData = await statsRes.json()
      if (statsData.success) {
        setStats(statsData.data)
      }

      // Get courses
      const coursesRes = await fetch('/api/courses')
      const coursesData = await coursesRes.json()
      if (coursesData.success) {
        setCourses(coursesData.data)
      }

    } catch (error) {
      console.error('Error loading dashboard:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Enhanced Loading Animation */}
          <div className="relative w-16 h-16 mx-auto">
            {/* Outer spinning ring */}
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"></div>
            {/* Inner spinning ring */}
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#4A73D1] border-r-[#4A73D1] rounded-full animate-spin"></div>
            {/* Center logo */}
            <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-[#4A73D1]" />
            </div>
          </div>
          
          {/* Loading text with animation */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Loading Dashboard
            </h3>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-600">Please wait</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-[#4A73D1] rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-[#4A73D1] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-[#4A73D1] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <div className="w-6 h-6 border-2 border-[#DB1B28] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-[#DB1B28] rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-[#DB1B28] mb-6">{error}</p>
            <Button onClick={loadDashboardData} className="bg-[#4A73D1] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="flex items-center space-x-3">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens Logo"
                width={160}
                height={45}
                className="object-contain"
              />
              <div className="text-xs text-gray-600 font-medium ml-2">
                Admin Dashboard
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/admin/profile">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-xl hover:bg-[#4A73D1] hover:text-white transition-all duration-200 cursor-pointer group">
                  <User className="h-4 w-4 text-gray-600 group-hover:text-white" />
                  <span className="text-sm font-medium text-gray-900 group-hover:text-white">{user?.name}</span>
                </div>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-[#DB1B28] hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your courses, students, and track learning progress.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
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
                    <p className="text-sm font-medium text-gray-600 mb-1">Average Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Completions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCompletions}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-xl">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/courses/new" className="block">
            <Button className="w-full bg-[#4A73D1] text-white h-12 text-base font-semibold">
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </Button>
          </Link>
          <Link href="/admin/students" className="block">
            <Button className="w-full bg-[#DB1B28] text-white h-12 text-base font-semibold">
              <Users className="h-5 w-5 mr-2" />
              Manage Students
            </Button>
          </Link>
          <Link href="/admin/students/new" className="block">
            <Button variant="outline" className="w-full h-12 text-base font-semibold border-gray-300 hover:bg-gray-50">
              <UserPlus className="h-5 w-5 mr-2" />
              Add Student
            </Button>
          </Link>
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
              <p className="text-gray-600">Manage and track all your courses</p>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-[#4A73D1] h-11"
              />
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No courses found' : 'No courses yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms or clear the filter.'
                    : 'Create your first course to get started with the platform.'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/courses/new">
                    <Button className="bg-[#4A73D1] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Course
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/admin/courses/${course.id}`}>
                  <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group h-full">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-[#4A73D1] transition-colors">
                          <BookOpen className="h-5 w-5 text-[#4A73D1] group-hover:text-white transition-colors" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#4A73D1] transition-colors" />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-[#4A73D1] transition-colors line-clamp-2">
                        {course.title}
                      </CardTitle>
                      {course.description && (
                        <CardDescription className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {course.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Course Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-600 text-sm">
                              <BookOpen className="h-4 w-4 mr-1" />
                              <span>{course.module_count} modules</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{course.enrolled_students} students</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Avg Progress: {course.avg_progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#4A73D1] to-[#DB1B28] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(course.avg_progress, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(course.created_at).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="secondary" className="bg-blue-50 text-[#4A73D1] text-xs">
                            {course.total_completions} completed
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}