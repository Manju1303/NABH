from schemas import NABHEntryLevelForm
from compliance import get_nested_value, NABH_THRESHOLDS, MANDATORY_BOOLEANS

def calculate_nabh_score(form: NABHEntryLevelForm) -> dict:
    """
    NABH Scoring Engine v4.1
    Fix HIGH-06: is_ready threshold changed from 100% to 80%
    """
    form_data = form.model_dump()

    raw_score = 0
    raw_max_score = 0
    cat_scores: dict = {}
    cat_max: dict = {}

    # 1. Assessment Mode Detection (1-5 beds = Virtual, 6+ = Onsite)
    op_beds = get_nested_value(form_data, "hospital_details.operational_beds") or 0
    assessment_mode = "Virtual Assessment (VA)" if op_beds <= 5 else "Onsite Assessment (OA)"

    # 2. Statutory Compliance Blockers
    statutory_items = ["bmw_authorization", "fire_noc", "emergency_24x7", "steam_autoclave"]
    statutory_passed = True
    missing_statutory = []

    # 3. Evaluate numeric thresholds
    for t in NABH_THRESHOLDS:
        cat = t["category"]
        cat_scores.setdefault(cat, 0)
        cat_max.setdefault(cat, 0)

        condition = t.get("condition_field")
        if condition and not get_nested_value(form_data, condition):
            continue

        weight = 10
        raw_max_score += weight
        cat_max[cat] += weight

        actual_val = get_nested_value(form_data, t["field"])
        if actual_val is not None and actual_val >= t["min_value"]:
            raw_score += weight
            cat_scores[cat] += weight

    # 4. Evaluate mandatory booleans
    for req in MANDATORY_BOOLEANS:
        cat = req["category"]
        cat_scores.setdefault(cat, 0)
        cat_max.setdefault(cat, 0)

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

    # 5. Normalize
    normalized_total = (raw_score / raw_max_score * 100) if raw_max_score > 0 else 0

    # 6. Grading — HIGH-06 FIX: is_ready at 80%, not 100%
    if not statutory_passed:
        grade = "Ineligible (Missing Statutory Requirements)"
        status_color = "#EF4444"
    elif normalized_total < 50:
        grade = "Initial Stage (Low Readiness)"
        status_color = "#F97316"
    elif normalized_total < 80:
        grade = "Advanced Stage (Near Ready)"
        status_color = "#EAB308"
    else:
        grade = "Accreditation Ready (Full Compliance)"
        status_color = "#22C55E"

    section_scores = {
        cat: int((cat_scores[cat] / cat_max[cat]) * 100)
        for cat in cat_scores if cat_max.get(cat, 0) > 0
    }

    return {
        "total_score": int(normalized_total),
        "max_score": 100,
        "readiness_percentage": round(normalized_total, 2),
        # FIXED HIGH-06: was >= 100, now >= 80
        "is_ready": normalized_total >= 80 and statutory_passed,
        "assessment_mode": assessment_mode,
        "statutory_passed": statutory_passed,
        "missing_statutory": missing_statutory,
        "grade": grade,
        "status_color": status_color,
        "section_scores": section_scores,
    }
