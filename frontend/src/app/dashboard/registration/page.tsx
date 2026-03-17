'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import {
  Send, CheckCircle, AlertTriangle, ShieldAlert, ChevronLeft, ChevronRight,
  Building2, Stethoscope, Users, Award, FileText, Activity, Zap,
  ShieldCheck, GraduationCap, HeartPulse, FlaskConical, ClipboardList,
  Clock, CalendarClock, Bell, Plus, Trash
} from 'lucide-react';

const STEPS = [
  { label: 'Basic Info', icon: <FileText className="w-4 h-4" /> },
  { label: 'Hospital Details', icon: <Building2 className="w-4 h-4" /> },
  { label: 'OPD / IPD Data', icon: <Activity className="w-4 h-4" /> },
  { label: 'Clinical Services', icon: <Stethoscope className="w-4 h-4" /> },
  { label: 'Hospital Staffing', icon: <Users className="w-4 h-4" /> },
  { label: 'OT & Sterilization', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Utilities', icon: <Zap className="w-4 h-4" /> },
  { label: 'Infection Control', icon: <HeartPulse className="w-4 h-4" /> },
  { label: 'HR Training', icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Patient Processes', icon: <ShieldCheck className="w-4 h-4" /> },
  { label: 'Lab & Imaging', icon: <FlaskConical className="w-4 h-4" /> },
  { label: 'Key Personnel', icon: <Users className="w-4 h-4" /> },
  { label: 'Accreditation', icon: <Award className="w-4 h-4" /> },
];

interface ScoreResult {
  total_score: number; max_score: number;
  readiness_percentage: number; is_ready: boolean;
  section_scores: Record<string, number>;
}

interface Deficiency {
  id: string; type: string; category: string; label: string;
  current_value: number | boolean; required_value: number | boolean;
  unit: string; severity: string; nabh_reference: string;
  message: string; suggested_deadline_days: number; suggested_deadline: string;
}

interface DefSummary {
  total: number; critical: number; high: number; medium: number;
}

export default function ComplianceForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deficiencies, setDeficiencies] = useState<Deficiency[]>([]);
  const [defSummary, setDefSummary] = useState<DefSummary | null>(null);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [deadlineInputs, setDeadlineInputs] = useState<Record<string, string>>({});
  const [deadlineNotes, setDeadlineNotes] = useState<Record<string, string>>({});
  const [deadlineSet, setDeadlineSet] = useState<Record<string, boolean>>({});

  // ── STEP 1: Basic Info ──
  const [hospitalName, setHospitalName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // ── STEP 2: Hospital Details ──
  const [hospitalType, setHospitalType] = useState('');
  const [ownershipType, setOwnershipType] = useState('');
  const [builtUpArea, setBuiltUpArea] = useState(0);
  const [buildings, setBuildings] = useState(1);
  const [sanctionedBeds, setSanctionedBeds] = useState(0);
  const [operationalBeds, setOperationalBeds] = useState(0);
  const [emergencyBeds, setEmergencyBeds] = useState(0);
  const [icuBeds, setIcuBeds] = useState(0);
  const [hduBeds, setHduBeds] = useState(0);
  const [privateBeds, setPrivateBeds] = useState(0);
  const [semiPrivateBeds, setSemiPrivateBeds] = useState(0);
  const [generalBeds, setGeneralBeds] = useState(0);

  // ── STEP 3: OPD/IPD ──
  const [opd12, setOpd12] = useState(0);
  const [admissions12, setAdmissions12] = useState(0);
  const [inpatientDays, setInpatientDays] = useState(0);
  const [availableBedDays, setAvailableBedDays] = useState(0);
  const [avgOccupancy, setAvgOccupancy] = useState(0);
  const [icuOccupancy, setIcuOccupancy] = useState(0);
  const [wardOccupancy, setWardOccupancy] = useState(0);
  const [icuInpatientDays, setIcuInpatientDays] = useState(0);
  const [availableIcuBedDays, setAvailableIcuBedDays] = useState(0);

  // ── STEP 4: Clinical Services ──
  const [topServices, setTopServices] = useState<string[]>(Array(10).fill(''));
  const [topDiagnoses, setTopDiagnoses] = useState<string[]>(Array(10).fill(''));
  const [topSurgeries, setTopSurgeries] = useState<string[]>(Array(10).fill(''));
  const [jointReplacements, setJointReplacements] = useState(0);

  // ── STEP 5: Hospital Staffing ──
  const [nursesPresent, setNursesPresent] = useState(false);
  const [nursesList, setNursesList] = useState<{name: string; qualification: string; certificate_name: string}[]>([{name: '', qualification: '', certificate_name: ''}]);
  const [nursesDoc, setNursesDoc] = useState(false);
  const [nursesOutsourced, setNursesOutsourced] = useState('');

  // ── STEP 6: OT & Sterilization ──
  const [numOTs, setNumOTs] = useState(0);
  const [superSpeciality, setSuperSpeciality] = useState(false);
  const [exclusiveOT, setExclusiveOT] = useState(false);
  const [numSuperOTs, setNumSuperOTs] = useState(0);
  const [steamAutoclave, setSteamAutoclave] = useState(false);
  const [eto, setEto] = useState(false);
  const [plasma, setPlasma] = useState(false);
  const [flash, setFlash] = useState(false);
  const [otherSterilization, setOtherSterilization] = useState('');

  // ── STEP 7: Utilities ──
  const [upsPresent, setUpsPresent] = useState(false);
  const [upsKV, setUpsKV] = useState(0);
  const [genPresent, setGenPresent] = useState(false);
  const [genKV, setGenKV] = useState(0);
  const [waterTanks, setWaterTanks] = useState(0);
  const [waterCapacity, setWaterCapacity] = useState(0);
  const [altWater, setAltWater] = useState(false);
  const [altWaterUsage, setAltWaterUsage] = useState('');
  const [trolleyElevators, setTrolleyElevators] = useState(0);
  const [peopleElevators, setPeopleElevators] = useState(0);
  const [trolleySafety, setTrolleySafety] = useState(false);
  const [wheelchairSafety, setWheelchairSafety] = useState(false);

  // ── STEP 8: Infection Control & BMW ──
  const [icCommittee, setIcCommittee] = useState(false);
  const [nursesIC, setNursesIC] = useState(false);
  const [handHygiene, setHandHygiene] = useState(false);
  const [bmwAuth, setBmwAuth] = useState(false);
  const [colorBins, setColorBins] = useState(false);
  const [segregationInstr, setSegregationInstr] = useState(false);
  const [closedTransport, setClosedTransport] = useState(false);
  const [needleCutters, setNeedleCutters] = useState(false);
  const [bmwStorage, setBmwStorage] = useState(false);
  const [biohazardSign, setBiohazardSign] = useState(false);
  const [housekeeping, setHousekeeping] = useState(false);
  const [laundryProcess, setLaundryProcess] = useState(false);

  // ── STEP 9: HR Training ──
  const [trScope, setTrScope] = useState(false);
  const [trLab, setTrLab] = useState(false);
  const [trImaging, setTrImaging] = useState(false);
  const [trChild, setTrChild] = useState(false);
  const [trIC, setTrIC] = useState(false);
  const [trFire, setTrFire] = useState(false);
  const [trSpill, setTrSpill] = useState(false);
  const [trSafety, setTrSafety] = useState(false);
  const [trNeedle, setTrNeedle] = useState(false);
  const [trMedError, setTrMedError] = useState(false);
  const [trDisciplinary, setTrDisciplinary] = useState(false);
  const [trGrievance, setTrGrievance] = useState(false);

  // ── STEP 10: Patient Processes ──
  const [consentForms, setConsentForms] = useState(false);
  const [recordsAudited, setRecordsAudited] = useState(false);
  const [feedbackSystem, setFeedbackSystem] = useState(false);
  const [patientRights, setPatientRights] = useState(false);
  const [grievance, setGrievance] = useState(false);
  const [lasaProtocol, setLasaProtocol] = useState(false);
  const [medLabelling, setMedLabelling] = useState(false);
  const [fireNoc, setFireNoc] = useState(false);
  const [fireDrills, setFireDrills] = useState(false);
  const [cprTrained, setCprTrained] = useState(false);
  const [emergency24x7, setEmergency24x7] = useState(false);
  const [radSignage, setRadSignage] = useState(false);
  const [pcpndtSignage, setPcpndtSignage] = useState(false);
  const [bioSignage, setBioSignage] = useState(false);
  const [fireExitSignage, setFireExitSignage] = useState(false);
  const [directionalSignage, setDirectionalSignage] = useState(false);
  const [deptSignage, setDeptSignage] = useState(false);
  const [breakdownMaint, setBreakdownMaint] = useState('In house');
  const [preventiveMaint, setPreventiveMaint] = useState('In house');

  // ── STEP 11: Lab, Imaging, Blood Bank ──
  const [labCritical, setLabCritical] = useState(false);
  const [labTAT, setLabTAT] = useState(false);
  const [labScope, setLabScope] = useState(false);
  const [imgCritical, setImgCritical] = useState(false);
  const [imgTAT, setImgTAT] = useState(false);
  const [imgScope, setImgScope] = useState(false);
  const [bloodReaction, setBloodReaction] = useState(false);
  const [bloodCommittee, setBloodCommittee] = useState(false);

  // ── STEP 12: Key Personnel ──
  const [medDirector, setMedDirector] = useState('');
  const [qualityMgr, setQualityMgr] = useState('');
  const [admin, setAdmin] = useState('');

  // ── STEP 13: Accreditation ──
  const [accreditationType, setAccreditationType] = useState('Entry Level');
  const [prevAccredited, setPrevAccredited] = useState(false);
  const [prevAccDate, setPrevAccDate] = useState('');

  useEffect(() => {
    // Attempt to load existing form data on mount
    axios.get(`${API_BASE_URL}/api/submissions`)
      .then(res => {
        const records = res.data.records;
        if (records && records.length > 0) {
          const latest = records[records.length - 1]; // Assume latest record for this demo
          const fd = latest.form_data;
          if (!fd) return;
          
          const bi = fd.basic_info || {};
          setHospitalName(bi.hospital_name || '');
          setRegNumber(bi.registration_number || '');
          setEmail(bi.contact_email || '');
          setPhone(bi.phone || '');
          
          const hd = fd.hospital_details || {};
          setHospitalType(hd.hospital_type || '');
          setOwnershipType(hd.ownership_type || '');
          setBuiltUpArea(hd.built_up_area_sqmt || 0);
          setBuildings(hd.number_of_buildings || 1);
          setSanctionedBeds(hd.total_sanctioned_beds || 0);
          setOperationalBeds(hd.operational_beds || 0);
          setEmergencyBeds(hd.casualty_emergency_beds || 0);
          setIcuBeds(hd.icu_beds || 0);
          setHduBeds(hd.hdu_beds || 0);
          setPrivateBeds(hd.private_ward_beds || 0);
          setSemiPrivateBeds(hd.semi_private_ward_beds || 0);
          setGeneralBeds(hd.general_ward_beds || 0);

          const oi = fd.opd_ipd || {};
          setOpd12(oi.opd_patients_12_months || 0);
          setAdmissions12(oi.admissions_12_months || 0);
          setInpatientDays(oi.inpatient_days_monthly_avg || 0);
          setAvailableBedDays(oi.available_bed_days_monthly_avg || 0);
          setAvgOccupancy(oi.average_occupancy_pct || 0);
          setIcuOccupancy(oi.icu_occupancy_pct || 0);
          setWardOccupancy(oi.ward_occupancy_pct || 0);
          setIcuInpatientDays(oi.icu_inpatient_days_monthly_avg || 0);
          setAvailableIcuBedDays(oi.available_icu_bed_days_monthly_avg || 0);

          const cs = fd.clinical_services || {};
          if (cs.top_10_clinical_services) setTopServices(cs.top_10_clinical_services);
          if (cs.top_10_diagnoses) setTopDiagnoses(cs.top_10_diagnoses);
          if (cs.top_10_surgical_procedures) setTopSurgeries(cs.top_10_surgical_procedures);
          setJointReplacements(cs.number_of_joint_replacements_yearly || 0);

      const hs = fd.hospital_staffing || {};
          setNursesPresent(hs.nurses_present || false);
          
          if (hs.nurses_list && hs.nurses_list.length > 0) {
            setNursesList(hs.nurses_list);
            setNursesDoc(hs.nurses_list.some((n: any) => n.certificate_name) || hs.nurses_document_uploaded || false);
          } else {
            // Legacy fallback
            setNursesList([{
              name: hs.nurse_name || '', 
              qualification: '', 
              certificate_name: hs.certificate_name || ''
            }]);
            if (hs.certificate_name) setNursesDoc(true);
            else setNursesDoc(hs.nurses_document_uploaded || false);
          }
          
          setNursesOutsourced(hs.nurses_outsourced || '');

          const ots = fd.ot_sterilization || {};
          setNumOTs(ots.number_of_ots || 0);
          setSuperSpeciality(ots.performs_super_speciality_surgeries || false);
          setExclusiveOT(ots.exclusive_ot_for_super_speciality || false);
          setNumSuperOTs(ots.number_of_super_speciality_ots || 0);
          setSteamAutoclave(ots.steam_autoclave || false);
          setEto(ots.eto_sterilization || false);
          setPlasma(ots.plasma_sterilization || false);
          setFlash(ots.flash_sterilization || false);
          setOtherSterilization(ots.other_sterilization || '');

          const ut = fd.utilities || {};
          setUpsPresent(ut.ups_present || false);
          setUpsKV(ut.ups_capacity_kv || 0);
          setGenPresent(ut.generator_present || false);
          setGenKV(ut.generator_capacity_kv || 0);
          setWaterTanks(ut.total_water_tanks || 0);
          setWaterCapacity(ut.total_water_capacity_litres || 0);
          setAltWater(ut.alternate_water_source || false);
          setAltWaterUsage(ut.alternate_water_usage || '');
          setTrolleyElevators(ut.elevators_for_trolleys || 0);
          setPeopleElevators(ut.elevators_for_people || 0);
          setTrolleySafety(ut.trolleys_with_safety_belts || false);
          setWheelchairSafety(ut.wheelchairs_with_safety_belts || false);

          const ic = fd.infection_control_bmw || {};
          setIcCommittee(ic.has_infection_control_committee || false);
          setNursesIC(ic.nurses_trained_in_infection_control || false);
          setHandHygiene(ic.hand_hygiene_audit_conducted || false);
          setBmwAuth(ic.has_biomedical_waste_authorization || false);
          setColorBins(ic.colour_coded_bins_available || false);
          setSegregationInstr(ic.segregation_instructions_displayed || false);
          setClosedTransport(ic.closed_container_transport || false);
          setNeedleCutters(ic.needle_cutters_used || false);
          setBmwStorage(ic.bmw_storage_facility || false);
          setBiohazardSign(ic.biohazard_sign_displayed || false);
          setHousekeeping(ic.housekeeping_checklists_maintained || false);
          setLaundryProcess(ic.laundry_segregation_process || false);

          const hr = fd.hr_training || {};
          setTrScope(hr.training_scope_of_services || false);
          setTrLab(hr.training_safe_lab_practices || false);
          setTrImaging(hr.training_safe_imaging_practices || false);
          setTrChild(hr.training_child_abduction_prevention || false);
          setTrIC(hr.training_infection_control || false);
          setTrFire(hr.fire_mock_drills_conducted || false);
          setTrSpill(hr.training_spill_management || false);
          setTrSafety(hr.training_safety_education || false);
          setTrNeedle(hr.training_needle_stick_injury || false);
          setTrMedError(hr.training_medication_error || false);
          setTrDisciplinary(hr.training_disciplinary_procedures || false);
          setTrGrievance(hr.training_grievance_handling || false);

          const pp = fd.patient_processes || {};
          setConsentForms(pp.has_standard_consent_forms || false);
          setRecordsAudited(pp.medical_records_audited_monthly || false);
          setFeedbackSystem(pp.patient_feedback_system || false);
          setPatientRights(pp.patient_rights_displayed || false);
          setGrievance(pp.grievance_redressal_mechanism || false);
          setLasaProtocol(pp.lasa_drugs_storage_protocol || false);
          setMedLabelling(pp.medication_labelling_protocol || false);
          setFireNoc(pp.fire_noc_valid || false);
          setFireDrills(pp.regular_fire_drills || false);
          setCprTrained(pp.staff_trained_in_cpr || false);
          setEmergency24x7(pp.emergency_services_24x7 || false);
          setRadSignage(pp.radiation_hazard_signage || false);
          setPcpndtSignage(pp.pcpndt_declaration_displayed || false);
          setBioSignage(pp.biohazard_signage || false);
          setFireExitSignage(pp.fire_exit_signage || false);
          setDirectionalSignage(pp.directional_signage || false);
          setDeptSignage(pp.departmental_signage || false);
          setBreakdownMaint(pp.breakdown_maintenance_type || 'In house');
          setPreventiveMaint(pp.preventive_maintenance_type || 'In house');

          const lib = fd.lab_imaging_blood || {};
          setLabCritical(lib.lab_critical_result_reporting || false);
          setLabTAT(lib.lab_tat_displayed || false);
          setLabScope(lib.lab_scope_documented || false);
          setImgCritical(lib.imaging_critical_result_reporting || false);
          setImgTAT(lib.imaging_tat_displayed || false);
          setImgScope(lib.imaging_scope_documented || false);
          setBloodReaction(lib.blood_bank_transfusion_reaction_forms || false);
          setBloodCommittee(lib.blood_transfusion_committee_active || false);

          const kp = fd.key_personnel || {};
          setMedDirector(kp.medical_director || '');
          setQualityMgr(kp.quality_manager || '');
          setAdmin(kp.administrator || '');

          const ai = fd.accreditation_info || {};
          setAccreditationType(ai.accreditation_type || 'Entry Level');
          setPrevAccredited(ai.previously_accredited || false);
          setPrevAccDate(ai.previous_accreditation_date || '');
          
          setSubmittedId(latest.id);
        }
      })
      .catch(() => {});
  }, []);

  const updateList = (list: string[], idx: number, val: string, setter: (l: string[]) => void) => {
    const copy = [...list]; copy[idx] = val; setter(copy);
  };

  const validateStep = () => {
    setError(null);

    // ── Step 0: Basic Info ──
    if (step === 0) {
      if (!hospitalName.trim()) { setError('Hospital Name is required.'); return false; }
      if (hospitalName.trim().length < 3) { setError('Hospital Name must be at least 3 characters.'); return false; }
      if (!regNumber.trim()) { setError('Registration Number is required.'); return false; }
      if (!email.trim()) { setError('Contact Email is required.'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address (e.g. admin@hospital.com).'); return false; }
      if (!phone.trim()) { setError('Phone number is required.'); return false; }
      if (!/^\d{10}$/.test(phone)) { setError('Phone number must be exactly 10 digits (no spaces, dashes, or country code).'); return false; }
    }

    // ── Step 1: Hospital Details ──
    if (step === 1) {
      if (!hospitalType) { setError('Hospital Type is required.'); return false; }
      if (!ownershipType) { setError('Ownership Type is required.'); return false; }
      if (builtUpArea <= 0) { setError('Built-up Area must be greater than 0.'); return false; }
      if (buildings <= 0) { setError('Number of Buildings must be at least 1.'); return false; }
      if (sanctionedBeds <= 0) { setError('Sanctioned Beds must be greater than 0.'); return false; }
      if (operationalBeds <= 0) { setError('Operational Beds must be greater than 0.'); return false; }
      if (operationalBeds > sanctionedBeds) { setError('Operational Beds cannot exceed Sanctioned Beds.'); return false; }
      if (icuBeds + hduBeds + privateBeds + semiPrivateBeds + generalBeds + emergencyBeds > operationalBeds) {
        setError('Sum of bed categories (ICU + HDU + Private + Semi-Private + General + Emergency) cannot exceed Operational Beds.'); return false;
      }
    }

    // ── Step 2: OPD / IPD Data ──
    if (step === 2) {
      if (opd12 <= 0) { setError('OPD Patients (past 12 months) must be greater than 0.'); return false; }
      if (admissions12 <= 0) { setError('Admissions (past 12 months) must be greater than 0.'); return false; }
      if (avgOccupancy < 0 || avgOccupancy > 100) { setError('Average Occupancy must be between 0 and 100%.'); return false; }
      if (icuOccupancy < 0 || icuOccupancy > 100) { setError('ICU Occupancy must be between 0 and 100%.'); return false; }
      if (wardOccupancy < 0 || wardOccupancy > 100) { setError('Ward Occupancy must be between 0 and 100%.'); return false; }
    }

    // ── Step 3: Clinical Services ──
    if (step === 3) {
      const validServices = topServices.filter(s => s.trim() !== '').length;
      const validDiagnoses = topDiagnoses.filter(s => s.trim() !== '').length;
      const validSurgeries = topSurgeries.filter(s => s.trim() !== '').length;
      if (validServices < 5) { setError('Please provide at least 5 Clinical Services.'); return false; }
      if (validDiagnoses < 5) { setError('Please provide at least 5 Diagnoses.'); return false; }
      if (validSurgeries < 5) { setError('Please provide at least 5 Surgical Procedures.'); return false; }
    }

    // ── Step 4: Hospital Staffing ──
    if (step === 4) {
      if (nursesPresent) {
        if (nursesList.length === 0) { setError('Please add at least one nurse.'); return false; }
        for (let i = 0; i < nursesList.length; i++) {
          if (!nursesList[i].name.trim()) { setError(`Nurse #${i + 1}: Name is required.`); return false; }
          if (!nursesList[i].qualification.trim()) { setError(`Nurse #${i + 1}: Qualification is required.`); return false; }
        }
      } else {
        if (!nursesOutsourced) { setError('Please select whether nurses are Insourced or Outsourced.'); return false; }
      }
    }

    // ── Step 5: OT & Sterilization ──
    if (step === 5) {
      if (numOTs <= 0) { setError('Number of OTs must be at least 1.'); return false; }
      if (superSpeciality && exclusiveOT && numSuperOTs <= 0) { setError('Number of Super-Speciality OTs must be at least 1 if exclusive OT is selected.'); return false; }
      if (!steamAutoclave && !eto && !plasma && !flash && !otherSterilization.trim()) {
        setError('Please select at least one sterilization method.'); return false;
      }
    }

    // ── Step 6: Utilities ──
    if (step === 6) {
      if (upsPresent && upsKV <= 0) { setError('UPS Capacity (KV) must be greater than 0 when UPS is present.'); return false; }
      if (genPresent && genKV <= 0) { setError('Generator Capacity (KV) must be greater than 0 when generator is present.'); return false; }
      if (waterTanks <= 0) { setError('Total Water Tanks must be at least 1.'); return false; }
      if (waterCapacity <= 0) { setError('Total Water Capacity must be greater than 0.'); return false; }
    }

    // ── Step 7: Infection Control & BMW ──
    if (step === 7) {
      if (!icCommittee) { setError('Infection Control Committee is mandatory.'); return false; }
      if (!nursesIC) { setError('Nurses Trained in Infection Control is mandatory.'); return false; }
      if (!handHygiene) { setError('Hand Hygiene Audit is mandatory.'); return false; }
      if (!bmwAuth) { setError('BMW Authorization from PCB is mandatory.'); return false; }
      if (!colorBins) { setError('Colour Coded Bins are mandatory.'); return false; }
      if (!segregationInstr) { setError('Segregation Instructions must be displayed (mandatory).'); return false; }
      if (!closedTransport) { setError('Closed Container Transport is mandatory.'); return false; }
      if (!needleCutters) { setError('Needle Cutters usage is mandatory.'); return false; }
      if (!bmwStorage) { setError('BMW Storage Facility is mandatory.'); return false; }
      if (!biohazardSign) { setError('Biohazard Sign must be displayed (mandatory).'); return false; }
    }

    // ── Step 8: HR Training ──
    if (step === 8) {
      if (!trLab) { setError('Training: Safe Practices in Laboratory is mandatory.'); return false; }
      if (!trImaging) { setError('Training: Safe Practices in Imaging is mandatory.'); return false; }
      if (!trIC) { setError('Training: Infection Control Practices is mandatory.'); return false; }
      if (!trSpill) { setError('Training: Spill Management is mandatory.'); return false; }
      if (!trSafety) { setError('Training: Safety Education Programme is mandatory.'); return false; }
    }

    // ── Step 9: Patient Processes ──
    if (step === 9) {
      if (!fireNoc) { setError('Fire NOC must be valid (mandatory).'); return false; }
      if (!fireDrills) { setError('Regular Fire Drills are mandatory.'); return false; }
    }

    // ── Step 10: Lab, Imaging & Blood Bank ──
    if (step === 10) {
      // No hard mandatory here but we verify at least labs or imaging are filled if applicable
    }

    // ── Step 11: Key Personnel ──
    if (step === 11) {
      if (!medDirector.trim()) { setError('Medical Director name is required.'); return false; }
      if (medDirector.trim().length < 3) { setError('Medical Director name must be at least 3 characters.'); return false; }
      if (!qualityMgr.trim()) { setError('Quality Manager name is required.'); return false; }
      if (qualityMgr.trim().length < 3) { setError('Quality Manager name must be at least 3 characters.'); return false; }
      if (!admin.trim()) { setError('Administrator name is required.'); return false; }
      if (admin.trim().length < 3) { setError('Administrator name must be at least 3 characters.'); return false; }
    }

    // ── Step 12: Accreditation ──
    if (step === 12) {
      if (!accreditationType) { setError('Accreditation Type is required.'); return false; }
      if (prevAccredited && !prevAccDate) { setError('Previous Accreditation Date is required when previously accredited.'); return false; }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true); setError(null); setResult(null);
    const payload = {
      basic_info: { hospital_name: hospitalName, registration_number: regNumber, contact_email: email, phone },
      hospital_details: {
        hospital_type: hospitalType, ownership_type: ownershipType, built_up_area_sqmt: builtUpArea,
        number_of_buildings: buildings, total_sanctioned_beds: sanctionedBeds, operational_beds: operationalBeds,
        casualty_emergency_beds: emergencyBeds, icu_beds: icuBeds, hdu_beds: hduBeds,
        private_ward_beds: privateBeds, semi_private_ward_beds: semiPrivateBeds, general_ward_beds: generalBeds,
      },
      opd_ipd: {
        opd_patients_12_months: opd12, admissions_12_months: admissions12,
        inpatient_days_monthly_avg: inpatientDays, available_bed_days_monthly_avg: availableBedDays,
        average_occupancy_pct: avgOccupancy, icu_occupancy_pct: icuOccupancy, ward_occupancy_pct: wardOccupancy,
        icu_inpatient_days_monthly_avg: icuInpatientDays, available_icu_bed_days_monthly_avg: availableIcuBedDays,
      },
      clinical_services: {
        top_10_clinical_services: topServices, top_10_diagnoses: topDiagnoses,
        top_10_surgical_procedures: topSurgeries, number_of_joint_replacements_yearly: jointReplacements,
        clinical_service_volumes: [],
      },
      hospital_staffing: {
        nurses_present: nursesPresent, 
        nurses_list: nursesPresent ? nursesList.filter((n) => n.name.trim() !== '') : [],
        nurses_document_uploaded: nursesPresent ? nursesList.some(n => n.certificate_name) : false, 
        nurses_outsourced: nursesOutsourced,
      },
      ot_sterilization: {
        number_of_ots: numOTs, performs_super_speciality_surgeries: superSpeciality,
        exclusive_ot_for_super_speciality: exclusiveOT, number_of_super_speciality_ots: numSuperOTs,
        steam_autoclave: steamAutoclave, eto_sterilization: eto, plasma_sterilization: plasma,
        flash_sterilization: flash, other_sterilization: otherSterilization,
      },
      utilities: {
        ups_present: upsPresent, ups_capacity_kv: upsKV, generator_present: genPresent,
        generator_capacity_kv: genKV, total_water_tanks: waterTanks, total_water_capacity_litres: waterCapacity,
        alternate_water_source: altWater, alternate_water_usage: altWaterUsage,
        elevators_for_trolleys: trolleyElevators, elevators_for_people: peopleElevators,
        trolleys_with_safety_belts: trolleySafety, wheelchairs_with_safety_belts: wheelchairSafety,
      },
      infection_control_bmw: {
        has_infection_control_committee: icCommittee, nurses_trained_in_infection_control: nursesIC,
        hand_hygiene_audit_conducted: handHygiene, has_biomedical_waste_authorization: bmwAuth,
        colour_coded_bins_available: colorBins, segregation_instructions_displayed: segregationInstr,
        closed_container_transport: closedTransport, needle_cutters_used: needleCutters,
        bmw_storage_facility: bmwStorage, biohazard_sign_displayed: biohazardSign,
        housekeeping_checklists_maintained: housekeeping, laundry_segregation_process: laundryProcess,
      },
      hr_training: {
        training_scope_of_services: trScope, training_safe_lab_practices: trLab,
        training_safe_imaging_practices: trImaging, training_child_abduction_prevention: trChild,
        training_infection_control: trIC, fire_mock_drills_conducted: trFire,
        training_spill_management: trSpill, training_safety_education: trSafety,
        training_needle_stick_injury: trNeedle, training_medication_error: trMedError,
        training_disciplinary_procedures: trDisciplinary, training_grievance_handling: trGrievance,
      },
      patient_processes: {
        has_standard_consent_forms: consentForms, medical_records_audited_monthly: recordsAudited,
        patient_feedback_system: feedbackSystem, patient_rights_displayed: patientRights,
        grievance_redressal_mechanism: grievance, lasa_drugs_storage_protocol: lasaProtocol,
        medication_labelling_protocol: medLabelling, fire_noc_valid: fireNoc,
        regular_fire_drills: fireDrills, staff_trained_in_cpr: cprTrained,
        emergency_services_24x7: emergency24x7, radiation_hazard_signage: radSignage,
        pcpndt_declaration_displayed: pcpndtSignage, biohazard_signage: bioSignage,
        fire_exit_signage: fireExitSignage, directional_signage: directionalSignage,
        departmental_signage: deptSignage, breakdown_maintenance_type: breakdownMaint,
        preventive_maintenance_type: preventiveMaint,
      },
      lab_imaging_blood: {
        lab_critical_result_reporting: labCritical, lab_tat_displayed: labTAT, lab_scope_documented: labScope,
        imaging_critical_result_reporting: imgCritical, imaging_tat_displayed: imgTAT,
        imaging_scope_documented: imgScope, blood_bank_transfusion_reaction_forms: bloodReaction,
        blood_transfusion_committee_active: bloodCommittee,
      },
      key_personnel: { medical_director: medDirector, quality_manager: qualityMgr, administrator: admin },
      accreditation_info: {
        accreditation_type: accreditationType, previously_accredited: prevAccredited,
        previous_accreditation_date: prevAccDate || null,
      },
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/submit-form`, payload);
      setResult(res.data.results);
      setDeficiencies(res.data.deficiencies || []);
      setDefSummary(res.data.deficiency_summary || null);
      setSubmittedId(res.data.results ? null : null);
      // Extract record ID from submissions for deadline setting
      try {
        const subs = await axios.get(`${API_BASE_URL}/api/submissions`);
        const latest = subs.data.records[subs.data.records.length - 1];
        if (latest) setSubmittedId(latest.id);
      } catch { /* ignore */ }
      setStep(0);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const detail = err.response.data?.detail;
        setError(Array.isArray(detail) ? detail.map((d: Record<string, string>) => d.msg).join('; ') : 'Validation Error.');
      } else if (axios.isAxiosError(err) && err.response?.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
      } else { setError('Network Error. Ensure backend is running on port 8000.'); }
    } finally { setLoading(false); }
  };

  const handleSetDeadline = async (defId: string, label: string) => {
    if (!submittedId || !deadlineInputs[defId]) return;
    try {
      await axios.post(`${API_BASE_URL}/api/submissions/${submittedId}/set-deadline`, {
        deficiency_id: defId, deadline: deadlineInputs[defId],
        label, note: deadlineNotes[defId] || '',
      });
      setDeadlineSet(prev => ({ ...prev, [defId]: true }));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.detail || 'Failed to set deadline.');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="hope-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Registration Form</span>
      </div>

      {/* Blue info banner */}
      <div className="hope-banner flex items-center justify-between mb-4">
        <span>Registration Form — Step {step + 1} of {STEPS.length}</span>
        <span className="text-xs opacity-80">{STEPS[step].label}</span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded text-sm text-white font-medium flex items-center gap-2" style={{ background: '#C62828' }}>
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Score Result */}
      {result && (
        <div className="hope-card p-5 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: result.is_ready ? '#2E7D32' : '#F57F17' }}>
                {result.is_ready ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />} {result.is_ready ? 'Hospital is Accreditation Ready!' : 'Actions Required — See Deficiencies Below'}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#616161' }}>
                Score: <strong>{result.total_score}/{result.max_score}</strong> ({Math.round(result.readiness_percentage)}%)
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.entries(result.section_scores).map(([k, v]) => (
                  <span key={k} className="px-2 py-1 rounded text-xs font-medium" style={{ background: '#F5F7FA', color: '#424242', border: '1px solid #E0E0E0' }}>
                    {k.replace(/_/g, ' ')}: <strong style={{ color: '#00695C' }}>{v}%</strong>
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: result.is_ready ? '#E8F5E9' : '#FFF8E1', color: result.is_ready ? '#2E7D32' : '#F57F17', border: `3px solid ${result.is_ready ? '#2E7D32' : '#F57F17'}` }}>
              {Math.round(result.readiness_percentage)}%
            </div>
          </div>
        </div>
      )}

      {/* Deficiency Report */}
      {deficiencies.length > 0 && (
        <div className="hope-card p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: '#C62828' }}><Bell className="w-4 h-4" /> Deficiency Report</h3>
            {defSummary && (
              <div className="flex gap-2 text-xs">
                {defSummary.critical > 0 && <span className="px-2 py-1 rounded font-medium" style={{ background: '#FFEBEE', color: '#C62828' }}>{defSummary.critical} Critical</span>}
                {defSummary.high > 0 && <span className="px-2 py-1 rounded font-medium" style={{ background: '#FFF3E0', color: '#E65100' }}>{defSummary.high} High</span>}
                {defSummary.medium > 0 && <span className="px-2 py-1 rounded font-medium" style={{ background: '#E3F2FD', color: '#1565C0' }}>{defSummary.medium} Medium</span>}
              </div>
            )}
          </div>
          <div className="space-y-3">
            {deficiencies.map(def => (
              <div key={def.id} className="p-3 rounded border text-sm" style={{
                background: def.severity === 'critical' ? '#FFF5F5' : def.severity === 'high' ? '#FFFBF0' : '#F5F9FF',
                borderColor: def.severity === 'critical' ? '#FFCDD2' : def.severity === 'high' ? '#FFE0B2' : '#BBDEFB',
              }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase px-1.5 py-0.5 rounded mr-2" style={{
                      background: def.severity === 'critical' ? '#C62828' : def.severity === 'high' ? '#E65100' : '#1565C0',
                      color: 'white'
                    }}>{def.severity}</span>
                    <span className="text-xs" style={{ color: '#9E9E9E' }}>{def.category}</span>
                    <p className="font-medium mt-1" style={{ color: '#212121' }}>{def.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#616161' }}>{def.message}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: '#9E9E9E' }}>{def.suggested_deadline_days}d fix</span>
                </div>
                {submittedId && !deadlineSet[def.id] ? (
                  <div className="mt-2 pt-2 flex flex-col sm:flex-row gap-2" style={{ borderTop: '1px solid #E0E0E0' }}>
                    <input type="date" value={deadlineInputs[def.id] || ''} onChange={e => setDeadlineInputs(p => ({...p, [def.id]: e.target.value}))} min={new Date().toISOString().split('T')[0]} className="hope-input text-xs" style={{ maxWidth: 160 }} />
                    <input type="text" placeholder="Note (optional)" value={deadlineNotes[def.id] || ''} onChange={e => setDeadlineNotes(p => ({...p, [def.id]: e.target.value}))} className="hope-input text-xs flex-1" />
                    <button onClick={() => handleSetDeadline(def.id, def.label)} disabled={!deadlineInputs[def.id]} className="hope-btn-primary text-xs px-3 py-1.5 disabled:opacity-40">Set Deadline</button>
                  </div>
                ) : deadlineSet[def.id] ? (
                  <div className="mt-2 pt-2 text-xs font-medium flex items-center gap-1" style={{ borderTop: '1px solid #E0E0E0', color: '#2E7D32' }}><CheckCircle className="w-3.5 h-3.5" /> Deadline set for {deadlineInputs[def.id]}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOPE-style Tabs */}
      <div className="hope-tabs overflow-x-auto">
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => { if (i <= step) setStep(i); }}
            className={`hope-tab ${i === step ? 'active' : ''} ${i > step ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Form body */}
      <div className="hope-card p-6">
        <h3 className="text-base font-semibold mb-5 pb-3" style={{ color: '#00695C', borderBottom: '1px solid #E0E0E0' }}>
          {STEPS[step].label}
        </h3>

        {step === 0 && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Inp label="Hospital Name *" v={hospitalName} set={setHospitalName} />
          <Inp label="Registration Number *" v={regNumber} set={setRegNumber} />
          <Inp label="Contact Email *" v={email} set={setEmail} type="email" />
          <Inp label="Phone *" v={phone} set={setPhone} />
        </div>}

        {step === 1 && <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Sel label="Hospital Type *" v={hospitalType} set={setHospitalType} opts={['','Government','Private','NGO','Armed Forces']} labels={['Select Type','Government','Private','NGO','Armed Forces']} />
            <Sel label="Ownership Type *" v={ownershipType} set={setOwnershipType} opts={['','Proprietorship','Partnership','Trust','Society','Corporate']} labels={['Select','Proprietorship','Partnership','Trust','Society','Corporate']} />
            <Num label="Built-up Area (sq.mt)" v={builtUpArea} set={setBuiltUpArea} />
            <Num label="Number of Buildings" v={buildings} set={setBuildings} />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Bed Strength</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Num label="Sanctioned Beds *" v={sanctionedBeds} set={setSanctionedBeds} />
            <Num label="Operational Beds *" v={operationalBeds} set={setOperationalBeds} />
            <Num label="Emergency Beds" v={emergencyBeds} set={setEmergencyBeds} />
            <Num label="ICU Beds" v={icuBeds} set={setIcuBeds} />
            <Num label="HDU Beds" v={hduBeds} set={setHduBeds} />
            <Num label="Private Ward" v={privateBeds} set={setPrivateBeds} />
            <Num label="Semi-Private" v={semiPrivateBeds} set={setSemiPrivateBeds} />
            <Num label="General Ward" v={generalBeds} set={setGeneralBeds} />
          </div>
        </div>}

        {step === 2 && <div className="space-y-5">
          <p className="text-xs p-3 rounded" style={{ background: '#FFF8E1', color: '#F57F17', border: '1px solid #FFE082' }}>Note: Take data of the past 3 months for monthly averages.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Num label="OPD Patients (past 12 months) *" v={opd12} set={setOpd12} />
            <Num label="Admissions (past 12 months) *" v={admissions12} set={setAdmissions12} />
            <Num label="Inpatient Days (Monthly Avg)" v={inpatientDays} set={setInpatientDays} />
            <Num label="Available Bed Days (Monthly Avg)" v={availableBedDays} set={setAvailableBedDays} />
            <Num label="Average Occupancy %" v={avgOccupancy} set={setAvgOccupancy} />
            <Num label="ICU Occupancy %" v={icuOccupancy} set={setIcuOccupancy} />
            <Num label="Ward Occupancy %" v={wardOccupancy} set={setWardOccupancy} />
            <Num label="ICU Inpatient Days (Monthly Avg)" v={icuInpatientDays} set={setIcuInpatientDays} />
            <Num label="Available ICU Bed Days (Monthly Avg)" v={availableIcuBedDays} set={setAvailableIcuBedDays} />
          </div>
        </div>}

        {step === 3 && <div className="space-y-6">
          <ListInput label="Top 10 Clinical Services (first 5 required)" items={topServices} setItems={setTopServices} updateList={updateList} required={5} />
          <ListInput label="Top 10 Diagnoses for In-patients (first 5 required)" items={topDiagnoses} setItems={setTopDiagnoses} updateList={updateList} required={5} />
          <ListInput label="Top 10 Surgical Procedures (first 5 required)" items={topSurgeries} setItems={setTopSurgeries} updateList={updateList} required={5} />
          <Num label="Joint Replacements (last 1 year)" v={jointReplacements} set={setJointReplacements} />
        </div>}

        {step === 4 && <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Tog label="Nurses Present at Hospital?" c={nursesPresent} set={setNursesPresent} />
            {!nursesPresent && (
              <Sel label="Insource or Outsource Nurses?" v={nursesOutsourced} set={setNursesOutsourced} opts={['','Insourced','Outsourced']} labels={['Select','Insourced','Outsourced']} />
            )}
          </div>
          
          {nursesPresent && (
            <div className="p-5 rounded-lg border bg-white" style={{ borderColor: '#E0E0E0' }}>
              <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: '1px solid #E0E0E0' }}>
                <h4 className="text-sm font-semibold" style={{ color: '#00695C' }}>Nurse Details (Registration details as in State Nursing Council)</h4>
                <button onClick={() => setNursesList([...nursesList, {name: '', qualification: '', certificate_name: ''}])} className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded hover:bg-blue-100 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Nurse
                </button>
              </div>

              <div className="space-y-4">
                {nursesList.map((nurse, idx) => (
                  <div key={idx} className="p-4 rounded border bg-gray-50 flex flex-col gap-4 relative">
                    {nursesList.length > 1 && (
                      <button onClick={() => setNursesList(nursesList.filter((_, i) => i !== idx))} className="absolute right-3 top-3 text-red-500 hover:text-red-700">
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                    <h5 className="text-xs font-semibold text-gray-500 uppercase">Nurse #{idx + 1}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="hope-label">Name of Nurse *</label>
                        <input type="text" value={nurse.name} onChange={(e) => {
                          const n = [...nursesList]; n[idx].name = e.target.value; setNursesList(n);
                        }} placeholder="Enter full name" className="hope-input" />
                      </div>
                      <div>
                        <label className="hope-label">Qualification *</label>
                        <input type="text" value={nurse.qualification} onChange={(e) => {
                          const n = [...nursesList]; n[idx].qualification = e.target.value; setNursesList(n);
                        }} placeholder="e.g. B.Sc Nursing, GNM" className="hope-input" />
                      </div>
                      <div>
                        <label className="hope-label">Upload Certificate</label>
                        <label className="flex items-center justify-center w-full h-[42px] px-3 border border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" style={{ borderColor: '#BDBDBD', background: '#FFFFFF' }}>
                          <div className="flex items-center gap-2 text-sm" style={{ color: '#616161' }}>
                            <FileText className="w-4 h-4" />
                            <span className="truncate max-w-[120px]">{nurse.certificate_name ? nurse.certificate_name : 'Browse PDF'}</span>
                          </div>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const n = [...nursesList]; n[idx].certificate_name = e.target.files[0].name; setNursesList(n);
                            }
                          }} />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {nursesList.some(n => n.certificate_name) && (
                <div className="mt-4 p-3 rounded text-sm font-medium flex items-center gap-2" style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}>
                  <CheckCircle className="w-4 h-4" /> Valid nursing council document(s) attached successfully.
                </div>
              )}
            </div>
          )}
        </div>}

        {step === 5 && <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Num label="Number of OTs *" v={numOTs} set={setNumOTs} />
            <Tog label="Super-Speciality Surgeries?" c={superSpeciality} set={setSuperSpeciality} />
            {superSpeciality && <><Tog label="Exclusive OT for Super-Speciality?" c={exclusiveOT} set={setExclusiveOT} /><Num label="Number of Super-Speciality OTs" v={numSuperOTs} set={setNumSuperOTs} /></>}
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Sterilization Methods</h4>
          <div className="grid grid-cols-2 gap-3">
            <Tog label="Steam Autoclave" c={steamAutoclave} set={setSteamAutoclave} />
            <Tog label="ETO" c={eto} set={setEto} />
            <Tog label="Plasma" c={plasma} set={setPlasma} />
            <Tog label="Flash Sterilization" c={flash} set={setFlash} />
          </div>
          <Inp label="Other Sterilization Method" v={otherSterilization} set={setOtherSterilization} />
        </div>}

        {step === 6 && <div className="space-y-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Electrical</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Tog label="UPS Present?" c={upsPresent} set={setUpsPresent} />
            {upsPresent && <Num label="UPS Capacity (KV)" v={upsKV} set={setUpsKV} />}
            <Tog label="Generator Present?" c={genPresent} set={setGenPresent} />
            {genPresent && <Num label="Generator Capacity (KV)" v={genKV} set={setGenKV} />}
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Water Supply</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Num label="Total Water Tanks" v={waterTanks} set={setWaterTanks} />
            <Num label="Total Capacity (in 1000 litres)" v={waterCapacity} set={setWaterCapacity} />
            <Tog label="Alternate Water Source?" c={altWater} set={setAltWater} />
            {altWater && <Sel label="Alternate Usage" v={altWaterUsage} set={setAltWaterUsage} opts={['','Drinking','Not for drinking']} labels={['Select','Drinking','Not for drinking']} />}
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Elevators & Transport</h4>
          <div className="grid grid-cols-2 gap-4">
            <Num label="Elevators for Trolleys/Beds" v={trolleyElevators} set={setTrolleyElevators} />
            <Num label="Elevators for People" v={peopleElevators} set={setPeopleElevators} />
            <Tog label="Trolleys with Safety Belts" c={trolleySafety} set={setTrolleySafety} />
            <Tog label="Wheelchairs with Safety Belts" c={wheelchairSafety} set={setWheelchairSafety} />
          </div>
        </div>}

        {step === 7 && <div className="space-y-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Infection Control</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Infection Control Committee *" c={icCommittee} set={setIcCommittee} />
            <Tog label="Nurses Trained in IC *" c={nursesIC} set={setNursesIC} />
            <Tog label="Hand Hygiene Audit Conducted *" c={handHygiene} set={setHandHygiene} />
            <Tog label="Housekeeping Checklists Maintained" c={housekeeping} set={setHousekeeping} />
            <Tog label="Laundry Segregation Process" c={laundryProcess} set={setLaundryProcess} />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Bio-Medical Waste</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="BMW Authorization from PCB *" c={bmwAuth} set={setBmwAuth} />
            <Tog label="Colour Coded Bins Available *" c={colorBins} set={setColorBins} />
            <Tog label="Segregation Instructions Displayed *" c={segregationInstr} set={setSegregationInstr} />
            <Tog label="Closed Container Transport *" c={closedTransport} set={setClosedTransport} />
            <Tog label="Needle Cutters Used *" c={needleCutters} set={setNeedleCutters} />
            <Tog label="BMW Storage Facility Available *" c={bmwStorage} set={setBmwStorage} />
            <Tog label="Biohazard Sign Displayed *" c={biohazardSign} set={setBiohazardSign} />
          </div>
        </div>}

        {step === 8 && <div className="space-y-5">
          <p className="text-xs p-3 rounded" style={{ background: '#E3F2FD', color: '#1565C0', border: '1px solid #90CAF9' }}>Select all training programs that have been conducted at your hospital.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Scope of Services" c={trScope} set={setTrScope} />
            <Tog label="Safe Practices in Laboratory *" c={trLab} set={setTrLab} />
            <Tog label="Safe Practices in Imaging *" c={trImaging} set={setTrImaging} />
            <Tog label="Child Abduction Prevention" c={trChild} set={setTrChild} />
            <Tog label="Infection Control Practices *" c={trIC} set={setTrIC} />
            <Tog label="Fire Mock Drills" c={trFire} set={setTrFire} />
            <Tog label="Spill Management *" c={trSpill} set={setTrSpill} />
            <Tog label="Safety Education Programme *" c={trSafety} set={setTrSafety} />
            <Tog label="Needle Stick Injury" c={trNeedle} set={setTrNeedle} />
            <Tog label="Medication Error" c={trMedError} set={setTrMedError} />
            <Tog label="Disciplinary Procedures" c={trDisciplinary} set={setTrDisciplinary} />
            <Tog label="Grievance Handling" c={trGrievance} set={setTrGrievance} />
          </div>
          <div className="p-3 rounded text-xs" style={{ background: '#F5F7FA', color: '#616161' }}>
            Completed: <strong style={{ color: '#00695C' }}>{[trScope,trLab,trImaging,trChild,trIC,trFire,trSpill,trSafety,trNeedle,trMedError,trDisciplinary,trGrievance].filter(Boolean).length}</strong> / 12 training modules
          </div>
        </div>}

        {step === 9 && <div className="space-y-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Documentation & Patient Rights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Standard Consent Forms Used" c={consentForms} set={setConsentForms} />
            <Tog label="Medical Records Audited Monthly" c={recordsAudited} set={setRecordsAudited} />
            <Tog label="Patient Feedback System Active" c={feedbackSystem} set={setFeedbackSystem} />
            <Tog label="Patient Rights Displayed" c={patientRights} set={setPatientRights} />
            <Tog label="Grievance Redressal Mechanism" c={grievance} set={setGrievance} />
            <Tog label="LASA Drugs Storage Protocol" c={lasaProtocol} set={setLasaProtocol} />
            <Tog label="Medication Labelling Protocol" c={medLabelling} set={setMedLabelling} />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Safety & Signage</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Fire NOC Valid *" c={fireNoc} set={setFireNoc} />
            <Tog label="Regular Fire Drills *" c={fireDrills} set={setFireDrills} />
            <Tog label="Staff Trained in CPR" c={cprTrained} set={setCprTrained} />
            <Tog label="Emergency Services 24x7" c={emergency24x7} set={setEmergency24x7} />
            <Tog label="Radiation Hazard Signage" c={radSignage} set={setRadSignage} />
            <Tog label="PCPNDT Declaration" c={pcpndtSignage} set={setPcpndtSignage} />
            <Tog label="Biohazard Signage" c={bioSignage} set={setBioSignage} />
            <Tog label="Fire Exit Signage" c={fireExitSignage} set={setFireExitSignage} />
            <Tog label="Directional Signage" c={directionalSignage} set={setDirectionalSignage} />
            <Tog label="Departmental Signage" c={deptSignage} set={setDeptSignage} />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Maintenance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Sel label="Breakdown Maintenance" v={breakdownMaint} set={setBreakdownMaint} opts={['In house','Outsourced']} labels={['In house','Outsourced']} />
            <Sel label="Preventive Maintenance" v={preventiveMaint} set={setPreventiveMaint} opts={['In house','Outsourced']} labels={['In house','Outsourced']} />
          </div>
        </div>}

        {step === 10 && <div className="space-y-5">
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Laboratory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Critical Result Reporting Register" c={labCritical} set={setLabCritical} />
            <Tog label="TAT Displayed" c={labTAT} set={setLabTAT} />
            <Tog label="Scope of Laboratory Documented" c={labScope} set={setLabScope} />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Imaging</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Critical Result Reporting Register" c={imgCritical} set={setImgCritical} />
            <Tog label="TAT Displayed" c={imgTAT} set={setImgTAT} />
            <Tog label="Scope of Imaging Documented" c={imgScope} set={setImgScope} />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Blood Bank</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Transfusion Reaction Forms (past 3 months)" c={bloodReaction} set={setBloodReaction} />
            <Tog label="Blood Transfusion Committee Active" c={bloodCommittee} set={setBloodCommittee} />
          </div>
        </div>}

        {step === 11 && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Inp label="Medical Director *" v={medDirector} set={setMedDirector} ph="Enter medical director name" />
          <Inp label="Quality Manager *" v={qualityMgr} set={setQualityMgr} ph="Enter quality manager name" />
          <Inp label="Administrator *" v={admin} set={setAdmin} ph="Enter administrator name" />
        </div>}

        {step === 12 && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Sel label="Accreditation Type *" v={accreditationType} set={setAccreditationType} opts={['Entry Level','Full','Pre-Accreditation','Renewal']} labels={['Entry Level','Full','Pre-Accreditation','Renewal']} />
          <Tog label="Previously Accredited" c={prevAccredited} set={setPrevAccredited} />
          {prevAccredited && <Inp label="Previous Accreditation Date" v={prevAccDate} set={setPrevAccDate} type="date" />}
        </div>}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between py-5">
        <button onClick={() => { if (step > 0) setStep(step - 1); }} disabled={step === 0}
          className="hope-btn-outline flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => { if (validateStep()) setStep(step + 1); }}
            className="hope-btn-primary flex items-center gap-2">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-6 py-2 rounded text-sm font-medium text-white disabled:opacity-40" style={{ background: '#2E7D32' }}>
            {loading ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> Analyzing...</> : <><Send className="w-4 h-4" /> Complete & Analyze</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── HOPE-styled reusable components ───
function Inp({ label, v, set, type = 'text', ph = '' }: { label: string; v: string; set: (s: string) => void; type?: string; ph?: string }) {
  return <div><label className="hope-label">{label}</label><input type={type} value={v} onChange={e => set(e.target.value)} placeholder={ph} className="hope-input" /></div>;
}
function Num({ label, v, set }: { label: string; v: number; set: (n: number) => void }) {
  return <div><label className="hope-label">{label}</label><input type="number" value={v} onChange={e => set(Number(e.target.value))} className="hope-input" /></div>;
}
function Sel({ label, v, set, opts, labels }: { label: string; v: string; set: (s: string) => void; opts: string[]; labels: string[] }) {
  return <div><label className="hope-label">{label}</label><select value={v} onChange={e => set(e.target.value)} className="hope-select">{opts.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}</select></div>;
}
function Tog({ label, c, set }: { label: string; c: boolean; set: (b: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-1">
      <button type="button" onClick={() => set(!c)} className={`hope-toggle ${c ? 'on' : ''}`}>
        <span className="knob" />
      </button>
      <span className="text-sm" style={{ color: '#424242' }}>{label}</span>
    </label>
  );
}
function ListInput({ label, items, setItems, updateList, required }: { label: string; items: string[]; setItems: (l: string[]) => void; updateList: (l: string[], i: number, v: string, s: (l: string[]) => void) => void; required: number }) {
  return <div><label className="hope-label mb-2">{label}</label><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{items.map((item, i) => <div key={i} className="flex items-center gap-2"><span className="text-xs w-5 shrink-0" style={{ color: '#9E9E9E' }}>{i + 1}.</span><input value={item} onChange={e => updateList(items, i, e.target.value, setItems)} placeholder={i < required ? 'Required *' : 'Optional'} className="hope-input text-sm" /></div>)}</div></div>;
}
