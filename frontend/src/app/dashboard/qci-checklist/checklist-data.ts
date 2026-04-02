export interface Question {
  id: string;
  text: string;
  importance: number;
  hasValidity?: boolean;
}

export interface ChecklistFile {
  id: string;
  code: string;
  name: string;
  category: string;
  questions: Question[];
  evidence_needed: string;
}

export const CHECKLIST_FILES: ChecklistFile[] = [
  // ── STATUTORY (STAT) ──────────────────────────────────────────────────────
  { id: 'f1', code: 'REG-01', name: 'Hospital Registration', category: 'STAT', questions: [
    { id: 'q1_1', text: 'Is the Clinical Establishment Registration current and valid?', importance: 1, hasValidity: true },
    { id: 'q1_2', text: 'Is the name on registration consistent with all other statutory certificates?', importance: 1 },
    { id: 'q1_3', text: 'Is the registration copy displayed prominently at the reception area?', importance: 1 },
    { id: 'q1_4', text: 'Does the registration cover the exact bed strength of the hospital?', importance: 1 },
    { id: 'q1_5', text: 'Is the validity date clearly visible and not expired?', importance: 1, hasValidity: true },
  ], evidence_needed: 'Current Clinical Establishment Registration Certificate' },

  { id: 'f2', code: 'STAT-01', name: 'Fire NOC', category: 'STAT', questions: [
    { id: 'q2_1', text: 'Does the hospital have a valid Fire No-Objection Certificate (NOC)?', importance: 1, hasValidity: true },
    { id: 'q2_2', text: 'Are all fire extinguishers within their testing/service validity dates?', importance: 1, hasValidity: true },
    { id: 'q2_3', text: 'Is fire safety training provided periodically to all staff?', importance: 1 },
    { id: 'q2_4', text: 'Is a fire exit map displayed on every floor of the building?', importance: 1 },
    { id: 'q2_5', text: 'Is a functional fire alarm system installed and regularly tested?', importance: 1 },
  ], evidence_needed: 'No Objection Certificate from Fire Department' },

  { id: 'f3', code: 'STAT-02', name: 'BMW Authorization', category: 'STAT', questions: [
    { id: 'q3_1', text: 'Is there a valid Bio-Medical Waste Authorization from the Pollution Control Board?', importance: 1, hasValidity: true },
    { id: 'q3_2', text: 'Is the authorized BMW quantity consistent with the waste generated?', importance: 1 },
    { id: 'q3_3', text: 'Is renewal of authorization applied for before the expiry date?', importance: 1 },
    { id: 'q3_4', text: 'Is a copy of the BMW authorization displayed at the waste storage area?', importance: 1 },
    { id: 'q3_5', text: 'Does the authorization cover all applicable BMW categories?', importance: 1 },
  ], evidence_needed: 'State Pollution Control Board BMW Authorization' },

  // ── GENERAL MANAGEMENT (GEN) ────────────────────────────────────────────
  { id: 'f_c01', code: 'CHECK-01', name: 'Hospital Committees', category: 'GEN', questions: [
    { id: 'f_c01_q1', text: 'Is a Quality & Safety Committee constituted with defined scope and meeting frequency?', importance: 1 },
    { id: 'f_c01_q2', text: 'Is a Pharmacy & Therapeutic Committee established to oversee medication use?', importance: 1 },
    { id: 'f_c01_q3', text: 'Is an Infection Control Committee actively functioning with minutes maintained?', importance: 1 },
    { id: 'f_c01_q4', text: 'Is a Blood Transfusion Committee active (if applicable)?', importance: 1 },
    { id: 'f_c01_q5', text: 'Is a Medical Record Committee constituted and committee minutes maintained?', importance: 1 },
  ], evidence_needed: 'Committee Formation Records & Meeting Minutes' },

  { id: 'f_c24', code: 'CHECK-04.21', name: 'Management Responsibilities', category: 'GEN', questions: [
    { id: 'f_c24_q1', text: 'Is an effective organogram prepared, approved by top management and depicting all departments?', importance: 1 },
    { id: 'f_c24_q2', text: 'Are all statutory and legal compliances met and a Legal Tracker maintained?', importance: 1 },
    { id: 'f_c24_q3', text: 'Are vision and mission statements displayed at entrance and all common waiting areas?', importance: 1 },
    { id: 'f_c24_q4', text: 'Is a designated Safety Officer present to oversee the hospital-wide safety program?', importance: 1 },
    { id: 'f_c24_q5', text: 'Is an accurate and ethical billing process documented and ownership disclosure maintained?', importance: 1 },
  ], evidence_needed: 'Organogram, Legal Tracker, Statutory Licenses, Vision/Mission Display' },

  // ── ACCESS & ASSESSMENT (AAC) ────────────────────────────────────────────
  { id: 'f_c13', code: 'CHECK-04.10', name: 'Out-Patient Department', category: 'AAC', questions: [
    { id: 'f_c13_q1', text: 'Is OPD registration done with a Unique Hospital Identification (UHID) number for every patient?', importance: 1 },
    { id: 'f_c13_q2', text: 'Is a predefined initial assessment of OPD patients done and documented?', importance: 1 },
    { id: 'f_c13_q3', text: 'Are patient rights and responsibilities displayed bilingually in OPD areas?', importance: 1 },
    { id: 'f_c13_q4', text: 'Are hand washing areas easily accessible with steps of hand hygiene displayed?', importance: 1 },
    { id: 'f_c13_q5', text: 'Are BMW bins available as per rules and prescription audit conducted regularly?', importance: 1 },
  ], evidence_needed: 'OPD Registration Records, UHID System, OPD Assessment Forms' },

  { id: 'f_c12', code: 'CHECK-04.9', name: 'Laboratory', category: 'AAC', questions: [
    { id: 'f_c12_q1', text: 'Is the scope of laboratory services commensurate with clinical services provided?', importance: 1 },
    { id: 'f_c12_q2', text: 'Are samples collected, labelled and transported in shake/spill-proof containers with biohazard logo?', importance: 1 },
    { id: 'f_c12_q3', text: 'Are critical laboratory values defined and immediately reported to the concerned clinician?', importance: 1 },
    { id: 'f_c12_q4', text: 'Is turn-around time (TAT) for lab tests defined, monitored and records maintained?', importance: 1 },
    { id: 'f_c12_q5', text: 'Are laboratory staff provided with PPEs, eyewash facility, spill kits and trained in safe practices?', importance: 1 },
  ], evidence_needed: 'Lab Scope Document, Critical Value Register, Sample Handling SOP, TAT Records' },

  { id: 'f_c10', code: 'CHECK-04.7', name: 'Radiology', category: 'AAC', questions: [
    { id: 'f_c10_q1', text: 'Do all imaging equipment have valid AERB licenses (X-ray, CT, C-arm, etc.) as applicable?', importance: 1, hasValidity: true },
    { id: 'f_c10_q2', text: 'Is PCPNDT Form F maintained and valid for ultrasonography equipment?', importance: 1, hasValidity: true },
    { id: 'f_c10_q3', text: 'Is radiation hazard signage and pregnancy/child restriction signage displayed in imaging areas?', importance: 1 },
    { id: 'f_c10_q4', text: 'Are imaging staff provided with TLD badges and lead aprons tested quarterly by AERB-authorized agency?', importance: 1 },
    { id: 'f_c10_q5', text: 'Are critical imaging values and turn-around time defined, monitored and records maintained?', importance: 1 },
  ], evidence_needed: 'AERB License, TLD Badge Reports, PCPNDT Form F, Radiation Safety Records' },

  { id: 'f_c23', code: 'CHECK-04.20', name: 'Front Office', category: 'AAC', questions: [
    { id: 'f_c23_q1', text: 'Is a documented SOP on admission available covering OPD, emergency and transfer modes?', importance: 1 },
    { id: 'f_c23_q2', text: 'Does every new patient receive a UHID number at registration?', importance: 1 },
    { id: 'f_c23_q3', text: 'Are patient rights explained, general consent taken, and tariff list displayed prominently?', importance: 1 },
    { id: 'f_c23_q4', text: 'Is the policy on no bed availability documented and front office staff trained?', importance: 1 },
    { id: 'f_c23_q5', text: 'Is a treatment estimate given to the patient before admission?', importance: 1 },
  ], evidence_needed: 'Admission SOP, Tariff List, UHID Registration Records, Consent Forms' },

  // ── CARE OF PATIENTS (COP) ────────────────────────────────────────────────
  { id: 'f_c04', code: 'CHECK-04.1', name: 'Emergency Department', category: 'COP', questions: [
    { id: 'f_c04_q1', text: 'Is the Emergency Department on the ground floor and easily accessible by ambulance?', importance: 1 },
    { id: 'f_c04_q2', text: 'Are dedicated areas for triage, wound care, emergency observation and nursing station demarcated?', importance: 1 },
    { id: 'f_c04_q3', text: 'Is a crash cart placed at an immediately accessible location and medicines checked daily with records?', importance: 1 },
    { id: 'f_c04_q4', text: 'Are Code Blue policy, BLS/ACLS protocols displayed and all ED staff trained?', importance: 1 },
    { id: 'f_c04_q5', text: 'Is triaging of patients done and MLC/brought-in-dead handling protocol documented?', importance: 1 },
  ], evidence_needed: 'ED Layout Plan, Emergency Drug List, Code Blue SOP, Triage Protocol' },

  { id: 'f_c05', code: 'CHECK-04.2', name: 'Ambulance', category: 'COP', questions: [
    { id: 'f_c05_q1', text: 'Is the vehicle registered as an ambulance with valid legal documents (registration, PUC, insurance)?', importance: 1, hasValidity: true },
    { id: 'f_c05_q2', text: 'Is the ambulance equipped with ALS/BLS resources as per National Ambulance Code?', importance: 1 },
    { id: 'f_c05_q3', text: 'Is the ambulance checked daily for equipment, medicines, lights and fuel with documented checklists?', importance: 1 },
    { id: 'f_c05_q4', text: 'Is ambulance staff (driver and technician) trained and certified in BLS skills?', importance: 1 },
    { id: 'f_c05_q5', text: 'Does ambulance staff have communication devices and awareness of patient transfer safety?', importance: 1 },
  ], evidence_needed: 'Ambulance Registration, Fitness Certificate, Daily Checklist, Staff BLS Training Records' },

  { id: 'f_c06', code: 'CHECK-04.3', name: 'Operation Theatre & Recovery', category: 'COP', questions: [
    { id: 'f_c06_q1', text: 'Is adequate space, equipment and infection control practices adhered to in OT?', importance: 1 },
    { id: 'f_c06_q2', text: 'Is pre-anesthesia assessment done by a qualified anesthesiologist and documented?', importance: 1 },
    { id: 'f_c06_q3', text: 'Is informed consent for anesthesia and surgery obtained before every procedure?', importance: 1 },
    { id: 'f_c06_q4', text: 'Is the WHO Surgical Safety Checklist followed and documented in every patient file?', importance: 1 },
    { id: 'f_c06_q5', text: 'Are OT air/surface culture tests done regularly and Aldrete scoring for recovery documented?', importance: 1 },
  ], evidence_needed: 'OT Culture Reports, Surgical Safety Checklist, Anesthesia Records, Consent Forms' },

  { id: 'f_c07', code: 'CHECK-04.4', name: 'ICU & High Dependency Unit', category: 'COP', questions: [
    { id: 'f_c07_q1', text: 'Is initial assessment done in a defined timeframe with plan of care countersigned by a clinician?', importance: 1 },
    { id: 'f_c07_q2', text: 'Are high-risk medications verified and dispensed by two persons and documented in ICU?', importance: 1 },
    { id: 'f_c07_q3', text: 'Is the ICU identified as high-risk with regular HAI surveillance (VAP, CLABSI, CAUTI) conducted?', importance: 1 },
    { id: 'f_c07_q4', text: 'Are narcotic drugs in ICU stored under double lock and key with usage/disposal documented?', importance: 1 },
    { id: 'f_c07_q5', text: 'Is credentialing and privileging of ICU doctors and nurses done and documented?', importance: 1 },
  ], evidence_needed: 'ICU Protocol Documents, HAI Surveillance Records, Credentialing Files' },

  { id: 'f_c08', code: 'CHECK-04.5', name: 'In-Patient Department', category: 'COP', questions: [
    { id: 'f_c08_q1', text: 'Is initial assessment of admitted patient done in a defined time frame and documented?', importance: 1 },
    { id: 'f_c08_q2', text: 'Does the discharge summary contain reason for admission, diagnosis, medications and follow-up instructions?', importance: 1 },
    { id: 'f_c08_q3', text: 'Is care of vulnerable patients (paediatric, elderly, differently abled) addressed as per policy?', importance: 1 },
    { id: 'f_c08_q4', text: 'Are LASA drug storage, prescription guidelines and narcotic drug management adhered to?', importance: 1 },
    { id: 'f_c08_q5', text: 'Are linen management, hand washing facilities and hazardous material identification in place?', importance: 1 },
  ], evidence_needed: 'IPD Nursing Records, Discharge Summary Format, Linen Policy' },

  { id: 'f_c09', code: 'CHECK-04.6', name: 'Specialized Wards', category: 'COP', questions: [
    { id: 'f_c09_q1', text: 'Is scope of paediatric and obstetric services displayed bilingually in the respective wards?', importance: 1 },
    { id: 'f_c09_q2', text: 'Is there provision for prevention of child/neonate abduction with CCTV cameras and Code Pink protocol?', importance: 1 },
    { id: 'f_c09_q3', text: 'Is nutritional, growth, psychosocial and immunization assessment for children documented?', importance: 1 },
    { id: 'f_c09_q4', text: 'Are pre-natal, peri-natal and post-natal monitoring and documentation done?', importance: 1 },
    { id: 'f_c09_q5', text: 'Is credentialing of chemotherapy unit staff done and Level 2B biosafety cabinet available?', importance: 1 },
  ], evidence_needed: 'Paediatric/Labour Room SOPs, Code Pink Records, NICU Level Documentation' },

  { id: 'f_c11', code: 'CHECK-04.8', name: 'Endoscopy & Bronchoscopy', category: 'COP', questions: [
    { id: 'f_c11_q1', text: 'Is informed consent obtained before every endoscopic or bronchoscopic procedure?', importance: 1 },
    { id: 'f_c11_q2', text: 'Is the person administering moderate sedation different from the one performing the procedure?', importance: 1 },
    { id: 'f_c11_q3', text: 'Is adequate monitoring equipment and rescue manpower available during sedation?', importance: 1 },
    { id: 'f_c11_q4', text: 'Is medication management adhered to and crash cart present and regularly checked?', importance: 1 },
    { id: 'f_c11_q5', text: 'Is the reuse policy for endoscopes documented and high-level disinfection protocol followed?', importance: 1 },
  ], evidence_needed: 'Sedation Protocol, Reuse Policy, Crash Cart Checklist, Consent Forms' },

  { id: 'f_c16', code: 'CHECK-04.13', name: 'CSSD', category: 'COP', questions: [
    { id: 'f_c16_q1', text: 'Is adequate space with unidirectional flow and clean/dirty zone segregation demarcated in CSSD?', importance: 1 },
    { id: 'f_c16_q2', text: 'Are policies for cleaning, packing, sterilization, storing and issue of items documented?', importance: 1 },
    { id: 'f_c16_q3', text: 'Is regular sterilization validation (chemical indicator) conducted and documented?', importance: 1 },
    { id: 'f_c16_q4', text: 'Is shelf life of sterile sets adhered to and documented in OT and CSSD?', importance: 1 },
    { id: 'f_c16_q5', text: 'Is a recall procedure in place when a sterilization system breakdown occurs?', importance: 1 },
  ], evidence_needed: 'Sterilization Validation Records, CSSD Layout Plan, Recall SOP' },

  // ── MEDICATION MANAGEMENT (MOM) ──────────────────────────────────────────
  { id: 'f_c14', code: 'CHECK-04.11', name: 'Medication Management', category: 'MOM', questions: [
    { id: 'f_c14_q1', text: 'Are documented procedures for procurement, storage, dispensing and prescription of medications available?', importance: 1 },
    { id: 'f_c14_q2', text: 'Are all drug licenses (Form 20, 21, Narcotics & Psychotropic) valid and state pharmacy council requirements met?', importance: 1, hasValidity: true },
    { id: 'f_c14_q3', text: 'Are LASA (look-alike sound-alike) medicines stored separately with a defined published list?', importance: 1 },
    { id: 'f_c14_q4', text: 'Are high-risk medications identified, stored separately and dispensed with double verification?', importance: 1 },
    { id: 'f_c14_q5', text: 'Are adverse drug events defined, monitored, reported and reviewed by the Pharmacy & Therapeutic Committee?', importance: 1 },
  ], evidence_needed: 'Drug Formulary, LASA List, Narcotic Register, Drug Retail License (Form 20 & 21)' },

  // ── INFECTION CONTROL (HIC) ───────────────────────────────────────────────
  { id: 'f_c15', code: 'CHECK-04.12', name: 'Hospital Infection Control', category: 'HIC', questions: [
    { id: 'f_c15_q1', text: 'Is there an Infection Control manual covering surveillance, sterilization, laundry and PPE practices?', importance: 1 },
    { id: 'f_c15_q2', text: 'Are hand hygiene facilities available in ALL patient care areas and compliance audited with a standard tool?', importance: 1 },
    { id: 'f_c15_q3', text: 'Is pre-exposure (Hep-B, Typhoid) and post-exposure prophylaxis offered to all relevant staff?', importance: 1 },
    { id: 'f_c15_q4', text: 'Is surveillance for VAP, CLABSI, CAUTI and SSI carried out using standard WHO/CDC definitions?', importance: 1 },
    { id: 'f_c15_q5', text: 'Is air surveillance (OT cultures, HEPA checks) and surface surveillance (swab cultures) done regularly?', importance: 1 },
  ], evidence_needed: 'IC Manual, Hand Hygiene Audit Reports, Air & Surface Culture Records, HAI Surveillance Data' },

  { id: 'f_c22', code: 'CHECK-04.19', name: 'Housekeeping, Laundry & Kitchen', category: 'HIC', questions: [
    { id: 'f_c22_q1', text: 'Is BMW waste properly segregated as per colour coding with biohazard signage and foot-operated closed bins?', importance: 1 },
    { id: 'f_c22_q2', text: 'Is BMW disposal to the authorized vendor carried out at least once in 48 hours with handover records?', importance: 1 },
    { id: 'f_c22_q3', text: 'Is soiled linen sluiced, bagged and transported separately with staff wearing appropriate PPE?', importance: 1 },
    { id: 'f_c22_q4', text: 'Does the kitchen have a valid FSSAI license and maintain unidirectional flow without cross-contamination?', importance: 1, hasValidity: true },
    { id: 'f_c22_q5', text: 'Are daily health screening and six-monthly medical checks (blood & stool tests) of food handling staff conducted?', importance: 1 },
  ], evidence_needed: 'BMW Authorization, MOU with Vendor, FSSAI License, Waste Handover Records' },

  // ── QUALITY IMPROVEMENT (CQI) ─────────────────────────────────────────────
  { id: 'f_c17', code: 'CHECK-04.14', name: 'Safety & Quality', category: 'CQI', questions: [
    { id: 'f_c17_q1', text: 'Is there a designated Quality Manager with a letter of designation and documented job description?', importance: 1 },
    { id: 'f_c17_q2', text: 'Is the quality assurance programme documented in a Quality Manual and updated regularly?', importance: 1 },
    { id: 'f_c17_q3', text: 'Are internal self-assessments/audits conducted periodically to ensure quality program continuity?', importance: 1 },
    { id: 'f_c17_q4', text: 'Does management provide adequate resources (manpower, budget, materials) for quality improvement?', importance: 1 },
    { id: 'f_c17_q5', text: 'Are clinical and managerial key performance indicators (KPIs) captured and monitored regularly?', importance: 1 },
  ], evidence_needed: 'Quality Manual, Internal Audit Records, KPI Monitoring Dashboards' },

  // ── FACILITY & SAFETY (FMS) ───────────────────────────────────────────────
  { id: 'f_c03b', code: 'CHECK-03b', name: 'Signage Compliance', category: 'FMS', questions: [
    { id: 'f_c03b_q1', text: 'Is Radiation Hazard signage (inverted triangle) displayed in all radiology and imaging areas?', importance: 1 },
    { id: 'f_c03b_q2', text: 'Is Declaration under PCPNDT Act displayed prominently near ultrasonography equipment?', importance: 1 },
    { id: 'f_c03b_q3', text: 'Is bio-hazard signage with authorized waste categories displayed at all BMW storage areas?', importance: 1 },
    { id: 'f_c03b_q4', text: 'Are fire exit routes, hospital name (bilingual) and scope of services signage in place?', importance: 1 },
    { id: 'f_c03b_q5', text: 'Are directional signages to all critical departments clearly visible throughout the hospital?', importance: 1 },
  ], evidence_needed: 'Signage Photographs, Compliance Walkthrough Report' },

  { id: 'f_c19', code: 'CHECK-04.16', name: 'Biomedical Equipment', category: 'FMS', questions: [
    { id: 'f_c19_q1', text: 'Is a database/inventory of all biomedical equipment with unique numbering system maintained?', importance: 1 },
    { id: 'f_c19_q2', text: 'Are planned preventive maintenance (PPM) schedules documented and followed for all equipment?', importance: 1 },
    { id: 'f_c19_q3', text: 'Are AMC/CMC contracts or in-house biomedical engineer support available for all critical equipment?', importance: 1, hasValidity: true },
    { id: 'f_c19_q4', text: 'Is documentation of breakdown, repair and condemnation of equipment maintained?', importance: 1 },
    { id: 'f_c19_q5', text: 'Is training of equipment technicians documented and uptime/downtime of equipment tracked?', importance: 1 },
  ], evidence_needed: 'Equipment Inventory Register, PPM Schedules, AMC/CMC Contracts' },

  { id: 'f_c20', code: 'CHECK-04.17', name: 'Common Areas Compliance', category: 'FMS', questions: [
    { id: 'f_c20_q1', text: 'Are all mandatory training programmes completed with records available for all departments?', importance: 1 },
    { id: 'f_c20_q2', text: 'Are mandatory signages (Scope of Services, Patient Rights, Directional) displayed throughout?', importance: 1 },
    { id: 'f_c20_q3', text: 'Is a Fire Mock Drill conducted, documented and records maintained periodically?', importance: 1 },
    { id: 'f_c20_q4', text: 'Are common area policies on Infection Control and Safety accessible and staff trained?', importance: 1 },
    { id: 'f_c20_q5', text: 'Is departmental and directional signage clearly visible in all common areas and corridors?', importance: 1 },
  ], evidence_needed: 'Training Records, Signage Photographs, Fire Drill Records, Policy Checklist' },

  { id: 'f_c21', code: 'CHECK-04.18', name: 'Utilities: Water, Electricity & Medical Gas', category: 'FMS', questions: [
    { id: 'f_c21_q1', text: 'Is potable water available round the clock and are cleaning records of water tanks documented?', importance: 1 },
    { id: 'f_c21_q2', text: 'Is 24x7 electricity maintained with generator testing documentation and backup available?', importance: 1 },
    { id: 'f_c21_q3', text: 'Are medical gas pipelines uniformly colour-coded with daily/monthly maintenance schedules maintained?', importance: 1 },
    { id: 'f_c21_q4', text: 'Are records of medical gas outlet pressure checks and leak detection maintained?', importance: 1 },
    { id: 'f_c21_q5', text: 'Are empty and filled gas cylinders stored separately with secure chaining and loading records?', importance: 1 },
  ], evidence_needed: 'Water Testing Reports, Generator Test Logs, Medical Gas Maintenance Records' },

  // ── HR MANAGEMENT (HRM) ───────────────────────────────────────────────────
  { id: 'f_c02', code: 'CHECK-02', name: 'Key Staff Trainings', category: 'HRM', questions: [
    { id: 'f_c02_q1', text: 'Are trainings on Scope of Services, Safe Lab Practices and Safe Imaging Practices conducted with records?', importance: 1 },
    { id: 'f_c02_q2', text: 'Are trainings on Infection Control Practices, Spill Management and PPE use conducted?', importance: 1 },
    { id: 'f_c02_q3', text: 'Are trainings on CPR, BLS, ACLS and Care of Emergency Patients completed for all relevant staff?', importance: 1 },
    { id: 'f_c02_q4', text: 'Are trainings on Child Abduction Prevention, Needle Stick Injury and Medication Error conducted?', importance: 1 },
    { id: 'f_c02_q5', text: 'Are trainings on Disciplinary Procedures, Grievance Handling and POSH conducted?', importance: 1 },
  ], evidence_needed: 'Training Calendar, Attendance Records & Completion Certificates' },

  { id: 'f_c25', code: 'CHECK-04.22', name: 'Human Resources Department', category: 'HRM', questions: [
    { id: 'f_c25_q1', text: 'Is an induction training programme conducted at joining covering all hospital-wide risks?', importance: 1 },
    { id: 'f_c25_q2', text: 'Are policies on disciplinary procedures, grievance handling and POSH (sexual harassment) documented?', importance: 1 },
    { id: 'f_c25_q3', text: 'Are personal files maintained for all employees with qualification, health status and disciplinary records?', importance: 1 },
    { id: 'f_c25_q4', text: 'Are documents maintained for pre-exposure prophylaxis, post-exposure prophylaxis and ESI/insurance coverage?', importance: 1 },
    { id: 'f_c25_q5', text: 'Is an annual audit of training conducted including staff interviews to verify awareness?', importance: 1 },
  ], evidence_needed: 'Personal Files, Induction Records, Grievance Register, Health Benefit Policy' },

  // ── INFORMATION MANAGEMENT (IMS) ──────────────────────────────────────────
  { id: 'f_c18', code: 'CHECK-04.15', name: 'Medical Records (MRD)', category: 'IMS', questions: [
    { id: 'f_c18_q1', text: 'Does every medical record have a Unique Identifier (UHID) and are all entries dated, timed and signed?', importance: 1 },
    { id: 'f_c18_q2', text: 'Do patient records contain all mandatory elements: demographics, discharge summary, consent forms and investigation results?', importance: 1 },
    { id: 'f_c18_q3', text: 'Is confidentiality, security and integrity of medical records maintained against loss, theft and tampering?', importance: 1 },
    { id: 'f_c18_q4', text: 'Are SOPs available for retention period, access control and destruction of medical records?', importance: 1 },
    { id: 'f_c18_q5', text: 'Is a medical record audit and mock drill conducted at least twice a year?', importance: 1 },
  ], evidence_needed: 'Medical Record Policy, Retention SOP, MRD Audit Reports, Destruction Records' },
];
