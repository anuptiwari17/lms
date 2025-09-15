//app/api/courses/[id]/modules/[moduleId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { moduleQueries } from '@/lib/database'
import type { ApiResponse, Module } from '@/types/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    
    const user = await auth.getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const updateData = await request.json()
    
    if (!updateData.title || updateData.title.trim().length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Module title is required'
      }, { status: 400 })
    }

    if (!updateData.video_url || updateData.video_url.trim().length === 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Video URL is required'
      }, { status: 400 })
    }

    const updatedModule = await moduleQueries.update(moduleId, {
      title: updateData.title.trim(),
      description: updateData.description?.trim() || null,
      video_url: updateData.video_url.trim(),
      duration_minutes: updateData.duration_minutes || 0
    })

    if (!updatedModule) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to update module'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse<Module>>({
      success: true,
      data: updatedModule,
      message: 'Module updated successfully'
    })
  } catch (error) {
    console.error('Update module API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to update module'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    
    const user = await auth.getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const deleteSuccess = await moduleQueries.delete(moduleId)

    if (!deleteSuccess) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to delete module'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Module deleted successfully'
    })
  } catch (error) {
    console.error('Delete module API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to delete module'
    }, { status: 500 })
  }
}