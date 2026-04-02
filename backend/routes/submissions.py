from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import json, csv, io
from datetime import datetime

import models, schemas, database, auth
from scoring import calculate_nabh_score
from compliance import evaluate_deficiencies

router = APIRouter(prefix="/api/submissions", tags=["submissions"])

@router.post("", response_model=dict)
async def submit_form(form_data: schemas.NABHEntryLevelForm, db: AsyncSession = Depends(database.get_db)):
    # Scoring
    score_result = calculate_nabh_score(form_data)
    # Deficiency evaluation
    deficiencies = evaluate_deficiencies(form_data.model_dump())

    bi = form_data.basic_info
    hd = form_data.hospital_details

    # Check for existing
    result = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.registration_number == bi.registration_number))
    existing = result.scalars().first()

    record_data = {
        "hospital_name": bi.hospital_name,
        "registration_number": bi.registration_number,
        "contact_email": bi.contact_email,
        "phone": bi.phone,
        "hospital_type": hd.hospital_type,
        "bed_capacity": hd.total_sanctioned_beds,
        "operational_beds": hd.operational_beds,
        "score": score_result["total_score"],
        "readiness_percentage": score_result["readiness_percentage"],
        "is_ready": score_result["is_ready"],
        "section_scores": score_result["section_scores"],
        "deficiencies": deficiencies,
        "form_data": form_data.model_dump()
    }

    if existing:
        for key, value in record_data.items():
            setattr(existing, key, value)
        db.add(existing)
    else:
        new_submission = models.HospitalSubmission(**record_data)
        db.add(new_submission)

    await db.commit()
    return {"status": "success", "results": score_result, "deficiencies": deficiencies}

@router.get("")
async def list_submissions(db: AsyncSession = Depends(database.get_db)):
    result = await db.execute(select(models.HospitalSubmission))
    records = result.scalars().all()
    
    # Enrich with deadlines (simplified for now as back-compat)
    enriched = []
    for rec in records:
        # We'll handle full enrichment in a separate helper or route specialized for dashboard
        enriched.append({
            "id": rec.id,
            "hospital_name": rec.hospital_name,
            "registration_number": rec.registration_number,
            "submitted_at": rec.submitted_at,
            "score": rec.score,
            "readiness_percentage": rec.readiness_percentage,
            "is_ready": rec.is_ready,
            "section_scores": rec.section_scores,
            "deficiencies": rec.deficiencies,
            "deficiency_count": len(rec.deficiencies) if rec.deficiencies else 0,
        })
    return {"total": len(enriched), "records": enriched}

@router.delete("/{record_id}")
async def delete_submission(record_id: int, db: AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    result = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.id == record_id))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    await db.delete(record)
    await db.commit()
    return {"status": "deleted"}
