"""
Simple script to create default test user.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
import sys
sys.path.insert(0, '.')

from app.config import get_settings
from app.models.user import User
from passlib.context import CryptContext

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_test_user():
    """Create default test user."""
    print("👤 Creating default test user...")
    
    engine = create_async_engine(settings.database_url, echo=False)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal() as session:
        # Check if user exists
        result = await session.execute(
            select(User).where(User.email == "burhan.malu.learning@gmail.com")
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print("⚠️  User already exists!")
            print(f"📧 Email: {existing_user.email}")
            print(f"👤 Name: {existing_user.full_name}")
        else:
            # Hash password
            password_hash = pwd_context.hash("123456")
            
            # Create user
            user = User(
                email="burhan.malu.learning@gmail.com",
                password_hash=password_hash,
                full_name="Burhan Malu"
            )
            session.add(user)
            await session.commit()
            
            print("✅ Test user created successfully!")
            print("📧 Email: burhan.malu.learning@gmail.com")
            print("🔑 Password: 123456")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(create_test_user())
