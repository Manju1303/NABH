"""
routes/deadlines.py
Fix MED-03: deadline field is now a datetime (validated in schema), not a raw str.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
import models, schemas, database, auth

router = APIRouter(prefix="/api/submissions", tags=["Deadlines"])


@router.post("/{record_id}/set-deadline")
async def set_deadline(
    record_id: int,
    payload: schemas.DeadlineCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    # MED-03 FIX: deadline is already a datetime from schema validation
    deadline_date = payload.deadline
    if deadline_date.tzinfo is None:
        deadline_date = deadline_date.replace(tzinfo=timezone.utc)

    if deadline_date < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Deadline must be a future date.")

    new_deadline = models.RemediationDeadline(
        submission_id=record_id,
        deficiency_id=payload.deficiency_id,
        deadline=deadline_date,
        label=payload.label,
        note=payload.note,
        set_by=current_user.username,
    )
    db.add(new_deadline)
    await db.commit()
    return {"status": "success", "message": "Deadline set"}


@router.get("/{record_id}/deadlines")
async def get_deadlines(
    record_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    if current_user.role not in ["admin", "committee"] and current_user.hospital_id != record_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these deadlines")

    result = await db.execute(
        select(models.RemediationDeadline)
        .filter(models.RemediationDeadline.submission_id == record_id)
    )
    deadlines = result.scalars().all()

    now = datetime.now(timezone.utc)
    alerts = []
    for d in deadlines:
        dl = d.deadline
        if dl.tzinfo is None:
            dl = dl.replace(tzinfo=timezone.utc)
        days_remaining = (dl - now).days
        if days_remaining < 0:
            status = "overdue"
            blink = True
        elif days_remaining <= 3:
            status = "critical_alert"
            blink = True
        elif days_remaining <= 7:
            status = "warning"
            blink = False
        else:
            status = "on_track"
            blink = False

        alerts.append({
            "deficiency_id": d.deficiency_id,
            "label": d.label,
            "deadline": dl.isoformat(),
            "days_remaining": days_remaining,
            "status": status,
            "blink": blink,
            "note": d.note,
            "set_at": d.set_at.isoformat() if d.set_at else None,
        })
    return {"record_id": record_id, "alerts": alerts}
