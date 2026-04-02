'use client';
import { Tog, Sel } from './FormControls';

export const PatientProcessesStep = ({ data, update }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Tog label="Standard Consent Forms? *" c={data.consentForms} set={(v: any) => update({ consentForms: v })} />
      <Tog label="Records Audited Monthly?" c={data.recordsAudit} set={(v: any) => update({ recordsAudit: v })} />
      <Tog label="Patient Feedback System?" c={data.feedbackSystem} set={(v: any) => update({ feedbackSystem: v })} />
      <Tog label="Patient Rights Displayed? *" c={data.patientRights} set={(v: any) => update({ patientRights: v })} />
      <Tog label="Grievance Redressal?" c={data.grievance} set={(v: any) => update({ grievance: v })} />
      <Tog label="LASA Drugs Protocol?" c={data.lasaProtocol} set={(v: any) => update({ lasaProtocol: v })} />
      <Tog label="Fire NOC Valid? *" c={data.fireNOC} set={(v: any) => update({ fireNOC: v })} />
      <Tog label="Emergency 24x7? *" c={data.emergency24} set={(v: any) => update({ emergency24: v })} />
    </div>
    <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Signage</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Tog label="Radiation Hazard" c={data.radiationSign} set={(v: any) => update({ radiationSign: v })} />
      <Tog label="PCPNDT Decl." c={data.pcpndtDecl} set={(v: any) => update({ pcpndtDecl: v })} />
      <Tog label="Fire Exit Signage" c={data.fireExitSign} set={(v: any) => update({ fireExitSign: v })} />
      <Tog label="Directional Signage" c={data.dirSign} set={(v: any) => update({ dirSign: v })} />
      <Tog label="Departmental Signage" c={data.deptSign} set={(v: any) => update({ deptSign: v })} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Sel label="Breakdown Maintenance Type" v={data.breakdownMaint} set={(v: any) => update({ breakdownMaint: v })} opts={['In house','Outsourced']} />
      <Sel label="Preventive Maintenance Type" v={data.prevMaint} set={(v: any) => update({ prevMaint: v })} opts={['In house','Outsourced']} />
    </div>
  </div>
);
