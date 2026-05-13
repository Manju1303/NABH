"""
main.py — NABH Compliance Engine API
Fixes:
  CRIT-01: SQL injection in factory-reset (parameterized query)
  HIGH-02: Rate limiting via slowapi
  MED-13:  Restricted CORS allow_methods
"""
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os, logging
from contextlib import asynccontextmanager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("nabh-api")

from database import init_db, get_db
from routes import submissions, remarks, deadlines, schedule, users, reports, remediation
import auth

IS_PRODUCTION = os.getenv("RENDER", "") != ""

# ── Rate Limiter ──
limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing NABH Compliance Engine Database...")
    await init_db()
    logger.info("System Ready.")
    yield

app = FastAPI(
    title="NABH Compliance Engine API",
    description="Secured API for NABH Compliance Tracking.",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    lifespan=lifespan,
)

# Attach rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()
]

if not IS_PRODUCTION:
    ALLOWED_ORIGINS.append("https://localhost:3000")

if IS_PRODUCTION and not os.getenv("ALLOWED_ORIGINS"):
    logger.warning("ALLOWED_ORIGINS not set in production! CORS will block frontend.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://nabh(-.*)?\\.vercel\\.app" if IS_PRODUCTION else None,
    allow_credentials=True,
    # MED-13 FIX: Restricted to only needed methods
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(submissions.router)
app.include_router(remarks.router)
app.include_router(deadlines.router)
app.include_router(schedule.router)
app.include_router(users.router)
app.include_router(reports.router)
app.include_router(auth.router)
app.include_router(remediation.router)


# ── Factory Reset (CRIT-01 Fixed) ──
@app.delete("/api/system/factory-reset")
@limiter.limit("3/hour")
async def factory_reset(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: auth.models.User = Depends(auth.require_admin),
):
    reset_key = request.headers.get("X-System-Reset-Key")
    expected_key = os.getenv("SYSTEM_RESET_KEY")

    if not IS_PRODUCTION and not expected_key:
        expected_key = "dev_reset_123"

    if not expected_key or reset_key != expected_key:
        raise auth.HTTPException(status_code=403, detail="Invalid or missing System Reset Key.")

    from sqlalchemy import text
    await db.execute(text("DELETE FROM remarks"))
    await db.execute(text("DELETE FROM deadlines"))
    await db.execute(text("DELETE FROM remediation"))
    await db.execute(text("DELETE FROM schedules"))
    await db.execute(text("DELETE FROM submissions"))
    # CRIT-01 FIX: Parameterized query — no SQL injection
    await db.execute(text("DELETE FROM users WHERE id != :uid"), {"uid": current_user.id})

    await db.commit()
    logger.warning(f"FACTORY RESET executed by user: {current_user.username}")
    return {"message": "System Reset Successful — All compliance data wiped."}


@app.get("/")
async def root():
    return {"message": "NABH Compliance Engine API v4.0 — Secured & Refactored"}


# ── Global Exception Handler ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"UNHANDLED EXCEPTION on {request.url}: {str(exc)}")
    if not IS_PRODUCTION:
        import traceback
        traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please contact support."}
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
