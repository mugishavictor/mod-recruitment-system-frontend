# MOD Recruitment System – Frontend

## Overview
This frontend is the user-facing interface for the **MOD Recruitment System**. It allows:
- applicants to submit applications with a CV
- applicants to track application status using a reference code
- HR users to review applications
- Super Admin users to manage system users
- HR and Super Admin users to view dashboard statistics

## Live Demo
Frontend URL: `https://mod-recruitment-system.vercel.app/`

## Repository
Frontend repository: `https://github.com/mugishavictor/mod-recruitment-system-frontend`

## Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Fetch-based API client

## Main Features
### Public pages
- `/` – landing page
- `/login` – user login
- `/apply` – applicant submission form
- `/profile-status` – application status tracking

### Protected pages
- `/dashboard` – dashboard statistics
- `/applications` – latest applications for HR review
- `/applications/[id]` – application details and review
- `/users` – user management for Super Admin

## Prerequisites
Install the following before running locally:
- Node.js 18 or later
- npm or yarn
- running backend API

## Environment Variables
Create a file named `.env.local` in the frontend root.

```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
```

For deployed environments, point this to the deployed backend URL.

## Installation
```bash
git clone https://github.com/mugishavictor/mod-recruitment-system-frontend.git
cd mod-recruitment-system-frontend
npm install
```

## Run Locally
```bash
npm run dev
```

The app will be available at:

```text
http://localhost:3000
```

## Build for Production
```bash
npm run build
npm run start
```

## How the Frontend Connects to the Backend
The frontend uses `NEXT_PUBLIC_API_URL` to call backend endpoints.

Expected backend base URL pattern:

```text
http://localhost:8081/api/v1
```

Examples:
- `POST /auth/login`
- `POST /applications`
- `GET /applications/status/{referenceCode}`
- `GET /hr/applications`
- `GET /dashboard/stats`
- `GET /users`

## Authentication Flow
- User logs in through `/login`
- Backend returns a JWT token
- Token is stored in browser localStorage
- Protected pages use the token to call the backend
- Users without a token are redirected back to `/login`

## Data Required to Use the System
### 1. Applicant submission
To submit an application, the applicant needs:
- National ID number
- First name
- Last name
- Phone number
- Email address
- Date of birth
- Address
- Grade
- School option
- CV file (`.pdf`, `.doc`, or `.docx`)

### 2. Status tracking
The applicant needs:
- application reference code returned after submission

### 3. HR review
The HR user needs:
- valid HR login credentials
- access to application list and detail page

### 4. Super Admin actions
The admin user needs:
- valid Super Admin credentials
- access to user management page

## Expected Demo Credentials
These should match the backend seed data:

### Super Admin
- Email: `admin@recruitment.com`
- Password: `Admin@123`

### HR
- Email: `hr@recruitment.com`
- Password: `Hr@123`

## Typical User Flows
### Applicant flow
1. Open `/apply`
2. Enter NID
3. Fetch simulated NID and NESA data
4. Complete the remaining fields
5. Upload CV
6. Submit the application
7. Copy the returned reference code
8. Open `/profile-status` to track progress

### HR flow
1. Login with HR account
2. Open `/applications`
3. Review the latest 10 applications
4. Open an application detail page
5. Approve or reject with a reason

### Super Admin flow
1. Login with admin account
2. Open `/users`
3. Create, update, or deactivate users

## Suggested UI Components
This project uses shadcn/ui components for:
- buttons
- inputs
- cards
- forms
- tables
- dialogs
- badges
- textareas
- selects

## Important Notes
- The frontend depends on the backend being available and reachable
- If login succeeds but protected pages fail, check `NEXT_PUBLIC_API_URL`
- If browser requests fail, verify backend CORS settings
- For production, make sure the backend allows the deployed frontend origin

## Recommended Submission Notes
When sharing this project, include:
- deployed frontend URL
- backend repository link
- frontend repository link
- demo credentials
- short explanation of applicant, HR, and admin flows

## Troubleshooting
### Login works but dashboard does not load
Check:
- backend is running
- token exists in localStorage
- `NEXT_PUBLIC_API_URL` points to the correct backend

### API requests fail with CORS errors
Check backend CORS configuration and allowed frontend origin.

### File upload fails
Check:
- file is PDF, DOC, or DOCX
- file size is within allowed upload limit
- backend upload directory configuration is correct

## License
This project was developed as part of a coding challenge submission.