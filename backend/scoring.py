from models import NABHEntryLevelForm


def calculate_nabh_score(form: NABHEntryLevelForm) -> dict:
    """
    Rule-based NABH Compliance Scoring Engine.
    Maximum Score = 100, distributed across 10 weighted categories.
    """
    score = 0
    max_score = 100
    details = {}

    # ── 1. Infrastructure & Bed Strength (15 pts) ──
    infra = 0
    hd = form.hospital_details
    if hd.operational_beds >= 10: infra += 5
    if hd.casualty_emergency_beds > 0: infra += 3
    if hd.icu_beds > 0: infra += 3
    if hd.built_up_area_sqmt > 0: infra += 2
    if hd.number_of_buildings >= 1: infra += 2
    infra = min(infra, 15)
    score += infra
    details['infrastructure'] = infra

    # ── 2. OPD/IPD & Occupancy (10 pts) ──
    occ = 0
    opd = form.opd_ipd
    if opd.opd_patients_12_months > 0: occ += 3
    if opd.admissions_12_months > 0: occ += 3
    if opd.average_occupancy_pct > 0: occ += 2
    if opd.icu_occupancy_pct > 0: occ += 2
    occ = min(occ, 10)
    score += occ
    details['opd_ipd_occupancy'] = occ

    # ── 3. Clinical Services Scope (10 pts) ──
    cs = 0
    filled_services = [s for s in form.clinical_services.top_10_clinical_services if s.strip()]
    filled_diagnoses = [s for s in form.clinical_services.top_10_diagnoses if s.strip()]
    if len(filled_services) >= 5: cs += 4
    elif len(filled_services) >= 1: cs += 2
    if len(filled_diagnoses) >= 5: cs += 3
    elif len(filled_diagnoses) >= 1: cs += 1
    if form.clinical_services.number_of_joint_replacements_yearly > 0: cs += 1
    if len(form.clinical_services.clinical_service_volumes) > 0: cs += 2
    cs = min(cs, 10)
    score += cs
    details['clinical_services'] = cs

    # ── 4. OT & Sterilization (10 pts) ──
    ot = 0
    ots = form.ot_sterilization
    if ots.number_of_ots > 0: ot += 3
    if ots.steam_autoclave: ot += 2
    if ots.eto_sterilization: ot += 1
    if ots.plasma_sterilization: ot += 1
    if ots.performs_super_speciality_surgeries and ots.exclusive_ot_for_super_speciality: ot += 3
    ot = min(ot, 10)
    score += ot
    details['ot_sterilization'] = ot

    # ── 5. Utilities & Infrastructure Support (5 pts) ──
    util = 0
    u = form.utilities
    if u.ups_present: util += 1
    if u.generator_present: util += 1
    if u.total_water_tanks > 0: util += 1
    if u.trolleys_with_safety_belts: util += 1
    if u.elevators_for_trolleys > 0: util += 1
    util = min(util, 5)
    score += util
    details['utilities'] = util

    # ── 6. Infection Control & BMW (15 pts) ──
    ic = 0
    icb = form.infection_control_bmw
    if icb.has_infection_control_committee: ic += 2
    if icb.nurses_trained_in_infection_control: ic += 2
    if icb.hand_hygiene_audit_conducted: ic += 2
    if icb.has_biomedical_waste_authorization: ic += 3
    if icb.colour_coded_bins_available: ic += 1
    if icb.segregation_instructions_displayed: ic += 1
    if icb.closed_container_transport: ic += 1
    if icb.needle_cutters_used: ic += 1
    if icb.housekeeping_checklists_maintained: ic += 1
    if icb.laundry_segregation_process: ic += 1
    ic = min(ic, 15)
    score += ic
    details['infection_control_bmw'] = ic

    # ── 7. HR Training (10 pts) ──
    hr = 0
    t = form.hr_training
    training_fields = [
        t.training_scope_of_services, t.training_safe_lab_practices,
        t.training_safe_imaging_practices, t.training_child_abduction_prevention,
        t.training_infection_control, t.fire_mock_drills_conducted,
        t.training_spill_management, t.training_safety_education,
        t.training_needle_stick_injury, t.training_medication_error,
        t.training_disciplinary_procedures, t.training_grievance_handling
    ]
    completed = sum(1 for f in training_fields if f)
    hr = min(round((completed / 12) * 10), 10)
    score += hr
    details['hr_training'] = hr

    # ── 8. Patient Processes & Safety (15 pts) ──
    pp = 0
    p = form.patient_processes
    if p.has_standard_consent_forms: pp += 2
    if p.medical_records_audited_monthly: pp += 2
    if p.patient_feedback_system: pp += 1
    if p.patient_rights_displayed: pp += 1
    if p.grievance_redressal_mechanism: pp += 1
    if p.lasa_drugs_storage_protocol: pp += 1
    if p.medication_labelling_protocol: pp += 1
    if p.fire_noc_valid: pp += 2
    if p.emergency_services_24x7: pp += 2
    if p.fire_exit_signage and p.directional_signage: pp += 1
    if p.staff_trained_in_cpr: pp += 1
    pp = min(pp, 15)
    score += pp
    details['patient_processes_safety'] = pp

    # ── 9. Lab, Imaging & Blood Bank (5 pts) ──
    lb = 0
    li = form.lab_imaging_blood
    if li.lab_critical_result_reporting: lb += 1
    if li.lab_scope_documented: lb += 1
    if li.imaging_critical_result_reporting: lb += 1
    if li.imaging_scope_documented: lb += 1
    if li.blood_transfusion_committee_active: lb += 1
    lb = min(lb, 5)
    score += lb
    details['lab_imaging_blood'] = lb

    # ── 10. Key Personnel & Accreditation (5 pts) ──
    kp = 0
    if len(form.key_personnel.medical_director.strip()) > 1: kp += 2
    if len(form.key_personnel.quality_manager.strip()) > 1: kp += 2
    if len(form.key_personnel.administrator.strip()) > 1: kp += 1
    kp = min(kp, 5)
    score += kp
    details['key_personnel'] = kp

    readiness_percentage = (score / max_score) * 100

    return {
        "total_score": score,
        "max_score": max_score,
        "readiness_percentage": readiness_percentage,
        "is_ready": readiness_percentage >= 75,
        "section_scores": details
    }
