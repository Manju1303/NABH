from pydantic import BaseModel, Field, field_validator, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# ── Auth Schemas ──
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    password: str
    hospital_id: Optional[int] = None

class UserOut(BaseModel):
    id: int
    username: str
    role: str
    hospital_id: Optional[int] = None

    class Config:
        from_attributes = True

# ── Submission Schemas ──
class BasicInformation(BaseModel):
    hospital_name: str = Field(..., min_length=2)
    registration_number: str = Field(..., min_length=2)
    contact_email: EmailStr = Field(...)
    phone: str = Field(..., min_length=10)

class HospitalDetails(BaseModel):
    hospital_type: str = Field(...)
    ownership_type: str = Field(...)
    built_up_area_sqmt: float = Field(default=0, ge=0)
    number_of_buildings: int = Field(default=1, ge=1)
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

class OPDIPDData(BaseModel):
    opd_patients_12_months: int = Field(default=0, ge=0)
    admissions_12_months: int = Field(default=0, ge=0)
    inpatient_days_monthly_avg: float = Field(default=0, ge=0)
    available_bed_days_monthly_avg: float = Field(default=0, ge=0)
    average_occupancy_pct: float = Field(default=0, ge=0, le=100)
    icu_occupancy_pct: float = Field(default=0, ge=0, le=100)
    ward_occupancy_pct: float = Field(default=0, ge=0, le=100)
    icu_inpatient_days_monthly_avg: float = Field(default=0, ge=0)
    available_icu_bed_days_monthly_avg: float = Field(default=0, ge=0)

class ClinicalServicesScope(BaseModel):
    top_10_clinical_services: List[str] = Field(default_factory=lambda: [""] * 10)
    top_10_diagnoses: List[str] = Field(default_factory=lambda: [""] * 10)
    top_10_surgical_procedures: List[str] = Field(default_factory=lambda: [""] * 10)
    number_of_joint_replacements_yearly: int = Field(default=0, ge=0)
    clinical_service_volumes: List[Dict[str, Any]] = Field(default_factory=list)

class OTSterilization(BaseModel):
    number_of_ots: int = Field(default=0, ge=0)
    performs_super_speciality_surgeries: bool = Field(default=False)
    exclusive_ot_for_super_speciality: bool = Field(default=False)
    number_of_super_speciality_ots: int = Field(default=0, ge=0)
    steam_autoclave: bool = Field(default=False)
    eto_sterilization: bool = Field(default=False)
    plasma_sterilization: bool = Field(default=False)
    flash_sterilization: bool = Field(default=False)
    other_sterilization: str = Field(default="")

class Utilities(BaseModel):
    ups_present: bool = Field(default=False)
    ups_capacity_kv: float = Field(default=0, ge=0)
    generator_present: bool = Field(default=False)
    generator_capacity_kv: float = Field(default=0, ge=0)
    total_water_tanks: int = Field(default=0, ge=0)
    total_water_capacity_litres: float = Field(default=0, ge=0)
    alternate_water_source: bool = Field(default=False)
    alternate_water_usage: str = Field(default="")
    elevators_for_trolleys: int = Field(default=0, ge=0)
    elevators_for_people: int = Field(default=0, ge=0)
    trolleys_with_safety_belts: bool = Field(default=False)
    wheelchairs_with_safety_belts: bool = Field(default=False)

class InfectionControlBMW(BaseModel):
    has_infection_control_committee: bool = Field(default=False)
    nurses_trained_in_infection_control: bool = Field(default=False)
    hand_hygiene_audit_conducted: bool = Field(default=False)
    has_biomedical_waste_authorization: bool = Field(default=False)
    colour_coded_bins_available: bool = Field(default=False)
    segregation_instructions_displayed: bool = Field(default=False)
    closed_container_transport: bool = Field(default=False)
    needle_cutters_used: bool = Field(default=False)
    bmw_storage_facility: bool = Field(default=False)
    biohazard_sign_displayed: bool = Field(default=False)
    housekeeping_checklists_maintained: bool = Field(default=False)
    laundry_segregation_process: bool = Field(default=False)

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

class PatientProcesses(BaseModel):
    has_standard_consent_forms: bool = Field(default=False)
    medical_records_audited_monthly: bool = Field(default=False)
    patient_feedback_system: bool = Field(default=False)
    patient_rights_displayed: bool = Field(default=False)
    grievance_redressal_mechanism: bool = Field(default=False)
    lasa_drugs_storage_protocol: bool = Field(default=False)
    medication_labelling_protocol: bool = Field(default=False)
    fire_noc_valid: bool = Field(default=False)
    regular_fire_drills: bool = Field(default=False)
    staff_trained_in_cpr: bool = Field(default=False)
    emergency_services_24x7: bool = Field(default=False)
    radiation_hazard_signage: bool = Field(default=False)
    pcpndt_declaration_displayed: bool = Field(default=False)
    biohazard_signage: bool = Field(default=False)
    fire_exit_signage: bool = Field(default=False)
    directional_signage: bool = Field(default=False)
    departmental_signage: bool = Field(default=False)
    breakdown_maintenance_type: str = Field(default="In house")
    preventive_maintenance_type: str = Field(default="In house")

class LabImagingBloodBank(BaseModel):
    lab_critical_result_reporting: bool = Field(default=False)
    lab_tat_displayed: bool = Field(default=False)
    lab_scope_documented: bool = Field(default=False)
    imaging_critical_result_reporting: bool = Field(default=False)
    imaging_tat_displayed: bool = Field(default=False)
    imaging_scope_documented: bool = Field(default=False)
    blood_bank_transfusion_reaction_forms: bool = Field(default=False)
    blood_transfusion_committee_active: bool = Field(default=False)

class KeyPersonnel(BaseModel):
    medical_director: str = Field(..., min_length=2)
    quality_manager: str = Field(..., min_length=2)
    administrator: str = Field(..., min_length=2)

class AccreditationInfo(BaseModel):
    accreditation_type: str = Field(default="Entry Level")
    previously_accredited: bool = Field(default=False)
    previous_accreditation_date: Optional[str] = Field(default=None)

class NurseDetail(BaseModel):
    name: str
    qualification: str
    certificate_name: Optional[str] = None

class HospitalStaffing(BaseModel):
    nurses_present: bool = Field(default=False)
    nurses_list: List[NurseDetail] = Field(default_factory=list)
    nurses_document_uploaded: bool = Field(default=False)
    nurses_outsourced: str = Field(default="")

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

class RemarkCreate(BaseModel):
    author: str = "Hospital Admin"
    message: str
    role: str = "Applicant"
    category: str = "Observation"

class DeadlineCreate(BaseModel):
    deficiency_id: str
    deadline: str
    label: str = ""
    note: str = ""
