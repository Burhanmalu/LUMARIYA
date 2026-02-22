"""
Seed script to create admin user in the database.
Run this once to set up the initial admin account.

Usage: python seed_admin.py
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.utils.security import get_password_hash
from app.config import get_settings

settings = get_settings()


async def create_admin():
    """Create admin user in database."""
    # Create async engine
    engine = create_async_engine(settings.database_url, echo=True)
    
    # Create async session
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Check if admin already exists
        from sqlalchemy import select
        result = await session.execute(
            select(User).where(User.email == "admin@lumariya.com")
        )
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            print("Admin user already exists!")
            print(f"   Email: {existing_admin.email}")
            print(f"   Name: {existing_admin.full_name}")
            return
        
        # Create admin user
        admin_user = User(
            email="admin@lumariya.com",
            password_hash=get_password_hash("admin123"),
            full_name="Admin User",
            is_admin=1
        )
        
        session.add(admin_user)
        await session.commit()
        await session.refresh(admin_user)
        
        print("Admin user created successfully!")
        print(f"   Email: {admin_user.email}")
        print(f"   Password: admin123")
        print(f"   ID: {admin_user.id}")
        print("\nIMPORTANT: Change the admin password after first login!")
    
    await engine.dispose()

if __name__ == "__main__":
    import sys
    if sys.platform == 'win32':
        # Fix for Windows event loop
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    print("Creating admin user...")
    asyncio.run(create_admin())
