"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Award,
  ExternalLink,
  SkipForward,
  SkipBack,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  Megaphone,
  Calendar
} from "lucide-react"
import { utils } from "@/lib/database"
import type { Course, Module, AnnouncementWithAuthor } from "@/types/database"

interface ModuleWithProgress extends Module {
  completed: boolean
  completed_at: string | null
}

interface StudentCourseData extends Course {
  modules: ModuleWithProgress[]
  enrollment: {
    progress_percentage: number
    enrolled_at: string
    completed_at: string | null
  }
}

export default function StudentCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [course, setCourse] = useState<StudentCourseData | null>(null)
  const [announcements, setAnnouncements] = useState<AnnouncementWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingModuleId, setProcessingModuleId] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  // Prevent context menu (right-click)
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Extract params
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
      
      const [courseResponse, announcementsResponse] = await Promise.all([
        fetch(`/api/student/courses/${courseId}`, {
          credentials: 'include'
        }),
        fetch(`/api/courses/${courseId}/announcements`, {
          credentials: 'include'
        })
      ])
      
      const courseResult = await courseResponse.json()
      const announcementsResult = await announcementsResponse.json()
      
      if (!courseResult.success) {
        throw new Error(courseResult.error || 'Failed to load course')
      }
      
      setCourse(courseResult.data)
      
      if (announcementsResult.success) {
        setAnnouncements(announcementsResult.data || [])
      }
      
    } catch (error) {
      console.error('Error loading course:', error)
      setError(error instanceof Error ? error.message : 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async (moduleId: string, completed: boolean) => {
    setProcessingModuleId(moduleId)
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          moduleId,
          completed
        })
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update progress')
      }

      // Reload course data
      await loadCourseData()
      
    } catch (error) {
      console.error('Error updating progress:', error)
    } finally {
      setProcessingModuleId(null)
    }
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

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-[#4A73D1] border-r-[#DB1B28] rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#4A73D1]" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Loading Course</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm sm:text-base text-gray-600">Preparing content</span>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-gray-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-transparent border-t-[#4A73D1] border-r-[#DB1B28] rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#4A73D1]" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Loading Course</h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm sm:text-base text-gray-600">Preparing content</span>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-md">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#DB1B28] rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#DB1B28] rounded-full"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Something went wrong</h3>
            <p className="text-[#DB1B28] mb-6 text-sm sm:text-lg">{error || 'Course not found'}</p>
            <Link href="/student">
              <Button className="bg-[#4A73D1] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                Back to Dashboard
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const completedModules = course.modules.filter(m => m.completed).length
  const totalModules = course.modules.length
  const nextModule = course.modules.find(m => !m.completed)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile-First Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          {/* Mobile Layout */}
          <div className="flex items-center sm:hidden">
            {/* Left: Back button */}
            <Link href="/student">
              <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 rounded-lg">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Center: Course title - with flex-1 to use available space */}
            <div className="flex-1 mx-3 min-w-0">
              <h1 className="text-base font-bold text-gray-900 truncate">{course.title}</h1>
              <p className="text-xs text-gray-600 truncate">Course Progress</p>
            </div>
            
            {/* Right: Progress badge */}
            <Badge 
              className={`text-xs font-medium flex-shrink-0 ${course.enrollment.completed_at ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-[#4A73D1]'}`}
            >
              {course.enrollment.progress_percentage}%
            </Badge>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex sm:items-center sm:justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Link href="/student">
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
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">Course Progress</p>
              </div>
            </div>
            
            <Badge 
              className={`text-xs font-medium ${course.enrollment.completed_at ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-[#4A73D1]'}`}
            >
              {course.enrollment.progress_percentage}% Complete
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-10 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-8">
          {/* Mobile-First Tab Navigation */}
          <div className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200 text-xs sm:text-sm px-2 py-2"
              >
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="modules"
                className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200 text-xs sm:text-sm px-2 py-2"
              >
                <Play className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Modules</span>
                <span className="ml-1 text-xs">({totalModules})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="announcements"
                className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium rounded-lg transition-all duration-200 text-xs sm:text-sm px-2 py-2"
              >
                <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">News</span>
                <span className="ml-1 text-xs">({announcements.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Stats - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl">
                <CardContent className="p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-[#4A73D1]">{totalModules}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Modules</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl">
                <CardContent className="p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-green-600">{completedModules}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Done</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl">
                <CardContent className="p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-[#4A73D1]">{course.enrollment.progress_percentage}%</p>
                  <p className="text-xs sm:text-sm text-gray-600">Progress</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-100 shadow-md rounded-lg sm:rounded-xl">
                <CardContent className="p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-3xl font-bold text-orange-600">{announcements.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">News</p>
                </CardContent>
              </Card>
            </div>

            {/* Course Overview */}
            <Card className="bg-white border-gray-100 shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Course Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {course.description || 'No description available for this course.'}
                </p>
                
                <Progress 
                  value={course.enrollment.progress_percentage} 
                  className="h-2 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-[#4A73D1] [&>div]:to-[#DB1B28]" 
                />
              </CardContent>
            </Card>

            {/* Next Module Suggestion */}
            {nextModule && !course.enrollment.completed_at && (
              <Card className="bg-blue-50 border-blue-100 shadow-md rounded-xl">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Next Module</h3>
                    <p className="text-[#4A73D1] text-sm truncate">{nextModule.title}</p>
                  </div>
                  <Link href={`/student/courses/${courseId}/modules/${nextModule.id}`}>
                    <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg w-full sm:w-auto">
                      <span className="sm:hidden">Start</span>
                      <span className="hidden sm:inline">Start Now</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Recent Announcements Preview */}
            {announcements.length > 0 && (
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Recent News</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveTab('announcements')}
                      className="text-[#4A73D1] hover:bg-blue-50 text-xs sm:text-sm"
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {announcements.slice(0, 2).map((announcement) => (
                    <div key={announcement.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-[#4A73D1]">
                      <div className="flex items-center space-x-2 mb-1">
                        <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 text-[#4A73D1]" />
                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                          {announcement.author.name} • {formatDate(announcement.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-800 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {announcement.content}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {course.modules
                .sort((a, b) => a.order_index - b.order_index)
                .map((module, index) => {
                  const embedUrl = getYouTubeEmbedUrl(module.video_url)
                  const isProcessing = processingModuleId === module.id
                  
                  return (
                    <Card 
                      key={module.id} 
                      className={`bg-white border-gray-100 shadow-md rounded-xl hover:shadow-xl transition-all duration-200 ${
                        module.completed ? 'border-green-100' : ''
                      }`}
                    >
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2">{module.title}</CardTitle>
                            {module.description && (
                              <CardDescription className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{module.description}</CardDescription>
                            )}
                          </div>
                          <Badge className="bg-blue-100 text-[#4A73D1] text-xs flex-shrink-0">
                            {module.duration_minutes > 0 ? `${module.duration_minutes}m` : 'N/A'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 sm:space-y-4">
                          {embedUrl && (
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <iframe
                                src={embedUrl}
                                title={module.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; screen-wake-lock"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center">
                            <Button
                              onClick={() => handleMarkComplete(module.id, !module.completed)}
                              disabled={isProcessing}
                              variant={module.completed ? "default" : "outline"}
                              size="sm"
                              className={`${module.completed 
                                ? "bg-green-600 text-white hover:bg-green-700" 
                                : "border-[#4A73D1] text-[#4A73D1] hover:bg-blue-50"
                              } w-full sm:w-auto`}
                            >
                              {isProcessing ? 'Processing...' : module.completed ? 'Completed' : 'Mark Complete'}
                            </Button>
                            <Link href={`/student/courses/${courseId}/modules/${module.id}`}>
                              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
                                Watch
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 text-[#4A73D1]" />
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Course News</h3>
                <p className="text-gray-600 text-sm sm:text-base">Important updates from your instructor</p>
              </div>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#4A73D1] to-[#DB1B28] text-white rounded-full flex items-center justify-center flex-shrink-0">
                          <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">{announcement.author.name}</p>
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{formatDate(announcement.created_at)}</span>
                            {announcement.updated_at !== announcement.created_at && (
                              <span className="text-xs text-gray-500">
                                (Updated)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-[#4A73D1]">
                        <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardContent className="p-6 sm:p-12 text-center">
                  <Megaphone className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">No announcements yet</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                    Your instructor hasn&#39;t posted any announcements for this course yet. Check back later for important updates and information.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}