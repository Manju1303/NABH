"""
routes/schedule.py
Fix HIGH-01: Replace hardcoded mock data with real DB-backed AssessmentSchedule model.
Admin can create/update/delete schedules. All users can view (filtered by hospital).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models, schemas, database, auth

router = APIRouter(prefix="/api/schedule", tags=["Schedule"])


@router.get("", response_model=list[schemas.ScheduleOut])
async def get_schedule(
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    """Admin sees all schedules; hospital users see only their own."""
    if current_user.role == "admin":
        result = await db.execute(
            select(models.AssessmentSchedule).order_by(models.AssessmentSchedule.date.asc())
        )
    else:
        result = await db.execute(
            select(models.AssessmentSchedule)
            .filter(models.AssessmentSchedule.submission_id == current_user.hospital_id)
            .order_by(models.AssessmentSchedule.date.asc())
        )
    return result.scalars().all()


@router.post("", response_model=schemas.ScheduleOut, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    payload: schemas.ScheduleCreate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    """Admin creates a new assessment schedule entry."""
    new_schedule = models.AssessmentSchedule(
        submission_id=payload.submission_id,
        hospital_name=payload.hospital_name,
        date=payload.date,
        assessment_type=payload.assessment_type,
        assessor=payload.assessor,
        location=payload.location,
        status=payload.status,
        notes=payload.notes,
        created_by=current_user.username,
    )
    db.add(new_schedule)
    await db.commit()
    await db.refresh(new_schedule)
    return new_schedule


@router.patch("/{schedule_id}", response_model=schemas.ScheduleOut)
async def update_schedule(
    schedule_id: int,
    payload: schemas.ScheduleUpdate,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    """Admin updates an existing schedule."""
    result = await db.execute(
        select(models.AssessmentSchedule).filter(models.AssessmentSchedule.id == schedule_id)
    )
    schedule = result.scalars().first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    if payload.date is not None:
        schedule.date = payload.date
    if payload.assessment_type is not None:
        schedule.assessment_type = payload.assessment_type
    if payload.assessor is not None:
        schedule.assessor = payload.assessor
    if payload.location is not None:
        schedule.location = payload.location
    if payload.status is not None:
        schedule.status = payload.status
    if payload.notes is not None:
        schedule.notes = payload.notes

    db.add(schedule)
    await db.commit()
    await db.refresh(schedule)
    return schedule


@router.delete("/{schedule_id}")
async def delete_schedule(
    schedule_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.require_admin),
):
    result = await db.execute(
        select(models.AssessmentSchedule).filter(models.AssessmentSchedule.id == schedule_id)
    )
    schedule = result.scalars().first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    await db.delete(schedule)
    await db.commit()
    return {"message": "Schedule deleted"}
