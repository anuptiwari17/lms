// app/api/student/route.ts - Updated with Phone Support and Proper Normalization
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'
import { passwordUtils } from '@/lib/auth'
import type { ApiResponse, User, CreateStudentData, AuthUser } from '@/types/database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-minimum-32-chars'

async function authenticateAdmin(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get('lms-auth-token')?.value
  if (!token) return null

  try {
    const user = jwt.verify(token, JWT_SECRET, {
      issuer: 'lms-platform',
      audience: 'lms-users'
    }) as AuthUser

    return user.role === 'admin' ? user : null
  } catch {
    return null
  }
}

// Helper function to normalize phone numbers
function normalizePhoneNumber(phone: string): string {
  // Remove all spaces, dashes, parentheses, and plus signs
  let normalized = phone.replace(/[\s\-\(\)\+]/g, '')
  
  // If it starts with country code (like 91 for India), keep it
  // If it's just a 10-digit number, add default country code (91 for India)
  if (normalized.length === 10 && /^[6-9]\d{9}$/.test(normalized)) {
    // Indian mobile numbers start with 6,7,8,9
    normalized = '91' + normalized
  }
  
  return normalized
}

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateAdmin(request)
    if (!user) {
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: 'Admin access required' 
      }, { status: 401 })
    }

    const { data: students, error } = await supabase
      .from('users')
      .select('id, email, name, phone, role, created_at, updated_at')
      .eq('role', 'student')
      .order('name')

    if (error) throw error

    return NextResponse.json<ApiResponse<User[]>>({
      success: true,
      data: students || []
    })

  } catch (error) {
    console.error('Get students API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch students'
    }, { status: 500 })
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

    const studentData: CreateStudentData & { phone?: string } = await request.json()
    
    if (!studentData.name || !studentData.email) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Name and email are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(studentData.email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Please enter a valid email address'
      }, { status: 400 })
    }

    const normalizedEmail = studentData.email.toLowerCase().trim()
    let normalizedPhone: string | null = null

    // Validate and normalize phone if provided
    if (studentData.phone && studentData.phone.trim()) {
      const rawPhone = studentData.phone.trim()
      
      // Basic phone validation (should contain only numbers, spaces, +, -, ())
      if (!/^[\+\d\s\-\(\)]+$/.test(rawPhone)) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Phone number contains invalid characters'
        }, { status: 400 })
      }

      // Normalize the phone number
      normalizedPhone = normalizePhoneNumber(rawPhone)
      
      // Validate normalized phone (should be 10-15 digits)
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
      const phoneExists = existingPhoneUsers?.some(user => {
        if (!user.phone) return false
        const existingNormalized = normalizePhoneNumber(user.phone)
        return existingNormalized === normalizedPhone
      })

      if (phoneExists) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'A user with this phone number already exists'
        }, { status: 400 })
      }
    }

    // Generate or use provided password
    const userPassword = studentData.password || generateTempPassword()
    const hashedPassword = await passwordUtils.hash(userPassword)

    // Store the original phone format (for display) but we'll use normalized for uniqueness checking
    const displayPhone = studentData.phone && studentData.phone.trim() ? studentData.phone.trim() : null

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: normalizedEmail,
        password_hash: hashedPassword,
        name: studentData.name.trim(),
        phone: displayPhone, // Store original format for display
        role: 'student'
      })
      .select('id, email, name, phone, role, created_at, updated_at')
      .single()

    if (insertError) throw insertError

    return NextResponse.json<ApiResponse<{ user: User, tempPassword?: string }>>({
      success: true,
      data: {
        user: newUser as User,
        tempPassword: studentData.password ? undefined : userPassword
      },
      message: 'Student created successfully'
    })

  } catch (error) {
    console.error('Create student API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to create student'
    }, { status: 500 })
  }
}

// Helper function to generate temporary password
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}