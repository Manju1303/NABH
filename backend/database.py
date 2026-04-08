from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database Configuration
# Supports both SQLite (local/disk) and PostgreSQL (Supabase/Render)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Normalize to asyncpg driver for both postgres:// and postgresql:// schemes
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    DB_URL = DATABASE_URL
    print(f"[DB] Using cloud PostgreSQL (Supabase)")
else:
    # Fallback to local SQLite
    DB_PATH = os.getenv("DB_PATH", "./nabh.db")
    DB_URL = f"sqlite+aiosqlite:///{DB_PATH}"
    print(f"[DB] Using local SQLite at: {DB_PATH}")

engine = create_async_engine(
    DB_URL,
    echo=False,
    # For PostgreSQL: use a connection pool; for SQLite: single connection
    pool_pre_ping=True,
)

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
