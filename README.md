# Next.js To-Do App (Supabase Authentication + Role Management)

A full-stack To-Do application built with **Next.js**, **Supabase** and **TailwindCSS**.  
This project includes authentication, role-based access control, admin tools, API routes and unit tests.  
Developed as part of an internship assignment.

---

## Features

### Authentication
- Sign up, login, logout
- Forgot password + password update flow
- Session management with Supabase

### Role-Based Access
- `user` → standard permissions
- `super_admin` → admin dashboard access
- Admin panel displays all users + their todo counts

### To-Do Management
- Add a todo
- List todos
- Mark complete/ incomplete
- Delete todos
- Users can only access their own todos

### API Routes
`/api/todos`
- `GET` → fetch authenticated user's todos
- `POST` → create a todo
- `PATCH` → update todo status
- `DELETE` → remove a todo
 

---

## Installation

Clone the project and install dependencies:

```bash
npm install
npm run dev
