"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  CheckCircle, 
  Award,
  ExternalLink,
  MessageSquare
} from "lucide-react"
import { utils } from "@/lib/database"
import type { Course, Module, Announcement } from "@/types/database"

interface ModuleWithProgress extends Module {
  completed: boolean
  completed_at: string | null
  file_url?: string
}

interface StudentCourseData extends Course {
  modules: ModuleWithProgress[]
  enrollment: {
    progress_percentage: number
    enrolled_at: string
    completed_at: string | null
  }
}

interface AnnouncementWithName extends Announcement {
  created_by_name: string
}

export default function StudentCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [course, setCourse] = useState<StudentCourseData | null>(null)
  const [announcements, setAnnouncements] = useState<AnnouncementWithName[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processingModuleId, setProcessingModuleId] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<string>("")
  const router = useRouter()

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
      
      const [courseRes, announcementsRes] = await Promise.all([
        fetch(`/api/student/courses/${courseId}`, { credentials: 'include' }),
        fetch(`/api/courses/${courseId}/announcements`, { credentials: 'include' })
      ])
      
      const courseResult = await courseRes.json()
      const announcementsResult = await announcementsRes.json()
      
      if (!courseResult.success) {
        throw new Error(courseResult.error || 'Failed to load course')
      }
      
      if (!announcementsResult.success) {
        throw new Error(announcementsResult.error || 'Failed to load announcements')
      }
      
      setCourse(courseResult.data)
      setAnnouncements(announcementsResult.data || [])
      
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

      // Reload course data to get updated progress
      await loadCourseData()
      
    } catch (error) {
      console.error('Error updating progress:', error)
      setError(error instanceof Error ? error.message : 'Failed to update progress')
    } finally {
      setProcessingModuleId(null)
    }
  }

  const getYouTubeVideoId = (url: string) => {
    return utils.extractYouTubeVideoId(url)
  }

  // Don't render until we have the courseId
  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4A73D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4A73D1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#DB1B28] mb-4">{error || 'Course not found'}</p>
          <Link href="/student">
            <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const completedModules = course.modules.filter(m => m.completed).length
  const totalModules = course.modules.length
  const nextModule = course.modules.find(m => !m.completed)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#4A73D1]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-500">Course Progress</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant={course.enrollment.completed_at ? "default" : "secondary"}
                className={course.enrollment.completed_at 
                  ? "bg-[#4A73D1]/10 text-[#4A73D1]" 
                  : "bg-gray-100 text-[#4A73D1]"
                }
              >
                {course.enrollment.progress_percentage}% Complete
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Course Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-500 leading-relaxed">
                  {course.description || 'No description available for this course.'}
                </p>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      Progress: {completedModules}/{totalModules} modules completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-[#4A73D1] h-3 rounded-full transition-all duration-300"
                      style={{ width: `${course.enrollment.progress_percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-[#4A73D1]" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Modules</p>
                    <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-[#4A73D1]" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{completedModules}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {course.enrollment.completed_at && (
              <Card className="bg-[#4A73D1]/10 border-[#4A73D1]/20">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-[#4A73D1] mx-auto mb-2" />
                  <p className="font-semibold text-[#4A73D1]">Congratulations!</p>
                  <p className="text-sm text-gray-700">Course completed on</p>
                  <p className="text-sm text-gray-700">
                    {new Date(course.enrollment.completed_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Next Module to Watch */}
        {nextModule && !course.enrollment.completed_at && (
          <Card className="bg-[#4A73D1]/10 border-[#4A73D1]/20 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Continue Learning</h3>
                  <p className="text-gray-700">Up next: {nextModule.title}</p>
                </div>
                <Link href={`/student/courses/${courseId}/modules/${nextModule.id}`}>
                  <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modules List */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Modules</h2>
            <p className="text-gray-500">Watch videos and track your progress</p>
          </div>

          <div className="space-y-4">
            {course.modules
              .sort((a, b) => a.order_index - b.order_index)
              .map((module, index) => {
                const videoId = getYouTubeVideoId(module.video_url)
                const isProcessing = processingModuleId === module.id
                
                return (
                  <Card key={module.id} className={`bg-white border-gray-200 shadow-sm ${
                    module.completed ? 'bg-[#4A73D1]/10 border-[#4A73D1]/20' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Module Number & Status */}
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            module.completed 
                              ? 'bg-[#4A73D1] text-white' 
                              : 'bg-[#4A73D1] text-white'
                          }`}>
                            {module.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          
                          {/* Complete/Incomplete Button */}
                          <Button
                            onClick={() => handleMarkComplete(module.id, !module.completed)}
                            disabled={isProcessing}
                            variant={module.completed ? "default" : "outline"}
                            size="sm"
                            className={`text-xs ${
                              module.completed 
                                ? 'bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white' 
                                : 'border-gray-200'
                            }`}
                          >
                            {isProcessing ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : module.completed ? (
                              'Completed'
                            ) : (
                              'Mark Complete'
                            )}
                          </Button>
                        </div>
                        
                        {/* Module Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex space-x-4 flex-1">
                              {videoId && (
                                <div className="relative w-48 h-28 flex-shrink-0">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&controls=1&modestbranding=1`}
                                    title={module.title}
                                    className="w-full h-full rounded"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              )}
                              <div className="space-y-1 flex-1">
                                <h4 className="font-semibold text-gray-900 text-lg">{module.title}</h4>
                                {module.description && (
                                  <p className="text-gray-500 text-sm">{module.description}</p>
                                )}
                                {module.file_url && (
                                  <a 
                                    href={module.file_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[#4A73D1] hover:underline flex items-center text-sm mt-1"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View Additional File
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            <Link href={`/student/courses/${courseId}/modules/${module.id}`}>
                              <Button variant="outline" size="sm" className="border-gray-200 ml-4">
                                <Play className="h-4 w-4 mr-2" />
                                Watch
                              </Button>
                            </Link>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary" className="bg-gray-100 text-[#4A73D1]">
                              {module.duration_minutes > 0 ? `${module.duration_minutes} min` : 'Duration not set'}
                            </Badge>
                            {module.completed && module.completed_at && (
                              <Badge variant="secondary" className="bg-[#4A73D1]/10 text-[#4A73D1] text-xs">
                                Completed {new Date(module.completed_at).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>

        {/* Announcements Section */}
        <div className="space-y-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Announcements</h2>
            <p className="text-gray-500">Stay updated with the latest course announcements</p>
          </div>

          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <Card key={announcement.id} className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-sm mb-2">
                      Posted by {announcement.created_by_name} on{' '}
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-900">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements</h3>
                  <p className="text-gray-500">
                    There are no announcements for this course yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}