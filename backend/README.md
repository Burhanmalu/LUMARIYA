# LUMARIYA E-commerce Backend

Python FastAPI backend for the LUMARIYA luxury e-commerce application.

## Features

- 🚀 FastAPI framework for high performance
- 🐘 NeonDB PostgreSQL database (serverless)
- 🔐 JWT authentication with secure password hashing
- 📝 Automatic API documentation (Swagger UI)
- ✅ Pydantic validation
- 🔄 Async database operations

## Prerequisites

- Python 3.9+
- NeonDB account (free tier available at [neon.tech](https://neon.tech))

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   
   Copy `.env.example` to `.env` and update with your NeonDB credentials:
   ```bash
   cp .env.example .env
   ```

3. **Initialize database:**
   ```bash
   python seed_data.py
   ```

4. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order (checkout)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/addresses` - List addresses
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/{id}` - Update address
- `DELETE /api/users/addresses/{id}` - Delete address

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@host/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Database Schema

The application uses the following models:
- **User**: User accounts and authentication
- **Product**: Product catalog
- **Cart**: Shopping cart items
- **Order**: Order records
- **OrderItem**: Individual items in orders
- **Address**: User shipping addresses

## Development

To run in development mode with auto-reload:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment

For production, use a production ASGI server like Gunicorn:
```bash
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
