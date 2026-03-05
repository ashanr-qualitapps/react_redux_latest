# Copilot Instructions for React Redux Full Stack App

## Project Overview

This is a full-stack e-commerce application with:
- **Frontend**: React 18 + Redux Toolkit + Vite
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Infrastructure**: Docker + Docker Compose

## Code Structure & Patterns

### Backend Structure
```
backend/src/
├── models/          # Mongoose schemas (User.js, Product.js, Order.js, OrderItem.js)
├── controllers/     # Business logic handlers
├── routes/          # Express route definitions
├── middleware/      # Custom middleware (auth, validation)
├── config/          # Database and app configuration
└── index.js         # Server entry point
```

### Frontend Structure
```
frontend/src/
├── app/             # Core app configuration (store.js, apiClient.js)
├── features/        # Redux feature slices (auth/, products/, orders/, orderItems/)
├── components/      # Reusable UI components
├── pages/           # Page-level components
└── main.jsx         # React app entry point
```

## Technology Stack Details

### Backend
- **Framework**: Express.js with ES6 modules
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing
- **Validation**: express-validator for input sanitization
- **Security**: helmet, cors middleware
- **Development**: nodemon for hot reloading

### Frontend
- **Framework**: React 18 with functional components and hooks
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS (utility-first approach)
- **Notifications**: React Toastify

## Development Guidelines

### Backend Patterns

#### Model Definitions
```javascript
// Use Mongoose schemas with validation
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }
}, { timestamps: true });

// Add instance methods
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

#### Controller Patterns
```javascript
// Async/await with try/catch
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Use express-validator for input validation
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  // ... rest of logic
};
```

#### Route Patterns
```javascript
// Group related routes
const router = express.Router();

// Apply middleware to all routes in group
router.use(protect); // Authentication middleware

// CRUD operations
router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
```

#### Authentication Middleware
```javascript
// JWT verification middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};
```

### Frontend Patterns

#### Redux Slice Pattern
```javascript
// Use createSlice for reducer + actions
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});
```

#### API Layer Pattern
```javascript
// Centralized API functions
const getProducts = (params = {}) =>
  apiClient.get('/products', { params }).then(r => r.data);

const createProduct = (data) =>
  apiClient.post('/products', data).then(r => r.data);

export default { getProducts, createProduct };
```

#### Component Patterns
```javascript
// Functional components with hooks
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  );
};
```

#### Route Protection
```javascript
// Higher-order component for protected routes
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

## File Naming Conventions

### Backend
- **Models**: PascalCase (User.js, Product.js)
- **Controllers**: camelCase + Controller.js (authController.js)
- **Routes**: lowercase (auth.js, products.js)
- **Middleware**: camelCase + Middleware.js (authMiddleware.js)

### Frontend
- **Components**: PascalCase (Navbar.jsx, ProductCard.jsx)
- **Pages**: PascalCase + Page.jsx (LoginPage.jsx)
- **API files**: featureName + API.js (authAPI.js)
- **Slice files**: featureName + Slice.js (authSlice.js)
- **Hooks**: use + PascalCase (useAuth.js)

## API Design Patterns

### RESTful Endpoints
- `GET /api/products` - List with pagination/filtering
- `GET /api/products/:id` - Get single item
- `POST /api/products` - Create new item
- `PUT /api/products/:id` - Update item
- `DELETE /api/products/:id` - Delete item

### Response Format
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Optional success message"
}
```

### Error Handling
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

### Pagination
```json
{
  "products": [...],
  "total": 150,
  "page": 1,
  "pages": 15,
  "limit": 10
}
```

## State Management Guidelines

### Redux Store Structure
```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
```

### Slice Organization
- Keep slices focused on specific domains
- Use meaningful action names
- Handle loading, success, and error states
- Use createAsyncThunk for API calls

## Database Design Patterns

### Schema Relationships
```javascript
// One-to-Many: User -> Orders
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // ... other fields
});

// Many-to-Many: Order <-> Products (via OrderItem)
const orderItemSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  unitPrice: Number
});
```

### Data Validation
- Required fields with custom error messages
- Type validation (String, Number, Boolean, Date)
- Length constraints
- Email format validation
- Custom validation functions

## Security Best Practices

### Backend Security
- Input validation and sanitization
- JWT token expiration
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Rate limiting (consider implementing)

### Frontend Security
- Store JWT in localStorage (consider httpOnly cookies for production)
- Validate user permissions on protected routes
- Sanitize user inputs
- Use HTTPS in production

## Testing Approaches

### Backend Testing
```javascript
// Controller testing with supertest
const request = require('supertest');
const app = require('../src/index');

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
  });
});
```

### Frontend Testing
```javascript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import ProductsPage from './ProductsPage';

test('renders products page', () => {
  render(
    <Provider store={store}>
      <ProductsPage />
    </Provider>
  );

  expect(screen.getByText('Products')).toBeInTheDocument();
});
```

## Deployment Considerations

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb://production-db:27017/app
JWT_SECRET=your-production-secret
JWT_EXPIRE=24h
```

### Docker Configuration
- Multi-stage builds for optimized images
- Non-root user for security
- Proper environment variable handling
- Health checks for containers

### Production Optimizations
- Code minification and bundling
- Image optimization and CDN
- Database indexing
- Caching strategies
- Monitoring and logging

## Common Patterns to Follow

1. **Error Handling**: Always wrap async operations in try/catch
2. **Validation**: Validate inputs on both client and server
3. **Authentication**: Check user permissions for protected operations
4. **Loading States**: Show loading indicators during async operations
5. **Consistent Naming**: Follow established naming conventions
6. **Code Organization**: Keep related code together
7. **Documentation**: Comment complex business logic
8. **Testing**: Write tests for critical functionality

## Quick Reference

### Starting Development
```bash
# Full stack with Docker
docker-compose up --build

# Manual development
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

### Key Files to Know
- `backend/src/index.js` - Server setup
- `frontend/src/app/store.js` - Redux store
- `frontend/src/app/apiClient.js` - HTTP client
- `modules.md` - Detailed documentation
- `docker-compose.yml` - Container orchestration

Remember: This codebase follows modern React/Redux patterns with a focus on maintainability, security, and developer experience. When suggesting code, prioritize these principles and follow the established patterns.