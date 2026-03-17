'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, FileText, Image as ImageIcon, Check } from 'lucide-react';

const requirementCategories = [
  {
    title: "1 - General Information",
    items: [
      { text: "Certificate which validates the registered name of the Hospital to be uploaded through portal", type: "document" },
      { text: "Registration Certificate of hospital under State/Local Statutory Hospital Registering Body, Clinical Establishment Act, or Shop and Establishment Act", type: "document" },
      { text: "Registration Certificate of hospital for type of ownership/partnership like private-corporate, proprietary, cooperative society etc.", type: "document" },
      { text: "Certificate of the hospital under any government empanelment schemes (as applicable) such as ECHS, CGHS, etc.", type: "document" }
    ]
  },
  {
    title: "2 – Physical Infrastructure",
    items: [
      { text: "Documentation pertinent to Land/Rent Agreement or occupancy certificate to be uploaded through portal", type: "document" },
      { text: "MoU with the other Hospital for Clinical Biochemistry Lab, Clinical Microbiology & Serology Lab, Pathology Lab, etc. (if outside premises)", type: "document" },
      { text: "MoU for Diagnostic Imaging like CT Scanning, MRI, Ultrasound, DSA, etc. (if outside premises)", type: "document" },
      { text: "MoU for Other Services like 2D Echo, Audiometry, EEG, EMG/EP, Holter Monitoring, etc.", type: "document" },
      { text: "Certificate of potability of alternate as well as drinking water source as per IS 10500:2012 (uploaded through mobile application)", type: "document" },
      { text: "Certificate of Lift License / Safety for all elevators", type: "document" },
      { text: "Photo of Generator in the hospital, ICUs, OT, Ward, Labour Room, and anywhere else", type: "photo" },
      { text: "Photo of alternate source of water used", type: "photo" },
      { text: "Photo of trolleys and wheel chairs with safety belts or side rails", type: "photo" },
      { text: "Photo of safety hazard signage: Radiation, PCPNDT Declaration, Bio hazard", type: "photo" }
    ]
  },
  {
    title: "3 - Statutory Compliances",
    items: [
      { text: "Legal status for conducting business under Shops and Commercial Establishments Act", type: "document" },
      { text: "State Pollution Control Board (SPCB) Consent to generate Bio-Medical Waste (BMW)", type: "document" },
      { text: "MoU with BMW collecting Agency", type: "document" },
      { text: "Pollution Control Board License for water and Air Pollution (above 50 beds)", type: "document" },
      { text: "Registration under PC-PNDT Act and MTP Act", type: "document" },
      { text: "AERB Licenses for X-Ray, Mobile X-Ray, Dental X-Rays, OPG, CT scan, Mammography, BMD, C-Arm, Cath Lab", type: "document" },
      { text: "RSO Level I, II, III License, Nuclear Medicine, PET Scan, Radiotherapy, IMRT, Cobalt, Linear Accelerator Compliance Licenses", type: "document" },
      { text: "Narcotics License & Retail Pharmacy License", type: "document" }
    ]
  },
  {
    title: "4 - Clinical Service Details OPD & IPD",
    items: [
      { text: "UHID OF 5 patients treated in past 6 months under each clinical services offered (uploaded through mobile application)", type: "document" }
    ]
  },
  {
    title: "5 - Hospital Staffing",
    items: [
      { text: "Details of general duty medical officers in the form of provided template", type: "document" },
      { text: "Details of nurses in the form of provided template", type: "document" },
      { text: "Details of paramedical staff (OT, ECG, Radiology, PFT, Lab, Optometrist, Emg, Dialysis) in the form of provided template", type: "document" },
      { text: "General details of administrative and support staff in the form of provided template", type: "document" }
    ]
  },
  {
    title: "6 - Quality Improvement Process",
    items: [
      { text: "Documents for any two changes made in the hospital which are related to quality & patient safety", type: "document" },
      { text: "Documents for any five indicators data signed by top management", type: "document" },
      { text: "Blood and blood product consent of 3 patients, Blood donation consent, Anesthesia Consent, Surgery consent of 3 patients", type: "document" },
      { text: "Training material on education on safe parenting nutrition and immunization", type: "document" },
      { text: "Upload UHID of any one patient and corresponding filled Initial Assessment form for OPD, IPD, and Emergency", type: "document" },
      { text: "Nursing Care: Upload 1 copy of Medication Administration Record, nursing monitoring charts, and nurses' notes", type: "document" },
      { text: "Scanned list of emergency and high-risk medications, photos of emergency medication stock", type: "document" },
      { text: "Upload training records: scope of services, care of emergency patients, Infection Control, Safety Education, Medication Error, Grievance, Lab/Imaging safety, Fire mock drills", type: "document" },
      { text: "Organogram and handling record of patient grievances/complaints", type: "document" },
      { text: "Scanned MCA & CAPA of Medication Error and Adverse drug reaction of last 3 months", type: "document" }
    ]
  },
  {
    title: "7 - Documentation Requirements (Policies/Procedures)",
    items: [
      { text: "Scanned copy of procedures to guide collection, identification, handling, safe transportation, processing and disposal of specimens", type: "document" },
      { text: "Scanned copy of process to discharge all patients including Medico-legal cases and LAMA", type: "document" },
      { text: "Scanned copies of documented policies that govern rational use of blood products, anaesthesia, prevention of adverse events", type: "document" },
      { text: "Scanned copies of Infection control manual", type: "document" },
      { text: "Scanned copies of safe exit plan in case of fire and non-fire emergencies", type: "document" },
      { text: "Scanned copies of disciplinary and grievance handling procedure, staff recruitment process", type: "document" }
    ]
  },
  {
    title: "8 - Onsite Photos Required",
    items: [
      { text: "Laboratory: Labelled sample containers, Boxes, specimen disposal bin, fire extinguishers/PPE", type: "photo" },
      { text: "Radiology: Aprons and shields", type: "photo" },
      { text: "ICU/OT: WHO check lists, OT Zoning, storage areas, narcotic records, handwashing areas", type: "photo" },
      { text: "Wards & Pharmacy: Expired drugs stored separately, list of high risk/emergency meds, labelled drugs, fridge temp records", type: "photo" },
      { text: "Housekeeping: Cleaning blood spill, BMW segregation, Medical gas cylinder storage, fire detectors/extinguishers", type: "photo" },
      { text: "Ambulance: Inside/outside view, equipment list, drugs list, driver/doctor details", type: "photo" },
      { text: "Signage: Scope of services, Patients' rights, Fire exit, Directional, Departmental", type: "photo" }
    ]
  }
];

export default function DocumentChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (categoryIdx: number, itemIdx: number) => {
    const key = `${categoryIdx}-${itemIdx}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateProgress = () => {
    const total = requirementCategories.reduce((acc, curr) => acc + curr.items.length, 0);
    const checked = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checked / total) * 100) || 0;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            NABH Document & Evidence Checklist
          </h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl">
            Track all the physical documents, licenses, MOUs, and photographic evidence required for 
            your hospital&apos;s accreditation process, as mandated by NABH guidelines.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-950/50 px-6 py-4 rounded-xl border border-slate-800">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-indigo-500/30 relative">
            <span className="text-xl font-bold text-indigo-300">{calculateProgress()}%</span>
            <svg className="absolute top-0 left-0 w-full h-full -rotate-90 pointer-events-none">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-800" />
              <circle 
                cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" 
                className="text-indigo-500 transition-all duration-500"
                strokeDasharray="175"
                strokeDashoffset={175 - (175 * calculateProgress()) / 100}
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Total Readiness</span>
            <span className="text-xs text-slate-500">{Object.values(checkedItems).filter(Boolean).length} of {requirementCategories.reduce((acc, curr) => acc + curr.items.length, 0)} Items</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {requirementCategories.map((category, cIdx) => (
          <div key={cIdx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <div className="bg-slate-800/50 p-4 border-b border-slate-700/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-indigo-400">{category.title}</h2>
              <span className="text-xs bg-slate-950/50 px-3 py-1 rounded-full text-slate-400 border border-slate-800">
                {category.items.filter((_, i) => checkedItems[`${cIdx}-${i}`]).length} / {category.items.length} done
              </span>
            </div>
            
            <ul className="divide-y divide-slate-800/50">
              {category.items.map((item, iIdx) => {
                const isChecked = checkedItems[`${cIdx}-${iIdx}`];
                return (
                  <li 
                    key={iIdx} 
                    onClick={() => toggleCheck(cIdx, iIdx)}
                    className="p-4 flex gap-4 hover:bg-slate-800/30 cursor-pointer transition-colors group"
                  >
                    <button className="mt-0.5 shrink-0 outline-none text-slate-500 group-hover:text-indigo-400 transition-colors">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {item.text}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        {item.type === 'document' ? (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded">
                            <FileText className="w-3 h-3" /> Document
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded">
                            <ImageIcon className="w-3 h-3" /> Photograph
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
