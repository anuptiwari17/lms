"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Plus, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  ArrowRight, 
  UserPlus,
  Search,
  Menu,
  X
} from "lucide-react"
import type { AuthUser, DashboardStats, CourseWithStats } from "@/types/database"

export default function ModernAdminDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [courses, setCourses] = useState<CourseWithStats[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    return <LoadingSpinner message="Crafting Your Workspace..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-md">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#DB1B28] rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#DB1B28] rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Something went wrong</h3>
            <p className="text-[#DB1B28] mb-6 text-base sm:text-lg">{error}</p>
            <Button 
              onClick={loadDashboardData} 
              className="bg-[#4A73D1] text-white px-6 py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              Try Again
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/admin" className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens Logo"
                width={120}
                height={30}
                className="object-contain sm:w-[150px] sm:h-[40px] lg:w-[180px] lg:h-[50px]"
              />
              <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium hidden sm:inline-flex">
                Admin Dashboard
              </Badge>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-3 md:space-x-4">
              <Link href="/admin/profile">
                <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 bg-gray-100 rounded-xl hover:bg-[#4A73D1] hover:text-white transition-all duration-200 cursor-pointer group">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#4A73D1] group-hover:text-white" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-white truncate max-w-[120px]">
                    {user?.name}
                  </span>
                </div>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="border-[#DB1B28] text-[#DB1B28] hover:bg-[#DB1B28] hover:text-white transition-all duration-200 rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 space-y-3">
              <Link href="/admin/profile" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 rounded-xl">
                  <User className="h-5 w-5 text-[#4A73D1]" />
                  <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                </div>
              </Link>
              <Button 
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                variant="outline" 
                className="w-full border-[#DB1B28] text-[#DB1B28] hover:bg-[#DB1B28] hover:text-white transition-all duration-200 rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 sm:mb-3">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
            Oversee courses, manage students, and track learning progress with ease.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
            {[
              { title: "Total Courses", value: stats.totalCourses, icon: BookOpen, bg: "bg-blue-50", color: "text-[#4A73D1]" },
              { title: "Total Students", value: stats.totalStudents, icon: Users, bg: "bg-red-50", color: "text-[#DB1B28]" },
              { title: "Average Progress", value: `${stats.averageProgress}%`, icon: TrendingUp, bg: "bg-green-50", color: "text-green-600" },
              { title: "Completions", value: stats.totalCompletions, icon: Award, bg: "bg-yellow-50", color: "text-yellow-600" },
            ].map((stat, index) => (
              <Card 
                key={index} 
                className="bg-white border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl overflow-hidden"
              >
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 leading-tight">
                        {stat.title}
                      </p>
                      <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-2 sm:p-3 ${stat.bg} rounded-xl shadow-sm self-end sm:self-auto`}>
                      <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
          <Link href="/admin/courses/new" className="block">
            <Button className="w-full bg-[#4A73D1] text-white h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Create Course
            </Button>
          </Link>
          <Link href="/admin/students" className="block">
            <Button className="w-full bg-[#DB1B28] text-white h-10 sm:h-12 text-sm sm:text-base font-semibold rounded-lg hover:bg-[#C11723] hover:scale-105 transition-all duration-200">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Manage Students
            </Button>
          </Link>
          <Link href="/admin/students/new" className="block">
            <Button 
              variant="outline" 
              className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold border-gray-300 hover:bg-gray-100 hover:scale-105 transition-all duration-200 rounded-lg"
            >
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#4A73D1]" />
              Add Student
            </Button>
          </Link>
        </div>

        {/* Courses Section */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Your Courses
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                Monitor and manage all your educational content
              </p>
            </div>
            
            <div className="relative w-full sm:w-80 lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 bg-white border-gray-200 h-10 sm:h-12 rounded-lg focus:border-[#4A73D1] transition-colors duration-200 shadow-sm text-sm sm:text-base"
              />
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="bg-white border-gray-100 shadow-md rounded-xl">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  {searchTerm ? 'No courses found' : 'No courses yet'}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try adjusting your search terms or clear the filter.'
                    : 'Create your first course to get started with the platform.'
                  }
                </p>
                {!searchTerm && (
                  <Link href="/admin/courses/new">
                    <Button className="bg-[#4A73D1] text-white px-6 py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Create Your First Course
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} href={`/admin/courses/${course.id}`}>
                  <Card className="bg-white border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl cursor-pointer group h-full">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <div className="p-2 sm:p-3 bg-blue-50 rounded-lg group-hover:bg-[#4A73D1] transition-all duration-200">
                          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#4A73D1] group-hover:text-white transition-all" />
                        </div>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-[#DB1B28] transition-all" />
                      </div>
                      <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-[#4A73D1] transition-colors line-clamp-2 leading-tight">
                        {course.title}
                      </CardTitle>
                      {course.description && (
                        <CardDescription className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                          {course.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3 sm:space-y-4">
                      {/* Course Metrics */}
                      <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="flex items-center">
                            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#4A73D1]" />
                            <span>{course.module_count} modules</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-[#DB1B28]" />
                            <span>{course.enrolled_students} students</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">
                            Avg Progress: {course.avg_progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5">
                          <div 
                            className="bg-gradient-to-r from-[#4A73D1] to-[#DB1B28] h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(course.avg_progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="truncate max-w-[100px] sm:max-w-none">
                            {new Date(course.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium">
                          {course.total_completions} completed
                        </Badge>
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