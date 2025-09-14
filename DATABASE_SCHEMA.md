# Database Schema

This document provides a comprehensive overview of the Bilvens Learning Management System database schema. The database uses PostgreSQL with Supabase as the backend service.

## Related Documentation
- [← Back to README](README.md)
- [Folder Structure →](FOLDER_STRUCTURE.md)

---

## Schema Overview

The LMS database consists of **6 main tables** that handle user management, course organization, learning progress, and communication. All tables use UUID as primary keys for better scalability and security.

### Entity Relationship Summary
```
Users ──┬── Courses [created_by]
        ├── Enrollments [student_id]
        ├── Module Progress [student_id]
        └── Announcements [created_by]

Courses ──┬── Modules [course_id]
          ├── Enrollments [course_id]
          └── Announcements [course_id]

Modules ──── Module Progress [module_id]
```

---

## Tables Overview

| Table Name | Purpose | Key Relationships |
|------------|---------|------------------|
| `users` | Store user accounts (admins & students) | Referenced by courses, enrollments, progress |
| `courses` | Store course information | References users (creator) |
| `modules` | Store video modules within courses | References courses |
| `enrollments` | Track student course enrollments | References users and courses |
| `module_progress` | Track individual module completion | References users and modules |
| `announcements` | Store course announcements | References courses and users |

---

## Detailed Table Schemas

### Users Table
Stores all user accounts with role-based access control.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier |
| `email` | `varchar` | NOT NULL, UNIQUE | User's email address |
| `password_hash` | `varchar` | NOT NULL | Bcrypt hashed password |
| `name` | `varchar` | NOT NULL | User's full name |
| `role` | `varchar` | NOT NULL, CHECK (role IN ('admin', 'student')) | User role |
| `phone` | `varchar` | NULLABLE | User's phone number |
| `created_at` | `timestamp` | DEFAULT now() | Account creation time |
| `updated_at` | `timestamp` | DEFAULT now() | Last profile update |

**Indexes:**
- Primary key on `id`
- Unique index on `email`

---

### Courses Table
Stores course information and metadata.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique course identifier |
| `title` | `varchar` | NOT NULL | Course title |
| `description` | `text` | NULLABLE | Course description |
| `thumbnail_url` | `varchar` | NULLABLE | Course thumbnail image URL |
| `created_by` | `uuid` | FOREIGN KEY → users(id) | Course creator (admin) |
| `is_active` | `boolean` | DEFAULT true | Course availability status |
| `created_at` | `timestamp` | DEFAULT now() | Course creation time |
| `updated_at` | `timestamp` | DEFAULT now() | Last course update |

**Relationships:**
- `created_by` → `users.id` (Many courses can be created by one admin)

---

### Modules Table
Stores video modules within courses.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique module identifier |
| `course_id` | `uuid` | FOREIGN KEY → courses(id) | Parent course |
| `title` | `varchar` | NOT NULL | Module title |
| `description` | `text` | NULLABLE | Module description |
| `video_url` | `varchar` | NOT NULL | YouTube video URL |
| `order_index` | `integer` | NOT NULL, DEFAULT 0 | Module order within course |
| `duration_minutes` | `integer` | DEFAULT 0 | Video duration in minutes |
| `is_active` | `boolean` | DEFAULT true | Module availability status |
| `created_at` | `timestamp` | DEFAULT now() | Module creation time |
| `updated_at` | `timestamp` | DEFAULT now() | Last module update |

**Relationships:**
- `course_id` → `courses.id` (One course can have many modules)

**Indexes:**
- Index on `course_id` for efficient course module queries

---

### Enrollments Table
Tracks student enrollments in courses and overall progress.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique enrollment identifier |
| `student_id` | `uuid` | FOREIGN KEY → users(id) | Enrolled student |
| `course_id` | `uuid` | FOREIGN KEY → courses(id) | Enrolled course |
| `enrolled_at` | `timestamp` | DEFAULT now() | Enrollment date |
| `completed_at` | `timestamp` | NULLABLE | Course completion date |
| `progress_percentage` | `integer` | DEFAULT 0, CHECK (0 ≤ progress ≤ 100) | Overall course progress |

**Relationships:**
- `student_id` → `users.id` (One student can enroll in many courses)
- `course_id` → `courses.id` (One course can have many enrolled students)

**Indexes:**
- Index on `student_id` for student dashboard queries
- Index on `course_id` for course enrollment queries

---

### Module Progress Table
Tracks individual module completion for each student.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique progress record identifier |
| `student_id` | `uuid` | FOREIGN KEY → users(id) | Student who completed module |
| `module_id` | `uuid` | FOREIGN KEY → modules(id) | Completed module |
| `completed` | `boolean` | DEFAULT false | Module completion status |
| `completed_at` | `timestamp` | NULLABLE | Module completion time |
| `created_at` | `timestamp` | DEFAULT now() | Progress record creation |

**Relationships:**
- `student_id` → `users.id` (One student can complete many modules)
- `module_id` → `modules.id` (One module can be completed by many students)

---

### Announcements Table
Stores course-specific announcements from instructors.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique announcement identifier |
| `course_id` | `uuid` | FOREIGN KEY → courses(id), NOT NULL | Target course |
| `content` | `text` | NOT NULL | Announcement content |
| `created_by` | `uuid` | FOREIGN KEY → users(id), NOT NULL | Announcement creator (admin) |
| `created_at` | `timestamp` | DEFAULT now() | Announcement creation time |
| `updated_at` | `timestamp` | DEFAULT now() | Last announcement update |

**Relationships:**
- `course_id` → `courses.id` (One course can have many announcements)
- `created_by` → `users.id` (One admin can create many announcements)

**Indexes:**
- Index on `course_id` for efficient course announcement queries

---

## Database Creation Script

Use this SQL script to set up the complete database schema in Supabase:

```sql
-- =============================================
-- Bilvens LMS Database Schema
-- =============================================

-- 1. Create Users Table
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  name character varying NOT NULL,
  role character varying NOT NULL CHECK (role::text = ANY (ARRAY['admin'::character varying, 'student'::character varying]::text[])),
  phone character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- 2. Create Courses Table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  description text,
  thumbnail_url character varying,
  created_by uuid,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);

-- 3. Create Modules Table
CREATE TABLE public.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid,
  title character varying NOT NULL,
  description text,
  video_url character varying NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT modules_pkey PRIMARY KEY (id),
  CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);

-- 4. Create Enrollments Table
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid,
  course_id uuid,
  enrolled_at timestamp without time zone DEFAULT now(),
  completed_at timestamp without time zone,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  CONSTRAINT enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id),
  CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

-- 5. Create Module Progress Table
CREATE TABLE public.module_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid,
  module_id uuid,
  completed boolean DEFAULT false,
  completed_at timestamp without time zone,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT module_progress_pkey PRIMARY KEY (id),
  CONSTRAINT module_progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id),
  CONSTRAINT module_progress_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);

-- 6. Create Announcements Table
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  content text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id),
  CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id),
  CONSTRAINT announcements_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);

-- =============================================
-- Performance Optimization Indexes
-- =============================================

CREATE INDEX idx_announcements_course_id ON public.announcements(course_id);
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);

-- =============================================
-- Schema Setup Complete
-- =============================================
```

---

## Sample Data Relationships

### Example Data Flow:
1. **Admin** creates a **Course** → `courses.created_by` references `users.id`
2. Admin adds **Modules** to the course → `modules.course_id` references `courses.id`
3. Admin enrolls **Students** → `enrollments.student_id` and `enrollments.course_id`
4. Students watch videos → `module_progress.student_id` and `module_progress.module_id`
5. Admin posts **Announcements** → `announcements.course_id` and `announcements.created_by`

### Progress Calculation:
```sql
-- Calculate course progress percentage
SELECT 
  e.course_id,
  e.student_id,
  COUNT(mp.id) * 100.0 / COUNT(m.id) as progress_percentage
FROM enrollments e
JOIN modules m ON m.course_id = e.course_id
LEFT JOIN module_progress mp ON mp.module_id = m.id 
  AND mp.student_id = e.student_id 
  AND mp.completed = true
GROUP BY e.course_id, e.student_id;
```

---

## Security Considerations

### Data Protection
- **Password Security**: Passwords are hashed using bcrypt before storage
- **UUID Primary Keys**: Prevents enumeration attacks
- **Role-based Access**: Users have defined roles (admin/student)
- **Data Validation**: CHECK constraints ensure data integrity

### Authentication Flow
1. User submits credentials → API validates against `users` table
2. JWT token generated with user role → Stored in HTTP-only cookies
3. Role-based routing → Admin/Student interfaces separated
4. API endpoints validate JWT and role before data access

---

## Performance Optimizations

### Database Indexes
- Primary keys on all `id` fields (automatic)
- Foreign key indexes for efficient joins
- Course-specific queries optimized with targeted indexes

### Query Patterns
- **Student Dashboard**: Join enrollments → courses → modules
- **Progress Tracking**: Join module_progress → modules → courses
- **Admin Analytics**: Aggregate queries on enrollments and progress

---

## Development Guidelines

### Adding New Tables
1. Use `uuid` for primary keys
2. Include `created_at` and `updated_at` timestamps
3. Add appropriate foreign key constraints
4. Create necessary indexes for performance

### Database Migrations
- Always backup before schema changes
- Test migrations on development environment first
- Update TypeScript types in `types/database.ts`

---

**Related Documentation:**
- [← Back to README](README.md) - Main project documentation  
- [Folder Structure →](FOLDER_STRUCTURE.md) - Project organization guide

---
*This document is part of the Bilvens documentation suite.*