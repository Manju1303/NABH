from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
import models, schemas, database

router = APIRouter(prefix="/api/schedule", tags=["schedule"])

@router.get("")
async def get_schedule(db: AsyncSession = Depends(database.get_db)):
    # Simplified list for now
    return [
        { "id": 1, "date": "2026-04-15", "time": "10:00 AM", "type": "Pre-Assessment Visit", "assessor": "Dr. R. Sharma", "location": "On-Site", "status": "Scheduled" },
        { "id": 2, "date": "2026-05-20", "time": "09:30 AM", "type": "Document Verification", "assessor": "Dr. P. Mehta", "location": "Virtual", "status": "Pending" },
    ]
