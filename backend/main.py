"""
NABH Compliance Engine API v3.0 — Refactored & Enhanced
"""

from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import os, time

from database import init_db, get_db
from routes import submissions, remarks, deadlines, schedule, committee
import auth

IS_PRODUCTION = os.getenv("RENDER", "") != ""

app = FastAPI(
    title="NABH Compliance Engine API",
    description="Secured & Refactored API for NABH Compliance Tracking.",
    docs_url=None if IS_PRODUCTION else "/docs",
)

# ── CORS ──
_default_origins = "http://localhost:3000,http://127.0.0.1:3000,*"
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

# ── NUCLEAR RESET (Temporary) ──
@app.delete("/api/system/factory-reset")
async def factory_reset(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import text
    await db.execute(text("DELETE FROM hospital_submissions"))
    await db.execute(text("DELETE FROM remarks"))
    await db.execute(text("DELETE FROM schedule"))
    await db.execute(text("DELETE FROM committee_records"))
    await db.commit()
    return {"message": "System Reset Successful - All data wiped."}

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "NABH Compliance Engine API v3.0 — Refactored"}

# ── Global exception handler ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"ERROR: {exc}") # Log correctly for dev
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
