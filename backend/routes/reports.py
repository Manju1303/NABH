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
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    styles = getSampleStyleSheet()
    
    # Custom Styles
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#00F2FF'), alignment=1, spaceAfter=20)
    subtitle_style = ParagraphStyle('SubTitle', parent=styles['Normal'], fontSize=10, textColor=colors.grey, alignment=1, spaceAfter=30)
    section_title = ParagraphStyle('SecTitle', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor('#1E293B'), spaceBefore=20, spaceAfter=10)
    stat_box = ParagraphStyle('StatBox', parent=styles['Normal'], fontSize=12, leading=14)

    elements = []

    # 1. Header & Title
    elements.append(Paragraph("HEALTHGUARD AI", title_style))
    elements.append(Paragraph(f"ACCURACY VERIFICATION & AUDIT REPORT — v4.1", subtitle_style))
    elements.append(Spacer(1, 10))

    # 2. Hospital Identity Summary
    info_data = [
        [Paragraph(f"<b>HOSPITAL:</b> {submission.hospital_name}", styles['Normal']), Paragraph(f"<b>REG:</b> {submission.registration_number}", styles['Normal'])],
        [Paragraph(f"<b>DATE:</b> {submission.submitted_at.strftime('%Y-%m-%d %H:%M')}", styles['Normal']), Paragraph(f"<b>STATUS:</b> <font color='{'green' if submission.is_ready else 'red'}'>{'ACCREDITATION READY' if submission.is_ready else 'DEFICIENCIES FOUND'}</font>", styles['Normal'])]
    ]
    info_table = Table(info_data, colWidths=[260, 260])
    info_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 25))

    # 3. Score Intelligence Matrix
    elements.append(Paragraph("I. COMPLIANCE SCORE MATRIX", section_title))
    score_data = [["SECTION CATEGORY", "SCORE", "VALIDATION STATUS"]]
    if submission.section_scores:
        for cat, val in submission.section_scores.items():
            status = "VERIFIED" if val >= 100 else "DEVIATION"
            score_data.append([cat.upper().replace("_", " "), f"{val}%", status])
    
    score_table = Table(score_data, colWidths=[200, 100, 220])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
    ]))
    elements.append(score_table)
    elements.append(Spacer(1, 25))

    # 4. Detailed Deficiency & reasoning Analysis
    elements.append(Paragraph("II. GAP ANALYSIS & VERIFICATION LOG", section_title))
    
    if submission.deficiencies:
        for d in submission.deficiencies:
            elements.append(Paragraph(f"<b>Requirement:</b> {d.get('label')}", styles['Normal']))
            elements.append(Paragraph(f"<font color='red'><b>Deviation Reasoning:</b></font> {d.get('reasoning', d.get('message'))}", styles['Italic']))
            elements.append(Paragraph(f"<b>Verification Method:</b> {d.get('verification_method', 'Document Audit')}", styles['Normal']))
            elements.append(Paragraph(f"<b>NABH Standard Mapping:</b> {d.get('nabh_reference', 'N/A')}", styles['Normal']))
            elements.append(Spacer(1, 12))
    else:
        elements.append(Paragraph("No deficiencies detected. All mandatory standards verified successfully.", styles['Normal']))

    # Final Summary Stamp
    elements.append(Spacer(1, 40))
    summary = f"FINAL READINESS: {submission.readiness_percentage}% — { 'PASS' if submission.is_ready else 'PENDING' }"
    elements.append(Paragraph(f"<b>STAMP OF VALIDATION:</b> {summary}", styles['Heading3']))
    elements.append(Paragraph(f"Generated by HealthGuard AI Intelligence Engine", styles['Normal']))

    doc.build(elements)
    
    pdf_value = buffer.getvalue()
    buffer.close()
    
    return Response(
        content=pdf_value,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=NABH_Analysis_Report_{submission.registration_number}.pdf"}
    )
