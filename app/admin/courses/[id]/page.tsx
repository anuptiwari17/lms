"use client"

import { useState, useEffect, useRef } from "react"
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
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Download,
  GripVertical,
  ExternalLink,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  MessageSquare
} from "lucide-react"
import type { Course, Module, ApiResponse, Announcement } from "@/types/database"
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

interface AnnouncementWithName extends Announcement {
  created_by_name: string
}

// Custom Video Player Component
function CustomVideoPlayer({ videoUrl, title }: { videoUrl: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnd = () => setIsPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnd)

    // Disable right-click context menu
    const disableContextMenu = (e: MouseEvent) => e.preventDefault()
    video.addEventListener('contextmenu', disableContextMenu)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnd)
      video.removeEventListener('contextmenu', disableContextMenu)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime += seconds
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-auto max-h-96 object-contain"
        src={videoUrl}
        title={title}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />
      
      {/* Custom Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4A73D1]"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-white">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            
            <button onClick={toggleMute} className="text-white">
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />

            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => skip(-10)} className="text-white" title="Rewind 10s">
              <RotateCcw className="h-4 w-4" />
            </button>
            
            <button onClick={() => skip(10)} className="text-white" title="Forward 10s">
              <RotateCw className="h-4 w-4" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="text-white"
                title="Playback settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 shadow-lg z-10">
                  <div className="text-white text-xs font-medium mb-2">Playback Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => changePlaybackRate(rate)}
                      className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-gray-700 ${
                        playbackRate === rate ? 'text-[#4A73D1] font-medium' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors"
          >
            <Play className="h-12 w-12 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [course, setCourse] = useState<CourseWithModules | null>(null)
  const [students, setStudents] = useState<StudentInCourse[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementWithName[]>([])
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

  // Announcement form state
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({
    content: "",
    announcementId: ""
  })
  const [announcementLoading, setAnnouncementLoading] = useState(false)
  
  const router = useRouter()

  // Extract params on component mount
  useEffect(() => {
    const extractParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
    };
    extractParams();
  }, [params]);

  // Validate UUID format
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    if (courseId && isValidUUID(courseId)) {
      loadCourseData()
    }
  }, [courseId])

  const loadCourseData = async () => {
    try {
      setLoading(true)
      
      const [courseRes, studentsRes, announcementsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`, { credentials: 'include' }),
        fetch(`/api/courses/${courseId}/students`, { credentials: 'include' }),
        fetch(`/api/courses/${courseId}/announcements`, { credentials: 'include' })
      ])

      const courseData = await courseRes.json()
      const studentsData = await studentsRes.json()
      const announcementsData = await announcementsRes.json()

      if (!courseData.success) {
        throw new Error(courseData.error || 'Course not found')
      }

      setCourse(courseData.data)
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

  const handleCreateOrUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnnouncementLoading(true)

    try {
      if (!announcementForm.content.trim()) {
        throw new Error("Announcement content is required")
      }

      const method = announcementForm.announcementId ? 'PUT' : 'POST'
      const url = announcementForm.announcementId 
        ? `/api/courses/${courseId}/announcements/${announcementForm.announcementId}`
        : `/api/courses/${courseId}/announcements`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: announcementForm.content.trim() })
      })

      const result: ApiResponse<AnnouncementWithName> = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to save announcement')
      }

      // Reload course data to get updated announcements
      await loadCourseData()
      
      // Reset form
      setAnnouncementForm({ content: "", announcementId: "" })
      setShowAnnouncementForm(false)

    } catch (error) {
      console.error('Announcement error:', error)
      setError(error instanceof Error ? error.message : 'Failed to save announcement')
    } finally {
      setAnnouncementLoading(false)
    }
  }

  const handleEditAnnouncement = (announcement: AnnouncementWithName) => {
    setAnnouncementForm({
      content: announcement.content,
      announcementId: announcement.id
    })
    setShowAnnouncementForm(true)
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/announcements/${announcementId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const result: ApiResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete announcement')
      }

      // Reload course data to get updated announcements
      await loadCourseData()

    } catch (error) {
      console.error('Delete announcement error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete announcement')
    }
  }

  const handleDownloadCSV = () => {
    if (students.length === 0) return
    
    const csvContent = utils.generateCSV(students, course?.title || 'Course')
    utils.downloadCSV(csvContent, `${course?.title || 'course'}-students.csv`)
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
          <Link href="/admin">
            <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#4A73D1]">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-500">Course Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
              <Button 
                onClick={handleDownloadCSV}
                variant="outline" 
                size="sm" 
                className="border-gray-200 hover:bg-gray-50"
                disabled={students.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium text-gray-500 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="modules"
              className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium text-gray-500 data-[state=active]:text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Modules ({course.modules?.length || 0})
            </TabsTrigger>
            <TabsTrigger 
              value="students"
              className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium text-gray-500 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Students ({students.length})
            </TabsTrigger>
            <TabsTrigger 
              value="announcements"
              className="data-[state=active]:bg-[#4A73D1] data-[state=active]:text-white font-medium text-gray-500 data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Announcements ({announcements.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Total Modules</p>
                      <p className="text-2xl font-bold text-gray-900">{course.modules?.length || 0}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-[#4A73D1]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Enrolled Students</p>
                      <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-[#4A73D1]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Avg Progress</p>
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
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-900">Description</Label>
                  <p className="text-gray-500 mt-1 leading-relaxed">
                    {course.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-900">Created</Label>
                  <p className="text-gray-500 mt-1">
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
                <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
                <p className="text-gray-500">Manage video modules for this course</p>
              </div>
              <Dialog open={showModuleForm} onOpenChange={setShowModuleForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">
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
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="module-title">Module Title *</Label>
                        <Input
                          id="module-title"
                          value={moduleForm.title}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Introduction to HTML"
                          className="h-11"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="module-description">Description</Label>
                        <Textarea
                          id="module-description"
                          value={moduleForm.description}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this module covers..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="video-url">Video URL *</Label>
                        <Input
                          id="video-url"
                          value={moduleForm.video_url}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, video_url: e.target.value }))}
                          placeholder="https://example.com/video.mp4"
                          className="h-11"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Direct video URLs are recommended for better control
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={moduleForm.duration_minutes}
                          onChange={(e) => setModuleForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                          placeholder="e.g., 15"
                          min="0"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowModuleForm(false)}
                        disabled={moduleLoading}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white"
                        disabled={moduleLoading || !moduleForm.title.trim() || !moduleForm.video_url.trim()}
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
                  .map((module, index) => (
                    <Card key={module.id} className="bg-white border-gray-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#4A73D1] text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <GripVertical className="h-4 w-4 text-gray-500 cursor-move" />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{module.title}</h4>
                                {module.description && (
                                  <p className="text-gray-500 text-sm mt-1">{module.description}</p>
                                )}
                                <div className="flex items-center space-x-4 mt-2">
                                  <Badge variant="secondary" className="bg-gray-100 text-[#4A73D1]">
                                    {module.duration_minutes > 0 ? `${module.duration_minutes} min` : 'Duration not set'}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-500">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-[#DB1B28] hover:text-[#DB1B28]/80 hover:bg-[#DB1B28]/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                              <CustomVideoPlayer 
                                videoUrl={module.video_url} 
                                title={module.title}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            ) : (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Play className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start by adding video modules to your course. Students will see modules in the order you create them.
                  </p>
                  <Button onClick={() => setShowModuleForm(true)} className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">
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
                <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
                <p className="text-gray-500">Track student progress and manage enrollments</p>
              </div>
              <Link href={`/admin/courses/${courseId}/enroll`}>
                <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Enroll Students
                </Button>
              </Link>
            </div>

            {students.length > 0 ? (
              <div className="space-y-4">
                {students.map((student) => (
                  <Card key={student.id} className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-[#4A73D1] text-white rounded-full flex items-center justify-center font-semibold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={student.progress_percentage === 100 ? "default" : "secondary"}
                              className={student.progress_percentage === 100 
                                ? "bg-[#4A73D1]/10 text-[#4A73D1]" 
                                : "bg-gray-100 text-[#4A73D1]"
                              }
                            >
                              {student.progress_percentage}% Complete
                            </Badge>
                          </div>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#4A73D1] h-2 rounded-full transition-all duration-300"
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
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No students enrolled</h3>
                  <p className="text-gray-500 mb-6">
                    Start by enrolling students in this course to track their progress.
                  </p>
                  <Link href={`/admin/courses/${courseId}/enroll`}>
                    <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Enroll Students
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
                <p className="text-gray-500">Manage course announcements</p>
              </div>
              <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <form onSubmit={handleCreateOrUpdateAnnouncement}>
                    <DialogHeader>
                      <DialogTitle>{announcementForm.announcementId ? 'Edit Announcement' : 'Add New Announcement'}</DialogTitle>
                      <DialogDescription>
                        {announcementForm.announcementId ? 'Update the announcement content' : 'Create a new announcement for this course'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="announcement-content">Announcement Content *</Label>
                        <Textarea
                          id="announcement-content"
                          value={announcementForm.content}
                          onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter your announcement here..."
                          rows={5}
                          className="resize-none"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Maximum 5000 characters
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAnnouncementForm(false)}
                        disabled={announcementLoading}
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white"
                        disabled={announcementLoading || !announcementForm.content.trim()}
                      >
                        {announcementLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            {announcementForm.announcementId ? 'Update Announcement' : 'Add Announcement'}
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Announcements List */}
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-gray-500 text-sm mb-2">
                            Posted by {announcement.created_by_name} on{' '}
                            {new Date(announcement.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-gray-900">{announcement.content}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500"
                            onClick={() => handleEditAnnouncement(announcement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#DB1B28] hover:text-[#DB1B28]/80 hover:bg-[#DB1B28]/10"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements yet</h3>
                  <p className="text-gray-500 mb-6">
                    Create announcements to keep students informed about course updates.
                  </p>
                  <Button onClick={() => setShowAnnouncementForm(true)} className="bg-[#4A73D1] hover:bg-[#4A73D1]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Announcement
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}