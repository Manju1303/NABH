import pytest
from schemas import NABHEntryLevelForm, BasicInformation, HospitalDetails, OPDIPDData, ClinicalServicesScope, HospitalStaffing, OTSterilization, Utilities, InfectionControlBMW, HRTraining, PatientProcesses, LabImagingBloodBank, KeyPersonnel, AccreditationInfo
from scoring import calculate_nabh_score

def get_minimal_form_data():
    return {
        "basic_info": {
            "hospital_name": "Test Hospital",
            "registration_number": "REG123",
            "contact_email": "test@hospital.com",
            "phone": "9876543210"
        },
        "hospital_details": {
            "hospital_type": "General",
            "ownership_type": "Private",
            "total_sanctioned_beds": 100,
            "operational_beds": 50
        },
        "opd_ipd": {},
        "clinical_services": {},
        "hospital_staffing": {},
        "ot_sterilization": {},
        "utilities": {},
        "infection_control_bmw": {},
        "hr_training": {},
        "patient_processes": {},
        "lab_imaging_blood": {},
        "key_personnel": {
            "medical_director": "Dr. Smith",
            "quality_manager": "Jane Doe",
            "administrator": "John Doe"
        },
        "accreditation_info": {}
    }

def test_full_compliance_score():
    data = get_minimal_form_data()
    # Setting all critical/mandatory fields to pass
    # Thresholds
    data["hospital_details"]["operational_beds"] = 15 # min 10
    data["hospital_details"]["icu_beds"] = 5 # min 2
    data["hospital_details"]["casualty_emergency_beds"] = 5 # min 2
    data["ot_sterilization"]["number_of_ots"] = 2 # min 1
    data["opd_ipd"]["opd_patients_12_months"] = 2000 # min 1000
    data["opd_ipd"]["admissions_12_months"] = 200 # min 100
    
    # Utilities (optional if not present)
    data["utilities"]["ups_present"] = True
    data["utilities"]["ups_capacity_kv"] = 10 # min 5
    data["utilities"]["generator_present"] = True
    data["utilities"]["generator_capacity_kv"] = 20 # min 15
    data["utilities"]["total_water_tanks"] = 3 # min 2
    data["utilities"]["total_water_capacity_litres"] = 10 # min 5
    data["utilities"]["elevators_for_trolleys"] = 2 # min 1
    
    # Booleans
    data["infection_control_bmw"]["has_infection_control_committee"] = True
    data["infection_control_bmw"]["has_biomedical_waste_authorization"] = True
    data["infection_control_bmw"]["colour_coded_bins_available"] = True
    data["infection_control_bmw"]["needle_cutters_used"] = True
    data["patient_processes"]["fire_noc_valid"] = True
    data["patient_processes"]["emergency_services_24x7"] = True
    data["patient_processes"]["has_standard_consent_forms"] = True
    data["patient_processes"]["patient_rights_displayed"] = True
    data["patient_processes"]["fire_exit_signage"] = True
    data["ot_sterilization"]["steam_autoclave"] = True
    data["hr_training"]["training_infection_control"] = True
    data["hr_training"]["training_spill_management"] = True
    
    form = NABHEntryLevelForm(**data)
    result = calculate_nabh_score(form)
    
    assert result["total_score"] == 100
    assert result["is_ready"] is True

def test_zero_compliance_score():
    data = get_minimal_form_data()
    # All mandatory fields will be 0 or False by default except what we set in minimal data
    # Let's ensure they are fail
    data["hospital_details"]["operational_beds"] = 5 # min 10
    
    form = NABHEntryLevelForm(**data)
    result = calculate_nabh_score(form)
    
    assert result["total_score"] < 100
    assert result["is_ready"] is False
