# Folder Structure

This document provides a comprehensive overview of the Bilvens Learning Management System folder structure. Each directory and its purpose is explained to help developers navigate and understand the codebase efficiently.

## Related Documentation
- [← Back to README](README.md)
- [Database Schema →](DATABASE_SCHEMA.md)

---

## Project Structure Tree

```
bilvens/
├── app/                          # Next.js App Router directory (main application)
│   ├── api/                      # Backend API route handlers
│   │   ├── auth/                 # User authentication endpoints
│   │   │   ├── login/            # User login API
│   │   │   ├── signup/           # User registration API
│   │   │   ├── logout/           # User logout API
│   │   │   └── check/            # Authentication verification API
│   │   ├── courses/              # Course management APIs
│   │   │   ├── [id]/             # Dynamic course operations by ID
│   │   │   │   ├── announcements/# Course-specific announcements
│   │   │   │   ├── modules/      # Course modules management
│   │   │   │   └── students/     # Course enrollment management
│   │   │   └── route.ts          # Main course CRUD operations
│   │   ├── announcements/        # Global announcement management
│   │   │   └── [id]/             # Individual announcement operations
│   │   ├── student/              # Student-specific API endpoints
│   │   │   ├── courses/          # Student course access APIs
│   │   │   └── stats/            # Student progress statistics
│   │   ├── admin/                # Admin-specific API endpoints
│   │   │   └── students/         # Student management APIs
│   │   ├── analytics/            # Analytics and reporting APIs
│   │   ├── enrollments/          # Course enrollment APIs
│   │   └── progress/             # Learning progress tracking APIs
│   ├── admin/                    # Admin dashboard pages (UI)
│   │   ├── courses/              # Course management interface
│   │   │   ├── [id]/             # Individual course management
│   │   │   │   └── enroll/       # Student enrollment interface
│   │   │   └── new/              # Create new course interface
│   │   ├── students/             # Student management interface
│   │   │   ├── [id]/             # Individual student management
│   │   │   └── new/              # Add new student interface
│   │   ├── profile/              # Admin profile management
│   │   └── page.tsx              # Main admin dashboard
│   ├── student/                  # Student dashboard pages (UI)
│   │   ├── courses/              # Student course access interface
│   │   │   └── [id]/             # Individual course view
│   │   │       └── modules/      # Module viewing interface
│   │   │           └── [moduleId]/# Individual module page
│   │   ├── profile/              # Student profile management
│   │   └── page.tsx              # Main student dashboard
│   ├── login/                    # User login page
│   ├── signup/                   # User registration page
│   ├── contact/                  # Contact information page
│   ├── privacy/                  # Privacy policy page
│   ├── terms/                    # Terms of service page
│   ├── setup/                    # Initial application setup page
│   ├── globals.css               # Global CSS styles
│   ├── layout.tsx                # Root application layout
│   └── page.tsx                  # Landing/home page
├── components/                   # Reusable React components
│   └── ui/                       # UI component library (Shadcn/ui)
├── lib/                          # Utility libraries and configurations
│   ├── auth.ts                   # Authentication helper functions
│   ├── database.ts               # Database query functions
│   └── supabase.ts               # Supabase client configuration
├── types/                        # TypeScript type definitions
│   └── database.ts               # Database schema type definitions
├── public/                       # Static assets (served publicly)
│   └── images/                   # Image assets and media files
├── .env.local                    # Environment variables (local)
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript compiler configuration
├── package.json                  # NPM dependencies and scripts
├── README.md                     # Main project documentation
├── FOLDER_STRUCTURE.md           # This document
└── DATABASE_SCHEMA.md            # Database schema documentation
```

---

## Directory Explanations

### Core Application (`app/`)
The main application directory using Next.js 14 App Router pattern.

#### API Routes (`app/api/`)
Contains all backend API endpoints that handle server-side logic:

- **`auth/`** - Handles user authentication (login, signup, logout, session verification)
- **`courses/`** - Manages course operations (create, read, update, delete courses and modules)
- **`announcements/`** - Handles course announcements and notifications
- **`student/`** - Student-specific endpoints (enrolled courses, progress stats)
- **`admin/`** - Admin-only endpoints (student management, system administration)
- **`analytics/`** - Reporting and analytics data processing
- **`enrollments/`** - Course enrollment management
- **`progress/`** - Learning progress tracking and updates

#### User Interface Pages (`app/admin/`, `app/student/`)
Frontend pages that users interact with:

- **Admin Pages** - Course creation, student management, analytics dashboard
- **Student Pages** - Course access, video learning, progress tracking
- **Shared Pages** - Authentication, profiles, policies

### Components (`components/`)
Reusable React components that are used across different pages:

- **`ui/`** - Pre-built UI components from Shadcn/ui library (buttons, forms, modals, etc.)
- Custom components for specific features (course cards, progress bars, etc.)

### Libraries (`lib/`)
Utility functions and configurations:

- **`auth.ts`** - Authentication helpers (JWT handling, password validation)
- **`database.ts`** - Database query functions and data operations
- **`supabase.ts`** - Supabase client setup and configuration

### Types (`types/`)
TypeScript type definitions for type safety:

- **`database.ts`** - Database schema types (User, Course, Module, etc.)
- Interface definitions for API responses and component props

### Public Assets (`public/`)
Static files served directly by the web server:

- **`images/`** - Course thumbnails, user avatars, UI assets
- Favicon, robots.txt, and other static resources

---

## Key Features by Directory

### Admin Dashboard (`app/admin/`)
- Course management interface
- Student enrollment and tracking
- Analytics and reporting
- System administration

### Student Portal (`app/student/`)
- Course catalog and enrollment
- Video learning interface
- Progress tracking dashboard
- Profile management

### Authentication (`app/api/auth/`)
- Secure JWT-based authentication
- Role-based access control
- Session management

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Cross-device compatibility

---

## Development Guidelines

### File Organization
- Keep related files grouped in their respective directories
- Use descriptive file names that clearly indicate their purpose
- Follow Next.js App Router conventions for page and API routes

### Component Structure
- Place reusable components in `components/` directory
- Keep page-specific components within their respective page directories
- Use TypeScript for all components and maintain type safety

### API Organization
- Group related API endpoints in logical directories
- Use RESTful conventions for API design
- Implement proper error handling and validation

---

**Related Documentation:**
- [← Back to README](README.md) - Main project documentation
- [Database Schema →](DATABASE_SCHEMA.md) - Database structure and relationships

---
*This document is part of the Bilvens documentation suite.*