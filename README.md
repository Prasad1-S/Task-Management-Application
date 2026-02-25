# TaskFlow — Task Management Application

> 24-Hour Technical Assessment Submission — Subhojeet Prasad

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://task-management-application-blond.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)](https://neon.tech/)

---

## Live Demo

**[https://task-management-application-blond.vercel.app/](https://task-management-application-blond.vercel.app/)**

---

## Screenshots

### Landing Page
![Landing Page](./screenshots/Landing.png)

### Login
![Login](./screenshots/login.png)

### Register
![Register](./screenshots/register.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Create Task
![Create Task](./screenshots/createTask.png)

---

## Database Schema

![Database Schema](./screenshots/db.png)

---

## Architecture

```
┌─────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│   Browser   │ ──────▶│  Next.js 16 (Vercel) │ ──────▶│  PostgreSQL     │
│             │        │                      │        │  (Neon)         │
│  React UI   │ ◀───── │  API Routes +        │ ◀───── │                 │
│             │        │  Middleware           │        │  users + tasks  │
└─────────────┘        └──────────────────────┘        └─────────────────┘
       │                          │
       │                          │
  HTTP-only JWT Cookie      Rate Limiting
  (secure, sameSite=lax)    (5/min login)
```

---

## Features

- **Authentication** — Register, login, and logout with JWT stored in HTTP-only cookies
- **Task CRUD** — Create, read, update, and delete tasks
- **Priority Levels** — Low, Medium, High with colour-coded indicators
- **Task Status** — To Do, In Progress, Done with one-click cycling
- **Due Dates** — Set due dates with smart labels: Due today, Due tomorrow, Overdue
- **Search & Filter** — Filter tasks by status, priority, or search by title
- **Progress Tracking** — Live progress bar showing completion percentage
- **Responsive Design** — Works on desktop and mobile
- **Rate Limiting** — 5 attempts/min on login, 3 attempts/min on register
- **Secure Cookies** — HTTP-only, secure in production, sameSite=lax

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React, CSS-in-JS |
| Backend | Next.js API Routes |
| Database | PostgreSQL via Neon |
| Auth | JWT + bcryptjs |
| Deployment | Vercel |

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── register/route.js
│   │   │   ├── logout/route.js
│   │   │   └── me/route.js
│   │   └── tasks/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── dashboard/page.jsx
│   ├── login/page.jsx
│   ├── register/page.jsx
│   ├── layout.jsx
│   └── page.jsx
├── lib/
│   ├── auth.js
│   ├── db.js
│   └── rateLimit.js
├── proxy.js
├── screenshots/
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a [Neon](https://neon.tech) free account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prasad1-S/Task-Management-Application.git
   cd task-management-application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your values in `.env.local`:
   ```env
   DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require
   JWT_SECRET=your_secret_key_here
   ```

4. **Set up the database**

   Run the following SQL to create the required tables:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE tasks (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     priority VARCHAR(20) DEFAULT 'medium',
     status VARCHAR(20) DEFAULT 'todo',
     due_date TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and receive cookie | ❌ |
| POST | `/api/auth/logout` | Clear auth cookie | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks for user | ✅ |
| POST | `/api/tasks` | Create a new task | ✅ |
| PUT | `/api/tasks/:id` | Update a task | ✅ |
| DELETE | `/api/tasks/:id` | Delete a task | ✅ |

---

## Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Auth tokens stored in **HTTP-only cookies** (not accessible via JavaScript)
- **Rate limiting** on auth routes to prevent brute force attacks
- **Secure cookie flag** enabled automatically in production
- Route protection via **Next.js middleware**
- Parameterized SQL queries to prevent **SQL injection**

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## 👤 Submitted By

**Subhojeet Prasad**
24-Hour Technical Assessment

> Built with Next.js 16, PostgreSQL (Neon), and JWT authentication — designed, developed, and deployed within 24 hours.

---

*Submitted to: [Company Name]*