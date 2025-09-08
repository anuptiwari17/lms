// app/api/admin/create-admin/route.ts - Create New Admin
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'
import { passwordUtils } from '@/lib/auth'
import type { ApiResponse, User, AuthUser } from '@/types/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-minimum-32-chars'

// Helper function to normalize phone numbers
function normalizePhoneNumber(phone: string): string {
  let normalized = phone.replace(/[\s\-\(\)\+]/g, '')
  
  if (normalized.length === 10 && /^[6-9]\d{9}$/.test(normalized)) {
    normalized = '91' + normalized
  }
  
  return normalized
}

async function authenticateAdmin(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get('lms-auth-token')?.value
    if (!token) return null

    const user = jwt.verify(token, JWT_SECRET, {
      issuer: 'lms-platform',
      audience: 'lms-users'
    }) as AuthUser

    return user.role === 'admin' ? user : null
  } catch (error) {
    console.error('Admin auth error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateAdmin(request)
    if (!user) {
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: 'Admin access required' 
      }, { status: 401 })
    }

    const adminData = await request.json()
    const { name, email, phone, password } = adminData
    
    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Name, email, and password are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Please enter a valid email address'
      }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    let normalizedPhone: string | null = null

    // Validate and normalize phone if provided
    if (phone && phone.trim()) {
      const rawPhone = phone.trim()
      
      // Basic phone validation
      if (!/^[\+\d\s\-\(\)]+$/.test(rawPhone)) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Phone number contains invalid characters'
        }, { status: 400 })
      }

      // Normalize the phone number
      normalizedPhone = normalizePhoneNumber(rawPhone)
      
      // Validate normalized phone
      if (!/^\d{10,15}$/.test(normalizedPhone)) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Please enter a valid phone number (10-15 digits)'
        }, { status: 400 })
      }
    }

    // Check if email already exists
    const { data: existingUsers, error: emailCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .limit(1)

    if (emailCheckError) throw emailCheckError

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'A user with this email already exists'
      }, { status: 400 })
    }

    // Check if normalized phone already exists (if provided)
    if (normalizedPhone) {
      const { data: existingPhoneUsers, error: phoneCheckError } = await supabase
        .from('users')
        .select('id, phone')
        .not('phone', 'is', null)

      if (phoneCheckError) throw phoneCheckError

      // Check if any existing phone number normalizes to the same value
      const phoneExists = existingPhoneUsers?.some(existingUser => {
        if (!existingUser.phone) return false
        const existingNormalized = normalizePhoneNumber(existingUser.phone)
        return existingNormalized === normalizedPhone
      })

      if (phoneExists) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'A user with this phone number already exists'
        }, { status: 400 })
      }
    }

    // Hash password
    const hashedPassword = await passwordUtils.hash(password)

    // Store the original phone format (for display) 
    const displayPhone = phone && phone.trim() ? phone.trim() : null

    // Create new admin
    const { data: newAdmin, error: insertError } = await supabase
      .from('users')
      .insert({
        email: normalizedEmail,
        password_hash: hashedPassword,
        name: name.trim(),
        phone: displayPhone,
        role: 'admin'
      })
      .select('id, email, name, phone, role, created_at, updated_at')
      .single()

    if (insertError) throw insertError

    // Log the admin creation action
    console.log(`Admin ${user.email} created new admin: ${newAdmin.email}`)

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: newAdmin as User,
      message: 'Admin created successfully'
    })

  } catch (error) {
    console.error('Create admin API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create admin'
    }, { status: 500 })
  }
}