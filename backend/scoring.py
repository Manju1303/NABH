from models import NABHEntryLevelForm

def calculate_nabh_score(form: NABHEntryLevelForm) -> dict:
    """
    Calculates the NABH Score based ONLY on mandatory items (THRESHOLDS + BOOLEANS).
    Maximum score is normalized to 100.
    """
    from compliance import get_nested_value, NABH_THRESHOLDS, MANDATORY_BOOLEANS
    
    # We will compute over the nested dict structure
    form_data = form.model_dump()
    
    raw_score = 0
    raw_max_score = 0
    
    cat_scores = {}
    cat_max = {}
    
    # 1. Evaluate thresholds
    for t in NABH_THRESHOLDS:
        cat = t["category"]
        if cat not in cat_scores:
            cat_scores[cat] = 0
            cat_max[cat] = 0
            
        # Check condition if any (e.g. UPS present)
        condition = t.get("condition_field")
        if condition and not get_nested_value(form_data, condition):
            continue
            
        raw_max_score += 10
        cat_max[cat] += 10
        
        actual_val = get_nested_value(form_data, t["field"])
        if actual_val is not None and actual_val >= t["min_value"]:
            raw_score += 10
            cat_scores[cat] += 10
            
    # 2. Evaluate booleans
    for req in MANDATORY_BOOLEANS:
        cat = req["category"]
        if cat not in cat_scores:
            cat_scores[cat] = 0
            cat_max[cat] = 0
            
        raw_max_score += 10
        cat_max[cat] += 10
        
        actual_val = get_nested_value(form_data, req["field"])
        if actual_val:
            raw_score += 10
            cat_scores[cat] += 10

    # Normalize to 100
    if raw_max_score > 0:
        normalized_total = (raw_score / raw_max_score) * 100
    else:
        normalized_total = 0

    # Normalize section scores
    section_scores = {}
    for cat in cat_scores:
        if cat_max[cat] > 0:
            # We just show the raw percentage of that section
            section_scores[cat] = int((cat_scores[cat] / cat_max[cat]) * 100)
            
    return {
        "total_score": int(normalized_total),
        "max_score": 100,
        "readiness_percentage": normalized_total,
        "is_ready": normalized_total == 100, # All mandatory things must be 100% to truly be ready
        "section_scores": section_scores
    }
