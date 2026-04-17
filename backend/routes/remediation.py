from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime
import models, schemas, database, auth

router = APIRouter(prefix="/api/remediation", tags=["Remediation"])

@router.get("/{submission_id}", response_model=List[dict])
async def get_remediation_steps(submission_id: int, db: AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Security: Ensure user can only see their own hospital's remediation steps
    if current_user.role != "admin" and current_user.hospital_id != submission_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these remediation steps")

    result = await db.execute(select(models.RemediationStep).filter(models.RemediationStep.submission_id == submission_id))
    steps = result.scalars().all()
    
    # Map to dict for easy frontend consumption
    return [
        {
            "id": s.id,
            "deficiency_id": s.deficiency_id,
            "status": s.status,
            "action_taken": s.action_taken,
            "updated_at": s.updated_at
        } for s in steps
    ]

@router.post("/{submission_id}/{deficiency_id}")
async def update_remediation(
    submission_id: int, 
    deficiency_id: str, 
    payload: dict, # {status: str, action_taken: str}
    db: AsyncSession = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    # Only hospital admin or main admin
    if current_user.role != "admin" and current_user.hospital_id != submission_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Check if step already exists
    result = await db.execute(select(models.RemediationStep).filter(
        models.RemediationStep.submission_id == submission_id,
        models.RemediationStep.deficiency_id == deficiency_id
    ))
    step = result.scalars().first()

    if step:
        step.status = payload.get("status", step.status)
        step.action_taken = payload.get("action_taken", step.action_taken)
        db.add(step)
    else:
        step = models.RemediationStep(
            submission_id=submission_id,
            deficiency_id=deficiency_id,
            status=payload.get("status", "in_progress"),
            action_taken=payload.get("action_taken", "")
        )
        db.add(step)
    
    await db.commit()
    return {"status": "updated"}
