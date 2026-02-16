# Test User Setup

## Default Test User Credentials

**Email:** burhan.malu.learning@gmail.com  
**Password:** 123456

## How to Create the Test User

Since you have the backend running, you can create the test user in two ways:

### Option 1: Via Frontend (Recommended)

1. Open http://localhost:3000 in your browser
2. Click the **User icon** in the navigation
3. Click **"Don't have an account? Sign up"**
4. Fill in the form:
   - **Full Name:** Burhan Malu
   - **Email:** burhan.malu.learning@gmail.com
   - **Password:** 123456
5. Click **"Create Account"**

That's it! You can now login with these credentials.

### Option 2: Via API (Using curl or Postman)

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "burhan.malu.learning@gmail.com",
    "password": "123456",
    "full_name": "Burhan Malu"
  }'
```

## Testing Login

After creating the account, test the login:

1. Go to any product page
2. Click **"Add to Bag"**
3. Login modal should appear
4. Enter:
   - Email: burhan.malu.learning@gmail.com
   - Password: 123456
5. Click **"Sign In"**

You should be logged in and the item should be added to cart!

## Database Migration Completed

✅ The database has been updated with OAuth fields:
- `oauth_provider` (google, facebook, or null)
- `oauth_id` (provider's user ID)
- `password_hash` (now nullable for OAuth users)

The authentication system is fully functional and ready to use!
