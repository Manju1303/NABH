"""
database.py — NABH Compliance Engine
Fixes: CRIT-03, CRIT-04, MED-08, CRIT-02
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os, logging
from dotenv import load_dotenv

logger = logging.getLogger("nabh-api")
load_dotenv()

IS_PRODUCTION = os.getenv("RENDER", "") != ""
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    DATABASE_URL = DATABASE_URL.strip()
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    if ":6543" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace(":6543", ":5432")
    DB_URL = DATABASE_URL
    logger.info("[DB] Using cloud PostgreSQL")
else:
    DB_PATH = os.getenv("DB_PATH", "./nabh.db")
    DB_URL = f"sqlite+aiosqlite:///{DB_PATH}"
    logger.info(f"[DB] Using local SQLite at: {DB_PATH}")

connect_args = {}
if DATABASE_URL and "localhost" not in DATABASE_URL.lower():
    import ssl
    ctx = ssl.create_default_context()
    # CRIT-03 FIX: Default is now "false" — verification enabled by default
    if os.getenv("DB_SSL_NO_VERIFY", "false").lower() == "true":
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        logger.warning("[DB SECURITY] SSL certificate verification DISABLED")
    connect_args["ssl"] = ctx
    connect_args["server_settings"] = {"application_name": "nabh_api"}

engine = create_async_engine(
    DB_URL, echo=False, connect_args=connect_args,
    pool_size=5 if DATABASE_URL else 3,
    max_overflow=10 if DATABASE_URL else 5,
    pool_recycle=300, pool_pre_ping=True, pool_use_lifo=True,
)

AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        if DATABASE_URL:
            try:
                from sqlalchemy import text
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'staff';"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE;"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;"))
                await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS hospital_id INTEGER;"))
                logger.info("[DB MIGRATION] All PostgreSQL users table columns verified successfully.")
            except Exception as e:
                logger.warning(f"[DB MIGRATION] Column verification note: {e}")

    # Seed default admin if no user exists in DB
    try:
        async with AsyncSessionLocal() as session:
            from sqlalchemy import select
            import models, auth
            user_result = await session.execute(select(models.User))
            if not user_result.scalars().first():
                initial_password = os.getenv("INITIAL_ADMIN_PASSWORD", "admin123")
                admin_user = models.User(
                    username="admin@nabh.com",
                    email="admin@nabh.com",
                    hashed_password=auth.get_password_hash(initial_password),
                    role="admin", 
                    is_active=True,
                )
                session.add(admin_user)
                await session.commit()
                logger.info("[DB] Initial admin created with username 'admin@nabh.com'.")
    except Exception as err:
        logger.error(f"[DB SEEDING WARNING] Could not seed initial user: {err}")

