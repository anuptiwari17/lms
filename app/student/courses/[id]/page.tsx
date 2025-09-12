"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Users
} from "lucide-react"
import { utils } from "@/lib/database"
import type { Course, Module } from "@/types/database"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingModuleId, setProcessingModuleId] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<string>("")
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
      
      const response = await fetch(`/api/student/courses/${courseId}`, {
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to load course')
      }
      
      setCourse(result.data)
      
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

  const completedModules = course.modules.filter(m => m.completed).length
  const totalModules = course.modules.length
  const nextModule = course.modules.find(m => !m.completed)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">Course Progress</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                className={`text-xs font-medium ${course.enrollment.completed_at ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-[#4A73D1]'}`}
              >
                {course.enrollment.progress_percentage}% Complete
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats (Inspired by reference image) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-gray-100 shadow-md rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#4A73D1]">{totalModules}</p>
              <p className="text-sm text-gray-600">Modules</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-100 shadow-md rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#4A73D1]">{completedModules}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-100 shadow-md rounded-xl">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#4A73D1]">{course.enrollment.progress_percentage}%</p>
              <p className="text-sm text-gray-600">Progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Overview */}
        <Card className="bg-white border-gray-100 shadow-md rounded-xl mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Course Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-base leading-relaxed">
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
          <Card className="bg-blue-50 border-blue-100 shadow-md rounded-xl mb-8">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Next Module</h3>
                <p className="text-[#4A73D1] text-sm">{nextModule.title}</p>
              </div>
              <Link href={`/student/courses/${courseId}/modules/${nextModule.id}`}>
                <Button className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] rounded-lg">
                  Start Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">{module.title}</CardTitle>
                        {module.description && (
                          <CardDescription className="text-gray-600 text-sm mt-1 line-clamp-2">{module.description}</CardDescription>
                        )}
                      </div>
                      <Badge className="bg-blue-100 text-[#4A73D1] text-xs">
                        {module.duration_minutes > 0 ? `${module.duration_minutes} min` : 'N/A'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                      <div className="flex justify-between items-center">
                        <Button
                          onClick={() => handleMarkComplete(module.id, !module.completed)}
                          disabled={isProcessing}
                          variant={module.completed ? "default" : "outline"}
                          className={module.completed 
                            ? "bg-green-600 text-white hover:bg-green-700" 
                            : "border-[#4A73D1] text-[#4A73D1] hover:bg-blue-50"
                          }
                        >
                          {isProcessing ? 'Processing...' : module.completed ? 'Completed' : 'Mark Complete'}
                        </Button>
                        <Link href={`/student/courses/${courseId}/modules/${module.id}`}>
                          <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
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
      </main>
    </div>
  )
}