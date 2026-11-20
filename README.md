# 🎓 LearnHub — Learning Management System

**Learn • Grow • Achieve**

LearnHub is a full-stack Learning Management System (LMS) developed using the MERN stack. It provides a platform where students can explore courses, enroll in learning programs, and track their learning activities, while administrators can manage courses through a dedicated dashboard.
Instructors can create and manage their own courses, upload course lessons, and view enrolled students.

# Live Demo

- **Frontend:** https://learn-hub-ten-teal.vercel.app
- **Backend API:** https://learnhub-backend-flame.vercel.app/api/courses
- **GitHub Repository:** https://github.com/laibarasheed879/LearnHub

# Key Features

# Student Features
- Student registration and login
- Secure authentication using JWT
- Browse available courses and view course details
- Enroll in courses
- Access a personalized student dashboard
- View enrolled courses and learning progress

# Admin Features
- Admin authentication and role-based access
- Add, view, update, and delete courses
- View users and update account roles
- View platform analytics for users, courses, enrollments, and progress

# Instructor Features
- Instructor registration and role-based dashboard access
- Create, view, update, and delete owned courses
- Upload and delete PDF, text, MP4, MOV, and WebM lesson files (up to 4 MB each)
- View students enrolled in owned courses

## User Interface
- Modern blue-and-white design
- Responsive layout for different screen sizes
- Reusable React components
- Interactive navigation and course cards
- Form validation and user notifications

#Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| React Bootstrap | Responsive layout and UI components |
| React Router DOM | Client-side navigation |
| Axios | API requests |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| MongoDB Atlas | Cloud database |
| Mongoose | Database schemas and models |
| JSON Web Token (JWT) | Authentication |
| CSS | Styling and responsive design |
| Vercel | Deployment |

## API Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require
`Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register as a student or instructor |
| POST | `/auth/login` | Public | Login and receive a JWT |
| GET | `/auth/profile` | Authenticated | Read the current token's profile |
| GET | `/courses` | Public | List courses |
| GET | `/courses/:id` | Public | Read one course |
| POST | `/courses` | Admin or instructor | Create a course |
| PUT | `/courses/:id` | Admin or owning instructor | Update a course |
| DELETE | `/courses/:id` | Admin or owning instructor | Delete a course |
| GET | `/courses/my-courses` | Instructor | List the instructor's courses |
| GET | `/courses/instructor/enrollments` | Instructor | List students enrolled in their courses |
| GET | `/courses/:courseId/lessons` | Enrolled student, owning instructor, or admin | List course lessons |
| POST | `/courses/:courseId/lessons` | Admin or owning instructor | Upload a lesson (`title` and multipart `file`) |
| GET | `/courses/:courseId/lessons/:lessonId/file` | Enrolled student, owning instructor, or admin | Download a lesson |
| DELETE | `/courses/:courseId/lessons/:lessonId` | Admin or owning instructor | Delete a lesson |
| POST | `/enrollments` | Student | Enroll using `{ "courseId": "..." }` |
| GET | `/enrollments/my-courses` | Student | List enrolled courses and progress |
| GET | `/admin/users` | Admin | List users |
| PATCH | `/admin/users/:id/role` | Admin | Update a user's role |
| DELETE | `/admin/users/:id` | Admin | Delete a user |
| GET | `/admin/analytics` | Admin | Read platform counts and average progress |

Lesson files are stored in MongoDB with their lesson records so uploads persist
across serverless deployments. The 4 MB per-file limit accommodates the request
size limits of the configured Vercel deployment.

## 📁 Project Structure

```text
LearnHub/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Run the Project Locally

### Prerequisites
- Node.js and npm
- MongoDB connection
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/laibarasheed879/LearnHub.git
cd LearnHub
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and configure your own database connection and JWT secret:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```

Start the backend:

```bash
npm start
```

If your backend does not define a `start` script, use the start command configured in its `package.json`.

# 3. Set Up the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm start
```

The React development server will display the local frontend address in the terminal.

# Security Notes

- Keep database credentials and JWT secrets private.
- Never commit your `.env` file or real credentials to GitHub.
- Configure environment variables separately for local development and deployment.

# Project Objective

The objective of LearnHub is to demonstrate practical implementation of full-stack web development concepts, including frontend development, REST APIs, database integration, authentication, role-based authorization, CRUD operations, and deployment.

# Developer

**Laiba Rasheed**

MERN Stack Web Development — Final Project, Batch 3

---

*LearnHub — Making online learning more accessible and organized.*
