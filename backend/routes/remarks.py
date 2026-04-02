from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime
import models, schemas, database

router = APIRouter(prefix="/api/submissions", tags=["remarks"])

@router.get("/{record_id}/remarks")
async def get_remarks(record_id: int, db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.Remark).filter(models.Remark.submission_id == record_id))
    remarks = result.scalars().all()
    return remarks

@router.post("/{record_id}/remarks")
async def add_remark(record_id: int, payload: schemas.RemarkCreate, db: AsyncSession = Depends(database.get_db)):
    # Check if submission exists
    sub_res = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.id == record_id))
    if not sub_res.scalars().first():
        raise HTTPException(status_code=404, detail="Submission not found")

    new_remark = models.Remark(
        submission_id=record_id,
        author=payload.author,
        role=payload.role,
        message=payload.message,
        category=payload.category,
        date=datetime.utcnow()
    )
    db.add(new_remark)
    await db.commit()
    await db.refresh(new_remark)
    return new_remark
