"""
routes/remediation.py
Fix CRIT-06: Replace raw dict payload with typed RemediationUpdate schema.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
import models, schemas, database, auth

router = APIRouter(prefix="/api/remediation", tags=["Remediation"])


@router.get("/{submission_id}")
async def get_remediation_steps(
    submission_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role not in ["admin", "committee"] and current_user.hospital_id != submission_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these remediation steps")

    result = await db.execute(
        select(models.RemediationStep)
        .filter(models.RemediationStep.submission_id == submission_id)
    )
    steps = result.scalars().all()
    return [
        {
            "id": s.id,
            "deficiency_id": s.deficiency_id,
            "status": s.status,
            "action_taken": s.action_taken,
            "updated_at": s.updated_at,
        }
        for s in steps
    ]


@router.post("/{submission_id}/{deficiency_id}")
async def update_remediation(
    submission_id: int,
    deficiency_id: str,
    # CRIT-06 FIX: Typed schema instead of raw dict
    payload: schemas.RemediationUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role not in ["admin"] and current_user.hospital_id != submission_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(
        select(models.RemediationStep).filter(
            models.RemediationStep.submission_id == submission_id,
            models.RemediationStep.deficiency_id == deficiency_id,
        )
    )
    step = result.scalars().first()

    if step:
        step.status = payload.status
        if payload.action_taken is not None:
            step.action_taken = payload.action_taken
        db.add(step)
    else:
        step = models.RemediationStep(
            submission_id=submission_id,
            deficiency_id=deficiency_id,
            status=payload.status,
            action_taken=payload.action_taken or "",
        )
        db.add(step)

    await db.commit()
    return {"status": "updated"}
