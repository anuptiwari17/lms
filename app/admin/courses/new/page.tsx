"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function CreateCoursePage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-[#4A73D1] border-r-[#DB1B28] rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-[#4A73D1]" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">Creating Your Course</h3>
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
        ) : (
          <Card className="bg-white border-gray-100 shadow-md rounded-xl hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Create New Course</CardTitle>
              <p className="text-gray-600 text-base leading-relaxed">Fill in the details to create a new course for your students.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-600">
                    Course Title
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter course title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-white border-gray-200 h-12 rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-600">
                    Course Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter course description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="bg-white border-gray-200 min-h-[120px] rounded-lg focus:border-[#4A73D1] transition-all duration-200 shadow-sm"
                  />
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-[#DB1B28] text-sm font-medium">{error}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-4">
                  <Link href="/admin">
                    <Button 
                      variant="outline" 
                      className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-[#4A73D1] text-white hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200 rounded-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Course'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}