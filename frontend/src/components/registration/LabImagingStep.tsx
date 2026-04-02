'use client';
import { Tog } from './FormControls';

export const LabImagingStep = ({ data, update }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Tog label="Lab Critical Result Reporting?" c={data.labCritical} set={(v: any) => update({ labCritical: v })} />
    <Tog label="Lab TAT Displayed?" c={data.labTAT} set={(v: any) => update({ labTAT: v })} />
    <Tog label="Lab Scope Documented?" c={data.labScope} set={(v: any) => update({ labScope: v })} />
    <Tog label="Imaging Critical Reporting?" c={data.imagingCritical} set={(v: any) => update({ imagingCritical: v })} />
    <Tog label="Imaging TAT Displayed?" c={data.imagingTAT} set={(v: any) => update({ imagingTAT: v })} />
    <Tog label="Imaging Scope Documented?" c={data.imagingScope} set={(v: any) => update({ imagingScope: v })} />
    <Tog label="Blood Bank Transfusion Forms?" c={data.bloodBankForms} set={(v: any) => update({ bloodBankForms: v })} />
    <Tog label="Blood Transfusion Committee?" c={data.bloodCommittee} set={(v: any) => update({ bloodCommittee: v })} />
  </div>
);
