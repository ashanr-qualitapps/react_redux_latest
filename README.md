# React Redux App — Full Stack with Docker

A full-stack web application with **React + Redux Toolkit** frontend, **Node.js + Express** backend, and **MongoDB** database — all containerised with Docker.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, React Router v6, Vite, Axios |
| Backend | Node.js, Express 4, Mongoose, JWT, bcryptjs |
| Database | MongoDB 7 |
| Infrastructure | Docker, Docker Compose, Nginx |

## Project Structure

```
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── config/db.js
│       ├── models/User.js
│       ├── middleware/authMiddleware.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── dashboardController.js
│       └── routes/
│           ├── auth.js
│           └── dashboard.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── app/
        │   ├── store.js
        │   └── apiClient.js
        ├── features/auth/
        │   ├── authSlice.js
        │   └── authAPI.js
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   └── DashboardPage.jsx
        └── components/
            ├── Navbar.jsx
            └── ProtectedRoute.jsx
```

## Quick Start

### With Docker (Recommended)

```bash
# Build and start all containers
docker-compose up --build

# Run in background
docker-compose up --build -d

# Stop all containers
docker-compose down
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MongoDB | localhost:27017 |

### Local Development (Without Docker)

**Backend:**
```bash
cd backend
npm install
# Copy environment variables
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev   # Available at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | — |
| POST | `/api/auth/login` | Login user | — |
| GET | `/api/auth/profile` | Get own profile | Bearer |
| GET | `/api/dashboard` | Get dashboard data | Bearer |
| GET | `/api/health` | Health check | — |

## Features

- ✅ User registration with server-side validation
- ✅ JWT-based login / logout
- ✅ Protected dashboard route
- ✅ Redux Toolkit state management
- ✅ Axios interceptor for auth token
- ✅ Toast notifications
- ✅ Loading & error states
- ✅ Docker multi-container setup
- ✅ Nginx reverse proxy for API
- ✅ MongoDB persistent volume
- ✅ Responsive UI

## Environment Variables

Create `backend/.env` for local development:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/reactredux_db
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRE=7d
```
