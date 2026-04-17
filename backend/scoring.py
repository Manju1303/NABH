from schemas import NABHEntryLevelForm
from compliance import get_nested_value, NABH_THRESHOLDS, MANDATORY_BOOLEANS

def calculate_nabh_score(form: NABHEntryLevelForm) -> dict:
    """
    Enhanced NABH Scoring Engine v4.0 (Aligned with Toolkit Guidelines)
    
    Implements:
    1. Assessment Mode Detection (Virtual vs Onsite)
    2. Statutory Compliance Blocker Logic
    3. Weighted Category Scoring
    4. Readiness Grading
    """
    form_data = form.model_dump()
    
    raw_score = 0
    raw_max_score = 0
    
    cat_scores = {}
    cat_max = {}
    
    # ── 1. Assessment Mode Detection ──
    # Guidelines: 1-5 beds = Virtual, 6+ beds = Onsite
    op_beds = get_nested_value(form_data, "hospital_details.operational_beds") or 0
    assessment_mode = "Virtual Assessment (VA)" if op_beds <= 5 else "Onsite Assessment (OA)"
    
    # ── 2. Statutory Compliance Check (Blockers) ──
    # These are non-negotiable for certification eligibility
    statutory_items = [
        "bmw_authorization", "fire_noc", "emergency_24x7", "steam_autoclave"
    ]
    statutory_passed = True
    missing_statutory = []
    
    # ── 3. Evaluate Thresholds & Booleans ──
    # Thresholds evaluation
    for t in NABH_THRESHOLDS:
        cat = t["category"]
        if cat not in cat_scores:
            cat_scores[cat] = 0
            cat_max[cat] = 0
            
        condition = t.get("condition_field")
        if condition and not get_nested_value(form_data, condition):
            continue
            
        weight = 10 # Default weight
        raw_max_score += weight
        cat_max[cat] += weight
        
        actual_val = get_nested_value(form_data, t["field"])
        if actual_val is not None and actual_val >= t["min_value"]:
            raw_score += weight
            cat_scores[cat] += weight

    # Booleans evaluation
    for req in MANDATORY_BOOLEANS:
        cat = req["category"]
        if cat not in cat_scores:
            cat_scores[cat] = 0
            cat_max[cat] = 0
            
        # Statutory check
        actual_val = get_nested_value(form_data, req["field"])
        if req["id"] in statutory_items and not actual_val:
            statutory_passed = False
            missing_statutory.append(req["label"])
            
        weight = 10
        raw_max_score += weight
        cat_max[cat] += weight
        
        if actual_val:
            raw_score += weight
            cat_scores[cat] += weight

    # ── 4. Normalization & Grading ──
    normalized_total = (raw_score / raw_max_score * 100) if raw_max_score > 0 else 0
    
    # Grading Logic
    if not statutory_passed:
        grade = "Ineligible (Missing Statutory Requirements)"
        status_color = "#EF4444" # Red
    elif normalized_total < 50:
        grade = "Initial Stage (Low Readiness)"
        status_color = "#F97316" # Orange
    elif normalized_total < 80:
        grade = "Advanced Stage (Near Ready)"
        status_color = "#EAB308" # Yellow
    else:
        grade = "Accreditation Ready (Full Compliance)"
        status_color = "#22C55E" # Green

    # Section scores
    section_scores = {}
    for cat in cat_scores:
        if cat_max[cat] > 0:
            section_scores[cat] = int((cat_scores[cat] / cat_max[cat]) * 100)
            
    return {
        "total_score": int(normalized_total),
        "max_score": 100,
        "readiness_percentage": round(normalized_total, 2),
        "is_ready": normalized_total >= 100 and statutory_passed,
        "assessment_mode": assessment_mode,
        "statutory_passed": statutory_passed,
        "missing_statutory": missing_statutory,
        "grade": grade,
        "status_color": status_color,
        "section_scores": section_scores
    }
