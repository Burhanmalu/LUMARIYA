"""
Add is_admin column to users table.
Run this script to migrate existing database.
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import get_settings

settings = get_settings()


async def migrate():
    """Add is_admin column to users table."""
    engine = create_async_engine(settings.database_url, echo=True)
    
    async with engine.begin() as conn:
        # Check if column exists
        check_query = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='is_admin';
        """)
        result = await conn.execute(check_query)
        exists = result.scalar_one_or_none()
        
        if exists:
            print("✅ Column 'is_admin' already exists!")
        else:
            # Add the column
            add_column_query = text("""
                ALTER TABLE users 
                ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
            """)
            await conn.execute(add_column_query)
            print("✅ Column 'is_admin' added successfully!")
    
    await engine.dispose()


if __name__ == "__main__":
    import sys
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    print("🔧 Migrating database...")
    asyncio.run(migrate())
    print("✅ Migration complete!")
