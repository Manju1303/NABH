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
async def submit_form(
    form_data: schemas.NABHEntryLevelForm, 
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
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

    target_record_id = None
    if existing:
        for key, value in record_data.items():
            setattr(existing, key, value)
        db.add(existing)
        target_record_id = existing.id
    else:
        new_submission = models.HospitalSubmission(**record_data)
        db.add(new_submission)
        await db.flush() # Get the new ID
        target_record_id = new_submission.id

    # AUTO-BRIDGE: Link user to this hospital if not already linked
    if not current_user.hospital_id:
        current_user.hospital_id = target_record_id
        db.add(current_user)

    # DRAFT SANITIZATION: Clear the draft since it's now a permanent submission
    from sqlalchemy import delete
    await db.execute(delete(models.HospitalDraft).where(models.HospitalDraft.user_id == current_user.id))

    await db.commit()
    return {"status": "success", "id": target_record_id, "results": score_result, "deficiencies": deficiencies}

@router.get("")
async def list_submissions(db: AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if current_user.role == "admin":
        query = select(models.HospitalSubmission)
    else:
        # Filter for hospital admin
        if not current_user.hospital_id:
            return {"total": 0, "records": []}
        query = select(models.HospitalSubmission).filter(models.HospitalSubmission.id == current_user.hospital_id)
        
    result = await db.execute(query)
    records = result.scalars().all()
    
    # ... (rest of the logic) ...
    enriched = []
    for rec in records:
        enriched.append({
            "id": rec.id,
            "hospital_name": rec.hospital_name,
            "registration_number": rec.registration_number,
            "submitted_at": rec.submitted_at,
            "score": rec.score,
            "max_score": 100,  # Fixed: normalized score ceiling
            "readiness_percentage": rec.readiness_percentage,
            "is_ready": rec.is_ready,
            "section_scores": rec.section_scores,
            "deficiencies": rec.deficiencies,
            "deficiency_count": len(rec.deficiencies) if rec.deficiencies else 0,
        })
    return {"total": len(enriched), "records": enriched}

@router.patch("/{record_id}", response_model=dict)
async def update_submission(
    record_id: int, 
    form_data: schemas.NABHEntryLevelForm, 
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Security: Only Admin or the specific Hospital Admin can update
    if current_user.role != "admin" and current_user.hospital_id != record_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this record")

    result = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.id == record_id))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Re-calculate score and deficiencies with new data
    score_result = calculate_nabh_score(form_data)
    deficiencies = evaluate_deficiencies(form_data.model_dump())

    record.score = score_result["total_score"]
    record.readiness_percentage = score_result["readiness_percentage"]
    record.is_ready = score_result["is_ready"]
    record.section_scores = score_result["section_scores"]
    record.deficiencies = deficiencies
    record.form_data = form_data.model_dump()
    record.updated_at = datetime.utcnow()

    db.add(record)
    await db.commit()
    return {"status": "updated", "results": score_result, "deficiencies": deficiencies}

@router.delete("/{record_id}")
async def delete_submission(record_id: int, db: AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    result = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.id == record_id))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    await db.delete(record)
    await db.commit()
    return {"status": "deleted"}

# ── DRAFT ROUTES — must be defined BEFORE /{record_id} to avoid FastAPI shadowing ──
@router.get("/draft", response_model=dict)
async def load_draft(db: AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    result = await db.execute(select(models.HospitalDraft).filter(models.HospitalDraft.user_id == current_user.id))
    draft = result.scalars().first()
    if not draft:
        return {"data": None}
    return {"data": draft.data}

@router.post("/draft")
async def save_draft(payload: dict, db: AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    result = await db.execute(select(models.HospitalDraft).filter(models.HospitalDraft.user_id == current_user.id))
    draft = result.scalars().first()

    if draft:
        draft.data = payload
        db.add(draft)
    else:
        new_draft = models.HospitalDraft(user_id=current_user.id, data=payload)
        db.add(new_draft)
    
    await db.commit()
    return {"status": "success"}

@router.get("/{record_id}/report")
async def download_audit_report(record_id: int, db: AsyncSession = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    # Only Admin or Committee can download full audit reports
    if current_user.role not in ["admin", "committee"]:
        raise HTTPException(status_code=403, detail="Not authorized to download audit reports")

    result = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.id == record_id))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["NABH FINAL AUDIT REPORT", datetime.utcnow().strftime("%Y-%m-%d")])
    writer.writerow([])
    writer.writerow(["Hospital Name", record.hospital_name])
    writer.writerow(["Reg Number", record.registration_number])
    writer.writerow(["Total Score", record.score])
    writer.writerow(["Readiness %", f"{record.readiness_percentage}%"])
    writer.writerow(["Status", "PASSED" if record.is_ready else "PENDING"])
    writer.writerow([])
    writer.writerow(["DEFICIENCIES FOUND:"])
    if record.deficiencies:
        for d in record.deficiencies:
            writer.writerow([f"- {d}"])
    else:
        writer.writerow(["No deficiencies found."])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=NABH_Report_{record.registration_number}.csv"}
    )
