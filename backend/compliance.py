"""
NABH Compliance Thresholds & Deficiency Engine.
Defines minimum standards for NABH Entry Level.
When hospital values fall below thresholds, deficiencies are flagged
with remediation deadlines.
"""

from datetime import datetime, timedelta
from typing import Optional

# ══════════════════════════════════════════════════════
# NABH MINIMUM STANDARD THRESHOLDS
# Each threshold: (field_path, label, min_required, unit, category)
# ══════════════════════════════════════════════════════

NABH_THRESHOLDS = [
    # Infrastructure & Bed Strength
    {
        "id": "beds_operational",
        "category": "Infrastructure",
        "label": "Minimum Operational Beds",
        "field": "hospital_details.operational_beds",
        "min_value": 10,
        "unit": "beds",
        "severity": "critical",
        "nabh_reference": "NABH Entry Level - Infrastructure Requirement",
    },
    {
        "id": "icu_beds",
        "category": "Infrastructure",
        "label": "Minimum ICU Beds",
        "field": "hospital_details.icu_beds",
        "min_value": 2,
        "unit": "beds",
        "severity": "critical",
        "nabh_reference": "NABH Entry Level - ICU Requirement",
    },
    {
        "id": "emergency_beds",
        "category": "Infrastructure",
        "label": "Minimum Emergency/Casualty Beds",
        "field": "hospital_details.casualty_emergency_beds",
        "min_value": 2,
        "unit": "beds",
        "severity": "high",
        "nabh_reference": "NABH Entry Level - Emergency Services",
    },

    # Utilities
    {
        "id": "ups_capacity",
        "category": "Utilities",
        "label": "Minimum UPS Capacity",
        "field": "utilities.ups_capacity_kv",
        "min_value": 5,
        "unit": "KV",
        "severity": "high",
        "nabh_reference": "NABH - Electrical Safety Standards",
        "condition_field": "utilities.ups_present",  # Only check if UPS is present
    },
    {
        "id": "generator_capacity",
        "category": "Utilities",
        "label": "Minimum Generator Capacity",
        "field": "utilities.generator_capacity_kv",
        "min_value": 15,
        "unit": "KV",
        "severity": "high",
        "nabh_reference": "NABH - Electrical Backup Standards",
        "condition_field": "utilities.generator_present",
    },
    {
        "id": "water_tanks",
        "category": "Utilities",
        "label": "Minimum Water Storage Tanks",
        "field": "utilities.total_water_tanks",
        "min_value": 2,
        "unit": "tanks",
        "severity": "medium",
        "nabh_reference": "NABH - Water Supply Standards",
    },
    {
        "id": "water_capacity",
        "category": "Utilities",
        "label": "Minimum Water Storage Capacity",
        "field": "utilities.total_water_capacity_litres",
        "min_value": 5,
        "unit": "× 1000 litres",
        "severity": "medium",
        "nabh_reference": "NABH - Water Storage Requirements",
    },
    {
        "id": "trolley_elevators",
        "category": "Utilities",
        "label": "Minimum Trolley/Bed Elevators",
        "field": "utilities.elevators_for_trolleys",
        "min_value": 1,
        "unit": "elevators",
        "severity": "medium",
        "nabh_reference": "NABH - Patient Transport Standards",
    },

    # OT
    {
        "id": "number_of_ots",
        "category": "OT & Sterilization",
        "label": "Minimum Operation Theatres",
        "field": "ot_sterilization.number_of_ots",
        "min_value": 1,
        "unit": "OTs",
        "severity": "critical",
        "nabh_reference": "NABH Entry Level - OT Requirement",
    },

    # OPD/IPD
    {
        "id": "opd_12_months",
        "category": "Clinical Volume",
        "label": "Minimum OPD Patients (12 months)",
        "field": "opd_ipd.opd_patients_12_months",
        "min_value": 1000,
        "unit": "patients",
        "severity": "medium",
        "nabh_reference": "NABH - Clinical Volume Baseline",
    },
    {
        "id": "admissions_12_months",
        "category": "Clinical Volume",
        "label": "Minimum Admissions (12 months)",
        "field": "opd_ipd.admissions_12_months",
        "min_value": 100,
        "unit": "admissions",
        "severity": "medium",
        "nabh_reference": "NABH - Admission Volume Baseline",
    },
]

# ══════════════════════════════════════════════════════
# MANDATORY BOOLEAN REQUIREMENTS
# These MUST be True for NABH compliance
# ══════════════════════════════════════════════════════

MANDATORY_BOOLEANS = [
    {
        "id": "ic_committee",
        "category": "Infection Control",
        "label": "Infection Control Committee must be established",
        "field": "infection_control_bmw.has_infection_control_committee",
        "severity": "critical",
        "nabh_reference": "HIC.1 - Infection Control Program",
    },
    {
        "id": "bmw_authorization",
        "category": "Bio-Medical Waste",
        "label": "BMW Authorization from Pollution Control Board is mandatory",
        "field": "infection_control_bmw.has_biomedical_waste_authorization",
        "severity": "critical",
        "nabh_reference": "NABH - BMW Management",
    },
    {
        "id": "fire_noc",
        "category": "Safety",
        "label": "Valid Fire NOC is mandatory",
        "field": "patient_processes.fire_noc_valid",
        "severity": "critical",
        "nabh_reference": "NABH - Fire Safety Standards",
    },
    {
        "id": "emergency_24x7",
        "category": "Clinical Services",
        "label": "24x7 Emergency Services must be available",
        "field": "patient_processes.emergency_services_24x7",
        "severity": "critical",
        "nabh_reference": "NABH Entry Level - Emergency Requirement",
    },
    {
        "id": "consent_forms",
        "category": "Patient Documentation",
        "label": "Standard Consent Forms must be in use",
        "field": "patient_processes.has_standard_consent_forms",
        "severity": "high",
        "nabh_reference": "PC.1 - Patient Rights",
    },
    {
        "id": "patient_rights",
        "category": "Patient Documentation",
        "label": "Patient Rights must be displayed",
        "field": "patient_processes.patient_rights_displayed",
        "severity": "high",
        "nabh_reference": "PC.1 - Patient Rights and Education",
    },
    {
        "id": "color_bins",
        "category": "Bio-Medical Waste",
        "label": "Colour-coded BMW bins must be available",
        "field": "infection_control_bmw.colour_coded_bins_available",
        "severity": "high",
        "nabh_reference": "NABH - BMW Segregation",
    },
    {
        "id": "needle_cutters",
        "category": "Bio-Medical Waste",
        "label": "Needle cutters must be used for syringe hubs",
        "field": "infection_control_bmw.needle_cutters_used",
        "severity": "high",
        "nabh_reference": "NABH - Sharps Waste Management",
    },
    {
        "id": "steam_autoclave",
        "category": "OT & Sterilization",
        "label": "Steam Autoclave sterilization is mandatory",
        "field": "ot_sterilization.steam_autoclave",
        "severity": "critical",
        "nabh_reference": "HIC.2 - Sterilization Standards",
    },
    {
        "id": "fire_exit_signage",
        "category": "Safety",
        "label": "Fire exit signage must be displayed",
        "field": "patient_processes.fire_exit_signage",
        "severity": "high",
        "nabh_reference": "NABH - Safety Signage",
    },
    {
        "id": "training_ic",
        "category": "HR Training",
        "label": "Infection Control Practices training is mandatory",
        "field": "hr_training.training_infection_control",
        "severity": "high",
        "nabh_reference": "NABH - Staff Training Requirements",
    },
    {
        "id": "training_spill",
        "category": "HR Training",
        "label": "Spill Management training is mandatory",
        "field": "hr_training.training_spill_management",
        "severity": "high",
        "nabh_reference": "NABH - Staff Training Requirements",
    },
]


def get_nested_value(data: dict, field_path: str):
    """Safely extract a nested value from a dict using dot notation."""
    keys = field_path.split(".")
    current = data
    for key in keys:
        if isinstance(current, dict):
            current = current.get(key)
        else:
            return None
        if current is None:
            return None
    return current


def evaluate_deficiencies(form_data: dict) -> list[dict]:
    """
    Evaluate all NABH thresholds and mandatory booleans.
    Returns a list of deficiency items with severity and suggested deadlines.
    """
    deficiencies = []

    # Check numeric thresholds
    for threshold in NABH_THRESHOLDS:
        # Check condition field (skip if condition isn't met)
        condition = threshold.get("condition_field")
        if condition:
            condition_val = get_nested_value(form_data, condition)
            if not condition_val:
                continue  # Skip – e.g., no UPS = skip UPS capacity check

        actual_value = get_nested_value(form_data, threshold["field"])
        if actual_value is None:
            actual_value = 0

        if actual_value < threshold["min_value"]:
            # Calculate suggested deadline based on severity
            if threshold["severity"] == "critical":
                deadline_days = 14
            elif threshold["severity"] == "high":
                deadline_days = 30
            else:
                deadline_days = 60

            deficiencies.append({
                "id": threshold["id"],
                "type": "threshold",
                "category": threshold["category"],
                "label": threshold["label"],
                "current_value": actual_value,
                "required_value": threshold["min_value"],
                "unit": threshold["unit"],
                "severity": threshold["severity"],
                "nabh_reference": threshold["nabh_reference"],
                "message": f"Current: {actual_value} {threshold['unit']} — Required minimum: {threshold['min_value']} {threshold['unit']}",
                "suggested_deadline_days": deadline_days,
                "suggested_deadline": (datetime.now() + timedelta(days=deadline_days)).isoformat(),
            })

    # Check mandatory booleans
    for req in MANDATORY_BOOLEANS:
        actual = get_nested_value(form_data, req["field"])
        if not actual:
            severity = req["severity"]
            deadline_days = 14 if severity == "critical" else 30

            deficiencies.append({
                "id": req["id"],
                "type": "mandatory",
                "category": req["category"],
                "label": req["label"],
                "current_value": False,
                "required_value": True,
                "unit": "",
                "severity": severity,
                "nabh_reference": req["nabh_reference"],
                "message": f"This requirement is not yet met.",
                "suggested_deadline_days": deadline_days,
                "suggested_deadline": (datetime.now() + timedelta(days=deadline_days)).isoformat(),
            })

    # Sort by severity: critical first, then high, then medium
    severity_order = {"critical": 0, "high": 1, "medium": 2}
    deficiencies.sort(key=lambda d: severity_order.get(d["severity"], 99))

    return deficiencies
