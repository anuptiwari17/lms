//app/api/announcements/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { announcementQueries } from '@/lib/database'
import type { ApiResponse, Announcement, UpdateAnnouncementData } from '@/types/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Authenticate user - only admins can update announcements
    const user = await auth.getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if announcement exists
    const existingAnnouncement = await announcementQueries.getById(id)
    if (!existingAnnouncement) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Announcement not found'
      }, { status: 404 })
    }

    // Parse request body
    const updateData: UpdateAnnouncementData = await request.json()

    if (!updateData.content || updateData.content.trim().length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Announcement content is required'
      }, { status: 400 })
    }

    // Update the announcement
    const updatedAnnouncement = await announcementQueries.update(id, {
      content: updateData.content.trim()
    })

    // Check update success
    if (!updatedAnnouncement) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to update announcement'
      }, { status: 500 })
    }

    // Return success response
    return NextResponse.json<ApiResponse<Announcement>>({
      success: true,
      data: updatedAnnouncement,
      message: 'Announcement updated successfully'
    })
  } catch (error) {
    console.error('Update announcement API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to update announcement'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Authenticate user - only admins can delete announcements
    const user = await auth.getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if announcement exists
    const existingAnnouncement = await announcementQueries.getById(id)
    if (!existingAnnouncement) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Announcement not found'
      }, { status: 404 })
    }

    // Delete the announcement
    const deleteSuccess = await announcementQueries.delete(id)

    // Check deletion success
    if (!deleteSuccess) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to delete announcement'
      }, { status: 500 })
    }

    // Return success response
    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Announcement deleted successfully'
    })
  } catch (error) {
    console.error('Delete announcement API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to delete announcement'
    }, { status: 500 })
  }
}