"""
routes/remarks.py
Fix CRIT-05: author and role are now derived from JWT, NOT from request body.
Fix HIGH-12: message has max_length enforced in schema.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
import models, schemas, database, auth

router = APIRouter(prefix="/api/submissions", tags=["Remarks"])

@router.get("/{record_id}/remarks")
async def get_remarks(
    record_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role not in ["admin", "committee"] and current_user.hospital_id != record_id:
        raise HTTPException(status_code=403, detail="You do not have access to these remarks")

    result = await db.execute(
        select(models.Remark).filter(models.Remark.submission_id == record_id)
        .order_by(models.Remark.date.asc())
    )
    return result.scalars().all()


@router.post("/{record_id}/remarks")
async def add_remark(
    record_id: int,
    payload: schemas.RemarkCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if current_user.role not in ["admin", "committee"] and current_user.hospital_id != record_id:
        raise HTTPException(status_code=403, detail="You do not have permission to add remarks here")

    sub_res = await db.execute(
        select(models.HospitalSubmission).filter(models.HospitalSubmission.id == record_id)
    )
    if not sub_res.scalars().first():
        raise HTTPException(status_code=404, detail="Submission not found")

    new_remark = models.Remark(
        submission_id=record_id,
        # CRIT-05 FIX: author and role come from JWT, not client body
        author=current_user.full_name or current_user.username,
        role=current_user.role,
        message=payload.message,
        category=payload.category,
        date=datetime.now(timezone.utc),
    )
    db.add(new_remark)
    await db.commit()
    await db.refresh(new_remark)
    return new_remark
