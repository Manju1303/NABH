import requests

url = "http://127.0.0.1:8000/api/submit-form"

payload = {
    "hospital_info": {
        "hospital_name": "City General Hospital",
        "registration_number": "REG12345",
        "contact_email": "admin@citygeneral.com",
        "total_sanctioned_beds": 100,
        "operational_beds": 85
    },
    "clinical_services": {
        "opd_patients_monthly_avg": 5000,
        "admissions_monthly_avg": 400,
        "icu_beds": 10,
        "icu_occupancy_monthly_avg": 250,
        "emergency_services_24x7": True
    },
    "infection_control": {
        "has_infection_control_committee": True,
        "nurses_trained_in_infection_control": True,
        "hand_hygiene_audit_conducted": True,
        "sterilization_method_used": "Autoclave"
    },
    "safety_hr": {
        "fire_noc_valid": True,
        "regular_fire_drills_conducted": True,
        "staff_trained_in_cpr": True,
        "biomedical_waste_authorization_valid": True
    },
    "patient_documentation": {
        "has_standard_consent_forms": True,
        "medical_records_audited_monthly": True,
        "patient_feedback_system_active": True
    }
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response Body:\n", response.json())
except requests.exceptions.ConnectionError:
    print("Error: Could not connect to the API. Make sure FastAPI server is running with 'python main.py' or 'uvicorn main:app --reload'")
