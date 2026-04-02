from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
import models, schemas, database

router = APIRouter(prefix="/api/submissions", tags=["deadlines"])

@router.post("/{record_id}/set-deadline")
async def set_deadline(record_id: int, payload: schemas.DeadlineCreate, db: AsyncSession = Depends(database.get_db)):
    # Validate date
    try:
        deadline_date = datetime.fromisoformat(payload.deadline)
        if deadline_date < datetime.now():
            raise HTTPException(status_code=400, detail="Deadline must be a future date.")
    except ValueError:
         raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format (YYYY-MM-DD).")

    new_deadline = models.RemediationDeadline(
        submission_id=record_id,
        deficiency_id=payload.deficiency_id,
        deadline=deadline_date,
        label=payload.label,
        note=payload.note,
        set_by="hospital_admin"
    )
    db.add(new_deadline)
    await db.commit()
    return {"status": "success", "message": "Deadline set"}

@router.get("/{record_id}/deadlines")
async def get_deadlines(record_id: int, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.RemediationDeadline).filter(models.RemediationDeadline.submission_id == record_id))
    deadlines = result.scalars().all()
    
    now = datetime.now()
    alerts = []
    for d in deadlines:
        days_remaining = (d.deadline - now).days
        status = "on_track"
        blink = False
        if days_remaining < 0:
            status = "overdue"; blink = True
        elif days_remaining <= 3:
            status = "critical_alert"; blink = True
        elif days_remaining <= 7:
            status = "warning"
            
        alerts.append({
            "deficiency_id": d.deficiency_id,
            "label": d.label,
            "deadline": d.deadline.isoformat(),
            "days_remaining": days_remaining,
            "status": status,
            "blink": blink,
            "note": d.note,
            "set_at": d.set_at.isoformat()
        })
    return {"record_id": record_id, "alerts": alerts}
