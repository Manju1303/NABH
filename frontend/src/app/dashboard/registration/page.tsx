'use client';

import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import {
  Send, CheckCircle, AlertTriangle, ShieldAlert, ChevronLeft, ChevronRight,
  Building2, Stethoscope, Users, Award, FileText, Activity, Zap,
  ShieldCheck, GraduationCap, HeartPulse, FlaskConical, ClipboardList,
  Clock, CalendarClock, Bell
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

  const updateList = (list: string[], idx: number, val: string, setter: (l: string[]) => void) => {
    const copy = [...list]; copy[idx] = val; setter(copy);
  };

  const validateStep = () => {
    setError(null);
    if (step === 0 && (!hospitalName || !regNumber || !email || !phone)) {
      setError('Please fill all required (*) fields.'); return false;
    }
    if (step === 1 && (!hospitalType || !ownershipType || !sanctionedBeds || !operationalBeds)) {
      setError('Hospital type, ownership, and valid bed capacities are required.'); return false;
    }
    if (step === 2 && (!opd12 || !admissions12)) {
      setError('Required OPD and Admissions data must be provided.'); return false;
    }
    if (step === 11 && (!medDirector || !qualityMgr || !admin)) {
      setError('All key personnel names are required.'); return false;
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
        nurses_present: nursesPresent, nurses_document_uploaded: nursesDoc, nurses_outsourced: nursesOutsourced,
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

        {step === 4 && <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Tog label="Nurses Present at Hospital?" c={nursesPresent} set={setNursesPresent} />
            {nursesPresent ? (
              <Tog label="Nurse Document Uploaded (Evidence)" c={nursesDoc} set={setNursesDoc} />
            ) : (
              <Sel label="Insource or Outsource Nurses?" v={nursesOutsourced} set={setNursesOutsourced} opts={['','Insourced','Outsourced']} labels={['Select','Insourced','Outsourced']} />
            )}
          </div>
          {nursesDoc && <div className="p-3 rounded text-sm font-medium flex items-center gap-2" style={{ background: '#E8F5E9', color: '#2E7D32', border: '1px solid #A5D6A7' }}><CheckCircle className="w-4 h-4" /> Nurse document uploaded successfully.</div>}
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
