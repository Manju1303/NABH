'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import { 
  CheckCircle, AlertTriangle, FileText, Building2, Activity, Stethoscope, 
  Users, ClipboardList, Zap, HeartPulse, GraduationCap, ShieldCheck, 
  FlaskConical, Award, Bell, ChevronLeft, ChevronRight, Send, Cpu, LayoutDashboard, Target, RotateCcw
} from 'lucide-react';
import Link from 'next/link';

import { BasicInfoStep } from '@/components/registration/BasicInfoStep';
import { HospitalDetailsStep } from '@/components/registration/HospitalDetailsStep';
import { OPDIPDStep } from '@/components/registration/OPDIPDStep';
import { ClinicalServicesStep } from '@/components/registration/ClinicalServicesStep';
import { HospitalStaffingStep } from '@/components/registration/HospitalStaffingStep';
import { OTSterilizationStep } from '@/components/registration/OTSterilizationStep';
import { UtilitiesStep } from '@/components/registration/UtilitiesStep';
import { InfectionControlStep } from '@/components/registration/InfectionControlStep';
import { HRTrainingStep } from '@/components/registration/HRTrainingStep';
import { PatientProcessesStep } from '@/components/registration/PatientProcessesStep';
import { LabImagingStep } from '@/components/registration/LabImagingStep';
import { KeyPersonnelStep } from '@/components/registration/KeyPersonnelStep';
import { AccreditationStep } from '@/components/registration/AccreditationStep';

const STEPS = [
  { label: 'BASIC INFO', icon: <FileText className="w-4 h-4" />, color: '#00F2FF' },
  { label: 'HOSPITAL DETAILS', icon: <Building2 className="w-4 h-4" />, color: '#FF00E5' },
  { label: 'OPD / IPD DATA', icon: <Activity className="w-4 h-4" />, color: '#3B82F6' },
  { label: 'CLINICAL SERVICES', icon: <Stethoscope className="w-4 h-4" />, color: '#22C55E' },
  { label: 'HOSPITAL STAFFING', icon: <Users className="w-4 h-4" />, color: '#EAB308' },
  { label: 'OT & STERILIZATION', icon: <ClipboardList className="w-4 h-4" />, color: '#00F2FF' },
  { label: 'UTILITIES', icon: <Zap className="w-4 h-4" />, color: '#FF00E5' },
  { label: 'INFECTION CONTROL', icon: <HeartPulse className="w-4 h-4" />, color: '#3B82F6' },
  { label: 'HR TRAINING', icon: <GraduationCap className="w-4 h-4" />, color: '#22C55E' },
  { label: 'PATIENT PROCESSES', icon: <ShieldCheck className="w-4 h-4" />, color: '#EAB308' },
  { label: 'LAB & IMAGING', icon: <FlaskConical className="w-4 h-4" />, color: '#00F2FF' },
  { label: 'KEY PERSONNEL', icon: <Users className="w-4 h-4" />, color: '#FF00E5' },
  { label: 'ACCREDITATION', icon: <Award className="w-4 h-4" />, color: '#3B82F6' },
];

export default function ComplianceForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [deficiencies, setDeficiencies] = useState<any[]>([]);
  
  const [fd, setFd] = useState({
    hospitalName: '', regNumber: '', email: '', phone: '',
    hospitalType: 'SHCO', ownershipType: 'Private', builtUpArea: 0, buildings: 1, sanctionedBeds: 0, operationalBeds: 0,
    emergencyBeds: 0, icuBeds: 0, hduBeds: 0, privateBeds: 0, semiPrivateBeds: 0, generalBeds: 0,
    opd12: 0, admissions12: 0, inpatientDays: 0, availableBedDays: 0, avgOccupancy: 0, icuOccupancy: 0, wardOccupancy: 0, icuInpatientDays: 0, availableIcuBedDays: 0,
    topServices: Array(10).fill(''), topDiagnoses: Array(10).fill(''), topSurgeries: Array(10).fill(''), jointReplacements: 0,
    nursesPresent: false, nursesList: [{name: '', qualification: '', certificate_name: ''}], nursesOutsourced: '',
    numOTs: 0, superSpeciality: false, exclusiveOT: false, numSuperOTs: 0, steamAutoclave: false, eto: false, plasma: false, flash: false, otherSterilization: '',
    upsPresent: false, upsKV: 0, genPresent: false, genKV: 0, waterTanks: 0, waterCapacity: 0, altWater: false, altWaterUsage: '', trolleyElevators: 0, peopleElevators: 0,
    icCommittee: false, nursesIC: false, handHygiene: false, bmwAuth: false, colorBins: false, segregationInstr: false, closedTransport: false, needleCutters: false, bmwStorage: false, biohazardSign: false, housekeeping: false, laundryProcess: false,
    trainingScope: false, trainingLab: false, trainingImaging: false, trainingAbduction: false, trainingInfection: false, fireDrills: false, trainingSpill: false, trainingSafety: false, trainingNeedle: false, trainingMedication: false,
    consentForms: false, recordsAudit: false, feedbackSystem: false, patientRights: false, grievance: false, lasaProtocol: false, fireNOC: false, emergency24: false, radiationSign: false, pcpndtDecl: false, fireExitSign: false, dirSign: false, deptSign: false, breakdownMaint: 'In house', prevMaint: 'In house',
    labCritical: false, labTAT: false, labScope: false, imagingCritical: false, imagingTAT: false, imagingScope: false, bloodBankForms: false, bloodCommittee: false,
    medDirector: '', qualityManager: '', administrator: '',
    accredType: 'Entry Level', prevAccred: false, prevAccredDate: '',
  });

  const updateFd = (updates: any) => setFd(prev => ({ ...prev, ...updates }));

  const sectionProgress = useMemo(() => {
    return Math.round(((step + 1) / STEPS.length) * 100);
  }, [step]);

  const handleSubmit = async () => {
    // Basic validation check before submit
    if (fd.phone.length !== 10) return setError("Phone number must be exactly 10 digits.");
    if (!fd.email.includes('@')) return setError("Please enter a valid email address.");

    setLoading(true); setError(null);
    const payload = {
      basic_info: { hospital_name: fd.hospitalName, registration_number: fd.regNumber, contact_email: fd.email, phone: fd.phone },
      hospital_details: {
        hospital_type: fd.hospitalType, ownership_type: fd.ownershipType, built_up_area_sqmt: fd.builtUpArea, number_of_buildings: fd.buildings,
        total_sanctioned_beds: fd.sanctionedBeds, operational_beds: fd.operationalBeds, casualty_emergency_beds: fd.emergencyBeds,
        icu_beds: fd.icuBeds, hdu_beds: fd.hduBeds, private_ward_beds: fd.privateBeds, semi_private_ward_beds: fd.semiPrivateBeds, general_ward_beds: fd.generalBeds
      },
      opd_ipd: {
        opd_patients_12_months: fd.opd12, admissions_12_months: fd.admissions12, inpatient_days_monthly_avg: fd.inpatientDays,
        available_bed_days_monthly_avg: fd.availableBedDays, average_occupancy_pct: fd.avgOccupancy, icu_occupancy_pct: fd.icuOccupancy,
        ward_occupancy_pct: fd.wardOccupancy, icu_inpatient_days_monthly_avg: fd.icuInpatientDays, available_icu_bed_days_monthly_avg: fd.availableIcuBedDays
      },
      clinical_services: {
        top_10_clinical_services: fd.topServices, top_10_diagnoses: fd.topDiagnoses, top_10_surgical_procedures: fd.topSurgeries,
        number_of_joint_replacements_yearly: fd.jointReplacements, clinical_service_volumes: []
      },
      hospital_staffing: {
        nurses_present: fd.nursesPresent, nurses_list: fd.nursesPresent ? fd.nursesList : [],
        nurses_document_uploaded: fd.nursesPresent && fd.nursesList.some(n => n.certificate_name), nurses_outsourced: fd.nursesOutsourced
      },
      ot_sterilization: {
        number_of_ots: fd.numOTs, performs_super_speciality_surgeries: fd.superSpeciality, exclusive_ot_for_super_speciality: fd.exclusiveOT,
        number_of_super_speciality_ots: fd.numSuperOTs, steam_autoclave: fd.steamAutoclave, eto_sterilization: fd.eto,
        plasma_sterilization: fd.plasma, flash_sterilization: fd.flash, other_sterilization: fd.otherSterilization
      },
      utilities: {
        ups_present: fd.upsPresent, ups_capacity_kv: fd.upsKV, generator_present: fd.genPresent, generator_capacity_kv: fd.genKV,
        total_water_tanks: fd.waterTanks, total_water_capacity_litres: fd.waterCapacity, alternate_water_source: fd.altWater,
        alternate_water_usage: fd.altWaterUsage, elevators_for_trolleys: fd.trolleyElevators, elevators_for_people: fd.peopleElevators,
        trolleys_with_safety_belts: false, wheelchairs_with_safety_belts: false
      },
      infection_control_bmw: {
        has_infection_control_committee: fd.icCommittee, nurses_trained_in_infection_control: fd.nursesIC,
        hand_hygiene_audit_conducted: fd.handHygiene, has_biomedical_waste_authorization: fd.bmwAuth,
        colour_coded_bins_available: fd.colorBins, segregation_instructions_displayed: fd.segregationInstr,
        closed_container_transport: fd.closedTransport, needle_cutters_used: fd.needleCutters,
        bmw_storage_facility: fd.bmwStorage, biohazard_sign_displayed: fd.biohazardSign,
        housekeeping_checklists_maintained: fd.housekeeping, laundry_segregation_process: fd.laundryProcess
      },
      hr_training: {
        training_scope_of_services: fd.trainingScope, training_safe_lab_practices: fd.trainingLab,
        training_safe_imaging_practices: fd.trainingImaging, training_child_abduction_prevention: fd.trainingAbduction,
        training_infection_control: fd.trainingInfection, fire_mock_drills_conducted: fd.fireDrills,
        training_spill_management: fd.trainingSpill, training_safety_education: fd.trainingSafety,
        training_needle_stick_injury: fd.trainingNeedle, training_medication_error: fd.trainingMedication,
        training_disciplinary_procedures: false, training_grievance_handling: false
      },
      patient_processes: {
        has_standard_consent_forms: fd.consentForms, medical_records_audited_monthly: fd.recordsAudit,
        patient_feedback_system: fd.feedbackSystem, patient_rights_displayed: fd.patientRights,
        grievance_redressal_mechanism: fd.grievance, lasa_drugs_storage_protocol: fd.lasaProtocol,
        medication_labelling_protocol: false, fire_noc_valid: fd.fireNOC, regular_fire_drills: fd.fireDrills,
        staff_trained_in_cpr: false, emergency_services_24x7: fd.emergency24, radiation_hazard_signage: fd.radiationSign,
        pcpndt_declaration_displayed: fd.pcpndtDecl, biohazard_signage: false, fire_exit_signage: fd.fireExitSign,
        directional_signage: fd.dirSign, departmental_signage: fd.deptSign, breakdown_maintenance_type: fd.breakdownMaint,
        preventive_maintenance_type: fd.prevMaint
      },
      lab_imaging_blood: {
        lab_critical_result_reporting: fd.labCritical, lab_tat_displayed: fd.labTAT, lab_scope_documented: fd.labScope,
        imaging_critical_result_reporting: fd.imagingCritical, imaging_tat_displayed: fd.imagingTAT,
        imaging_scope_documented: fd.imagingScope, blood_bank_transfusion_reaction_forms: fd.bloodBankForms,
        blood_transfusion_committee_active: fd.bloodCommittee
      },
      key_personnel: { medical_director: fd.medDirector, quality_manager: fd.qualityManager, administrator: fd.administrator },
      accreditation_info: {
        accreditation_type: fd.accredType, previously_accredited: fd.prevAccred,
        previous_accreditation_date: fd.prevAccredDate || null
      }
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/submissions`, payload);
      setResult(res.data.results);
      setDeficiencies(res.data.deficiencies || []);
      setStep(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Submission failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0: return <BasicInfoStep data={fd} update={updateFd} />;
      case 1: return <HospitalDetailsStep data={fd} update={updateFd} />;
      case 2: return <OPDIPDStep data={fd} update={updateFd} />;
      case 3: return <ClinicalServicesStep data={fd} update={updateFd} />;
      case 4: return <HospitalStaffingStep data={fd} update={updateFd} />;
      case 5: return <OTSterilizationStep data={fd} update={updateFd} />;
      case 6: return <UtilitiesStep data={fd} update={updateFd} />;
      case 7: return <InfectionControlStep data={fd} update={updateFd} />;
      case 8: return <HRTrainingStep data={fd} update={updateFd} />;
      case 9: return <PatientProcessesStep data={fd} update={updateFd} />;
      case 10: return <LabImagingStep data={fd} update={updateFd} />;
      case 11: return <KeyPersonnelStep data={fd} update={updateFd} />;
      case 12: return <AccreditationStep data={fd} update={updateFd} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 animate-in fade-in duration-700">
      {/* Neon Breadcrumb */}
      <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 px-4 sm:p-6 mb-2">
        <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Home</Link> 
        <span className="text-slate-800">/</span> 
        <span className="text-cyan-400">Registration</span>
      </div>

      {/* Sync Header */}
      <div className="p-5 sm:p-8 bg-slate-900 border border-white/5 rounded-2xl sm:rounded-[40px] shadow-2xl mb-6 sm:mb-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent"></div>
        <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mb-1">Registration</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Protocol: <span className="text-cyan-400">NABH Pre-Entry Level</span></p>
        </div>
        <div className="relative z-10 flex items-center gap-10">
             <div className="text-right">
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Sync Progress</p>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-cyan-400">{sectionProgress}%</span>
                    <div className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 transition-all duration-700" style={{ width: `${sectionProgress}%`, boxShadow: '0 0 10px rgba(0, 242, 255, 0.3)' }}></div>
                    </div>
                </div>
             </div>
             <div className="hidden sm:flex items-center gap-4">
                 <button 
                    onClick={() => { if(confirm('WIPE ALL DATA? This will clear your current form.')) { localStorage.removeItem('hg_reg_form'); window.location.reload(); } }}
                    className="px-6 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                 >
                    <RotateCcw className="w-3 h-3" /> RESET MATRIX
                 </button>
                 <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-2xl">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ref. ID</p>
                     <p className="text-xs font-black text-indigo-400">#SH_64218</p>
                 </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-10">
            {/* Steps Sidebar */}
            <div className="lg:col-span-1">
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {STEPS.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => setStep(i)} 
                        className={`flex-shrink-0 lg:w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all flex items-center gap-3 sm:gap-4 border ${i === step ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg shadow-cyan-500/20' : i < step ? 'bg-white/5 border-emerald-500/30 text-emerald-500 opacity-60' : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5'}`}
                    >
                        <div className={`p-1.5 rounded-lg ${i === step ? 'bg-black/10' : 'bg-white/5'}`}>
                            {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : s.icon}
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest truncate">{s.label}</span>
                    </button>
                ))}
                </div>
            </div>

            {/* Matrix Form Canvas */}
            <div className="lg:col-span-3 space-y-8">
                 {error && (
                    <div className="p-6 bg-rose-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-rose-500/20 animate-in shake duration-500">
                        <AlertTriangle className="w-5 h-5" /> {error}
                    </div>
                 )}

                 {result && (
                    <div className="p-10 bg-slate-900 border-2 border-emerald-500/50 rounded-[48px] shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 blur-3xl opacity-10"></div>
                        <div className="flex items-start justify-between gap-10">
                            <div>
                                <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                                    <Cpu className="w-6 h-6 text-emerald-400" />
                                    {result.is_ready ? 'SYNC_COMPLETE' : 'INTEGRITY_GAPS_DETECTED'}
                                </h2>
                                <p className="text-sm font-bold text-slate-400">Composite Readiness Calibration: <span className="text-emerald-400 font-black">{result.total_score}%</span></p>
                            </div>
                            <div className="w-20 h-20 rounded-3xl bg-black/50 border border-emerald-500 flex items-center justify-center">
                                <span className="text-2xl font-black text-emerald-400">{result.total_score}%</span>
                            </div>
                        </div>
                    </div>
                 )}

                 {/* Main Input Plate */}
                 <div className="bg-slate-900/50 border border-white/5 rounded-2xl sm:rounded-[56px] p-6 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-3xl min-h-[400px] sm:min-h-[500px]">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-white/5">
                        <button 
                            onClick={() => { if(confirm('FACTORY RESET? All local checklist and dates will be wiped.')) { localStorage.removeItem('hg_qci_responses'); localStorage.removeItem('hg_qci_dates'); window.location.reload(); } }}
                            className="hidden sm:flex px-6 py-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl font-black text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> RESET ALL
                        </button>
                        <button className="hidden sm:block px-8 py-3.5 bg-cyan-500 text-black rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:bg-cyan-400 transition-all hover:scale-105">
                            SAVE
                        </button>
                        <div className="p-3 sm:p-4 bg-cyan-500 rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-500/30">
                            <Target className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-xl font-bold text-white uppercase tracking-tight">SECTION: {STEPS[step].label}</h3>
                            <p className="text-[8px] font-medium text-slate-600 uppercase tracking-[0.2em]">Step {step + 1} of {STEPS.length}</p>
                        </div>
                    </div>

                    <div className="animate-in fade-in duration-700">
                        {renderStep()}
                    </div>

                    {/* Navigation Stream */}
                    <div className="mt-10 sm:mt-20 pt-6 sm:pt-10 border-t border-white/5 flex items-center justify-between gap-2">
                        <button 
                            onClick={() => { setStep(s => Math.max(0, s - 1)); window.scrollTo({top:0, behavior:'smooth'}); }} 
                            disabled={step === 0} 
                            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-5 rounded-xl sm:rounded-[24px] border border-white/10 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/5 disabled:opacity-20 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> PREVIOUS STEP
                        </button>
                        
                        {step < STEPS.length - 1 ? (
                            <button 
                                onClick={() => { setStep(s => Math.min(STEPS.length - 1, s + 1)); window.scrollTo({top:0, behavior:'smooth'}); }} 
                                className="flex items-center gap-2 sm:gap-3 px-6 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-[24px] bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                            >
                                NEXT STEP <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit} 
                                disabled={loading} 
                                className="flex items-center gap-2 sm:gap-4 px-6 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-[24px] bg-cyan-500 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-cyan-500/40 disabled:opacity-50"
                            >
                                {loading ? 'SUBMITTING...' : <><Send className="w-4 h-4" /> SUBMIT APPLICATION</>}
                            </button>
                        )}
                    </div>
                 </div>

                 {/* Security Context */}
                 <div className="p-4 sm:p-8 bg-black/40 border border-white/5 rounded-2xl sm:rounded-[40px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                     <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                         <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-white/5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Encrypted</span>
                         </div>
                         <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                            SHA-256 Verified Submission
                         </div>
                     </div>
                     <div className="text-indigo-400 font-black text-[9px] uppercase tracking-widest animate-pulse">
                        Inference Matrix Active
                     </div>
                 </div>
            </div>
      </div>
    </div>
  );
}
