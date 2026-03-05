# Bruno API Testing Collection

This Bruno collection contains comprehensive API tests for the React Redux Full Stack E-commerce application.

## Setup Instructions

1. **Install Bruno**: Download from https://www.usebruno.com/
2. **Import Collection**: Open Bruno and import this `bruno/` folder
3. **Configure Environment**:
   - Select "dev" environment for local development
   - Update base URLs and tokens as needed
4. **Run Tests**: Execute requests in order (auth first, then others)

## Collection Structure

```
bruno/
├── bruno.json              # Collection configuration
├── environments/
│   ├── dev.bru            # Development environment
│   └── prod.bru           # Production environment
├── auth/                   # Authentication endpoints
├── products/              # Product management
├── orders/                # Order management
├── order-items/           # Order item management
└── dashboard/             # Admin dashboard
```

## Environment Variables

### Development
- `base_url`: http://localhost:5000/api
- `token`: Auto-set after login, used for authenticated requests

### Production
- `base_url`: Your production API URL
- `token`: JWT token for authenticated requests

## Test Flow

1. **Register/Login** → Get authentication token
2. **Products** → CRUD operations on products
3. **Orders** → Create and manage orders
4. **Order Items** → Add/update/remove items from orders
5. **Dashboard** → View analytics (admin only)

## Authentication

Most endpoints require JWT authentication. The login request automatically stores the token in the environment variable `auth_token` for use in subsequent requests.

## Notes

- Replace placeholder IDs (like `507f1f77bcf86cd799439011`) with actual IDs from your database
- Some endpoints require admin privileges
- All requests include proper assertions for validation
- Collection is designed to work with the API as documented in `modules.md`