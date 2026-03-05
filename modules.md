# Modules Documentation

This document provides detailed information about all modules in the React Redux Full Stack E-commerce Application.

## Backend Modules

### User Module
**Purpose**: Handles user authentication, registration, and profile management with role-based access control.

**Data Model** (`backend/src/models/User.js`):
- `name`: String (required, max 50 chars) - User's full name
- `email`: String (required, unique, validated) - User's email address
- `password`: String (required, min 6 chars, hashed with bcrypt) - User's password
- `role`: String (enum: 'user'/'admin', default: 'user') - User role for permissions
- `isActive`: Boolean (default: true) - Account status
- `timestamps`: Automatic createdAt/updatedAt fields

**Key Features**:
- Password hashing with bcrypt (12 salt rounds)
- Password comparison method for authentication
- Email uniqueness validation
- Role-based permissions (user/admin)

**API Endpoints** (`backend/src/routes/auth.js`):
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User login with JWT token generation
- `GET /api/auth/profile` - Get current user profile (protected)

**Controller Logic** (`backend/src/controllers/authController.js`):
- JWT token generation (expires in 7 days by default)
- Input validation using express-validator
- Password hashing and comparison
- User existence checks

### Product Module
**Purpose**: Manages the product catalog with CRUD operations, inventory tracking, and search functionality.

**Data Model** (`backend/src/models/Product.js`):
- `name`: String (required, max 100 chars) - Product name
- `description`: String (max 1000 chars) - Product description
- `price`: Number (required, min 0) - Product price
- `stock`: Number (default 0, min 0) - Available inventory
- `category`: String (default 'general') - Product category
- `isActive`: Boolean (default true) - Product availability status
- `createdBy`: ObjectId (ref: 'User') - Creator of the product
- `timestamps`: Automatic createdAt/updatedAt fields

**Key Features**:
- Inventory management with stock tracking
- Category-based organization
- Creator attribution
- Active/inactive status for soft deletion

**API Endpoints** (`backend/src/routes/products.js`):
- `GET /api/products` - List products with pagination, filtering, and search
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

**Controller Logic** (`backend/src/controllers/productController.js`):
- Pagination support (default 50 items per page)
- Category and name-based search with regex
- Creator information population
- Input validation for price and required fields

### Order Module
**Purpose**: Manages customer orders with status tracking and relationship to order items.

**Data Model** (`backend/src/models/Order.js`):
- `user`: ObjectId (ref: 'User', required) - Customer who placed the order
- `status`: String (enum: 'pending'/'processing'/'shipped'/'delivered'/'cancelled', default: 'pending')
- `totalAmount`: Number (default 0, min 0) - Total order value
- `shippingAddress`: String (required) - Delivery address
- `notes`: String - Optional order notes
- `timestamps`: Automatic createdAt/updatedAt fields

**Key Features**:
- Order status lifecycle management
- User association for ownership
- Total amount calculation
- Shipping information storage

**API Endpoints** (`backend/src/routes/orders.js`):
- `GET /api/orders` - List orders (admin: all, user: own orders)
- `GET /api/orders/:id` - Get order details (owner or admin only)
- `POST /api/orders` - Create new order (protected)
- `PUT /api/orders/:id` - Update order status (protected)
- `DELETE /api/orders/:id` - Cancel order (protected)

**Controller Logic** (`backend/src/controllers/orderController.js`):
- Role-based access control (users see own orders, admins see all)
- Order ownership validation
- Status update restrictions
- User information population

### OrderItem Module
**Purpose**: Manages individual line items within orders, linking products to quantities and prices.

**Data Model** (`backend/src/models/OrderItem.js`):
- `order`: ObjectId (ref: 'Order', required) - Parent order
- `product`: ObjectId (ref: 'Product', required) - Product being ordered
- `quantity`: Number (required, min 1) - Quantity ordered
- `unitPrice`: Number (required, min 0) - Price per unit at time of order
- `subtotal`: Number (auto-calculated) - Line item total (quantity × unitPrice)
- `timestamps`: Automatic createdAt/updatedAt fields

**Key Features**:
- Automatic subtotal calculation on save/update
- Product and order relationship management
- Price snapshot at time of order (prevents price changes affecting past orders)
- Quantity validation

**API Endpoints** (`backend/src/routes/orderItems.js`):
- `GET /api/orderItems` - List order items (admin: all, user: own orders' items)
- `GET /api/orderItems/:id` - Get order item details
- `POST /api/orderItems` - Add item to order (protected)
- `PUT /api/orderItems/:id` - Update order item (protected)
- `DELETE /api/orderItems/:id` - Remove item from order (protected)

### Dashboard Module
**Purpose**: Provides analytics and overview data for administrative users.

**API Endpoints** (`backend/src/routes/dashboard.js`):
- `GET /api/dashboard/stats` - Get dashboard statistics (admin only)

**Controller Logic** (`backend/src/controllers/dashboardController.js`):
- Aggregated data for orders, products, and users
- Statistical calculations and summaries

## Frontend Features

### Auth Feature
**Purpose**: Manages user authentication state, login/logout flows, and protected routes.

**API Layer** (`frontend/src/features/auth/authAPI.js`):
- `register(userData)` - Register new user and store token
- `login(userData)` - Login user and store token
- `logout()` - Clear stored user data

**State Management** (`frontend/src/features/auth/authSlice.js`):
- Redux slice with async thunks for register/login
- Local storage persistence for user session
- Loading, error, and success state tracking
- Message handling for user feedback

**Components**:
- `LoginPage.jsx` - Login form with validation
- `RegisterPage.jsx` - Registration form
- `ProtectedRoute.jsx` - Route guard component

### Products Feature
**Purpose**: Handles product browsing, CRUD operations, and inventory management.

**API Layer** (`frontend/src/features/products/productAPI.js`):
- `getProducts(params)` - Fetch products with pagination/filtering
- `getProduct(id)` - Get single product
- `createProduct(data)` - Create new product
- `updateProduct(id, data)` - Update existing product
- `deleteProduct(id)` - Delete product

**State Management** (`frontend/src/features/products/productSlice.js`):
- Async thunks for all CRUD operations
- Pagination state management
- Loading/error states
- Product list and individual product state

**Components**:
- `ProductsPage.jsx` - Product listing and management interface

### Orders Feature
**Purpose**: Manages order viewing, creation, and status tracking.

**API Layer** (`frontend/src/features/orders/orderAPI.js`):
- Order CRUD operations similar to products
- Status update functionality

**State Management** (`frontend/src/features/orders/orderSlice.js`):
- Order list and detail state management
- Status update handling

**Components**:
- `OrdersPage.jsx` - Order listing
- `OrderDetailPage.jsx` - Individual order view with items

### OrderItems Feature
**Purpose**: Manages order line items and cart functionality.

**API Layer** (`frontend/src/features/orderItems/orderItemAPI.js`):
- Order item CRUD operations

**State Management** (`frontend/src/features/orderItems/orderItemSlice.js`):
- Order item state management

## Core Infrastructure

### API Client (`frontend/src/app/apiClient.js`)
- Axios instance with base URL `/api`
- Automatic JWT token attachment via request interceptor
- Centralized HTTP configuration

### Redux Store (`frontend/src/app/store.js`)
- Configured with Redux Toolkit
- Combined reducers for all features:
  - auth
  - products
  - orders
  - orderItems

### Authentication Middleware (`backend/src/middleware/authMiddleware.js`)
- JWT token verification
- User attachment to request object
- Route protection

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Development**: nodemon

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + React Redux
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Styling**: Tailwind CSS (inferred from setup)

### DevOps
- **Containerization**: Docker (frontend nginx, backend node)
- **Orchestration**: Docker Compose
- **Development**: Hot reload for both frontend (Vite) and backend (nodemon)

## Data Relationships

```
User (1) ──── (M) Order (1) ──── (M) OrderItem (M) ──── (1) Product
  │              │                    │                    │
  │              │                    │                    │
  └──────────────┼────────────────────┼────────────────────┘
                 │                    │
                 └────────────────────┘
                      Order Total
                      Calculation
```

## Security Features

- JWT-based authentication with configurable expiration
- Password hashing with salt rounds
- Role-based access control (user/admin)
- Input validation and sanitization
- Protected routes with middleware
- CORS configuration
- Helmet security headers

## API Response Patterns

- Consistent error handling with message field
- Pagination metadata for list endpoints
- Population of related data (user names, product details)
- HTTP status codes following REST conventions
- Validation error arrays from express-validator

## Developer Guide

### Getting Started

#### Prerequisites
- **Node.js** (v16 or higher)
- **Docker** and **Docker Compose**
- **MongoDB** (local or cloud instance)
- **Git** for version control

#### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd react-redux-latest
   ```

2. **Install dependencies**:
   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install

   # Return to root
   cd ..
   ```

3. **Environment Configuration**:
   Create `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/react-redux-app
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   ```

#### Running the Application

**Using Docker Compose (Recommended)**:
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Manual Development Setup**:
```bash
# Terminal 1: Start MongoDB (if running locally)
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

**Access the application**:
- Frontend: http://localhost:5173 (Vite dev server)
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Development Workflow

#### Code Structure Overview
```
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── models/         # Mongoose data models
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Custom middleware
│   │   └── index.js        # Server entry point
│   ├── Dockerfile          # Backend container config
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── app/           # Core app configuration
│   │   ├── features/      # Redux feature slices
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── main.jsx       # React entry point
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container config
│   └── package.json
├── docker-compose.yml      # Multi-container setup
└── modules.md             # This documentation
```

#### Adding New Features

**Backend API Development**:
1. **Create/Update Model** (`backend/src/models/`):
   - Define Mongoose schema with validations
   - Add pre/post hooks if needed
   - Export the model

2. **Create Controller** (`backend/src/controllers/`):
   - Implement CRUD operations
   - Add input validation
   - Handle errors appropriately
   - Return consistent response format

3. **Create Routes** (`backend/src/routes/`):
   - Define Express routes
   - Apply middleware (auth, validation)
   - Import and use controllers

4. **Update Main Server** (`backend/src/index.js`):
   - Import and mount new routes
   - Ensure proper middleware order

**Frontend Feature Development**:
1. **Create API Layer** (`frontend/src/features/[feature]/`):
   - Define API functions using apiClient
   - Handle request/response formatting

2. **Create Redux Slice** (`frontend/src/features/[feature]/[feature]Slice.js`):
   - Define initial state
   - Create async thunks for API calls
   - Implement reducers for state updates

3. **Create Components** (`frontend/src/components/` or `frontend/src/pages/`):
   - Use Redux hooks for state management
   - Implement proper loading/error states
   - Follow component composition patterns

4. **Update Store** (`frontend/src/app/store.js`):
   - Import and add new reducer

#### Database Operations

**Common Mongoose Patterns**:
```javascript
// Population (join-like operations)
const orders = await Order.find().populate('user', 'name email')

// Aggregation pipeline
const stats = await Order.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } }
])

// Text search
const products = await Product.find({
  $text: { $search: 'laptop' }
})
```

**Migration Strategy**:
- Use Mongoose schema versioning
- Implement data migration scripts for schema changes
- Test migrations on development data first

### Testing

#### API Testing
```bash
# Using curl
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Using Postman/Insomnia
# Import the API collection and set base URL to http://localhost:5000
```

#### Frontend Testing
```bash
# Run frontend in development mode
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

#### Docker Deployment
```bash
# Build production images
docker-compose -f docker-compose.yml up --build -d

# Scale services if needed
docker-compose up -d --scale backend=3
```

#### Environment Variables
- `NODE_ENV`: 'development' | 'production'
- `PORT`: Backend server port
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: Token expiration time

### Best Practices

#### Backend
- **Validation**: Always validate input using express-validator
- **Error Handling**: Use consistent error response format
- **Authentication**: Protect sensitive routes with middleware
- **Database**: Use indexes for frequently queried fields
- **Security**: Sanitize user inputs, use parameterized queries

#### Frontend
- **State Management**: Keep Redux slices focused on specific domains
- **Components**: Use functional components with hooks
- **API Calls**: Handle loading, success, and error states
- **Routing**: Protect routes using ProtectedRoute component
- **Styling**: Follow consistent CSS/Tailwind patterns

#### General
- **Git Workflow**: Use feature branches, write descriptive commits
- **Documentation**: Update this guide when adding new features
- **Code Review**: Always review code changes before merging
- **Security**: Never commit secrets or sensitive data

### Troubleshooting

#### Common Issues

**MongoDB Connection Failed**:
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify network connectivity

**CORS Errors**:
- Check CORS configuration in backend
- Ensure correct frontend URL in allowed origins

**JWT Token Issues**:
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper Authorization header format

**Build Failures**:
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

#### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Backend debug mode
NODE_ENV=development npm run dev
```

### Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make changes** following the development workflow
4. **Test thoroughly** on all environments
5. **Update documentation** if needed
6. **Submit a pull request** with detailed description

### Support

For questions or issues:
- Check this documentation first
- Review existing GitHub issues
- Create new issues with detailed reproduction steps
- Include environment details and error logs