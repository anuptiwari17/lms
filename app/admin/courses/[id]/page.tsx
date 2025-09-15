"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BarChart3, 
  Play, 
  Download,
  GripVertical,
  ArrowRight,
  Megaphone,
  Save,
  X,
  AlertTriangle,
  Menu,
  MoreVertical
} from "lucide-react"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import type { Course, Module, ApiResponse, AnnouncementWithAuthor, Announcement } from "@/types/database"
import { utils } from "@/lib/database"

interface CourseWithModules extends Course {
  modules: Module[]
}

interface StudentInCourse {
  id: string
  name: string
  email: string
  role: 'admin' | 'student'
  progress_percentage: number
  created_at: string
  updated_at: string
}

interface CourseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const [course, setCourse] = useState<CourseWithModules | null>(null)
  const [students, setStudents] = useState<StudentInCourse[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [courseId, setCourseId] = useState<string>("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Module form state
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleForm, setModuleForm] = useState({
    id: "",
    title: "",
    description: "",
    video_url: "",
    duration_minutes: 0
  })
  const [moduleLoading, setModuleLoading] = useState(false)
  const [editingModule, setEditingModule] = useState<string | null>(null)

  // Announcement state
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({ content: "" })
  const [announcementLoading, setAnnouncementLoading] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null)
  const [editAnnouncementContent, setEditAnnouncementContent] = useState("")

  // Course edit/delete state
  const [showEditCourseDialog, setShowEditCourseDialog] = useState(false)
  const [showDeleteCourseDialog, setShowDeleteCourseDialog] = useState(false)
  const [courseLoading, setCourseLoading] = useState(false)
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: ""
  })
  
  const router = useRouter()

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('iframe')) {
        event.preventDefault()
      }
    }
    document.addEventListener("contextmenu", handleContextMenu)
    return () => document.removeEventListener("contextmenu", handleContextMenu)
  }, [])

  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params
      if (!resolvedParams.id) {
        setError("Course ID is required")
        setLoading(false)
        return
      }
      setCourseId(resolvedParams.id)
    }
    extractParams()
  }, [params])

  useEffect(() => {
    if (courseId) {
      loadCourseData()
    }
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      
      const [courseRes, studentsRes, announcementsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/students`),
        fetch(`/api/courses/${courseId}/announcements`)
      ])

      const courseData = await courseRes.json()
      const studentsData = await studentsRes.json()
      const announcementsData = await announcementsRes.json()

      if (!courseData.success) {
        throw new Error(courseData.error || 'Course not found')
      }

      setCourse(courseData.data)
      setCourseForm({
        title: courseData.data.title,
        description: courseData.data.description || ""
      })
      if (studentsData.success) {
        setStudents(studentsData.data || [])
      }
      if (announcementsData.success) {
        setAnnouncements(announcementsData.data || [])
      }

    } catch (error) {
      console.error('Error loading course:', error)
      setError(error instanceof Error ? error.message : 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    setModuleLoading(true)

    try {
      if (!moduleForm.title.trim() || !moduleForm.video_url.trim()) {
        throw new Error("Title and video URL are required")
      }

      const method = editingModule ? 'PUT' : 'POST'
      const url = editingModule 
        ? `/api/courses/${courseId}/modules/${editingModule}`
        : `/api/courses/${courseId}/modules`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: moduleForm.title.trim(),
          description: moduleForm.description.trim(),
          video_url: moduleForm.video_url.trim(),
          duration_minutes: moduleForm.duration_minutes || 0
        })
      })

      const result: ApiResponse<Module> = await response.json()

      if (!result.success) {
        throw new Error(result.error || editingModule ? 'Failed to update module' : 'Failed to create module')
      }

      await loadCourseData()
      
      setModuleForm({
        id: "",
        title: "",
        description: "",
        video_url: "",
        duration_minutes: 0
      })
      setEditingModule(null)
      setShowModuleForm(false)

    } catch (error) {
      console.error('Module operation error:', error)
      setError(error instanceof Error ? error.message : editingModule ? 'Failed to update module' : 'Failed to create module')
    } finally {
      setModuleLoading(false)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return
    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: 'DELETE'
      })
      const result: ApiResponse = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete module')
      }
      await loadCourseData()
    } catch (error) {
      console.error('Delete module error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete module')
    }
  }

  const startEditModule = (module: Module) => {
    setEditingModule(module.id)
    setModuleForm({
      id: module.id,
      title: module.title,
      description: module.description || "",
      video_url: module.video_url,
      duration_minutes: module.duration_minutes
    })
    setShowModuleForm(true)
  }

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnnouncementLoading(true)

    try {
      if (!announcementForm.content.trim()) {
        throw new Error("Announcement content is required")
      }

      const response = await fetch(`/api/courses/${courseId}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: announcementForm.content.trim(),
          course_id: courseId
        })
      })

      const result: ApiResponse<Announcement> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create announcement')
      }

      await loadCourseData()
      
      setAnnouncementForm({ content: "" })
      setShowAnnouncementForm(false)

    } catch (error) {
      console.error('Create announcement error:', error)
      setError(error instanceof Error ? error.message : 'Failed to create announcement')
    } finally {
      setAnnouncementLoading(false)
    }
  }

  const handleEditAnnouncement = async (announcementId: string) => {
    try {
      if (!editAnnouncementContent.trim()) {
        throw new Error("Announcement content is required")
      }

      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editAnnouncementContent.trim()
        })
      })

      const result: ApiResponse<Announcement> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update announcement')
      }

      await loadCourseData()
      
      setEditingAnnouncement(null)
      setEditAnnouncementContent("")

    } catch (error) {
      console.error('Update announcement error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update announcement')
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return
    }

    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: 'DELETE'
      })

      const result: ApiResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete announcement')
      }

      await loadCourseData()

    } catch (error) {
      console.error('Delete announcement error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete announcement')
    }
  }

  const startEditAnnouncement = (announcement: AnnouncementWithAuthor) => {
    setEditingAnnouncement(announcement.id)
    setEditAnnouncementContent(announcement.content)
  }

  const cancelEditAnnouncement = () => {
    setEditingAnnouncement(null)
    setEditAnnouncementContent("")
  }

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setCourseLoading(true)
    try {
      if (!courseForm.title.trim()) {
        throw new Error("Course title is required")
      }

      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseForm.title.trim(),
          description: courseForm.description.trim()
        })
      })

      const result: ApiResponse<Course> = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to update course')
      }

      await loadCourseData()
      setShowEditCourseDialog(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update course')
    } finally {
      setCourseLoading(false)
    }
  }

  const handleDeleteCourse = async () => {
    setCourseLoading(true)
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE'
      })
      const result: ApiResponse = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete course')
      }
      router.push('/admin')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete course')
    } finally {
      setCourseLoading(false)
    }
  }

  const handleDownloadCSV = () => {
    if (students.length === 0) return
    const csvContent = utils.generateCSV(students, course?.title || 'Course')
    utils.downloadCSV(csvContent, `${course?.title || 'course'}-students.csv`)
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = utils.extractYouTubeVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!courseId || loading) {
    return <LoadingSpinner message="Loading course..." />
  }

  if (error || !course) {
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
            <p className="text-[#DB1B28] mb-6 text-base sm:text-lg">{error || 'Course not found'}</p>
            <Link href="/admin">
              <Button className="bg-[#4A73D1] text-white px-6 py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                Back to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link href="/admin">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 transition-all duration-200 rounded-lg p-2"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:ml-2 sm:inline">Back</span>
                </Button>
              </Link>
              <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 truncate">{course.title}</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Course Management</p>
              </div>
            </div>
            
            {/* Desktop Header Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button 
                onClick={() => setShowEditCourseDialog(true)}
                variant="outline" 
                size="sm"
                className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
              <Button 
                onClick={handleDownloadCSV}
                variant="outline" 
                size="sm"
                className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
                disabled={students.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100 space-y-3">
              <Button 
                onClick={() => {
                  setShowEditCourseDialog(true)
                  setMobileMenuOpen(false)
                }}
                variant="outline" 
                className="w-full border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200 justify-start"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
              <Button 
                onClick={() => {
                  handleDownloadCSV()
                  setMobileMenuOpen(false)
                }}
                variant="outline" 
                className="w-full border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200 justify-start"
                disabled={students.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Analytics
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 flex items-start">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          {/* Mobile-First Tab Navigation */}
          <div className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-100 p-1 rounded-xl shadow-sm h-14 sm:h-16">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-2 text-xs sm:text-sm"
                title="Overview"
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger 
                value="modules"
                className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-2 text-xs sm:text-sm"
                title={`Modules (${course.modules?.length || 0})`}
              >
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="hidden sm:inline">Modules</span>
                <span className="sm:hidden text-xs">({course.modules?.length || 0})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="announcements"
                className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-2 text-xs sm:text-sm"
                title={`Announcements (${announcements.length})`}
              >
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="hidden sm:inline">Announcements</span>
                <span className="sm:hidden text-xs">({announcements.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="students"
                className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-2 text-xs sm:text-sm"
                title={`Students (${students.length})`}
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="hidden sm:inline">Students</span>
                <span className="sm:hidden text-xs">({students.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { title: "Total Modules", value: course.modules?.length || 0, icon: BookOpen },
                { title: "Announcements", value: announcements.length, icon: Megaphone },
                { title: "Enrolled Students", value: students.length, icon: Users },
                { 
                  title: "Avg Progress", 
                  value: `${students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.progress_percentage, 0) / students.length) : 0}%`, 
                  icon: BarChart3 
                }
              ].map((stat, index) => (
                <Card key={index} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 leading-tight">{stat.title}</p>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className="self-end sm:self-auto">
                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-[#4A73D1]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Description</Label>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1">
                    {course.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Created</Label>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    {new Date(course.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Course Modules</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Manage video modules for this course</p>
              </div>
              <Dialog open={showModuleForm} onOpenChange={(open) => {
                setShowModuleForm(open)
                if (!open) {
                  setModuleForm({
                    id: "",
                    title: "",
                    description: "",
                    video_url: "",
                    duration_minutes: 0
                  })
                  setEditingModule(null)
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-full sm:max-w-lg md:max-w-2xl p-4 sm:p-6">
                  <form onSubmit={handleCreateOrUpdateModule}>
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl text-gray-900">{editingModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        {editingModule ? 'Update the module details' : 'Create a new video module for this course'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="module-title" className="text-sm font-medium text-gray-600">Module Title *</Label>
                        <Input
                          id="module-title"
                          value={moduleForm.title}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Introduction to HTML"
                          className="w-full h-12 pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="module-description" className="text-sm font-medium text-gray-600">Description</Label>
                        <Textarea
                          id="module-description"
                          value={moduleForm.description}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this module covers..."
                          rows={4}
                          className="w-full min-h-[120px] pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="video-url" className="text-sm font-medium text-gray-600">YouTube Video URL *</Label>
                        <Input
                          id="video-url"
                          value={moduleForm.video_url}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, video_url: e.target.value }))}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full h-12 pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                          required
                        />
                        <p className="text-xs text-gray-600">
                          YouTube, YouTube Shorts, or YouTube embed URLs are supported
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-sm font-medium text-gray-600">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={moduleForm.duration_minutes}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                          placeholder="e.g., 15"
                          min="0"
                          className="w-full h-12 pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowModuleForm(false)}
                        disabled={moduleLoading}
                        className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={moduleLoading || !moduleForm.title.trim() || !moduleForm.video_url.trim()}
                        className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2"
                      >
                        {moduleLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            {editingModule ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            {editingModule ? 'Update Module' : 'Add Module'}
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((module, index) => {
                    const embedUrl = getYouTubeEmbedUrl(module.video_url)
                    return (
                      <Card key={module.id} className="bg-white border-gray-100 shadow-md rounded-lg hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#4A73D1] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                            </div>
                            <div className="flex-1 space-y-3 w-full">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{module.title}</h4>
                                  {module.description && (
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1">{module.description}</p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2">
                                    <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium">
                                      {module.duration_minutes > 0 ? `${module.duration_minutes} min` : 'Duration not set'}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => startEditModule(module)}
                                    className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg transition-all duration-200 h-10 w-10"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteModule(module.id)}
                                    className="text-[#DB1B28] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 h-10 w-10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {embedUrl && (
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                  <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                                    <iframe
                                      src={embedUrl}
                                      title={module.title}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; screen-wake-lock"
                                      allowFullScreen
                                      referrerPolicy="strict-origin-when-cross-origin"
                                      loading="lazy"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            ) : (
              <Card className="bg-white border-gray-100 shadow-md rounded-lg hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Play className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">No modules yet</h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                    Start by adding video modules to your course. Students will see modules in the order you create them.
                  </p>
                  <Button onClick={() => setShowModuleForm(true)} className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Module
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Course Announcements</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Share important updates with your students</p>
              </div>
              <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-full sm:max-w-lg md:max-w-2xl p-4 sm:p-6">
                  <form onSubmit={handleCreateAnnouncement}>
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl text-gray-900">Create New Announcement</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Share an important update or message with all students enrolled in this course
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-content" className="text-sm font-medium text-gray-600">Announcement Content *</Label>
                        <Textarea
                          id="announcement-content"
                          value={announcementForm.content}
                          onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter your announcement message here..."
                          rows={8}
                          className="w-full min-h-[200px] pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
                          required
                        />
                        <p className="text-xs text-gray-600">
                          This message will be visible to all students enrolled in this course
                        </p>
                      </div>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAnnouncementForm(false)}
                        disabled={announcementLoading}
                        className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={announcementLoading || !announcementForm.content.trim()}
                        className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2"
                      >
                        {announcementLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Megaphone className="h-4 w-4 mr-2" />
                            Publish Announcement
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="bg-white border-gray-100 shadow-md rounded-lg hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#4A73D1] to-[#DB1B28] text-white rounded-full flex items-center justify-center">
                            <Megaphone className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-600 truncate">
                              By {announcement.author.name} • {formatDate(announcement.created_at)}
                            </p>
                            {announcement.updated_at !== announcement.created_at && (
                              <p className="text-xs text-gray-600 truncate">
                                Updated {formatDate(announcement.updated_at)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEditAnnouncement(announcement)}
                            className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg transition-all duration-200 h-10 w-10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-[#DB1B28] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 h-10 w-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {editingAnnouncement === announcement.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editAnnouncementContent}
                            onChange={(e) => setEditAnnouncementContent(e.target.value)}
                            className="w-full min-h-[120px] pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
                            rows={6}
                          />
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleEditAnnouncement(announcement.id)}
                              disabled={!editAnnouncementContent.trim()}
                              className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={cancelEditAnnouncement}
                              className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#4A73D1]">
                          <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                            {announcement.content}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-gray-100 shadow-md rounded-lg hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Megaphone className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">No announcements yet</h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                    Keep your students informed by creating announcements about course updates, deadlines, or important information.
                  </p>
                  <Button onClick={() => setShowAnnouncementForm(true)} className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Announcement
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Enrolled Students</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Track student progress and manage enrollments</p>
              </div>
              <Link href={`/admin/courses/${courseId}/enroll`}>
                <Button className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll Students
                </Button>
              </Link>
            </div>
            {students.length > 0 ? (
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id} className="bg-white border-gray-100 shadow-md rounded-lg hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-semibold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{student.name}</h4>
                            <p className="text-sm text-gray-600 truncate">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-center sm:text-right space-y-2">
                          <div className="flex items-center justify-center sm:justify-end gap-2">
                            <Badge 
                              className={`text-xs font-medium ${student.progress_percentage === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-[#4A73D1]'}`}
                            >
                              {student.progress_percentage}% Complete
                            </Badge>
                          </div>
                          <div className="w-24 sm:w-32 bg-gray-100 rounded-full h-2.5 border border-gray-200">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-200 ${student.progress_percentage > 0 ? 'bg-gradient-to-r from-[#4A73D1] to-[#DB1B28]' : 'bg-transparent'}`}
                              style={{ width: `${Math.min(student.progress_percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-gray-100 shadow-md rounded-lg hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Users className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">No students enrolled</h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                    Start by enrolling students in this course to track their progress.
                  </p>
                  <Link href={`/admin/courses/${courseId}/enroll`}>
                    <Button className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Enroll Students
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Course Dialog */}
        <Dialog open={showEditCourseDialog} onOpenChange={setShowEditCourseDialog}>
          <DialogContent className="w-full max-w-full sm:max-w-lg md:max-w-2xl p-4 sm:p-6">
            <form onSubmit={handleUpdateCourse}>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl text-gray-900">Edit Course</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Update the course details below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course-title" className="text-sm font-medium text-gray-600">Course Title *</Label>
                  <Input
                    id="course-title"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter course title"
                    className="w-full h-12 pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course-description" className="text-sm font-medium text-gray-600">Description</Label>
                  <Textarea
                    id="course-description"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter course description..."
                    rows={6}
                    className="w-full min-h-[150px] pl-4 pr-4 bg-white border-gray-200 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditCourseDialog(false)}
                  disabled={courseLoading}
                  className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDeleteCourseDialog(true)}
                  disabled={courseLoading}
                  className="w-full sm:w-auto border-red-200 text-[#DB1B28] hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 px-4 py-2"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Course
                </Button>
                <Button 
                  type="submit" 
                  disabled={courseLoading || !courseForm.title.trim()}
                  className="w-full sm:w-auto bg-[#4A73D1] hover:bg-[#3B5BB8] text-white rounded-lg transition-all duration-200 px-4 py-2"
                >
                  {courseLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Course
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Course Confirmation Dialog */}
        <Dialog open={showDeleteCourseDialog} onOpenChange={setShowDeleteCourseDialog}>
          <DialogContent className="w-full max-w-full sm:max-w-md p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center text-[#DB1B28] text-lg sm:text-xl">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Delete Course
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently delete the course and all associated data.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-[#DB1B28] text-sm font-medium mb-2">
                  You are about to delete: <span className="font-bold">&#34;{course?.title}&#34;</span>
                </p>
                <p className="text-[#DB1B28] text-sm">
                  This will also delete:
                </p>
                <ul className="text-[#DB1B28] text-sm mt-1 ml-4 list-disc">
                  <li>All {course?.modules?.length || 0} modules</li>
                  <li>All {announcements.length} announcements</li>
                  <li>All student enrollment data</li>
                  <li>All progress tracking data</li>
                </ul>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDeleteCourseDialog(false)}
                disabled={courseLoading}
                className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200 px-4 py-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteCourse}
                disabled={courseLoading}
                className="w-full sm:w-auto bg-[#DB1B28] hover:bg-red-600 text-white rounded-lg transition-all duration-200 px-4 py-2"
              >
                {courseLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Yes, Delete Course
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}


































// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { 
//   ArrowLeft, 
//   BookOpen, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Users, 
//   BarChart3, 
//   Play, 
//   Download,
//   GripVertical,
//   ArrowRight,
//   Megaphone,
//   Save,
//   X,
//   AlertTriangle
// } from "lucide-react"
// import LoadingSpinner from "@/components/ui/LoadingSpinner"
// import type { Course, Module, ApiResponse, AnnouncementWithAuthor, Announcement } from "@/types/database"
// import { utils } from "@/lib/database"

// interface CourseWithModules extends Course {
//   modules: Module[]
// }

// interface StudentInCourse {
//   id: string
//   name: string
//   email: string
//   role: 'admin' | 'student'
//   progress_percentage: number
//   created_at: string
//   updated_at: string
// }

// interface CourseDetailPageProps {
//   params: Promise<{ id: string }>
// }

// export default function CourseDetailPage({ params }: CourseDetailPageProps) {
//   const [course, setCourse] = useState<CourseWithModules | null>(null)
//   const [students, setStudents] = useState<StudentInCourse[]>([])
//   const [announcements, setAnnouncements] = useState<AnnouncementWithAuthor[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [activeTab, setActiveTab] = useState("overview")
//   const [courseId, setCourseId] = useState<string>("")
  
//   // Module form state
//   const [showModuleForm, setShowModuleForm] = useState(false)
//   const [moduleForm, setModuleForm] = useState({
//     id: "",
//     title: "",
//     description: "",
//     video_url: "",
//     duration_minutes: 0
//   })
//   const [moduleLoading, setModuleLoading] = useState(false)
//   const [editingModule, setEditingModule] = useState<string | null>(null)

//   // Announcement state
//   const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
//   const [announcementForm, setAnnouncementForm] = useState({ content: "" })
//   const [announcementLoading, setAnnouncementLoading] = useState(false)
//   const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null)
//   const [editAnnouncementContent, setEditAnnouncementContent] = useState("")

//   // Course edit/delete state
//   const [showEditCourseDialog, setShowEditCourseDialog] = useState(false)
//   const [showDeleteCourseDialog, setShowDeleteCourseDialog] = useState(false)
//   const [courseLoading, setCourseLoading] = useState(false)
//   const [courseForm, setCourseForm] = useState({
//     title: "",
//     description: ""
//   })
  
//   const router = useRouter()

//   useEffect(() => {
//     const handleContextMenu = (event: MouseEvent) => {
//       if ((event.target as HTMLElement).closest('iframe')) {
//         event.preventDefault()
//       }
//     }
//     document.addEventListener("contextmenu", handleContextMenu)
//     return () => document.removeEventListener("contextmenu", handleContextMenu)
//   }, [])

//   useEffect(() => {
//     const extractParams = async () => {
//       const resolvedParams = await params
//       if (!resolvedParams.id) {
//         setError("Course ID is required")
//         setLoading(false)
//         return
//       }
//       setCourseId(resolvedParams.id)
//     }
//     extractParams()
//   }, [params])

//   useEffect(() => {
//     if (courseId) {
//       loadCourseData()
//     }
//   }, [courseId])

//   const loadCourseData = async () => {
//     try {
//       setLoading(true)
      
//       const [courseRes, studentsRes, announcementsRes] = await Promise.all([
//         fetch(`/api/courses/${courseId}`),
//         fetch(`/api/courses/${courseId}/students`),
//         fetch(`/api/courses/${courseId}/announcements`)
//       ])

//       const courseData = await courseRes.json()
//       const studentsData = await studentsRes.json()
//       const announcementsData = await announcementsRes.json()

//       if (!courseData.success) {
//         throw new Error(courseData.error || 'Course not found')
//       }

//       setCourse(courseData.data)
//       setCourseForm({
//         title: courseData.data.title,
//         description: courseData.data.description || ""
//       })
//       if (studentsData.success) {
//         setStudents(studentsData.data || [])
//       }
//       if (announcementsData.success) {
//         setAnnouncements(announcementsData.data || [])
//       }

//     } catch (error) {
//       console.error('Error loading course:', error)
//       setError(error instanceof Error ? error.message : 'Failed to load course')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreateOrUpdateModule = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setModuleLoading(true)

//     try {
//       if (!moduleForm.title.trim() || !moduleForm.video_url.trim()) {
//         throw new Error("Title and video URL are required")
//       }

//       const method = editingModule ? 'PUT' : 'POST'
//       const url = editingModule 
//         ? `/api/courses/${courseId}/modules/${editingModule}`
//         : `/api/courses/${courseId}/modules`

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title: moduleForm.title.trim(),
//           description: moduleForm.description.trim(),
//           video_url: moduleForm.video_url.trim(),
//           duration_minutes: moduleForm.duration_minutes || 0
//         })
//       })

//       const result: ApiResponse<Module> = await response.json()

//       if (!result.success) {
//         throw new Error(result.error || editingModule ? 'Failed to update module' : 'Failed to create module')
//       }

//       await loadCourseData()
      
//       setModuleForm({
//         id: "",
//         title: "",
//         description: "",
//         video_url: "",
//         duration_minutes: 0
//       })
//       setEditingModule(null)
//       setShowModuleForm(false)

//     } catch (error) {
//       console.error('Module operation error:', error)
//       setError(error instanceof Error ? error.message : editingModule ? 'Failed to update module' : 'Failed to create module')
//     } finally {
//       setModuleLoading(false)
//     }
//   }

//   const handleDeleteModule = async (moduleId: string) => {
//     if (!confirm('Are you sure you want to delete this module?')) return
//     try {
//       const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
//         method: 'DELETE'
//       })
//       const result: ApiResponse = await response.json()
//       if (!result.success) {
//         throw new Error(result.error || 'Failed to delete module')
//       }
//       await loadCourseData()
//     } catch (error) {
//       console.error('Delete module error:', error)
//       setError(error instanceof Error ? error.message : 'Failed to delete module')
//     }
//   }

//   const startEditModule = (module: Module) => {
//     setEditingModule(module.id)
//     setModuleForm({
//       id: module.id,
//       title: module.title,
//       description: module.description || "",
//       video_url: module.video_url,
//       duration_minutes: module.duration_minutes
//     })
//     setShowModuleForm(true)
//   }

//   const handleCreateAnnouncement = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setAnnouncementLoading(true)

//     try {
//       if (!announcementForm.content.trim()) {
//         throw new Error("Announcement content is required")
//       }

//       const response = await fetch(`/api/courses/${courseId}/announcements`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           content: announcementForm.content.trim(),
//           course_id: courseId
//         })
//       })

//       const result: ApiResponse<Announcement> = await response.json()

//       if (!result.success) {
//         throw new Error(result.error || 'Failed to create announcement')
//       }

//       await loadCourseData()
      
//       setAnnouncementForm({ content: "" })
//       setShowAnnouncementForm(false)

//     } catch (error) {
//       console.error('Create announcement error:', error)
//       setError(error instanceof Error ? error.message : 'Failed to create announcement')
//     } finally {
//       setAnnouncementLoading(false)
//     }
//   }

//   const handleEditAnnouncement = async (announcementId: string) => {
//     try {
//       if (!editAnnouncementContent.trim()) {
//         throw new Error("Announcement content is required")
//       }

//       const response = await fetch(`/api/announcements/${announcementId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           content: editAnnouncementContent.trim()
//         })
//       })

//       const result: ApiResponse<Announcement> = await response.json()

//       if (!result.success) {
//         throw new Error(result.error || 'Failed to update announcement')
//       }

//       await loadCourseData()
      
//       setEditingAnnouncement(null)
//       setEditAnnouncementContent("")

//     } catch (error) {
//       console.error('Update announcement error:', error)
//       setError(error instanceof Error ? error.message : 'Failed to update announcement')
//     }
//   }

//   const handleDeleteAnnouncement = async (announcementId: string) => {
//     if (!confirm('Are you sure you want to delete this announcement?')) {
//       return
//     }

//     try {
//       const response = await fetch(`/api/announcements/${announcementId}`, {
//         method: 'DELETE'
//       })

//       const result: ApiResponse = await response.json()

//       if (!result.success) {
//         throw new Error(result.error || 'Failed to delete announcement')
//       }

//       await loadCourseData()

//     } catch (error) {
//       console.error('Delete announcement error:', error)
//       setError(error instanceof Error ? error.message : 'Failed to delete announcement')
//     }
//   }

//   const startEditAnnouncement = (announcement: AnnouncementWithAuthor) => {
//     setEditingAnnouncement(announcement.id)
//     setEditAnnouncementContent(announcement.content)
//   }

//   const cancelEditAnnouncement = () => {
//     setEditingAnnouncement(null)
//     setEditAnnouncementContent("")
//   }

//   const handleUpdateCourse = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setCourseLoading(true)
//     try {
//       if (!courseForm.title.trim()) {
//         throw new Error("Course title is required")
//       }

//       const response = await fetch(`/api/courses/${courseId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           title: courseForm.title.trim(),
//           description: courseForm.description.trim()
//         })
//       })

//       const result: ApiResponse<Course> = await response.json()
//       if (!result.success) {
//         throw new Error(result.error || 'Failed to update course')
//       }

//       await loadCourseData()
//       setShowEditCourseDialog(false)
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to update course')
//     } finally {
//       setCourseLoading(false)
//     }
//   }

//   const handleDeleteCourse = async () => {
//     setCourseLoading(true)
//     try {
//       const response = await fetch(`/api/courses/${courseId}`, {
//         method: 'DELETE'
//       })
//       const result: ApiResponse = await response.json()
//       if (!result.success) {
//         throw new Error(result.error || 'Failed to delete course')
//       }
//       router.push('/admin')
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to delete course')
//     } finally {
//       setCourseLoading(false)
//     }
//   }

//   const handleDownloadCSV = () => {
//     if (students.length === 0) return
//     const csvContent = utils.generateCSV(students, course?.title || 'Course')
//     utils.downloadCSV(csvContent, `${course?.title || 'course'}-students.csv`)
//   }

//   const getYouTubeEmbedUrl = (url: string) => {
//     const videoId = utils.extractYouTubeVideoId(url)
//     return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   if (!courseId) {
//     return <LoadingSpinner message="Loading course..." />
//   }

//   if (loading) {
//     return <LoadingSpinner message="Loading course..." />
//   }

//   if (error || !course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center space-y-6">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-md">
//             <div className="w-10 h-10 border-4 border-[#DB1B28] rounded-full flex items-center justify-center animate-pulse">
//               <div className="w-4 h-4 bg-[#DB1B28] rounded-full"></div>
//             </div>
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-3">Something went wrong</h3>
//             <p className="text-[#DB1B28] mb-6 text-lg">{error || 'Course not found'}</p>
//             <Link href="/admin">
//               <Button className="bg-[#4A73D1] text-white px-6 py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200">
//                 Back to Dashboard
//                 <ArrowRight className="ml-2 h-5 w-5" />
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
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Link href="/admin">
//                 <Button 
//                   variant="ghost" 
//                   className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 transition-all duration-200 rounded-lg"
//                 >
//                   <ArrowLeft className="h-5 w-5 mr-2" />
//                   Back to Dashboard
//                 </Button>
//               </Link>
//               <div className="h-6 w-px bg-gray-200"></div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
//                 <p className="text-sm text-gray-600">Course Management</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <Button 
//                 onClick={() => setShowEditCourseDialog(true)}
//                 variant="outline" 
//                 className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
//               >
//                 <Edit className="h-4 w-4 mr-2" />
//                 Edit Course
//               </Button>
//               <Button 
//                 onClick={handleDownloadCSV}
//                 variant="outline" 
//                 className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
//                 disabled={students.length === 0}
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Export Analytics
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-center">
//             <AlertTriangle className="h-5 w-5 mr-2" />
//             {error}
//           </div>
//         )}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
//           <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
//             <TabsTrigger 
//               value="overview" 
//               className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200"
//             >
//               <BarChart3 className="h-4 w-4 mr-2" />
//               Overview
//             </TabsTrigger>
//             <TabsTrigger 
//               value="modules"
//               className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200"
//             >
//               <BookOpen className="h-4 w-4 mr-2" />
//               Modules ({course.modules?.length || 0})
//             </TabsTrigger>
//             <TabsTrigger 
//               value="announcements"
//               className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200"
//             >
//               <Megaphone className="h-4 w-4 mr-2" />
//               Announcements ({announcements.length})
//             </TabsTrigger>
//             <TabsTrigger 
//               value="students"
//               className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200"
//             >
//               <Users className="h-4 w-4 mr-2" />
//               Students ({students.length})
//             </TabsTrigger>
//           </TabsList>

//           {/* Overview Tab */}
//           <TabsContent value="overview" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//               <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-1">Total Modules</p>
//                       <p className="text-2xl font-bold text-gray-900">{course.modules?.length || 0}</p>
//                     </div>
//                     <BookOpen className="h-8 w-8 text-[#4A73D1]" />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-1">Announcements</p>
//                       <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
//                     </div>
//                     <Megaphone className="h-8 w-8 text-[#4A73D1]" />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-1">Enrolled Students</p>
//                       <p className="text-2xl font-bold text-gray-900">{students.length}</p>
//                     </div>
//                     <Users className="h-8 w-8 text-[#4A73D1]" />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600 mb-1">Avg Progress</p>
//                       <p className="text-2xl font-bold text-gray-900">
//                         {students.length > 0 
//                           ? Math.round(students.reduce((sum, s) => sum + s.progress_percentage, 0) / students.length)
//                           : 0
//                         }%
//                       </p>
//                     </div>
//                     <BarChart3 className="h-8 w-8 text-[#4A73D1]" />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
//               <CardHeader>
//                 <CardTitle className="text-xl font-bold text-gray-900">Course Information</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <Label className="text-sm font-semibold text-gray-600">Description</Label>
//                   <p className="text-gray-600 text-base leading-relaxed mt-1">
//                     {course.description || 'No description provided'}
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-semibold text-gray-600">Created</Label>
//                   <p className="text-gray-600 text-base mt-1">
//                     {new Date(course.created_at).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Modules Tab */}
//           <TabsContent value="modules" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">Course Modules</h3>
//                 <p className="text-gray-600 text-base leading-relaxed">Manage video modules for this course</p>
//               </div>
//               <Dialog open={showModuleForm} onOpenChange={(open) => {
//                 setShowModuleForm(open)
//                 if (!open) {
//                   setModuleForm({
//                     id: "",
//                     title: "",
//                     description: "",
//                     video_url: "",
//                     duration_minutes: 0
//                   })
//                   setEditingModule(null)
//                 }
//               }}>
//                 <DialogTrigger asChild>
//                   <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Module
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl">
//                   <form onSubmit={handleCreateOrUpdateModule}>
//                     <DialogHeader>
//                       <DialogTitle>{editingModule ? 'Edit Module' : 'Add New Module'}</DialogTitle>
//                       <DialogDescription>
//                         {editingModule ? 'Update the module details' : 'Create a new video module for this course'}
//                       </DialogDescription>
//                     </DialogHeader>
                    
//                     <div className="space-y-6 py-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="module-title" className="text-sm font-medium text-gray-600">Module Title *</Label>
//                         <Input
//                           id="module-title"
//                           value={moduleForm.title}
//                           onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
//                           placeholder="e.g., Introduction to HTML"
//                           className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
//                           required
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label htmlFor="module-description" className="text-sm font-medium text-gray-600">Description</Label>
//                         <Textarea
//                           id="module-description"
//                           value={moduleForm.description}
//                           onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
//                           placeholder="Describe what this module covers..."
//                           rows={4}
//                           className="bg-white border-gray-200 min-h-[120px] rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label htmlFor="video-url" className="text-sm font-medium text-gray-600">YouTube Video URL *</Label>
//                         <Input
//                           id="video-url"
//                           value={moduleForm.video_url}
//                           onChange={(e) => setModuleForm(prev => ({ ...prev, video_url: e.target.value }))}
//                           placeholder="https://www.youtube.com/watch?v=..."
//                           className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
//                           required
//                         />
//                         <p className="text-xs text-gray-600">
//                           YouTube, YouTube Shorts, or YouTube embed URLs are supported
//                         </p>
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label htmlFor="duration" className="text-sm font-medium text-gray-600">Duration (minutes)</Label>
//                         <Input
//                           id="duration"
//                           type="number"
//                           value={moduleForm.duration_minutes}
//                           onChange={(e) => setModuleForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
//                           placeholder="e.g., 15"
//                           min="0"
//                           className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
//                         />
//                       </div>
//                     </div>

//                     <DialogFooter>
//                       <Button 
//                         type="button" 
//                         variant="outline" 
//                         onClick={() => setShowModuleForm(false)}
//                         disabled={moduleLoading}
//                         className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
//                       >
//                         Cancel
//                       </Button>
//                       <Button 
//                         type="submit" 
//                         disabled={moduleLoading || !moduleForm.title.trim() || !moduleForm.video_url.trim()}
//                         className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg"
//                       >
//                         {moduleLoading ? (
//                           <>
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                             {editingModule ? 'Updating...' : 'Creating...'}
//                           </>
//                         ) : (
//                           <>
//                             <Plus className="h-4 w-4 mr-2" />
//                             {editingModule ? 'Update Module' : 'Add Module'}
//                           </>
//                         )}
//                       </Button>
//                     </DialogFooter>
//                   </form>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             {course.modules && course.modules.length > 0 ? (
//               <div className="space-y-4">
//                 {course.modules
//                   .sort((a, b) => a.order_index - b.order_index)
//                   .map((module, index) => {
//                     const embedUrl = getYouTubeEmbedUrl(module.video_url)
//                     return (
//                       <Card key={module.id} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-xl transition-all duration-300 group">
//                         <CardContent className="p-6">
//                           <div className="flex items-start space-x-4">
//                             <div className="flex items-center space-x-3">
//                               <div className="w-10 h-10 bg-[#4A73D1] text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-all duration-200">
//                                 {index + 1}
//                               </div>
//                               <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
//                             </div>
                            
//                             <div className="flex-1 space-y-3">
//                               <div className="flex items-start justify-between">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900 text-lg group-hover:text-[#4A73D1] transition-colors">{module.title}</h4>
//                                   {module.description && (
//                                     <p className="text-gray-600 text-base leading-relaxed mt-1">{module.description}</p>
//                                   )}
//                                   <div className="flex items-center space-x-4 mt-2">
//                                     <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium">
//                                       {module.duration_minutes > 0 ? `${module.duration_minutes} min` : 'Duration not set'}
//                                     </Badge>
//                                   </div>
//                                 </div>
                                
//                                 <div className="flex items-center space-x-2">
//                                   <Button 
//                                     variant="ghost" 
//                                     onClick={() => startEditModule(module)}
//                                     className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg transition-all duration-200"
//                                   >
//                                     <Edit className="h-4 w-4" />
//                                   </Button>
//                                   <Button 
//                                     variant="ghost" 
//                                     onClick={() => handleDeleteModule(module.id)}
//                                     className="text-[#DB1B28] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
                              
//                               {embedUrl && (
//                                 <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
//                                   <div className="aspect-video bg-black rounded-lg overflow-hidden">
//                                     <iframe
//                                       src={embedUrl}
//                                       title={module.title}
//                                       className="w-full h-full"
//                                       allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; screen-wake-lock"
//                                       allowFullScreen
//                                       referrerPolicy="strict-origin-when-cross-origin"
//                                       loading="lazy"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     )
//                   })}
//               </div>
//             ) : (
//               <Card className="bg-white border-gray-100 shadow-md rounded-xl">
//                 <CardContent className="p-12 text-center">
//                   <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 mb-3">No modules yet</h3>
//                   <p className="text-gray-600 mb-6 text-base leading-relaxed">
//                     Start by adding video modules to your course. Students will see modules in the order you create them.
//                   </p>
//                   <Button onClick={() => setShowModuleForm(true)} className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Your First Module
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           {/* Announcements Tab */}
//           <TabsContent value="announcements" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">Course Announcements</h3>
//                 <p className="text-gray-600 text-base leading-relaxed">Share important updates with your students</p>
//               </div>
//               <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
//                 <DialogTrigger asChild>
//                   <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
//                     <Plus className="h-4 w-4 mr-2" />
//                     New Announcement
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-2xl">
//                   <form onSubmit={handleCreateAnnouncement}>
//                     <DialogHeader>
//                       <DialogTitle>Create New Announcement</DialogTitle>
//                       <DialogDescription>
//                         Share an important update or message with all students enrolled in this course
//                       </DialogDescription>
//                     </DialogHeader>
                    
//                     <div className="space-y-6 py-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="announcement-content" className="text-sm font-medium text-gray-600">Announcement Content *</Label>
//                         <Textarea
//                           id="announcement-content"
//                           value={announcementForm.content}
//                           onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
//                           placeholder="Enter your announcement message here..."
//                           rows={8}
//                           className="bg-white border-gray-200 min-h-[200px] rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
//                           required
//                         />
//                         <p className="text-xs text-gray-600">
//                           This message will be visible to all students enrolled in this course
//                         </p>
//                       </div>
//                     </div>

//                     <DialogFooter>
//                       <Button 
//                         type="button" 
//                         variant="outline" 
//                         onClick={() => setShowAnnouncementForm(false)}
//                         disabled={announcementLoading}
//                         className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
//                       >
//                         Cancel
//                       </Button>
//                       <Button 
//                         type="submit" 
//                         disabled={announcementLoading || !announcementForm.content.trim()}
//                         className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg"
//                       >
//                         {announcementLoading ? (
//                           <>
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                             Publishing...
//                           </>
//                         ) : (
//                           <>
//                             <Megaphone className="h-4 w-4 mr-2" />
//                             Publish Announcement
//                           </>
//                         )}
//                       </Button>
//                     </DialogFooter>
//                   </form>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             {announcements.length > 0 ? (
//               <div className="space-y-4">
//                 {announcements.map((announcement) => (
//                   <Card key={announcement.id} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-xl transition-all duration-300 group">
//                     <CardContent className="p-6">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-[#4A73D1] to-[#DB1B28] text-white rounded-full flex items-center justify-center group-hover:scale-105 transition-all duration-200">
//                             <Megaphone className="h-5 w-5" />
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-gray-600">
//                               By {announcement.author.name} • {formatDate(announcement.created_at)}
//                             </p>
//                             {announcement.updated_at !== announcement.created_at && (
//                               <p className="text-xs text-gray-500">
//                                 Updated {formatDate(announcement.updated_at)}
//                               </p>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-2">
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             onClick={() => startEditAnnouncement(announcement)}
//                             className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg transition-all duration-200"
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             onClick={() => handleDeleteAnnouncement(announcement.id)}
//                             className="text-[#DB1B28] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
                      
//                       {editingAnnouncement === announcement.id ? (
//                         <div className="space-y-3">
//                           <Textarea
//                             value={editAnnouncementContent}
//                             onChange={(e) => setEditAnnouncementContent(e.target.value)}
//                             className="bg-white border-gray-200 min-h-[120px] rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
//                             rows={6}
//                           />
//                           <div className="flex items-center space-x-2">
//                             <Button 
//                               size="sm"
//                               onClick={() => handleEditAnnouncement(announcement.id)}
//                               disabled={!editAnnouncementContent.trim()}
//                               className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg transition-all duration-200"
//                             >
//                               <Save className="h-4 w-4 mr-1" />
//                               Save
//                             </Button>
//                             <Button 
//                               size="sm"
//                               variant="outline"
//                               onClick={cancelEditAnnouncement}
//                               className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
//                             >
//                               <X className="h-4 w-4 mr-1" />
//                               Cancel
//                             </Button>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#4A73D1]">
//                           <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
//                             {announcement.content}
//                           </p>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <Card className="bg-white border-gray-100 shadow-md rounded-xl">
//                 <CardContent className="p-12 text-center">
//                   <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 mb-3">No announcements yet</h3>
//                   <p className="text-gray-600 mb-6 text-base leading-relaxed">
//                     Keep your students informed by creating announcements about course updates, deadlines, or important information.
//                   </p>
//                   <Button onClick={() => setShowAnnouncementForm(true)} className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create First Announcement
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           {/* Students Tab */}
//           <TabsContent value="students" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900">Enrolled Students</h3>
//                 <p className="text-gray-600 text-base leading-relaxed">Track student progress and manage enrollments</p>
//               </div>
//               <Link href={`/admin/courses/${courseId}/enroll`}>
//                 <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Enroll Students
//                 </Button>
//               </Link>
//             </div>

//             {students.length > 0 ? (
//               <div className="space-y-4">
//                 {students.map((student) => (
//                   <Card key={student.id} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-xl transition-all duration-300 group">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                           <div className="w-10 h-10 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-semibold group-hover:scale-105 transition-all duration-200">
//                             {student.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <h4 className="font-semibold text-gray-900 group-hover:text-[#4A73D1] transition-colors">{student.name}</h4>
//                             <p className="text-sm text-gray-600">{student.email}</p>
//                           </div>
//                         </div>
                        
//                         <div className="text-right space-y-2">
//                           <div className="flex items-center space-x-2">
//                             <Badge 
//                               className={`text-xs font-medium ${student.progress_percentage === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-[#4A73D1]'}`}
//                             >
//                               {student.progress_percentage}% Complete
//                             </Badge>
//                           </div>
//                           <div className="w-32 bg-gray-100 rounded-full h-2.5 border border-gray-200 group-hover:border-[#4A73D1] transition-all duration-300">
//                             <div 
//                               className={`h-2.5 rounded-full transition-all duration-300 ${student.progress_percentage > 0 ? 'bg-gradient-to-r from-[#4A73D1] to-[#DB1B28]' : 'bg-transparent'}`}
//                               style={{ width: `${Math.min(student.progress_percentage, 100)}%` }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <Card className="bg-white border-gray-100 shadow-md rounded-xl">
//                 <CardContent className="p-12 text-center">
//                   <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 mb-3">No students enrolled</h3>
//                   <p className="text-gray-600 mb-6 text-base leading-relaxed">
//                     Start by enrolling students in this course to track their progress.
//                   </p>
//                   <Link href={`/admin/courses/${courseId}/enroll`}>
//                     <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
//                       <Plus className="h-4 w-4 mr-2" />
//                       Enroll Students
//                     </Button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>
//         </Tabs>

//         {/* Edit Course Dialog */}
//         <Dialog open={showEditCourseDialog} onOpenChange={setShowEditCourseDialog}>
//           <DialogContent className="max-w-2xl">
//             <form onSubmit={handleUpdateCourse}>
//               <DialogHeader>
//                 <DialogTitle>Edit Course</DialogTitle>
//                 <DialogDescription>
//                   Update the course details below
//                 </DialogDescription>
//               </DialogHeader>
              
//               <div className="space-y-6 py-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="course-title" className="text-sm font-medium text-gray-600">Course Title *</Label>
//                   <Input
//                     id="course-title"
//                     value={courseForm.title}
//                     onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
//                     placeholder="Enter course title"
//                     className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="course-description" className="text-sm font-medium text-gray-600">Description</Label>
//                   <Textarea
//                     id="course-description"
//                     value={courseForm.description}
//                     onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
//                     placeholder="Enter course description..."
//                     rows={6}
//                     className="bg-white border-gray-200 min-h-[150px] rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
//                   />
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setShowEditCourseDialog(false)}
//                   disabled={courseLoading}
//                   className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   type="button" 
//                   variant="outline" 
//                   onClick={() => setShowDeleteCourseDialog(true)}
//                   disabled={courseLoading}
//                   className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete Course
//                 </Button>
//                 <Button 
//                   type="submit" 
//                   disabled={courseLoading || !courseForm.title.trim()}
//                   className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg"
//                 >
//                   {courseLoading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <Edit className="h-4 w-4 mr-2" />
//                       Update Course
//                     </>
//                   )}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* Delete Course Confirmation Dialog */}
//         <Dialog open={showDeleteCourseDialog} onOpenChange={setShowDeleteCourseDialog}>
//           <DialogContent className="max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center text-red-600">
//                 <AlertTriangle className="h-5 w-5 mr-2" />
//                 Delete Course
//               </DialogTitle>
//               <DialogDescription className="text-gray-600">
//                 This action cannot be undone. This will permanently delete the course and all associated data.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="py-4">
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                 <p className="text-red-800 text-sm font-medium mb-2">
//                   You are about to delete: <span className="font-bold">&#34;{course?.title}&#34;</span>
//                 </p>
//                 <p className="text-red-700 text-sm">
//                   This will also delete:
//                 </p>
//                 <ul className="text-red-700 text-sm mt-1 ml-4 list-disc">
//                   <li>All {course?.modules?.length || 0} modules</li>
//                   <li>All {announcements.length} announcements</li>
//                   <li>All student enrollment data</li>
//                   <li>All progress tracking data</li>
//                 </ul>
//               </div>
//             </div>

//             <DialogFooter>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setShowDeleteCourseDialog(false)}
//                 disabled={courseLoading}
//                 className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleDeleteCourse}
//                 disabled={courseLoading}
//                 className="bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all duration-200"
//               >
//                 {courseLoading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Yes, Delete Course
//                   </>
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </main>
//     </div>
//   )
// }


