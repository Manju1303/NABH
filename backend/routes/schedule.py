from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
import models, schemas, database, auth

router = APIRouter(prefix="/api/schedule", tags=["schedule"])

@router.get("")
async def get_schedule(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Simplified mock data - in a real app, this would query the DB filtered by hospital_id
    schedule_data = [
        { "id": 1, "hospital_id": 1, "date": "2026-04-15", "time": "10:00 AM", "type": "Pre-Assessment Visit", "assessor": "Dr. R. Sharma", "location": "On-Site", "status": "Scheduled" },
        { "id": 2, "hospital_id": 2, "date": "2026-05-20", "time": "09:30 AM", "type": "Document Verification", "assessor": "Dr. P. Mehta", "location": "Virtual", "status": "Pending" },
    ]
    
    if current_user.role == "admin":
        return schedule_data
        
    # Security: Filter for specific hospital to prevent IDOR
    return [s for s in schedule_data if s["hospital_id"] == current_user.hospital_id]
