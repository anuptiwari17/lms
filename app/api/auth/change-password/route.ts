// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth, passwordUtils } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { ApiResponse } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await auth.getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Current password and new password are required'
      }, { status: 400 })
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'New password must be at least 6 characters long'
      }, { status: 400 })
    }

    // Get user's current password hash from database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', user.id)
      .single()

    if (fetchError || !userData) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await passwordUtils.verify(currentPassword, userData.password_hash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Current password is incorrect'
      }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await passwordUtils.hash(newPassword)

    // Update password in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to change password'
    }, { status: 500 })
  }
}