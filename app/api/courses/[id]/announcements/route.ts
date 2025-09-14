//app/api/courses/[courseId]/announcements/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { announcementQueries } from '@/lib/database'
import type { ApiResponse, AnnouncementWithAuthor, Announcement, CreateAnnouncementData } from '@/types/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('GET announcements for courseId:', id)
    
    const user = await auth.getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const announcements = await announcementQueries.getByCourse(id)

    return NextResponse.json<ApiResponse<AnnouncementWithAuthor[]>>({
      success: true,
      data: announcements
    })
  } catch (error) {
    console.error('Get announcements API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch announcements'
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('POST announcement for courseId:', id)
    
    // Authenticate user - only admins can create announcements
    const user = await auth.getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const announcementData: CreateAnnouncementData = await request.json()
    
    console.log('Announcement data received:', { id, content: announcementData.content?.substring(0, 50) + '...', userId: user.id })

    if (!announcementData.content || announcementData.content.trim().length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Announcement content is required'
      }, { status: 400 })
    }

    // Create the announcement - make sure courseId is passed correctly
    const createdAnnouncement = await announcementQueries.create({
      course_id: id, // This should be the courseId from params
      content: announcementData.content.trim(),
      created_by: user.id
    })

    // Check creation success
    if (!createdAnnouncement) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to create announcement'
      }, { status: 500 })
    }

    // Return success response
    return NextResponse.json<ApiResponse<Announcement>>({
      success: true,
      data: createdAnnouncement,
      message: 'Announcement created successfully'
    })
  } catch (error) {
    console.error('Create announcement API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create announcement'
    }, { status: 500 })
  }
}