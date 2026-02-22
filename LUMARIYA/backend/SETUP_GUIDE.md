# LUMARIYA Backend Setup Guide

## Prerequisites

Before you begin, make sure you have:
- Python 3.9 or higher installed
- A NeonDB account (sign up at [neon.tech](https://neon.tech))

## Step 1: Create NeonDB Database

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click "Create Project"
3. Choose a project name (e.g., "lumariya-ecommerce")
4. Select a region close to you
5. Click "Create Project"
6. Copy your connection string (it will look like: `postgresql://username:password@ep-xxx.neon.tech/neondb`)

## Step 2: Install Dependencies

Open a terminal in the `backend` directory and run:

```bash
cd backend
pip install -r requirements.txt
```

## Step 3: Configure Environment

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and update the following:
   ```env
   DATABASE_URL=postgresql://your-neon-connection-string
   SECRET_KEY=your-secret-key-here-change-this
   ```

   **Important**: 
   - Replace `postgresql://` with `postgresql+asyncpg://` in your DATABASE_URL
   - Generate a secure SECRET_KEY (you can use: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)

## Step 4: Initialize Database

Run the seed script to create tables and populate with products:

```bash
python seed_data.py
```

You should see output like:
```
🌱 Starting database seeding...
📦 Creating database tables...
✨ Adding 8 products to database...
✅ Database seeding completed successfully!
📊 Added 8 products
```

## Step 5: Start the Server

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`

## Step 6: Test the API

Open your browser and go to:
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Quick Test

Try these endpoints in the Swagger UI (http://localhost:8000/docs):

1. **Get all products**: `GET /api/products`
2. **Register a user**: `POST /api/auth/register`
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "full_name": "Test User"
   }
   ```
3. **Login**: `POST /api/auth/login`
   - Copy the `access_token` from the response
   - Click "Authorize" button at the top
   - Enter: `Bearer <your-token>`
4. **Get current user**: `GET /api/auth/me`

## Troubleshooting

### Connection Error
If you get a connection error, make sure:
- Your DATABASE_URL is correct
- You've replaced `postgresql://` with `postgresql+asyncpg://`
- Your NeonDB project is active

### Module Not Found
If you get import errors:
```bash
pip install -r requirements.txt
```

### Port Already in Use
If port 8000 is busy, use a different port:
```bash
uvicorn app.main:app --reload --port 8001
```

## Next Steps

- Update your Next.js frontend to call these API endpoints
- Add authentication to protected routes
- Customize the tax calculation in orders
- Add admin authentication for product management

## Production Deployment

For production, use Gunicorn with Uvicorn workers:

```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

Consider deploying to:
- **Railway**: Easy deployment with automatic HTTPS
- **Render**: Free tier available
- **Fly.io**: Global deployment
- **AWS/GCP/Azure**: Full control
