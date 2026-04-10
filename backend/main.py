"""
NABH Compliance Engine API v3.0 — Refactored & Enhanced
"""

from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
import os, time

from contextlib import asynccontextmanager
from database import init_db, get_db
from routes import submissions, remarks, deadlines, schedule, committee, users, reports
import auth

IS_PRODUCTION = os.getenv("RENDER", "") != ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB
    await init_db()
    yield
    # Shutdown: Clean up if needed

app = FastAPI(
    title="NABH Compliance Engine API",
    description="Secured & Refactored API for NABH Compliance Tracking.",
    docs_url=None if IS_PRODUCTION else "/docs",
    lifespan=lifespan
)

# ── CORS ──
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()
]

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

# ── NUCLEAR RESET (Secured) ──
@app.delete("/api/system/factory-reset")
async def factory_reset(
    db: AsyncSession = Depends(get_db),
    current_user: auth.models.User = Depends(auth.get_current_user)
):
    if current_user.role != "admin":
        raise auth.HTTPException(status_code=403, detail="Unauthorized - Admin access required")
        
    from sqlalchemy import text
    # Wiping all compliance data
    await db.execute(text("DELETE FROM drafts"))
    await db.execute(text("DELETE FROM remarks"))
    await db.execute(text("DELETE FROM deadlines"))
    await db.execute(text("DELETE FROM submissions"))
    # Wiping all users EXCEPT the currently logged in admin (to avoid lock-out)
    await db.execute(text(f"DELETE FROM users WHERE id != {current_user.id}"))
    
    await db.commit()
    return {"message": "System Reset Successful - All compliance data and other accounts wiped."}

@app.get("/")
async def root():
    return {"message": "NABH Compliance Engine API v3.0 — Refactored & Secured"}

# ── Global exception handler ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
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
