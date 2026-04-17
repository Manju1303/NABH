from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os, logging
from dotenv import load_dotenv

logger = logging.getLogger("nabh-api")

# Load environment variables from .env file
load_dotenv()

# Database Configuration
IS_PRODUCTION = os.getenv("RENDER", "") != ""
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Normalize to asyncpg driver for both postgres:// and postgresql:// schemes
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    # Ensure SSL for Supabase/Cloud PostgreSQL
    if "sslmode" not in DATABASE_URL:
        separator = "&" if "?" in DATABASE_URL else "?"
        DATABASE_URL += f"{separator}sslmode=require"
    
    DB_URL = DATABASE_URL
    logger.info(f"[DB] Using cloud PostgreSQL (Supabase)")
else:
    # Fallback to local SQLite
    DB_PATH = os.getenv("DB_PATH", "./nabh.db")
    DB_URL = f"sqlite+aiosqlite:///{DB_PATH}"
    logger.info(f"[DB] Using local SQLite at: {DB_PATH}")

# Connection arguments for Supabase PgBouncer (Transaction Pooler)
connect_args = {}
if DATABASE_URL and "localhost" not in DATABASE_URL.lower():
    # For Supabase/PgBouncer: disable prepared statements to avoid connection pooler issues
    connect_args["server_settings"] = {"application_name": "nabh_api"}

engine = create_async_engine(
    DB_URL,
    echo=False,
    connect_args=connect_args,
    # High-Performance Settings
    pool_size=5 if DATABASE_URL else 3, 
    max_overflow=10 if DATABASE_URL else 5,
    pool_recycle=300,
    pool_pre_ping=True,
    pool_use_lifo=True,
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
    
    # Create default admin if no users exist (Development only or with explicit flag)
    if os.getenv("SEED_DB", "false").lower() == "true" or not IS_PRODUCTION:
        async with AsyncSessionLocal() as session:
            from sqlalchemy import select
            import models
            import auth
            user_result = await session.execute(select(models.User))
            if not user_result.scalars().first():
                admin_user = models.User(
                    username="admin@nabh.com",
                    hashed_password=auth.get_password_hash("admin123"),
                    role="admin"
                )
                session.add(admin_user)
                await session.commit()
                logger.info("[DB] Created initial admin user for development.")
