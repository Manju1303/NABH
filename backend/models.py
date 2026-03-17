from pydantic import BaseModel, Field, field_validator
from typing import Optional, List


# ══════════════════════════════════════════════
# STEP 1: Basic Information
# ══════════════════════════════════════════════
class BasicInformation(BaseModel):
    hospital_name: str = Field(..., min_length=2)
    registration_number: str = Field(..., min_length=2)
    contact_email: str = Field(...)
    phone: str = Field(..., min_length=10)


# ══════════════════════════════════════════════
# STEP 2: Hospital Details & Infrastructure
# ══════════════════════════════════════════════
class HospitalDetails(BaseModel):
    hospital_type: str = Field(...)  # Government / Private / NGO / Armed Forces
    ownership_type: str = Field(...)  # Proprietorship / Partnership / Trust / Society / Corporate
    built_up_area_sqmt: float = Field(default=0, ge=0)
    number_of_buildings: int = Field(default=1, ge=1)
    # Bed Strength
    total_sanctioned_beds: int = Field(..., ge=1)
    operational_beds: int = Field(..., ge=1)
    casualty_emergency_beds: int = Field(default=0, ge=0)
    icu_beds: int = Field(default=0, ge=0)
    hdu_beds: int = Field(default=0, ge=0)
    private_ward_beds: int = Field(default=0, ge=0)
    semi_private_ward_beds: int = Field(default=0, ge=0)
    general_ward_beds: int = Field(default=0, ge=0)

    @field_validator('operational_beds')
    @classmethod
    def verify_operational_beds(cls, v: int, info) -> int:
        if 'total_sanctioned_beds' in info.data and v > info.data['total_sanctioned_beds']:
            raise ValueError('Operational beds cannot exceed total sanctioned beds')
        return v


# ══════════════════════════════════════════════
# STEP 3: OPD / IPD & Occupancy Data
# ══════════════════════════════════════════════
class OPDIPDData(BaseModel):
    opd_patients_12_months: int = Field(default=0, ge=0, description="Number of OPD patients for the past 12 months")
    admissions_12_months: int = Field(default=0, ge=0, description="Number of admissions in the past 12 months")
    # Average Occupancy (3 month averages)
    inpatient_days_monthly_avg: float = Field(default=0, ge=0, description="Number of inpatient days in a month (3-month avg)")
    available_bed_days_monthly_avg: float = Field(default=0, ge=0, description="Number of available bed days (3-month avg)")
    average_occupancy_pct: float = Field(default=0, ge=0, le=100, description="Average Occupancy % (3-month avg)")
    icu_occupancy_pct: float = Field(default=0, ge=0, le=100, description="ICU Occupancy % (3-month avg)")
    ward_occupancy_pct: float = Field(default=0, ge=0, le=100, description="Ward Occupancy % (3-month avg)")
    # ICU data
    icu_inpatient_days_monthly_avg: float = Field(default=0, ge=0, description="Number of ICU inpatient days (3-month avg)")
    available_icu_bed_days_monthly_avg: float = Field(default=0, ge=0, description="Number of available ICU bed days (3-month avg)")


# ══════════════════════════════════════════════
# STEP 4: Clinical Services & Scope
# ══════════════════════════════════════════════
class ClinicalServicesScope(BaseModel):
    top_10_clinical_services: List[str] = Field(default_factory=lambda: [""] * 10)
    top_10_diagnoses: List[str] = Field(default_factory=lambda: [""] * 10)
    top_10_surgical_procedures: List[str] = Field(default_factory=lambda: [""] * 10)
    number_of_joint_replacements_yearly: int = Field(default=0, ge=0)
    # Clinical service volumes stored as a list of dicts
    clinical_service_volumes: List[dict] = Field(default_factory=list, description="List of {service, outpatient, inpatient, emergency}")


# ══════════════════════════════════════════════
# STEP 5: OT & Sterilization
# ══════════════════════════════════════════════
class OTSterilization(BaseModel):
    number_of_ots: int = Field(default=0, ge=0)
    performs_super_speciality_surgeries: bool = Field(default=False)
    exclusive_ot_for_super_speciality: bool = Field(default=False)
    number_of_super_speciality_ots: int = Field(default=0, ge=0)
    # Sterilization Methods
    steam_autoclave: bool = Field(default=False)
    eto_sterilization: bool = Field(default=False)
    plasma_sterilization: bool = Field(default=False)
    flash_sterilization: bool = Field(default=False)
    other_sterilization: str = Field(default="")


# ══════════════════════════════════════════════
# STEP 6: Utilities (Electrical, Water, Elevators)
# ══════════════════════════════════════════════
class Utilities(BaseModel):
    # Electrical
    ups_present: bool = Field(default=False)
    ups_capacity_kv: float = Field(default=0, ge=0)
    generator_present: bool = Field(default=False)
    generator_capacity_kv: float = Field(default=0, ge=0)
    # Water
    total_water_tanks: int = Field(default=0, ge=0)
    total_water_capacity_litres: float = Field(default=0, ge=0, description="In 1000 litres")
    alternate_water_source: bool = Field(default=False)
    alternate_water_usage: str = Field(default="")  # Drinking / Not for drinking
    # Elevators
    elevators_for_trolleys: int = Field(default=0, ge=0)
    elevators_for_people: int = Field(default=0, ge=0)
    trolleys_with_safety_belts: bool = Field(default=False)
    wheelchairs_with_safety_belts: bool = Field(default=False)


# ══════════════════════════════════════════════
# STEP 7: Infection Control & Bio Medical Waste
# ══════════════════════════════════════════════
class InfectionControlBMW(BaseModel):
    has_infection_control_committee: bool = Field(default=False)
    nurses_trained_in_infection_control: bool = Field(default=False)
    hand_hygiene_audit_conducted: bool = Field(default=False)
    has_biomedical_waste_authorization: bool = Field(default=False)
    # BMW specifics
    colour_coded_bins_available: bool = Field(default=False)
    segregation_instructions_displayed: bool = Field(default=False)
    closed_container_transport: bool = Field(default=False)
    needle_cutters_used: bool = Field(default=False)
    bmw_storage_facility: bool = Field(default=False)
    biohazard_sign_displayed: bool = Field(default=False)
    # Housekeeping & Laundry
    housekeeping_checklists_maintained: bool = Field(default=False)
    laundry_segregation_process: bool = Field(default=False)


# ══════════════════════════════════════════════
# STEP 8: HR Training
# ══════════════════════════════════════════════
class HRTraining(BaseModel):
    training_scope_of_services: bool = Field(default=False)
    training_safe_lab_practices: bool = Field(default=False)
    training_safe_imaging_practices: bool = Field(default=False)
    training_child_abduction_prevention: bool = Field(default=False)
    training_infection_control: bool = Field(default=False)
    fire_mock_drills_conducted: bool = Field(default=False)
    training_spill_management: bool = Field(default=False)
    training_safety_education: bool = Field(default=False)
    training_needle_stick_injury: bool = Field(default=False)
    training_medication_error: bool = Field(default=False)
    training_disciplinary_procedures: bool = Field(default=False)
    training_grievance_handling: bool = Field(default=False)


# ══════════════════════════════════════════════
# STEP 9: Patient Processes, Medication & Safety
# ══════════════════════════════════════════════
class PatientProcesses(BaseModel):
    # Patient documentation
    has_standard_consent_forms: bool = Field(default=False)
    medical_records_audited_monthly: bool = Field(default=False)
    patient_feedback_system: bool = Field(default=False)
    patient_rights_displayed: bool = Field(default=False)
    grievance_redressal_mechanism: bool = Field(default=False)
    # Medication management
    lasa_drugs_storage_protocol: bool = Field(default=False, description="Look-Alike Sound-Alike drugs stored safely")
    medication_labelling_protocol: bool = Field(default=False)
    # Safety management
    fire_noc_valid: bool = Field(default=False)
    regular_fire_drills: bool = Field(default=False)
    staff_trained_in_cpr: bool = Field(default=False)
    emergency_services_24x7: bool = Field(default=False)
    # Signage
    radiation_hazard_signage: bool = Field(default=False)
    pcpndt_declaration_displayed: bool = Field(default=False)
    biohazard_signage: bool = Field(default=False)
    fire_exit_signage: bool = Field(default=False)
    directional_signage: bool = Field(default=False)
    departmental_signage: bool = Field(default=False)
    # Maintenance
    breakdown_maintenance_type: str = Field(default="In house")  # In house / Outsourced
    preventive_maintenance_type: str = Field(default="In house")  # In house / Outsourced


# ══════════════════════════════════════════════
# STEP 10: Lab, Imaging, Blood Bank
# ══════════════════════════════════════════════
class LabImagingBloodBank(BaseModel):
    lab_critical_result_reporting: bool = Field(default=False)
    lab_tat_displayed: bool = Field(default=False)
    lab_scope_documented: bool = Field(default=False)
    imaging_critical_result_reporting: bool = Field(default=False)
    imaging_tat_displayed: bool = Field(default=False)
    imaging_scope_documented: bool = Field(default=False)
    blood_bank_transfusion_reaction_forms: bool = Field(default=False)
    blood_transfusion_committee_active: bool = Field(default=False)


# ══════════════════════════════════════════════
# STEP 11: Key Personnel
# ══════════════════════════════════════════════
class KeyPersonnel(BaseModel):
    medical_director: str = Field(..., min_length=2)
    quality_manager: str = Field(..., min_length=2)
    administrator: str = Field(..., min_length=2)


# ══════════════════════════════════════════════
# STEP 12: Accreditation Info
# ══════════════════════════════════════════════
class AccreditationInfo(BaseModel):
    accreditation_type: str = Field(default="Entry Level")  # Full / Entry Level / Pre-Accreditation / Renewal
    previously_accredited: bool = Field(default=False)
    previous_accreditation_date: Optional[str] = Field(default=None)


# ══════════════════════════════════════════════
# Hospital Staffing
# ══════════════════════════════════════════════
class NurseDetail(BaseModel):
    name: str
    qualification: str
    certificate_name: Optional[str] = None

class HospitalStaffing(BaseModel):
    nurses_present: bool = Field(default=False, description="Whether nurses are present (Yes/No)")
    nurses_list: List[NurseDetail] = Field(default_factory=list, description="List of nurses details")
    nurses_document_uploaded: bool = Field(default=False, description="If yes, is the document uploaded")
    nurses_outsourced: str = Field(default="", description="If no, specify Insource or Outsource")


# ══════════════════════════════════════════════
# COMBINED FORM
# ══════════════════════════════════════════════
class NABHEntryLevelForm(BaseModel):
    basic_info: BasicInformation
    hospital_details: HospitalDetails
    opd_ipd: OPDIPDData
    clinical_services: ClinicalServicesScope
    hospital_staffing: HospitalStaffing
    ot_sterilization: OTSterilization
    utilities: Utilities
    infection_control_bmw: InfectionControlBMW
    hr_training: HRTraining
    patient_processes: PatientProcesses
    lab_imaging_blood: LabImagingBloodBank
    key_personnel: KeyPersonnel
    accreditation_info: AccreditationInfo
