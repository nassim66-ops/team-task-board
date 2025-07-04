Overview
A React-based task management application with user authentication and CRUD operations for tasks. The app features secure login/registration, password reset functionality, and full task management capabilities with filtering options. Built with tRPC for type-safe API calls and Supabase for backend services and data persistence.

Features

- Authentication
- User registration with email/password
- Secure login/logout functionality
- Password reset via email
- Session management

Task Management

- Create new tasks with title and description
- Edit existing tasks
- Change status by drag and drop
- Delete tasks
- Filter tasks by title or description
- Persist all changes to database

Technology Stack

- Frontend: React (Vite)
- State Management: React Context (for auth), tRPC for data
- Styling: Tailwind CSS
- API Layer: tRPC
- Backend: Supabase (Auth + Database)
- Routing: React Router

  Setup Instructions

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Git
- env variables:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - VITE_SUPABASE_ANON_KEY
  - VITE_SUPABASE_URL
-
