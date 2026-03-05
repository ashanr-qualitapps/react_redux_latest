# React Redux Full Stack E-commerce Application

A comprehensive full-stack e-commerce application built with React, Redux Toolkit, Node.js, Express, and MongoDB. Features user authentication, product management, order processing, and a complete admin dashboard.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control (User/Admin)
- **Product Management**: Complete CRUD operations for products with inventory tracking
- **Order Processing**: Full order lifecycle management with status tracking
- **Admin Dashboard**: Analytics and overview for administrative users
- **Responsive Design**: Mobile-friendly interface
- **Docker Containerization**: Easy deployment with Docker Compose
- **Real-time Updates**: Redux state management for seamless UI updates

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management with RTK Query
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **React Toastify** - Notification system
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet & cors** - Security middleware

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy for production

## 📁 Project Structure

```
├── backend/                          # Express.js API server
│   ├── Dockerfile                    # Backend container config
│   ├── package.json                  # Backend dependencies
│   └── src/
│       ├── index.js                  # Server entry point
│       ├── config/
│       │   └── db.js                 # Database configuration
│       ├── models/                   # Mongoose data models
│       │   ├── User.js               # User schema
│       │   ├── Product.js            # Product schema
│       │   ├── Order.js              # Order schema
│       │   └── OrderItem.js          # Order item schema
│       ├── controllers/              # Route handlers
│       │   ├── authController.js     # Authentication logic
│       │   ├── productController.js  # Product CRUD
│       │   ├── orderController.js    # Order management
│       │   ├── orderItemController.js# Order item management
│       │   └── dashboardController.js# Admin dashboard
│       ├── routes/                   # API route definitions
│       │   ├── auth.js               # Auth endpoints
│       │   ├── products.js           # Product endpoints
│       │   ├── orders.js             # Order endpoints
│       │   ├── orderItems.js         # Order item endpoints
│       │   └── dashboard.js          # Dashboard endpoints
│       └── middleware/
│           └── authMiddleware.js     # Authentication middleware
├── frontend/                         # React application
│   ├── Dockerfile                    # Frontend container config
│   ├── nginx.conf                    # Nginx configuration
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── index.html                    # HTML template
│   ├── public/                       # Static assets
│   │   └── react.svg                 # App favicon
│   └── src/
│       ├── main.jsx                  # React entry point
│       ├── index.css                 # Global styles
│       ├── App.jsx                   # Main app component
│       ├── app/
│       │   ├── store.js              # Redux store configuration
│       │   └── apiClient.js          # Axios client setup
│       ├── features/                 # Redux feature slices
│       │   ├── auth/
│       │   │   ├── authAPI.js        # Auth API functions
│       │   │   └── authSlice.js      # Auth Redux slice
│       │   ├── products/
│       │   │   ├── productAPI.js     # Product API functions
│       │   │   └── productSlice.js   # Product Redux slice
│       │   ├── orders/
│       │   │   ├── orderAPI.js       # Order API functions
│       │   │   └── orderSlice.js     # Order Redux slice
│       │   └── orderItems/
│       │       ├── orderItemAPI.js   # Order item API functions
│       │       └── orderItemSlice.js # Order item Redux slice
│       ├── components/               # Reusable UI components
│       │   ├── Navbar.jsx            # Navigation component
│       │   └── ProtectedRoute.jsx    # Route protection
│       └── pages/                    # Page components
│           ├── LoginPage.jsx         # Login page
│           ├── RegisterPage.jsx      # Registration page
│           ├── DashboardPage.jsx     # Admin dashboard
│           ├── ProductsPage.jsx      # Product management
│           ├── OrdersPage.jsx        # Order listing
│           └── OrderDetailPage.jsx   # Order details
├── docker-compose.yml                # Multi-container setup
├── modules.md                        # Detailed module documentation
└── README.md                         # This file
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Docker** and **Docker Compose**
- **Git** for version control

## 🚀 Getting Started

### Quick Start with Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd react-redux-latest
   ```

2. **Start the application**:
   ```bash
   # Build and start all services
   docker-compose up --build

   # Or run in background
   docker-compose up -d --build
   ```

3. **Access the application**:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **MongoDB**: localhost:27017

4. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Manual Development Setup

1. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Environment Configuration**:
   Create `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/react-redux-app
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   JWT_EXPIRE=7d
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7

   # Or install MongoDB locally
   ```

4. **Start the development servers**:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `GET` | `/api/auth/profile` | Get user profile | ✅ (Bearer) |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | List products (with pagination/search) | ❌ |
| `GET` | `/api/products/:id` | Get product details | ❌ |
| `POST` | `/api/products` | Create product | ✅ (Bearer) |
| `PUT` | `/api/products/:id` | Update product | ✅ (Bearer) |
| `DELETE` | `/api/products/:id` | Delete product | ✅ (Bearer) |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/orders` | List orders (user: own, admin: all) | ✅ (Bearer) |
| `GET` | `/api/orders/:id` | Get order details | ✅ (Bearer) |
| `POST` | `/api/orders` | Create order | ✅ (Bearer) |
| `PUT` | `/api/orders/:id` | Update order | ✅ (Bearer) |
| `DELETE` | `/api/orders/:id` | Cancel order | ✅ (Bearer) |

### Order Item Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/orderItems` | List order items | ✅ (Bearer) |
| `GET` | `/api/orderItems/:id` | Get order item details | ✅ (Bearer) |
| `POST` | `/api/orderItems` | Add item to order | ✅ (Bearer) |
| `PUT` | `/api/orderItems/:id` | Update order item | ✅ (Bearer) |
| `DELETE` | `/api/orderItems/:id` | Remove order item | ✅ (Bearer) |

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/dashboard/stats` | Get dashboard statistics | ✅ (Bearer, Admin) |

## 🔧 Development

### Available Scripts

**Backend**:
```bash
cd backend
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

**Frontend**:
```bash
cd frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Quality

- **ESLint**: Configured for both frontend and backend
- **Prettier**: Code formatting (if configured)
- Follow the established patterns in the codebase

### Testing

```bash
# API Testing with curl
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Frontend testing
cd frontend
npm run build  # Test production build
```

## 🚢 Deployment

### Production Docker Deployment

1. **Update environment variables** for production
2. **Build and deploy**:
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/react-redux-app` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the established patterns
4. Test thoroughly
5. Update documentation if needed
6. Submit a pull request

See [modules.md](modules.md) for detailed development guidelines.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- 📖 **Documentation**: See [modules.md](modules.md) for detailed module information
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Discussions**: Use GitHub Discussions for questions

---

**Happy coding! 🎉**

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
