"""
Quick script to update the User table with OAuth fields.
Run this to add the new columns to existing database.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import get_settings

settings = get_settings()

async def add_oauth_columns():
    """Add OAuth columns to User table."""
    print("🔧 Adding OAuth columns to User table...")
    
    engine = create_async_engine(settings.database_url, echo=True)
    
    async with engine.begin() as conn:
        # Add oauth_provider column
        try:
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN oauth_provider VARCHAR"
            ))
            print("✅ Added oauth_provider column")
        except Exception as e:
            print(f"⚠️  oauth_provider column might already exist: {e}")
        
        # Add oauth_id column
        try:
            await conn.execute(text(
                "ALTER TABLE users ADD COLUMN oauth_id VARCHAR"
            ))
            print("✅ Added oauth_id column")
        except Exception as e:
            print(f"⚠️  oauth_id column might already exist: {e}")
        
        # Make password_hash nullable
        try:
            await conn.execute(text(
                "ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL"
            ))
            print("✅ Made password_hash nullable")
        except Exception as e:
            print(f"⚠️  password_hash might already be nullable: {e}")
    
    await engine.dispose()
    print("✅ Migration completed!")

if __name__ == "__main__":
    asyncio.run(add_oauth_columns())
