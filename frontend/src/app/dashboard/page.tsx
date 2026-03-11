'use client';

import { useState } from 'react';
import axios from 'axios';
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

  // ── STEP 5: OT & Sterilization ──
  const [numOTs, setNumOTs] = useState(0);
  const [superSpeciality, setSuperSpeciality] = useState(false);
  const [exclusiveOT, setExclusiveOT] = useState(false);
  const [numSuperOTs, setNumSuperOTs] = useState(0);
  const [steamAutoclave, setSteamAutoclave] = useState(false);
  const [eto, setEto] = useState(false);
  const [plasma, setPlasma] = useState(false);
  const [flash, setFlash] = useState(false);
  const [otherSterilization, setOtherSterilization] = useState('');

  // ── STEP 6: Utilities ──
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

  // ── STEP 7: Infection Control & BMW ──
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

  // ── STEP 8: HR Training ──
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

  // ── STEP 9: Patient Processes ──
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

  // ── STEP 10: Lab, Imaging, Blood Bank ──
  const [labCritical, setLabCritical] = useState(false);
  const [labTAT, setLabTAT] = useState(false);
  const [labScope, setLabScope] = useState(false);
  const [imgCritical, setImgCritical] = useState(false);
  const [imgTAT, setImgTAT] = useState(false);
  const [imgScope, setImgScope] = useState(false);
  const [bloodReaction, setBloodReaction] = useState(false);
  const [bloodCommittee, setBloodCommittee] = useState(false);

  // ── STEP 11: Key Personnel ──
  const [medDirector, setMedDirector] = useState('');
  const [qualityMgr, setQualityMgr] = useState('');
  const [admin, setAdmin] = useState('');

  // ── STEP 12: Accreditation ──
  const [accreditationType, setAccreditationType] = useState('Entry Level');
  const [prevAccredited, setPrevAccredited] = useState(false);
  const [prevAccDate, setPrevAccDate] = useState('');

  const updateList = (list: string[], idx: number, val: string, setter: (l: string[]) => void) => {
    const copy = [...list]; copy[idx] = val; setter(copy);
  };

  const handleSubmit = async () => {
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
      const res = await axios.post('http://localhost:8000/api/submit-form', payload);
      setResult(res.data.results);
      setDeficiencies(res.data.deficiencies || []);
      setDefSummary(res.data.deficiency_summary || null);
      setSubmittedId(res.data.results ? null : null);
      // Extract record ID from submissions for deadline setting
      try {
        const subs = await axios.get('http://localhost:8000/api/submissions');
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
      await axios.post(`http://localhost:8000/api/submissions/${submittedId}/set-deadline`, {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-1">Hospital Onboarding</h1>
        <p className="text-slate-500 text-sm">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
      </header>

      {/* Progress */}
      <div className="grid grid-cols-6 lg:grid-cols-12 gap-1">
        {STEPS.map((s, i) => (
          <button key={i} onClick={() => { if (i <= step) setStep(i); }}
            className={`py-2 rounded-lg text-[10px] font-semibold transition-all cursor-pointer flex flex-col items-center gap-1
              ${i < step ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                i === step ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' :
                'bg-slate-900/50 text-slate-600 border border-slate-800'}`}>
            {i < step ? <CheckCircle className="w-3 h-3" /> : s.icon}
            <span className="hidden lg:inline">{s.label}</span>
            <span className="lg:hidden">{i + 1}</span>
          </button>
        ))}
      </div>

      {error && <div className="bg-red-950/50 border border-red-500/50 text-red-200 p-3 rounded-xl flex items-start gap-2 text-sm"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /><p>{error}</p></div>}

      {result && (
        <div className={`p-6 rounded-2xl glass-card flex flex-col md:flex-row items-center gap-6 border ${result.is_ready ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-amber-500/50 bg-amber-950/20'}`}>
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {result.is_ready ? <CheckCircle className="text-emerald-400" /> : <ShieldAlert className="text-amber-400" />}
              {result.is_ready ? 'Hospital is Accreditation Ready!' : 'Actions Required'}
            </h2>
            <p className="text-slate-300">Score: <span className="font-mono text-lg">{result.total_score}/{result.max_score}</span></p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
              {Object.entries(result.section_scores).map(([k, v]) => (
                <div key={k} className="bg-slate-900/50 rounded-lg p-2 text-center">
                  <p className="text-[10px] text-slate-500 capitalize">{k.replace(/_/g, ' ')}</p>
                  <p className="text-sm font-bold text-indigo-300">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="56" cy="56" r="52" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
              <circle cx="56" cy="56" r="52" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={327} strokeDashoffset={327 - (327 * result.readiness_percentage) / 100} className={`transition-all duration-1000 ${result.is_ready ? 'text-emerald-500' : 'text-amber-500'}`} strokeLinecap="round" />
            </svg>
            <span className="text-xl font-bold relative z-10">{Math.round(result.readiness_percentage)}%</span>
          </div>
        </div>
      )}

      {/* Deficiency Report */}
      {deficiencies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <Bell className="w-5 h-5 animate-pulse" /> Deficiency Report
            </h2>
            {defSummary && (
              <div className="flex gap-2 text-xs">
                {defSummary.critical > 0 && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 animate-pulse">🔴 {defSummary.critical} Critical</span>}
                {defSummary.high > 0 && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">🟠 {defSummary.high} High</span>}
                {defSummary.medium > 0 && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">🔵 {defSummary.medium} Medium</span>}
              </div>
            )}
          </div>

          {deficiencies.map(def => (
            <div key={def.id} className={`glass-card p-4 border transition-all ${
              def.severity === 'critical' ? 'border-red-500/40 bg-red-950/10' :
              def.severity === 'high' ? 'border-amber-500/40 bg-amber-950/10' :
              'border-blue-500/40 bg-blue-950/10'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      def.severity === 'critical' ? 'bg-red-500/20 text-red-400 animate-pulse' :
                      def.severity === 'high' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>{def.severity}</span>
                    <span className="text-xs text-slate-500">{def.category}</span>
                  </div>
                  <h4 className="text-sm font-medium text-white">{def.label}</h4>
                  <p className="text-xs text-slate-400 mt-1">{def.message}</p>
                  <p className="text-[10px] text-slate-600 mt-1">Ref: {def.nabh_reference}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Clock className="w-4 h-4 text-slate-500 inline" />
                  <p className="text-[10px] text-slate-500">{def.suggested_deadline_days} day fix</p>
                </div>
              </div>

              {/* Deadline setter */}
              {submittedId && !deadlineSet[def.id] ? (
                <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input type="date" value={deadlineInputs[def.id] || ''}
                      onChange={e => setDeadlineInputs(p => ({...p, [def.id]: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    <input type="text" placeholder="Note (optional)" value={deadlineNotes[def.id] || ''}
                      onChange={e => setDeadlineNotes(p => ({...p, [def.id]: e.target.value}))}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                  </div>
                  <button onClick={() => handleSetDeadline(def.id, def.label)}
                    disabled={!deadlineInputs[def.id]}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-all disabled:opacity-30 cursor-pointer whitespace-nowrap">
                    <CalendarClock className="w-3 h-3" /> Set Deadline
                  </button>
                </div>
              ) : deadlineSet[def.id] ? (
                <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle className="w-4 h-4" /> Deadline set for {deadlineInputs[def.id]}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Form body */}
      <div className="glass-card p-6 border border-slate-800">
        <h3 className="text-lg font-semibold mb-5 text-indigo-200 border-b border-slate-800 pb-3 flex items-center gap-2">{STEPS[step].icon} {STEPS[step].label}</h3>

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
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pt-2">Bed Strength</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Num label="Sanctioned Beds *" v={sanctionedBeds} set={setSanctionedBeds} />
            <Num label="Operational Beds *" v={operationalBeds} set={setOperationalBeds} />
            <Num label="Emergency Beds" v={emergencyBeds} set={setEmergencyBeds} />
            <Num label="ICU Beds" v={icuBeds} set={setIcuBeds} />
            <Num label="HDU Beds" v={hduBeds} set={setHduBeds} />
            <Num label="Private Ward (Single)" v={privateBeds} set={setPrivateBeds} />
            <Num label="Semi-Private (2 Beds)" v={semiPrivateBeds} set={setSemiPrivateBeds} />
            <Num label="General Ward (3+)" v={generalBeds} set={setGeneralBeds} />
          </div>
        </div>}

        {step === 2 && <div className="space-y-5">
          <p className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">Note: Take data of the past 3 months for monthly averages.</p>
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
            <Num label="Number of OTs *" v={numOTs} set={setNumOTs} />
            <Tog label="Super-Speciality Surgeries?" c={superSpeciality} set={setSuperSpeciality} />
            {superSpeciality && <><Tog label="Exclusive OT for Super-Speciality?" c={exclusiveOT} set={setExclusiveOT} /><Num label="Number of Super-Speciality OTs" v={numSuperOTs} set={setNumSuperOTs} /></>}
          </div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Sterilization Methods</h4>
          <div className="grid grid-cols-2 gap-3">
            <Tog label="Steam Autoclave" c={steamAutoclave} set={setSteamAutoclave} />
            <Tog label="ETO" c={eto} set={setEto} />
            <Tog label="Plasma" c={plasma} set={setPlasma} />
            <Tog label="Flash Sterilization" c={flash} set={setFlash} />
          </div>
          <Inp label="Other Sterilization Method" v={otherSterilization} set={setOtherSterilization} />
        </div>}

        {step === 5 && <div className="space-y-5">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Electrical</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Tog label="UPS Present?" c={upsPresent} set={setUpsPresent} />
            {upsPresent && <Num label="UPS Capacity (KV)" v={upsKV} set={setUpsKV} />}
            <Tog label="Generator Present?" c={genPresent} set={setGenPresent} />
            {genPresent && <Num label="Generator Capacity (KV)" v={genKV} set={setGenKV} />}
          </div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Water Supply</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Num label="Total Water Tanks" v={waterTanks} set={setWaterTanks} />
            <Num label="Total Capacity (in 1000 litres)" v={waterCapacity} set={setWaterCapacity} />
            <Tog label="Alternate Water Source?" c={altWater} set={setAltWater} />
            {altWater && <Sel label="Alternate Usage" v={altWaterUsage} set={setAltWaterUsage} opts={['','Drinking','Not for drinking']} labels={['Select','Drinking','Not for drinking']} />}
          </div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Elevators & Transport</h4>
          <div className="grid grid-cols-2 gap-4">
            <Num label="Elevators for Trolleys/Beds" v={trolleyElevators} set={setTrolleyElevators} />
            <Num label="Elevators for People" v={peopleElevators} set={setPeopleElevators} />
            <Tog label="Trolleys with Safety Belts" c={trolleySafety} set={setTrolleySafety} />
            <Tog label="Wheelchairs with Safety Belts" c={wheelchairSafety} set={setWheelchairSafety} />
          </div>
        </div>}

        {step === 6 && <div className="space-y-5">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Infection Control</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Infection Control Committee *" c={icCommittee} set={setIcCommittee} />
            <Tog label="Nurses Trained in IC *" c={nursesIC} set={setNursesIC} />
            <Tog label="Hand Hygiene Audit Conducted *" c={handHygiene} set={setHandHygiene} />
            <Tog label="Housekeeping Checklists Maintained" c={housekeeping} set={setHousekeeping} />
            <Tog label="Laundry Segregation Process" c={laundryProcess} set={setLaundryProcess} />
          </div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Bio-Medical Waste</h4>
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

        {step === 7 && <div className="space-y-5">
          <p className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg">Select all training programs that have been conducted at your hospital.</p>
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
          <div className="bg-slate-900/50 p-3 rounded-lg text-xs text-slate-400">
            Completed: <span className="text-indigo-400 font-bold">{[trScope,trLab,trImaging,trChild,trIC,trFire,trSpill,trSafety,trNeedle,trMedError,trDisciplinary,trGrievance].filter(Boolean).length}</span> / 12 training modules
          </div>
        </div>}

        {step === 8 && <div className="space-y-5">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Documentation & Patient Rights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Standard Consent Forms Used" c={consentForms} set={setConsentForms} />
            <Tog label="Medical Records Audited Monthly" c={recordsAudited} set={setRecordsAudited} />
            <Tog label="Patient Feedback System Active" c={feedbackSystem} set={setFeedbackSystem} />
            <Tog label="Patient Rights Displayed" c={patientRights} set={setPatientRights} />
            <Tog label="Grievance Redressal Mechanism" c={grievance} set={setGrievance} />
            <Tog label="LASA Drugs Storage Protocol" c={lasaProtocol} set={setLasaProtocol} />
            <Tog label="Medication Labelling Protocol" c={medLabelling} set={setMedLabelling} />
          </div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Safety & Signage</h4>
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
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Maintenance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Sel label="Breakdown Maintenance" v={breakdownMaint} set={setBreakdownMaint} opts={['In house','Outsourced']} labels={['In house','Outsourced']} />
            <Sel label="Preventive Maintenance" v={preventiveMaint} set={setPreventiveMaint} opts={['In house','Outsourced']} labels={['In house','Outsourced']} />
          </div>
        </div>}

        {step === 9 && <div className="space-y-5">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Laboratory</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Critical Result Reporting Register" c={labCritical} set={setLabCritical} />
            <Tog label="TAT Displayed" c={labTAT} set={setLabTAT} />
            <Tog label="Scope of Laboratory Documented" c={labScope} set={setLabScope} />
          </div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Imaging</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Critical Result Reporting Register" c={imgCritical} set={setImgCritical} />
            <Tog label="TAT Displayed" c={imgTAT} set={setImgTAT} />
            <Tog label="Scope of Imaging Documented" c={imgScope} set={setImgScope} />
          </div>
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Blood Bank</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Tog label="Transfusion Reaction Forms (past 3 months)" c={bloodReaction} set={setBloodReaction} />
            <Tog label="Blood Transfusion Committee Active" c={bloodCommittee} set={setBloodCommittee} />
          </div>
        </div>}

        {step === 10 && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Inp label="Medical Director *" v={medDirector} set={setMedDirector} ph="Enter medical director name" />
          <Inp label="Quality Manager *" v={qualityMgr} set={setQualityMgr} ph="Enter quality manager name" />
          <Inp label="Administrator *" v={admin} set={setAdmin} ph="Enter administrator name" />
        </div>}

        {step === 11 && <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Sel label="Accreditation Type *" v={accreditationType} set={setAccreditationType} opts={['Entry Level','Full','Pre-Accreditation','Renewal']} labels={['Entry Level','Full','Pre-Accreditation','Renewal']} />
          <Tog label="Previously Accredited" c={prevAccredited} set={setPrevAccredited} />
          {prevAccredited && <Inp label="Previous Accreditation Date" v={prevAccDate} set={setPrevAccDate} type="date" />}
        </div>}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 pb-10">
        <button onClick={() => { if (step > 0) setStep(step - 1); }} disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-2.5 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-2.5 rounded-full font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-40">
            {loading ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> Analyzing...</> : <><Send className="w-4 h-4" /> Complete &amp; Analyze</>}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Compact reusable components ───
function Inp({ label, v, set, type = 'text', ph = '' }: { label: string; v: string; set: (s: string) => void; type?: string; ph?: string }) {
  return <div><label className="text-xs font-medium text-slate-400 mb-1 block">{label}</label><input type={type} value={v} onChange={e => set(e.target.value)} placeholder={ph} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" /></div>;
}
function Num({ label, v, set }: { label: string; v: number; set: (n: number) => void }) {
  return <div><label className="text-xs font-medium text-slate-400 mb-1 block">{label}</label><input type="number" value={v} onChange={e => set(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" /></div>;
}
function Sel({ label, v, set, opts, labels }: { label: string; v: string; set: (s: string) => void; opts: string[]; labels: string[] }) {
  return <div><label className="text-xs font-medium text-slate-400 mb-1 block">{label}</label><select value={v} onChange={e => set(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all">{opts.map((o, i) => <option key={o} value={o}>{labels[i]}</option>)}</select></div>;
}
function Tog({ label, c, set }: { label: string; c: boolean; set: (b: boolean) => void }) {
  return <label className="flex items-center gap-3 cursor-pointer group py-0.5"><button type="button" onClick={() => set(!c)} className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${c ? 'bg-indigo-500' : 'bg-slate-700'}`}><span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${c ? 'translate-x-5' : ''}`} /></button><span className="text-slate-300 group-hover:text-white transition-colors select-none text-sm">{label}</span></label>;
}
function ListInput({ label, items, setItems, updateList, required }: { label: string; items: string[]; setItems: (l: string[]) => void; updateList: (l: string[], i: number, v: string, s: (l: string[]) => void) => void; required: number }) {
  return <div><label className="text-xs font-medium text-slate-400 mb-2 block">{label}</label><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{items.map((item, i) => <div key={i} className="flex items-center gap-2"><span className="text-xs text-slate-600 w-5 shrink-0">{i + 1}.</span><input value={item} onChange={e => updateList(items, i, e.target.value, setItems)} placeholder={i < required ? 'Required *' : 'Optional'} className={`flex-1 bg-slate-900 border rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${i < required ? 'border-slate-600' : 'border-slate-800'}`} /></div>)}</div></div>;
}
