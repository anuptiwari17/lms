import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { userQueries, enrollmentQueries } from '@/lib/database'
import type { ApiResponse, User } from '@/types/database'

interface StudentWithEnrollment extends User {
  enrolled: boolean
  enrollment_date?: string
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await auth.getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const courseId = params.id

    // Get all students
    const students = await userQueries.getStudents()

    // Get enrollments for this course using the existing method
    const enrollments = await enrollmentQueries.getByCourse(courseId)

    // Merge data
    const studentsWithEnrollment: StudentWithEnrollment[] = students.map(student => {
      const enrollment = enrollments.find(e => e.student_id === student.id)
      return {
        ...student,
        enrolled: !!enrollment,
        enrollment_date: enrollment?.enrolled_at
      }
    })

    return NextResponse.json<ApiResponse<StudentWithEnrollment[]>>({
      success: true,
      data: studentsWithEnrollment
    })

  } catch (error) {
    console.error('Enrollment status API error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch enrollment status'
    }, { status: 500 })
  }
}
