# Bilvens

A modern, full-stack Learning Management System built with Next.js, TypeScript, and Supabase. This platform enables administrators to create and manage courses while providing students with an intuitive learning experience.

## Documentation

- **[Folder Structure](FOLDER_STRUCTURE.md)** - Complete project organization guide
- **[Database Schema](DATABASE_SCHEMA.md)** - Detailed database structure and relationships

## Project Description

This LMS platform provides a complete solution for online education with separate interfaces for administrators and students. Administrators can create courses, add video modules, manage students, post announcements, and track progress. Students can enroll in courses, watch video content, track their progress, and receive announcements from instructors.

The platform features a responsive, mobile-first design that works seamlessly across all devices, from smartphones to desktop computers.

## Features

### Admin Features
- **Course Management**: Create, edit, and delete courses with descriptions and thumbnails
- **Module Management**: Add video modules from YouTube with descriptions and duration tracking
- **Student Management**: Add students manually, enroll them in courses, and track their progress
- **Announcements**: Post and manage course-specific announcements for students
- **Analytics Dashboard**: View comprehensive stats on courses, students, and completion rates
- **Progress Tracking**: Monitor individual student progress and generate CSV reports
- **User Authentication**: Secure login with role-based access control

### Student Features
- **Course Access**: View enrolled courses with progress tracking
- **Video Learning**: Watch YouTube-embedded videos with completion tracking
- **Progress Dashboard**: Track personal learning progress and achievements
- **Announcements**: View important updates from instructors
- **Responsive Interface**: Optimized mobile-first design for learning on any device
- **User Profile**: Manage personal information and view learning statistics

### Technical Features
- **Mobile-First Design**: Fully responsive across all screen sizes
- **Real-time Data**: Live updates for progress and announcements
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Database Integration**: PostgreSQL with Supabase for reliable data storage
- **Modern UI**: Clean, professional interface with smooth animations
- **TypeScript**: Full type safety throughout the application

## Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd lms-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_jwt_secret_minimum_32_characters

   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   
   Detailed database setup instructions and SQL commands are available in the [Database Schema Documentation](DATABASE_SCHEMA.md).

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Instructions

### First-Time Setup

1. **Create Admin Account**
   - Visit `/signup` to create the first admin account
   - Update the user's role to 'admin' in the Supabase dashboard

2. **Admin Dashboard**
   - Access admin features at `/admin`
   - Create your first course
   - Add students to the platform
   - Enroll students in courses

3. **Student Access**
   - Students can log in at `/login`
   - Access their courses at `/student`
   - Track progress and view announcements

### Admin Workflow

1. **Course Creation**
   - Click "Create Course" from the admin dashboard
   - Add course title, description, and thumbnail
   - Add video modules with YouTube URLs
   - Post announcements for enrolled students

2. **Student Management**
   - Add students via "Add Student" button
   - Enroll students in specific courses
   - Monitor student progress and completion rates
   - Export progress data as CSV

### Student Workflow

1. **Learning Experience**
   - View enrolled courses on the dashboard
   - Click on a course to access modules
   - Watch videos and mark modules as complete
   - Track overall progress and achievements
   - Read announcements from instructors

## Configuration

### Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Database Configuration**
   - Follow the detailed setup instructions in [Database Schema](DATABASE_SCHEMA.md)
   - Ensure all tables are created successfully
   - Verify foreign key relationships

3. **Authentication Settings**
   - The platform uses custom JWT authentication
   - Supabase is used only for database operations
   - No Supabase Auth configuration needed

### Environment Variables

Ensure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=secure_random_string_32_chars_minimum
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Technologies Used

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern React component library
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Supabase** - PostgreSQL database and client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## Project Structure

For a detailed breakdown of the project's folder structure and organization, see the [Folder Structure Documentation](FOLDER_STRUCTURE.md).

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `types/` - TypeScript type definitions
- `public/` - Static assets

## Database Schema

The application uses PostgreSQL with Supabase. For complete database documentation including table structures, relationships, and setup instructions, see the [Database Schema Documentation](DATABASE_SCHEMA.md).

### Core Tables
- **Users** - Admin and student accounts
- **Courses** - Course information and metadata
- **Modules** - Video content within courses
- **Enrollments** - Student course registrations
- **Module Progress** - Individual learning progress
- **Announcements** - Course communications

## Key Features Breakdown

### Authentication System
- Custom JWT-based authentication
- Role-based access control (Admin/Student)
- Secure password hashing with bcrypt
- Session management with HTTP-only cookies

### Course Management
- CRUD operations for courses and modules
- YouTube video integration
- Progress tracking and analytics
- Announcement system

### User Interface
- Mobile-first responsive design
- Modern, clean interface
- Smooth animations and transitions
- Accessibility-focused components

## Development Guidelines

### Code Standards
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement responsive design for all new features
- Ensure proper error handling and loading states
- Write clean, readable code with meaningful variable names

### Architecture Patterns
- Next.js App Router for file-based routing
- API routes for backend functionality
- Component-based UI architecture
- Custom hooks for shared logic

## Contribution Guidelines

This project is proprietary software developed by Bilvens Technologies. The codebase is not available for public contributions or free distribution.

### For Internal Development

If you're part of the development team:

1. **Branch Naming**: Use descriptive branch names (feature/course-management, fix/login-bug)
2. **Commit Messages**: Write clear, descriptive commit messages
3. **Code Style**: Follow the existing TypeScript and React patterns
4. **Testing**: Test all features thoroughly before submitting
5. **Documentation**: Update documentation for new features

## License

This project is proprietary software owned by Bilvens Technologies. All rights reserved.

**Copyright © 2025 Bilvens Technologies**

This software and its source code are the exclusive property of Bilvens Technologies. Unauthorized copying, distribution, modification, or use of this software, in whole or in part, is strictly prohibited without explicit written permission from Bilvens Technologies.

### Restrictions

- **No Distribution**: This software may not be distributed, sold, or shared publicly
- **No Modification**: Unauthorized modifications to the source code are prohibited  
- **No Reverse Engineering**: Attempting to reverse engineer or decompile the software is forbidden
- **Commercial Use**: Commercial use requires explicit licensing agreement with Bilvens Technologies

For licensing inquiries or permission requests, contact: support@bilvens.com

---

**Built with care by Anup Tiwari**

For technical support or questions about this LMS platform, please contact our development team.