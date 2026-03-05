# API Testing Setup

This project includes comprehensive API testing collections for both Bruno and Postman.

## Files

- `React-Redux-API.postman_collection.json` - Complete Postman collection with all API endpoints
- `bruno/` - Bruno folder-based collection (may require manual import)
- `simple-bruno/` - Minimal Bruno collection for testing
- `flat-bruno/` - Flat Bruno collection structure

## Postman Collection Usage

### Import Steps
1. Open Postman (or Bruno)
2. Click "Import" button
3. Select "File" tab
4. Choose `React-Redux-API.postman_collection.json`
5. Click "Import"

### Environment Setup
1. Create a new environment in Postman
2. Set variable `base_url` to your API endpoint:
   - Development: `http://localhost:5000/api`
   - Production: Your deployed API URL
3. The `token` variable will be automatically set after login

### Testing Flow
1. **Start with Authentication:**
   - Register a new user or Login with existing credentials
   - Token will be automatically saved to `token` variable

2. **Test other endpoints:**
   - All requests include proper Authorization headers
   - Use the saved token for authenticated requests

### Available Endpoints

#### Authentication (3 requests)
- POST /auth/register - Register new user
- POST /auth/login - Login user (saves token)
- GET /auth/profile - Get user profile

#### Products (5 requests)
- GET /products - List products with pagination
- GET /products/:id - Get single product
- POST /products - Create new product
- PUT /products/:id - Update product
- DELETE /products/:id - Delete product

#### Orders (5 requests)
- GET /orders - List user orders
- GET /orders/:id - Get single order
- POST /orders - Create new order
- PUT /orders/:id - Update order status
- DELETE /orders/:id - Delete order

#### Order Items (5 requests)
- GET /orderItems - List order items
- GET /orderItems/:id - Get single order item
- POST /orderItems - Add item to order
- PUT /orderItems/:id - Update order item
- DELETE /orderItems/:id - Remove order item

#### Dashboard (1 request)
- GET /dashboard/stats - Get dashboard statistics

## Bruno Collection

If you prefer using Bruno:

1. Open Bruno application
2. Click "Import Collection"
3. Select the `bruno` folder
4. Configure environments as needed

Note: If Bruno doesn't recognize the folder structure, try importing the Postman collection instead.

## Sample Data

### User Registration
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Product Creation
```json
{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 199.99,
  "stock": 50,
  "category": "electronics"
}
```

### Order Creation
```json
{
  "shippingAddress": "123 Main St, City, State 12345",
  "notes": "Please handle with care"
}
```

## Environment Variables

- `base_url`: API base URL (default: http://localhost:5000/api)
- `token`: JWT authentication token (auto-set after login)

## Tips

- Always test authentication first
- Check response codes and error messages
- Use different user accounts for comprehensive testing
- Test edge cases like invalid IDs, missing authentication, etc.