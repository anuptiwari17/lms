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
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react"
import type { Course, Module, ApiResponse } from "@/types/database"
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

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [course, setCourse] = useState<CourseWithModules | null>(null)
  const [students, setStudents] = useState<StudentInCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [courseId, setCourseId] = useState<string>("")
  
  // Module form state
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    video_url: "",
    duration_minutes: 0
  })
  const [moduleLoading, setModuleLoading] = useState(false)
  
  const router = useRouter()


  useEffect(() => {
  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  document.addEventListener("contextmenu", handleContextMenu);

  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
  };
}, []);



  // Extract params on component mount
  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
    };
    extractParams();
  }, [params]);

  useEffect(() => {
    if (courseId) {
      loadCourseData()
    }
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      
      const [courseRes, studentsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/students`)
      ])

      const courseData = await courseRes.json()
      const studentsData = await studentsRes.json()

      if (!courseData.success) {
        throw new Error(courseData.error || 'Course not found')
      }

      setCourse(courseData.data)
      if (studentsData.success) {
        setStudents(studentsData.data || [])
      }

    } catch (error) {
      console.error('Error loading course:', error)
      setError(error instanceof Error ? error.message : 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    setModuleLoading(true)

    try {
      if (!moduleForm.title.trim() || !moduleForm.video_url.trim()) {
        throw new Error("Title and video URL are required")
      }

      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
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
        throw new Error(result.error || 'Failed to create module')
      }

      // Reload course data to show new module
      await loadCourseData()
      
      // Reset form
      setModuleForm({
        title: "",
        description: "",
        video_url: "",
        duration_minutes: 0
      })
      setShowModuleForm(false)

    } catch (error) {
      console.error('Create module error:', error)
      setError(error instanceof Error ? error.message : 'Failed to create module')
    } finally {
      setModuleLoading(false)
    }
  }

  const handleDownloadCSV = () => {
    if (students.length === 0) return
    
    const csvContent = utils.generateCSV(students, course?.title || 'Course')
    utils.downloadCSV(csvContent, `${course?.title || 'course'}-students.csv`)
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = utils.extractYouTubeVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  if (!courseId) {
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
            <h3 className="text-xl font-semibold text-gray-900">Loading Course</h3>
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
            <h3 className="text-xl font-semibold text-gray-900">Loading Course</h3>
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

  if (error || !course) {
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
            <p className="text-[#DB1B28] mb-6 text-lg">{error || 'Course not found'}</p>
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
              <Link href="/admin">
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 transition-all duration-200 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">Course Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
              <Button 
                onClick={handleDownloadCSV}
                variant="outline" 
                className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
                disabled={students.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Analytics
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="modules"
              className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Modules ({course.modules?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="students"
              className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Students ({students.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Modules</p>
                      <p className="text-2xl font-bold text-gray-900">{course.modules?.length || 0}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-[#4A73D1]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Enrolled Students</p>
                      <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-[#4A73D1]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Avg Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {students.length > 0 
                          ? Math.round(students.reduce((sum, s) => sum + s.progress_percentage, 0) / students.length)
                          : 0
                        }%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-[#4A73D1]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Info */}
            <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Description</Label>
                  <p className="text-gray-600 text-base leading-relaxed mt-1">
                    {course.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Created</Label>
                  <p className="text-gray-600 text-base mt-1">
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
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Course Modules</h3>
                <p className="text-gray-600 text-base leading-relaxed">Manage video modules for this course</p>
              </div>
              <Dialog open={showModuleForm} onOpenChange={setShowModuleForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <form onSubmit={handleCreateModule}>
                    <DialogHeader>
                      <DialogTitle>Add New Module</DialogTitle>
                      <DialogDescription>
                        Create a new video module for this course
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="module-title" className="text-sm font-medium text-gray-600">Module Title *</Label>
                        <Input
                          id="module-title"
                          value={moduleForm.title}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Introduction to HTML"
                          className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
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
                          className="bg-white border-gray-200 min-h-[120px] rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="video-url" className="text-sm font-medium text-gray-600">YouTube Video URL *</Label>
                        <Input
                          id="video-url"
                          value={moduleForm.video_url}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, video_url: e.target.value }))}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
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
                          className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowModuleForm(false)}
                        disabled={moduleLoading}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={moduleLoading || !moduleForm.title.trim() || !moduleForm.video_url.trim()}
                        className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg"
                      >
                        {moduleLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Module
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Modules List */}
            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-4">
                {course.modules
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((module, index) => {
                    const embedUrl = getYouTubeEmbedUrl(module.video_url)+"?rel=0&modestbranding=1"
                    return (
                      <Card key={module.id} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-xl transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#4A73D1] text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-all duration-200">
                                {index + 1}
                              </div>
                              <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-lg group-hover:text-[#4A73D1] transition-colors">{module.title}</h4>
                                  {module.description && (
                                    <p className="text-gray-600 text-base leading-relaxed mt-1">{module.description}</p>
                                  )}
                                  <div className="flex items-center space-x-4 mt-2">
                                    <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium">
                                      {module.duration_minutes > 0 ? `${module.duration_minutes} min` : 'Duration not set'}
                                    </Badge>

                                    {/* {embedUrl && (
                                      <a 
                                        href={module.video_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-[#4A73D1] hover:text-[#3B5BB8] flex items-center transition-colors duration-200"
                                      >
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        View on YouTube
                                      </a>
                                    )} */}
                                    
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Button variant="ghost" className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg transition-all duration-200">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" className="text-[#DB1B28] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Video Preview */}
                              {embedUrl && (
                                <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
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
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardContent className="p-12 text-center">
                  <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No modules yet</h3>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    Start by adding video modules to your course. Students will see modules in the order you create them.
                  </p>
                  <Button onClick={() => setShowModuleForm(true)} className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Module
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Enrolled Students</h3>
                <p className="text-gray-600 text-base leading-relaxed">Track student progress and manage enrollments</p>
              </div>
              <Link href={`/admin/courses/${courseId}/enroll`}>
                <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll Students
                </Button>
              </Link>
            </div>

            {students.length > 0 ? (
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-semibold group-hover:scale-105 transition-all duration-200">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-[#4A73D1] transition-colors">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={`text-xs font-medium ${student.progress_percentage === 100 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-[#4A73D1]'}`}
                            >
                              {student.progress_percentage}% Complete
                            </Badge>
                          </div>
                          <div className="w-32 bg-gray-100 rounded-full h-2.5 border border-gray-200 group-hover:border-[#4A73D1] transition-all duration-300">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-300 ${student.progress_percentage > 0 ? 'bg-gradient-to-r from-[#4A73D1] to-[#DB1B28]' : 'bg-transparent'}`}
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
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No students enrolled</h3>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    Start by enrolling students in this course to track their progress.
                  </p>
                  <Link href={`/admin/courses/${courseId}/enroll`}>
                    <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Enroll Students
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}