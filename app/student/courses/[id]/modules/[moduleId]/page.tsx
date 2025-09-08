// app/student/courses/[id]/modules/[moduleId]/page.tsx - Enhanced Module Player
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Play,
  ExternalLink,
  SkipForward,
  SkipBack,
  BookOpen,
  FileText,
  Download,
  Clock,
  X,
  Maximize,
  Volume2,
  Settings,
  Pause
} from "lucide-react"
import { utils } from "@/lib/database"
import type { Module, Course } from "@/types/database"

interface ModuleWithProgress extends Module {
  completed: boolean
  completed_at: string | null
  file_url?: string | null
  file_title?: string | null
}

interface CourseData extends Course {
  modules: ModuleWithProgress[]
  enrollment: {
    progress_percentage: number
    enrolled_at: string
    completed_at: string | null
  }
}

interface CustomVideoPlayerProps {
  module: ModuleWithProgress
  isFullPage?: boolean
  onClose?: () => void
}

const CustomVideoPlayer = ({ module, isFullPage = false, onClose }: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLIFrameElement>(null)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = utils.extractYouTubeVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&modestbranding=1&rel=0&showinfo=0&autoplay=1` : null
  }

  const embedUrl = getYouTubeEmbedUrl(module.video_url)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls && !isFullPage) {
      timeout = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls, isFullPage])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  if (isFullPage) {
    return (
      <div className="w-full">
        {embedUrl ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <iframe
              ref={videoRef}
              src={embedUrl}
              title={module.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Video not available</h3>
              <p className="text-gray-400 mb-4">Unable to load video content</p>
              <a 
                href={module.video_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Original Link
              </a>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Modal version (if needed)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl mx-auto">
        {/* Close Button */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Container */}
        <div className="w-full h-full flex items-center justify-center p-6">
          {embedUrl ? (
            <div className="w-full h-full max-w-6xl max-h-[80vh] bg-black rounded-lg overflow-hidden">
              <iframe
                ref={videoRef}
                src={embedUrl}
                title={module.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-12 text-center max-w-md">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Video not available</h3>
              <p className="text-gray-400 mb-4">Unable to load video content</p>
              <a 
                href={module.video_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Original Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
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
  
  // Extract params on component mount
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

      // Reload data to get updated progress
      await loadData()
      
    } catch (error) {
      console.error('Error updating progress:', error)
      setError('Failed to update progress')
    } finally {
      setMarkingComplete(false)
    }
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

  // Don't render until we have the params
  if (!courseId || !moduleId) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading module...</p>
        </div>
      </div>
    )
  }

  if (error || !course || !currentModule) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Module not found'}</p>
          <Link href="/student">
            <Button className="btn-primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const { prev, next } = getAdjacentModules()
  const completedModules = course.modules.filter(m => m.completed).length
  const currentModuleIndex = course.modules.findIndex(m => m.id === currentModule.id) + 1

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--ui-card-border)] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 min-w-0">
              <Link href={`/student/courses/${courseId}`}>
                <Button variant="ghost" size="sm" className="text-[var(--text-secondary)] hover:text-[var(--brand-primary)] shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div className="h-6 w-px bg-[var(--ui-card-border)] shrink-0"></div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-[var(--fg-primary)] truncate">{currentModule.title}</h1>
                <p className="text-sm text-[var(--text-secondary)] truncate">{course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 shrink-0">
              <Badge variant="secondary" className="bg-[var(--ui-input-bg)] text-[var(--brand-primary)]">
                Module {currentModuleIndex} of {course.modules.length}
              </Badge>
              <Badge 
                variant={currentModule.completed ? "default" : "secondary"}
                className={currentModule.completed 
                  ? "bg-green-100 text-green-800" 
                  : "bg-[var(--ui-input-bg)] text-[var(--brand-primary)]"
                }
              >
                {currentModule.completed ? 'Completed' : 'In Progress'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--ui-card-border)] overflow-hidden">
              <CustomVideoPlayer module={currentModule} isFullPage={true} />
            </div>

            {/* Module Info */}
            <Card className="bg-white border-[var(--ui-card-border)] shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-[var(--fg-primary)] mb-2">{currentModule.title}</CardTitle>
                    <div className="flex items-center space-x-4">
                      {currentModule.duration_minutes > 0 && (
                        <div className="flex items-center text-[var(--text-secondary)]">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">{currentModule.duration_minutes} min</span>
                        </div>
                      )}
                      {currentModule.completed && currentModule.completed_at && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed on {new Date(currentModule.completed_at).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleMarkComplete(!currentModule.completed)}
                    disabled={markingComplete}
                    variant={currentModule.completed ? "default" : "outline"}
                    size="lg"
                    className={currentModule.completed 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white"
                    }
                  >
                    {markingComplete ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    )}
                    {currentModule.completed ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {currentModule.description && (
                  <div>
                    <h3 className="font-semibold text-[var(--fg-primary)] mb-2">About this module</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {currentModule.description}
                    </p>
                  </div>
                )}

                {/* File Resources */}
                {currentModule.file_url && (
                  <div>
                    <h3 className="font-semibold text-[var(--fg-primary)] mb-3">Course Materials</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-[var(--brand-primary)] p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-[var(--fg-primary)]">
                              {currentModule.file_title || 'Course Material'}
                            </p>
                            <p className="text-sm text-[var(--text-secondary)]">
                              Additional resources for this module
                            </p>
                          </div>
                        </div>
                        <a 
                          href={currentModule.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* External Link */}
                <div>
                  <h3 className="font-semibold text-[var(--fg-primary)] mb-3">External Resources</h3>
                  <a 
                    href={currentModule.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on Original Platform
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              {prev ? (
                <Link href={`/student/courses/${courseId}/modules/${prev.id}`}>
                  <Button variant="outline" size="lg" className="border-[var(--ui-card-border)] group">
                    <SkipBack className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs text-[var(--text-secondary)]">Previous</div>
                      <div className="font-medium truncate max-w-48">{prev.title}</div>
                    </div>
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              
              {next ? (
                <Link href={`/student/courses/${courseId}/modules/${next.id}`}>
                  <Button size="lg" className="btn-primary group">
                    <div className="text-right">
                      <div className="text-xs opacity-90">Next</div>
                      <div className="font-medium truncate max-w-48">{next.title}</div>
                    </div>
                    <SkipForward className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/student/courses/${courseId}`}>
                  <Button size="lg" className="btn-primary">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Back to Course
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card className="bg-white border-[var(--ui-card-border)] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[var(--fg-primary)]">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-300"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[var(--brand-primary)]"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${course.enrollment.progress_percentage}, 100`}
                        strokeLinecap="round"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-[var(--brand-primary)]">
                        {course.enrollment.progress_percentage}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {completedModules} of {course.modules.length} modules completed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Module List */}
            <Card className="bg-white border-[var(--ui-card-border)] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[var(--fg-primary)]">All Modules</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {course.modules
                    .filter(m => m.is_active)
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((module, index) => (
                    <Link 
                      key={module.id} 
                      href={`/student/courses/${courseId}/modules/${module.id}`}
                      className={`block p-4 hover:bg-[var(--ui-input-bg)] transition-colors border-b border-gray-100 last:border-b-0 ${
                        module.id === currentModule.id ? 'bg-[var(--brand-primary)]/10 border-r-4 border-r-[var(--brand-primary)]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            module.completed 
                              ? 'bg-green-600 text-white' 
                              : module.id === currentModule.id
                                ? 'bg-[var(--brand-primary)] text-white'
                                : 'bg-gray-200 text-[var(--text-secondary)]'
                          }`}>
                            {module.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-medium truncate ${
                              module.id === currentModule.id 
                                ? 'text-[var(--brand-primary)]' 
                                : 'text-[var(--fg-primary)]'
                            }`}>
                              {module.title}
                            </p>
                            {module.duration_minutes > 0 && (
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                {module.duration_minutes} min
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {module.id === currentModule.id && (
                          <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full shrink-0"></div>
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