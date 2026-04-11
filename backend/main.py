"""
NABH Compliance Engine API v3.0 — Refactored & Enhanced
"""

from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
import os, time, logging
from contextlib import asynccontextmanager

# ── Logging Configuration ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("nabh-api")

from database import init_db, get_db
from routes import submissions, remarks, deadlines, schedule, committee, users, reports, remediation
import auth

IS_PRODUCTION = os.getenv("RENDER", "") != ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    logger.info("Initializing NABH Compliance Engine Database...")
    await init_db()
    logger.info("System Ready.")
    yield

app = FastAPI(
    title="NABH Compliance Engine API",
    description="Secured & Refactored API for NABH Compliance Tracking.",
    docs_url=None if IS_PRODUCTION else "/docs",
    lifespan=lifespan
)

# ── CORS ──
_default_origins = "http://localhost:3000,http://127.0.0.1:3000,https://nabh.vercel.app"
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()
]

# Intelligence: Always trust nabh.vercel.app even if environment variable is missing
if "https://nabh.vercel.app" not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append("https://nabh.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(submissions.router)
app.include_router(remarks.router)
app.include_router(deadlines.router)
app.include_router(schedule.router)
app.include_router(committee.router)
app.include_router(users.router)
app.include_router(reports.router)
app.include_router(auth.router)
app.include_router(remediation.router)

# ── NUCLEAR RESET (Hardened) ──
@app.delete("/api/system/factory-reset")
async def factory_reset(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: auth.models.User = Depends(auth.get_current_user)
):
    if current_user.role != "admin":
        raise auth.HTTPException(status_code=403, detail="Unauthorized - Admin access required")
    
    # Requirement: Must provide a SYSTEM_RESET_KEY in headers for safety
    reset_key = request.headers.get("X-System-Reset-Key")
    expected_key = os.getenv("SYSTEM_RESET_KEY")
    
    if not IS_PRODUCTION and not expected_key:
        expected_key = "dev_reset_123" # Default for dev if not set
        
    if not expected_key or reset_key != expected_key:
         raise auth.HTTPException(status_code=403, detail="Invalid or missing System Reset Key.")

    from sqlalchemy import text
    # Wiping all compliance data
    await db.execute(text("DELETE FROM drafts"))
    await db.execute(text("DELETE FROM remarks"))
    await db.execute(text("DELETE FROM deadlines"))
    await db.execute(text("DELETE FROM submissions"))
    # Wiping all users EXCEPT the currently logged in admin
    await db.execute(text(f"DELETE FROM users WHERE id != {current_user.id}"))
    
    await db.commit()
    return {"message": "System Reset Successful - All compliance data and other accounts wiped."}

@app.get("/")
async def root():
    return {"message": "NABH Compliance Engine API v3.0 — Refactored & Secured"}

# ── Global exception handler ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"UNHANDLED EXCEPTION: {str(exc)}")
    # Log the full error in development
    if not IS_PRODUCTION:
        import traceback
        traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please contact support."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
