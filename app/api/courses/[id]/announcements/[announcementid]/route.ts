import { NextRequest, NextResponse } from 'next/server'
import { auth, roleUtils } from '@/lib/auth'
import { announcementQueries } from '@/lib/database'
import type { ApiResponse, Announcement } from '@/types/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; announcementId: string }> }
) {
  try {
    const { courseId, announcementId } = await params
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

    const announcement = await announcementQueries.update(announcementId, {
      content: content.trim()
    })

    if (!announcement) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<Announcement & { created_by_name: string }>>(
      { success: true, data: announcement, message: 'Announcement updated successfully' }
    )
  } catch (error) {
    console.error('Update announcement error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to update announcement' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; announcementId: string }> }
) {
  try {
    const { courseId, announcementId } = await params
    const user = await auth.getCurrentUser()

    if (!user || !roleUtils.isAdmin(user)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const success = await announcementQueries.delete(announcementId)

    if (!success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: 'Announcement deleted successfully' }
    )
  } catch (error) {
    console.error('Delete announcement error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete announcement' },
      { status: 500 }
    )
  }
}