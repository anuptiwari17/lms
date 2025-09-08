// app/api/analytics/dashboard/route.ts - Corrected Analytics
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { ApiResponse, DashboardStats } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    const user = await auth.getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({ 
        success: false, 
        error: 'Admin access required' 
      }, { status: 401 })
    }

    // Get all required data in parallel
    const [
      coursesResult,
      studentsResult, 
      modulesResult,
      enrollmentsResult,
      moduleProgressResult
    ] = await Promise.all([
      // Active courses only
      supabase.from('courses').select('id').eq('is_active', true),
      
      // All students (not just enrolled ones)
      supabase.from('users').select('id').eq('role', 'student'),
      
      // Active modules only
      supabase.from('modules').select('id, course_id').eq('is_active', true),
      
      // All enrollments with course info
      supabase
        .from('enrollments')
        .select(`
          id,
          student_id,
          course_id,
          progress_percentage,
          completed_at,
          courses!inner(id, is_active)
        `)
        .eq('courses.is_active', true),
      
      // All module progress
      supabase
        .from('module_progress')
        .select(`
          student_id,
          module_id,
          completed,
          modules!inner(id, course_id, is_active),
          courses!inner(id, is_active)
        `)
        .eq('modules.is_active', true)
        .eq('courses.is_active', true)
    ])

    // Basic counts
    const totalCourses = coursesResult.data?.length || 0
    const totalStudents = studentsResult.data?.length || 0 // All students, not just enrolled
    const totalModules = modulesResult.data?.length || 0

    const enrollments = enrollmentsResult.data || []
    const moduleProgressData = moduleProgressResult.data || []

    // Calculate accurate average progress
    // This represents: (total completed modules) / (total accessible modules) across all enrolled students
    let totalAccessibleModules = 0
    let totalCompletedModules = 0
    
    // Group modules by course
    const modulesByCourse = modulesResult.data?.reduce((acc, module) => {
      if (!acc[module.course_id]) acc[module.course_id] = []
      acc[module.course_id].push(module.id)
      return acc
    }, {} as Record<string, string[]>) || {}

    // For each enrollment, count accessible and completed modules
    for (const enrollment of enrollments) {
      const courseModules = modulesByCourse[enrollment.course_id] || []
      totalAccessibleModules += courseModules.length

      // Count completed modules for this student in this course
      const studentCompletedInCourse = moduleProgressData.filter(mp => 
        mp.student_id === enrollment.student_id && 
        courseModules.includes(mp.module_id) &&
        mp.completed
      ).length

      totalCompletedModules += studentCompletedInCourse
    }

    const averageProgress = totalAccessibleModules > 0 
      ? Math.round((totalCompletedModules / totalAccessibleModules) * 100)
      : 0

    // Calculate course completions
    // A course is completed when a student has completed ALL current active modules in that course
    let totalCompletions = 0
    
    for (const enrollment of enrollments) {
      const courseModules = modulesByCourse[enrollment.course_id] || []
      if (courseModules.length === 0) continue

      const studentCompletedInCourse = moduleProgressData.filter(mp => 
        mp.student_id === enrollment.student_id && 
        courseModules.includes(mp.module_id) &&
        mp.completed
      ).length

      // Course is complete if student completed all current modules
      if (studentCompletedInCourse === courseModules.length) {
        totalCompletions++
      }
    }

    // Active students = students who have at least one enrollment
    const activeStudents = new Set(enrollments.map(e => e.student_id)).size

    const stats: DashboardStats = {
      totalCourses,
      totalStudents, // All students in system
      totalModules,
      averageProgress, // Actual module completion rate across all enrollments
      totalCompletions, // Courses completed based on current module requirements
      activeStudents // Students with at least one enrollment
    }

    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Dashboard analytics error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    }, { status: 500 })
  }
}