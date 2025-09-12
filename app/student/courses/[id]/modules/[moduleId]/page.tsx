"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Play,
  ExternalLink,
  SkipForward,
  SkipBack,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Clock
} from "lucide-react"
import { utils } from "@/lib/database"
import type { Module, Course } from "@/types/database"

interface ModuleWithProgress extends Module {
  completed: boolean
  completed_at: string | null
}

interface CourseData extends Course {
  modules: ModuleWithProgress[]
  enrollment: {
    progress_percentage: number
    enrolled_at: string
    completed_at: string | null
  }
}

export default function ModulePlayerPage({ 
  params 
}: { 
  params: Promise<{ id: string; moduleId: string }> 
}) {
  const [course, setCourse] = useState<CourseData | null>(null)
  const [currentModule, setCurrentModule] = useState<ModuleWithProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [error, setError] = useState("")
  const [courseId, setCourseId] = useState<string>("")
  const [moduleId, setModuleId] = useState<string>("")
  
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
      setModuleId(resolvedParams.moduleId);
    };
    extractParams();
  }, [params]);

  useEffect(() => {
    if (courseId && moduleId) {
      loadData()
    }
  }, [courseId, moduleId])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/student/courses/${courseId}`, {
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load course')
      }
      
      setCourse(result.data)
      
      // Find current module
      const currentModule = result.data.modules.find((m: ModuleWithProgress) => m.id === moduleId)
      if (currentModule) {
        setCurrentModule(currentModule)
      } else {
        throw new Error('Module not found')
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load module')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async (completed: boolean) => {
    if (!currentModule) return
    
    setMarkingComplete(true)
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          moduleId: currentModule.id,
          completed
        })
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update progress')
      }

      // Reload data
      await loadData()
      
    } catch (error) {
      console.error('Error updating progress:', error)
      setError('Failed to update progress')
    } finally {
      setMarkingComplete(false)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = utils.extractYouTubeVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : null
  }

  const getAdjacentModules = () => {
    if (!course || !currentModule) return { prev: null, next: null }
    
    const sortedModules = course.modules
      .filter(m => m.is_active)
      .sort((a, b) => a.order_index - b.order_index)
    
    const currentIndex = sortedModules.findIndex(m => m.id === currentModule.id)
    
    return {
      prev: currentIndex > 0 ? sortedModules[currentIndex - 1] : null,
      next: currentIndex < sortedModules.length - 1 ? sortedModules[currentIndex + 1] : null
    }
  }

  if (!courseId || !moduleId) {
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
            <h3 className="text-xl font-semibold text-gray-900">Loading Module</h3>
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
            <h3 className="text-xl font-semibold text-gray-900">Loading Module</h3>
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

  if (error || !course || !currentModule) {
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
            <p className="text-[#DB1B28] mb-6 text-lg">{error || 'Module not found'}</p>
            <Link href="/student">
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

  const embedUrl = getYouTubeEmbedUrl(currentModule.video_url)
  const { prev, next } = getAdjacentModules()
  const completedModules = course.modules.filter(m => m.completed).length

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0">
              <Link href={`/student/courses/${courseId}`}>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-[#4A73D1] hover:bg-blue-50 transition-all duration-200 rounded-lg shrink-0"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200 shrink-0"></div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">{currentModule.title}</h1>
                <p className="text-sm text-gray-600 truncate">{course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 shrink-0">
              <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium">
                Module {course.modules.findIndex(m => m.id === currentModule.id) + 1} of {course.modules.length}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats (Inspired by reference image) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-[#4A73D1]">{currentModule.duration_minutes || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Minutes</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-[#4A73D1]">{currentModule.completed ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-[#4A73D1]">{course.enrollment.progress_percentage}%</p>
                  <p className="text-sm text-gray-600">Course Progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Video */}
            {embedUrl ? (
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                <iframe
                  src={embedUrl}
                  title={currentModule.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; screen-wake-lock"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                />
              </div>
            ) : (
              <Card className="bg-white border-gray-100 shadow-md rounded-xl">
                <CardContent className="p-12 text-center">
                  <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Video not available</h3>
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">The video URL appears to be invalid.</p>
                  <a 
                    href={currentModule.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#4A73D1] hover:text-[#3B5BB8] transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Original Link
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Module Info */}
            <Card className="bg-white border-gray-100 shadow-md rounded-xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">{currentModule.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      {currentModule.duration_minutes > 0 && (
                        <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium">
                          {currentModule.duration_minutes} min
                        </Badge>
                      )}
                      {currentModule.completed && (
                        <Badge className="bg-green-100 text-green-800 text-xs font-medium">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleMarkComplete(!currentModule.completed)}
                    disabled={markingComplete}
                    className={`rounded-lg transition-all duration-200 ${
                      currentModule.completed 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8]'
                    }`}
                    variant={currentModule.completed ? "default" : "outline"}
                  >
                    {markingComplete ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : currentModule.completed ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {currentModule.completed ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              </CardHeader>
              
              {currentModule.description && (
                <CardContent>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {currentModule.description}
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              {prev ? (
                <Link href={`/student/courses/${courseId}/modules/${prev.id}`}>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-[#4A73D1] hover:bg-blue-50 hover:text-[#3B5BB8] rounded-lg transition-all duration-200"
                  >
                    <SkipBack className="h-4 w-4 mr-2" />
                    Previous : {prev.title}
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              
              {next ? (
                <Link href={`/student/courses/${courseId}/modules/${next.id}`}>
                  <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
                    Next Module : {next.title}
                    <SkipForward className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/student/courses/${courseId}`}>
                  <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Back to Course
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar (Sticky on desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Course Progress */}
            <Card className="bg-white border-gray-100 shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4A73D1]">
                    {course.enrollment.progress_percentage}%
                  </p>
                  <p className="text-sm text-gray-600">
                    {completedModules} of {course.modules.length} modules
                  </p>
                </div>
                
                <Progress 
                  value={course.enrollment.progress_percentage} 
                  className="h-2 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-[#4A73D1] [&>div]:to-[#DB1B28]" 
                />
              </CardContent>
            </Card>

            {/* Module List (Scrollable if many) */}
            <Card className="bg-white border-gray-100 shadow-md rounded-xl max-h-[60vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900">Modules</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {course.modules
                    .filter(m => m.is_active)
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((module, index) => (
                      <Link 
                        key={module.id} 
                        href={`/student/courses/${courseId}/modules/${module.id}`}
                        className={`block p-4 hover:bg-blue-50 transition-all duration-200 ${
                          module.id === currentModule.id ? 'bg-blue-50 border-r-4 border-[#4A73D1]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              module.completed 
                                ? 'bg-green-600 text-white' 
                                : module.id === currentModule.id
                                  ? 'bg-[#4A73D1] text-white'
                                  : 'bg-gray-200 text-gray-600'
                            } transition-all duration-200 group-hover:scale-105`}>
                              {module.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <p className={`text-sm font-medium truncate ${
                              module.id === currentModule.id 
                                ? 'text-[#4A73D1]' 
                                : 'text-gray-900'
                            }`}>
                              {module.title}
                            </p>
                          </div>
                          
                          {module.duration_minutes > 0 && (
                            <Badge className="bg-blue-100 text-[#4A73D1] text-xs font-medium">
                              {module.duration_minutes} min
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
