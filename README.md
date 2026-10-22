# 🎓 LearnHub — Learning Management System

**Learn • Grow • Achieve**

LearnHub is a full-stack Learning Management System (LMS) developed using the MERN stack. It provides a platform where students can explore courses, enroll in learning programs, and track their learning activities, while administrators can manage courses through a dedicated dashboard.

## 🌐 Live Demo

- **Frontend:** https://learn-hub-ten-teal.vercel.app
- **Backend API:** https://learnhub-backend-flame.vercel.app/api/courses
- **GitHub Repository:** https://github.com/laibarasheed879/LearnHub

## ✨ Key Features

### 👩‍🎓 Student Features
- Student registration and login
- Secure authentication using JWT
- Browse available courses and view course details
- Enroll in courses
- Access a personalized student dashboard
- View enrolled courses and learning progress

### 🛠️ Admin Features
- Admin authentication and role-based access
- Add new courses
- View and manage existing courses
- Update course information
- Delete courses
- Manage course content through the admin dashboard

### 🎨 User Interface
- Modern blue-and-white design
- Responsive layout for different screen sizes
- Reusable React components
- Interactive navigation and course cards
- Form validation and user notifications

## 🧰 Technologies Used

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

### 3. Set Up the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm start
```

The React development server will display the local frontend address in the terminal.

## 🔐 Security Notes

- Keep database credentials and JWT secrets private.
- Never commit your `.env` file or real credentials to GitHub.
- Configure environment variables separately for local development and deployment.

## 🎯 Project Objective

The objective of LearnHub is to demonstrate practical implementation of full-stack web development concepts, including frontend development, REST APIs, database integration, authentication, role-based authorization, CRUD operations, and deployment.

## 👩‍💻 Developer

**Laiba Rasheed**

MERN Stack Web Development — Final Project, Batch 3

---

*LearnHub — Making online learning more accessible and organized.*
