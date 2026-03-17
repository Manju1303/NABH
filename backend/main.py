"""
NABH Compliance Engine API — Hardened & Secured
Features:
- Input sanitization & validation
- Rate limiting
- Strict CORS
- Deficiency tracking with deadlines
- Secure error handling (no stack traces leaked)
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from models import NABHEntryLevelForm
from scoring import calculate_nabh_score
from compliance import evaluate_deficiencies
import json, csv, io, os, re, time, html
from datetime import datetime
from collections import defaultdict

# ═══════════════════════════════════════════
# ENVIRONMENT
# ═══════════════════════════════════════════

IS_PRODUCTION = os.getenv("RENDER", "") != ""  # Render sets this automatically

# ═══════════════════════════════════════════
# APP SETUP
# ═══════════════════════════════════════════

app = FastAPI(
    title="NABH Compliance Engine API",
    description="Validates hospital data, evaluates NABH entry-level criteria, and tracks deficiencies.",
    docs_url=None if IS_PRODUCTION else "/docs",  # Disable Swagger in production
    redoc_url=None,
)

# ── Strict CORS (reads from env for production) ──
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,  # Cache preflight for 1 hour
)


# ── HTTPS redirect in production ──
@app.middleware("http")
async def enforce_https(request: Request, call_next):
    if IS_PRODUCTION:
        forwarded_proto = request.headers.get("x-forwarded-proto")
        if forwarded_proto and forwarded_proto != "https":
            url = request.url.replace(scheme="https")
            return RedirectResponse(url=str(url), status_code=301)
    return await call_next(request)


# ═══════════════════════════════════════════
# RATE LIMITING (in-memory, per-IP)
# ═══════════════════════════════════════════

RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 30  # max requests per window
rate_limit_store: dict[str, list[float]] = defaultdict(list)


@app.middleware("http")
async def rate_limiter(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    # Clean old entries
    rate_limit_store[client_ip] = [
        t for t in rate_limit_store[client_ip] if now - t < RATE_LIMIT_WINDOW
    ]

    if len(rate_limit_store[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please wait before trying again."}
        )

    rate_limit_store[client_ip].append(now)
    response = await call_next(request)
    return response


# ── Security headers middleware ──
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"] = "no-store"
    return response


# ═══════════════════════════════════════════
# INPUT SANITIZATION
# ═══════════════════════════════════════════

def sanitize_string(value: str) -> str:
    """Remove HTML, script tags, and dangerous characters from string inputs."""
    if not isinstance(value, str):
        return value
    # Strip HTML tags
    value = re.sub(r'<[^>]+>', '', value)
    # Escape HTML entities
    value = html.escape(value)
    # Remove null bytes
    value = value.replace('\x00', '')
    # Limit length (prevent memory attacks)
    return value[:500]


def sanitize_form_data(data: dict) -> dict:
    """Recursively sanitize all string fields in the form data."""
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_string(value)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_form_data(value)
        elif isinstance(value, list):
            sanitized[key] = [
                sanitize_string(item) if isinstance(item, str)
                else sanitize_form_data(item) if isinstance(item, dict)
                else item
                for item in value
            ]
        else:
            sanitized[key] = value
    return sanitized


# ═══════════════════════════════════════════
# DATA STORAGE (JSON file)
# ═══════════════════════════════════════════

DATA_FILE = os.path.join(os.path.dirname(__file__), "nabh_data.json")
DEADLINES_FILE = os.path.join(os.path.dirname(__file__), "nabh_deadlines.json")


def load_submissions() -> list[dict]:
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []


def save_submissions(records: list[dict]):
    with open(DATA_FILE, "w") as f:
        json.dump(records, f, indent=2, default=str)


def load_deadlines() -> dict:
    if os.path.exists(DEADLINES_FILE):
        with open(DEADLINES_FILE, "r") as f:
            return json.load(f)
    return {}


def save_deadlines(deadlines: dict):
    with open(DEADLINES_FILE, "w") as f:
        json.dump(deadlines, f, indent=2, default=str)


# ═══════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════

@app.get("/")
def read_root():
    return {"message": "NABH Compliance Engine API v2.0 — Secured"}


@app.post("/api/submit-form")
def submit_nabh_form(form_data: NABHEntryLevelForm):
    """
    Submit hospital NABH data.
    1. Pydantic validates structure (auto 422 on failure)
    2. Input sanitization applied
    3. Rule-based scoring
    4. Deficiency evaluation with thresholds
    5. Persisted to disk
    """
    # Sanitize all string inputs
    raw_data = form_data.model_dump()
    sanitized = sanitize_form_data(raw_data)

    # Re-validate after sanitization
    try:
        form_data = NABHEntryLevelForm(**sanitized)
    except Exception:
        raise HTTPException(status_code=422, detail="Data validation failed after sanitization.")

    # Scoring
    score_result = calculate_nabh_score(form_data)

    # Deficiency evaluation
    deficiencies = evaluate_deficiencies(sanitized)

    bi = form_data.basic_info
    hd = form_data.hospital_details

    record = {
        "id": len(load_submissions()) + 1,
        "submitted_at": datetime.now().isoformat(),
        "hospital_name": bi.hospital_name,
        "registration_number": bi.registration_number,
        "contact_email": bi.contact_email,
        "phone": bi.phone,
        "hospital_type": hd.hospital_type,
        "bed_capacity": hd.total_sanctioned_beds,
        "operational_beds": hd.operational_beds,
        "medical_director": form_data.key_personnel.medical_director,
        "quality_manager": form_data.key_personnel.quality_manager,
        "administrator": form_data.key_personnel.administrator,
        "accreditation_type": form_data.accreditation_info.accreditation_type,
        "form_data": sanitized,
        "score": score_result["total_score"],
        "max_score": score_result["max_score"],
        "readiness_percentage": score_result["readiness_percentage"],
        "is_ready": score_result["is_ready"],
        "section_scores": score_result["section_scores"],
        "deficiencies": deficiencies,
        "deficiency_count": len(deficiencies),
        "critical_deficiencies": len([d for d in deficiencies if d["severity"] == "critical"]),
    }

    submissions = load_submissions()
    submissions.append(record)
    save_submissions(submissions)

    return {
        "status": "success",
        "message": "Form validated, scored, and saved successfully",
        "hospital": bi.hospital_name,
        "results": score_result,
        "deficiencies": deficiencies,
        "deficiency_summary": {
            "total": len(deficiencies),
            "critical": len([d for d in deficiencies if d["severity"] == "critical"]),
            "high": len([d for d in deficiencies if d["severity"] == "high"]),
            "medium": len([d for d in deficiencies if d["severity"] == "medium"]),
        }
    }


@app.get("/api/submissions")
def get_submissions():
    records = load_submissions()
    # Enrich with deadline status
    deadlines = load_deadlines()
    now = datetime.now()

    for rec in records:
        rec_id = str(rec.get("id"))
        rec_deadlines = deadlines.get(rec_id, {})
        active_alerts = []

        for def_id, deadline_info in rec_deadlines.items():
            deadline_date = datetime.fromisoformat(deadline_info["deadline"])
            days_remaining = (deadline_date - now).days

            status = "on_track"
            if days_remaining < 0:
                status = "overdue"
            elif days_remaining <= 3:
                status = "critical_alert"
            elif days_remaining <= 7:
                status = "warning"

            active_alerts.append({
                "deficiency_id": def_id,
                "label": deadline_info.get("label", ""),
                "deadline": deadline_info["deadline"],
                "days_remaining": days_remaining,
                "status": status,
                "set_by": deadline_info.get("set_by", "system"),
                "note": deadline_info.get("note", ""),
            })

        rec["deadline_alerts"] = active_alerts
        rec["has_overdue"] = any(a["status"] == "overdue" for a in active_alerts)
        rec["has_critical_alert"] = any(a["status"] in ("critical_alert", "overdue") for a in active_alerts)

    return {"total": len(records), "records": records}


@app.post("/api/submissions/{record_id}/set-deadline")
def set_deficiency_deadline(record_id: int, payload: dict):
    """
    Set a remediation deadline for a specific deficiency.
    Payload: { deficiency_id: str, deadline: str (ISO date), note: str }
    """
    deficiency_id = sanitize_string(payload.get("deficiency_id", ""))
    deadline_str = sanitize_string(payload.get("deadline", ""))
    note = sanitize_string(payload.get("note", ""))

    if not deficiency_id or not deadline_str:
        raise HTTPException(status_code=400, detail="deficiency_id and deadline are required.")

    # Validate deadline is a valid future date
    try:
        deadline_date = datetime.fromisoformat(deadline_str)
        if deadline_date < datetime.now():
            raise HTTPException(status_code=400, detail="Deadline must be a future date.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO format (YYYY-MM-DD).")

    # Max deadline: 90 days
    max_deadline = datetime.now().replace(hour=23, minute=59, second=59)
    from datetime import timedelta
    max_deadline += timedelta(days=90)
    if deadline_date > max_deadline:
        raise HTTPException(status_code=400, detail="Deadline cannot exceed 90 days from today.")

    deadlines = load_deadlines()
    record_key = str(record_id)
    if record_key not in deadlines:
        deadlines[record_key] = {}

    deadlines[record_key][deficiency_id] = {
        "deadline": deadline_str,
        "label": payload.get("label", ""),
        "note": note,
        "set_at": datetime.now().isoformat(),
        "set_by": "hospital_admin",
    }

    save_deadlines(deadlines)

    return {
        "status": "success",
        "message": f"Deadline set for '{deficiency_id}' on {deadline_str}",
        "days_until_deadline": (deadline_date - datetime.now()).days,
    }


@app.get("/api/submissions/{record_id}/deadlines")
def get_record_deadlines(record_id: int):
    """Get all deadlines and their alert status for a submission."""
    deadlines = load_deadlines()
    record_key = str(record_id)
    rec_deadlines = deadlines.get(record_key, {})

    now = datetime.now()
    alerts = []

    for def_id, info in rec_deadlines.items():
        deadline_date = datetime.fromisoformat(info["deadline"])
        days_remaining = (deadline_date - now).days

        status = "on_track"
        blink = False
        if days_remaining < 0:
            status = "overdue"
            blink = True
        elif days_remaining <= 3:
            status = "critical_alert"
            blink = True
        elif days_remaining <= 7:
            status = "warning"

        alerts.append({
            "deficiency_id": def_id,
            "label": info.get("label", ""),
            "deadline": info["deadline"],
            "days_remaining": days_remaining,
            "status": status,
            "blink": blink,
            "note": info.get("note", ""),
            "set_at": info.get("set_at"),
        })

    # Sort: overdue first, then critical, then warning
    status_order = {"overdue": 0, "critical_alert": 1, "warning": 2, "on_track": 3}
    alerts.sort(key=lambda a: status_order.get(a["status"], 99))

    return {
        "record_id": record_id,
        "total_deadlines": len(alerts),
        "overdue_count": len([a for a in alerts if a["status"] == "overdue"]),
        "alerts": alerts,
    }


@app.delete("/api/submissions/{record_id}")
def delete_submission(record_id: int):
    records = load_submissions()
    new_records = [r for r in records if r.get("id") != record_id]
    if len(new_records) == len(records):
        raise HTTPException(status_code=404, detail="Record not found")
    save_submissions(new_records)
    # Also clean deadlines
    deadlines = load_deadlines()
    deadlines.pop(str(record_id), None)
    save_deadlines(deadlines)
    return {"status": "deleted", "remaining": len(new_records)}


@app.get("/api/export-csv")
def export_csv():
    records = load_submissions()
    if not records:
        raise HTTPException(status_code=404, detail="No records to export")

    CSV_COLUMNS = [
        "ID", "Submitted At",
        "Hospital Name", "Registration Number", "Email", "Phone",
        "Hospital Type", "Ownership Type", "Built-up Area (sq.mt)", "Buildings",
        "Sanctioned Beds", "Operational Beds", "Emergency Beds", "ICU Beds", "HDU Beds",
        "Private Ward Beds", "Semi-Private Beds", "General Ward Beds",
        "OPD Patients (12 months)", "Admissions (12 months)",
        "Inpatient Days (Monthly Avg)", "Available Bed Days (Monthly Avg)",
        "Avg Occupancy %", "ICU Occupancy %", "Ward Occupancy %",
        "ICU Inpatient Days (Monthly Avg)", "Available ICU Bed Days (Monthly Avg)",
        "Number of OTs", "Super-Speciality Surgeries", "Steam Autoclave", "ETO", "Plasma",
        "UPS Present", "UPS Capacity (KV)", "Generator Present", "Generator Capacity (KV)",
        "Water Tanks", "Water Capacity (1000L)", "Trolley Elevators", "People Elevators",
        "IC Committee", "Nurses Trained IC", "Hand Hygiene Audit",
        "BMW Authorization", "Colour Coded Bins", "Needle Cutters",
        "HR: Scope of Services", "HR: Lab Safety", "HR: Imaging Safety",
        "HR: Child Abduction", "HR: Infection Control", "HR: Fire Drills",
        "HR: Spill Management", "HR: Safety Education", "HR: Needle Stick",
        "HR: Medication Error", "HR: Disciplinary", "HR: Grievance",
        "Consent Forms", "Records Audited", "Feedback System",
        "Patient Rights Displayed", "Fire NOC", "Emergency 24x7",
        "LASA Protocol", "Medication Labelling",
        "Lab Critical Reporting", "Lab Scope", "Imaging Critical Reporting", "Imaging Scope",
        "Blood Bank Committee",
        "Medical Director", "Quality Manager", "Administrator",
        "Accreditation Type", "Previously Accredited",
        "Infrastructure (/15)", "OPD/IPD (/10)", "Clinical Services (/10)",
        "OT & Sterilization (/10)", "Utilities (/5)", "Infection Control (/15)",
        "HR Training (/10)", "Patient Processes (/15)", "Lab/Imaging (/5)",
        "Key Personnel (/5)", "Total Score (/100)", "Readiness %", "Accreditation Ready",
        "Nurses Present", "Nurses Document Uploaded", "Nurses Outsourced/Insourced",
        "Total Deficiencies", "Critical Deficiencies",
    ]

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=CSV_COLUMNS)
    writer.writeheader()

    def yn(v): return "Yes" if v else "No"

    for rec in records:
        fd = rec.get("form_data", {})
        bi = fd.get("basic_info", {})
        hd = fd.get("hospital_details", {})
        oi = fd.get("opd_ipd", {})
        ots = fd.get("ot_sterilization", {})
        ut = fd.get("utilities", {})
        ic = fd.get("infection_control_bmw", {})
        hr = fd.get("hr_training", {})
        pp = fd.get("patient_processes", {})
        li = fd.get("lab_imaging_blood", {})
        kp = fd.get("key_personnel", {})
        hs = fd.get("hospital_staffing", {})
        ai = fd.get("accreditation_info", {})
        ss = rec.get("section_scores", {})

        writer.writerow({
            "ID": rec.get("id"), "Submitted At": rec.get("submitted_at"),
            "Hospital Name": bi.get("hospital_name"), "Registration Number": bi.get("registration_number"),
            "Email": bi.get("contact_email"), "Phone": bi.get("phone"),
            "Hospital Type": hd.get("hospital_type"), "Ownership Type": hd.get("ownership_type"),
            "Built-up Area (sq.mt)": hd.get("built_up_area_sqmt"), "Buildings": hd.get("number_of_buildings"),
            "Sanctioned Beds": hd.get("total_sanctioned_beds"), "Operational Beds": hd.get("operational_beds"),
            "Emergency Beds": hd.get("casualty_emergency_beds"), "ICU Beds": hd.get("icu_beds"),
            "HDU Beds": hd.get("hdu_beds"), "Private Ward Beds": hd.get("private_ward_beds"),
            "Semi-Private Beds": hd.get("semi_private_ward_beds"), "General Ward Beds": hd.get("general_ward_beds"),
            "OPD Patients (12 months)": oi.get("opd_patients_12_months"),
            "Admissions (12 months)": oi.get("admissions_12_months"),
            "Inpatient Days (Monthly Avg)": oi.get("inpatient_days_monthly_avg"),
            "Available Bed Days (Monthly Avg)": oi.get("available_bed_days_monthly_avg"),
            "Avg Occupancy %": oi.get("average_occupancy_pct"),
            "ICU Occupancy %": oi.get("icu_occupancy_pct"), "Ward Occupancy %": oi.get("ward_occupancy_pct"),
            "ICU Inpatient Days (Monthly Avg)": oi.get("icu_inpatient_days_monthly_avg"),
            "Available ICU Bed Days (Monthly Avg)": oi.get("available_icu_bed_days_monthly_avg"),
            "Number of OTs": ots.get("number_of_ots"),
            "Super-Speciality Surgeries": yn(ots.get("performs_super_speciality_surgeries")),
            "Steam Autoclave": yn(ots.get("steam_autoclave")), "ETO": yn(ots.get("eto_sterilization")),
            "Plasma": yn(ots.get("plasma_sterilization")),
            "UPS Present": yn(ut.get("ups_present")), "UPS Capacity (KV)": ut.get("ups_capacity_kv"),
            "Generator Present": yn(ut.get("generator_present")),
            "Generator Capacity (KV)": ut.get("generator_capacity_kv"),
            "Water Tanks": ut.get("total_water_tanks"),
            "Water Capacity (1000L)": ut.get("total_water_capacity_litres"),
            "Trolley Elevators": ut.get("elevators_for_trolleys"),
            "People Elevators": ut.get("elevators_for_people"),
            "IC Committee": yn(ic.get("has_infection_control_committee")),
            "Nurses Trained IC": yn(ic.get("nurses_trained_in_infection_control")),
            "Hand Hygiene Audit": yn(ic.get("hand_hygiene_audit_conducted")),
            "BMW Authorization": yn(ic.get("has_biomedical_waste_authorization")),
            "Colour Coded Bins": yn(ic.get("colour_coded_bins_available")),
            "Needle Cutters": yn(ic.get("needle_cutters_used")),
            "HR: Scope of Services": yn(hr.get("training_scope_of_services")),
            "HR: Lab Safety": yn(hr.get("training_safe_lab_practices")),
            "HR: Imaging Safety": yn(hr.get("training_safe_imaging_practices")),
            "HR: Child Abduction": yn(hr.get("training_child_abduction_prevention")),
            "HR: Infection Control": yn(hr.get("training_infection_control")),
            "HR: Fire Drills": yn(hr.get("fire_mock_drills_conducted")),
            "HR: Spill Management": yn(hr.get("training_spill_management")),
            "HR: Safety Education": yn(hr.get("training_safety_education")),
            "HR: Needle Stick": yn(hr.get("training_needle_stick_injury")),
            "HR: Medication Error": yn(hr.get("training_medication_error")),
            "HR: Disciplinary": yn(hr.get("training_disciplinary_procedures")),
            "HR: Grievance": yn(hr.get("training_grievance_handling")),
            "Consent Forms": yn(pp.get("has_standard_consent_forms")),
            "Records Audited": yn(pp.get("medical_records_audited_monthly")),
            "Feedback System": yn(pp.get("patient_feedback_system")),
            "Patient Rights Displayed": yn(pp.get("patient_rights_displayed")),
            "Fire NOC": yn(pp.get("fire_noc_valid")),
            "Emergency 24x7": yn(pp.get("emergency_services_24x7")),
            "LASA Protocol": yn(pp.get("lasa_drugs_storage_protocol")),
            "Medication Labelling": yn(pp.get("medication_labelling_protocol")),
            "Lab Critical Reporting": yn(li.get("lab_critical_result_reporting")),
            "Lab Scope": yn(li.get("lab_scope_documented")),
            "Imaging Critical Reporting": yn(li.get("imaging_critical_result_reporting")),
            "Imaging Scope": yn(li.get("imaging_scope_documented")),
            "Blood Bank Committee": yn(li.get("blood_transfusion_committee_active")),
            "Medical Director": kp.get("medical_director"), "Quality Manager": kp.get("quality_manager"),
            "Administrator": kp.get("administrator"),
            "Accreditation Type": ai.get("accreditation_type"),
            "Previously Accredited": yn(ai.get("previously_accredited")),
            "Infrastructure (/15)": ss.get("infrastructure"),
            "OPD/IPD (/10)": ss.get("opd_ipd_occupancy"),
            "Clinical Services (/10)": ss.get("clinical_services"),
            "OT & Sterilization (/10)": ss.get("ot_sterilization"),
            "Utilities (/5)": ss.get("utilities"),
            "Infection Control (/15)": ss.get("infection_control_bmw"),
            "HR Training (/10)": ss.get("hr_training"),
            "Patient Processes (/15)": ss.get("patient_processes_safety"),
            "Lab/Imaging (/5)": ss.get("lab_imaging_blood"),
            "Key Personnel (/5)": ss.get("key_personnel"),
            "Total Score (/100)": rec.get("score"),
            "Readiness %": round(rec.get("readiness_percentage", 0), 2),
            "Accreditation Ready": "YES" if rec.get("is_ready") else "NO",
            "Nurses Present": yn(hs.get("nurses_present")),
            "Nurses Document Uploaded": yn(hs.get("nurses_document_uploaded")),
            "Nurses Outsourced/Insourced": hs.get("nurses_outsourced"),
            "Total Deficiencies": rec.get("deficiency_count", ""),
            "Critical Deficiencies": rec.get("critical_deficiencies", ""),
        })

    output.seek(0)
    return StreamingResponse(output, media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=nabh_hospital_report.csv"})


# ── Global exception handler ──
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Never leak stack traces to the client."""
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
