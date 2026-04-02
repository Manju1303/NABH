from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os

# Database Configuration
# Supports both SQLite (local/disk) and PostgreSQL (Supabase/Render)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Ensure the URL uses the asyncpg driver for PostgreSQL
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    DB_URL = DATABASE_URL
else:
    # Fallback to SQLite (requires persistent disk on Render)
    DB_PATH = os.getenv("DB_PATH", "./nabh.db")
    DB_URL = f"sqlite+aiosqlite:///{DB_PATH}"

engine = create_async_engine(DB_URL, echo=False)

AsyncSessionLocal = async_sessionmaker(

    bind=engine, class_=AsyncSession, expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
