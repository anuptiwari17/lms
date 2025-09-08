"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Plus } from "lucide-react"

export default function ModernCreateCoursePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create course")

      // Redirect to dashboard
      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
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

            <Link href="/admin">
              <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-600 mb-6 text-sm font-medium hover:text-[#4A73D1] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Plus className="h-6 w-6 text-[#4A73D1]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600">Add a new course to your platform</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-[#4A73D1]" />
              <CardTitle className="text-xl font-bold text-gray-900">Course Details</CardTitle>
            </div>
            <p className="text-gray-600 mt-2">
              Provide the basic information for your new course. You can add modules and content after creation.
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Course Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-semibold text-gray-900">
                  Course Title <span className="text-[#DB1B28]">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Enter course title (e.g., Introduction to Web Development)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-12 border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium"
                />
                <p className="text-xs text-gray-500">
                  Choose a clear, descriptive title that helps students understand what they&apos;ll learn.
                </p>
              </div>

              {/* Course Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-semibold text-gray-900">
                  Course Description <span className="text-[#DB1B28]">*</span>
                </label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the course content, learning objectives, and what students will achieve..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  className="border-gray-300 focus:border-[#4A73D1] focus:ring-2 focus:ring-[#4A73D1]/10 rounded-lg font-medium resize-none"
                />
                <p className="text-xs text-gray-500">
                  Include learning objectives, prerequisites, and key topics that will be covered.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-[#DB1B28] text-sm p-4 rounded-lg font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#DB1B28] rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-[#DB1B28] rounded-full"></div>
                    </div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !title.trim() || !description.trim()}
                  className="flex-1 sm:flex-none bg-[#4A73D1] text-white h-12 px-8 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </>
                  )}
                </Button>

                <Link href="/admin" className="flex-1 sm:flex-none">
                  <Button
                    variant="outline"
                    className="w-full h-12 px-8 font-semibold border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-[#4A73D1] mb-2">Next Steps</h3>
          <p className="text-sm text-gray-700">
            After creating your course, you&apos;ll be able to add modules, upload content, and set up assessments. 
            Students will only see published courses in their dashboard.
          </p>
        </div>
      </main>
    </div>
  )
}