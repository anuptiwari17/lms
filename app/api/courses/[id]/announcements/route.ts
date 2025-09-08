import { NextRequest, NextResponse } from 'next/server'
import { auth, roleUtils } from '@/lib/auth'
import { announcementQueries, enrollmentQueries } from '@/lib/database'
import type { ApiResponse, Announcement } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const user = await auth.getCurrentUser()

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin or enrolled in the course
    const isAdmin = roleUtils.isAdmin(user)
    const enrollments = await enrollmentQueries.getByCourse(courseId)
    const isEnrolled = enrollments.some(e => e.users?.id === user.id)

    if (!isAdmin && !isEnrolled) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Forbidden: Not enrolled in course' },
        { status: 403 }
      )
    }

    const announcements = await announcementQueries.getByCourse(courseId)

    return NextResponse.json<ApiResponse<(Announcement & { created_by_name: string })[]>>(
      { success: true, data: announcements }
    )
  } catch (error) {
    console.error('Get announcements error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const user = await auth.getCurrentUser()

    if (!user || !roleUtils.isAdmin(user)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content?.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }
    if (content.length > 5000) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Content cannot exceed 5000 characters' },
        { status: 400 }
      )
    }

    const announcement = await announcementQueries.create({
      course_id: courseId,
      content: content.trim(),
      created_by: user.id
    })

    if (!announcement) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to create announcement' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<Announcement & { created_by_name: string }>>(
      { success: true, data: announcement, message: 'Announcement created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create announcement error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create announcement' },
      { status: 500 }
    )
  }
}