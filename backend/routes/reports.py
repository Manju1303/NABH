from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import models, database, auth
from datetime import datetime

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/download/{submission_id}")
async def download_report(
    submission_id: int,
    db: AsyncSession = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Fetch submission
    result = await db.execute(select(models.HospitalSubmission).filter(models.HospitalSubmission.id == submission_id))
    submission = result.scalars().first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Security: Only admin or the hospital owner can download
    if current_user.role != "admin" and submission.id != current_user.hospital_id:
        raise HTTPException(status_code=403, detail="Unauthorized to download this report")

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    elements.append(Paragraph(f"NABH Readiness Assessment Report", styles['Title']))
    elements.append(Spacer(1, 12))

    # Hospital Info
    elements.append(Paragraph(f"<b>Hospital Name:</b> {submission.hospital_name}", styles['Normal']))
    elements.append(Paragraph(f"<b>Registration:</b> {submission.registration_number}", styles['Normal']))
    elements.append(Paragraph(f"<b>Assessment Date:</b> {submission.submitted_at.strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 12))

    # Score Summary
    elements.append(Paragraph(f"<b>Overall Score:</b> {submission.score}", styles['Heading2']))
    elements.append(Paragraph(f"<b>Readiness:</b> {submission.readiness_percentage}%", styles['Heading2']))
    elements.append(Spacer(1, 12))

    # Deficiencies Table
    elements.append(Paragraph("<b>Identified Deficiencies</b>", styles['Heading3']))
    
    data = [["ID", "Category", "Requirement", "Severity"]]
    if submission.deficiencies:
        for d in submission.deficiencies:
            data.append([
                d.get("id", "N/A"),
                d.get("category", "N/A"),
                d.get("label", "N/A"),
                d.get("severity", "N/A").upper()
            ])
    
    table = Table(data, colWidths=[50, 80, 250, 70])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ]))
    elements.append(table)

    doc.build(elements)
    
    pdf_value = buffer.getvalue()
    buffer.close()
    
    return Response(
        content=pdf_value,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=NABH_Report_{submission.registration_number}.pdf"}
    )
