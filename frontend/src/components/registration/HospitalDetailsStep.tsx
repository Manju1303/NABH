'use client';
import { Num, Sel } from './FormControls';

export const HospitalDetailsStep = ({ data, update }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Sel label="Hospital Type *" v={data.hospitalType} set={(v: any) => update({ hospitalType: v })} opts={['','Government','Private','NGO','Armed Forces']} labels={['Select Type','Government','Private','NGO','Armed Forces']} />
      <Sel label="Ownership Type *" v={data.ownershipType} set={(v: any) => update({ ownershipType: v })} opts={['','Proprietorship','Partnership','Trust','Society','Corporate']} labels={['Select','Proprietorship','Partnership','Trust','Society','Corporate']} />
      <Num label="Built-up Area (sq.mt) *" v={data.builtUpArea} set={(v: any) => update({ builtUpArea: v })} />
      <Num label="Number of Buildings *" v={data.buildings} set={(v: any) => update({ buildings: v })} />
    </div>
    <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Bed Strength</h4>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Num label="Sanctioned Beds *" v={data.sanctionedBeds} set={(v: any) => update({ sanctionedBeds: v })} />
      <Num label="Operational Beds *" v={data.operationalBeds} set={(v: any) => update({ operationalBeds: v })} />
      <Num label="Emergency Beds" v={data.emergencyBeds} set={(v: any) => update({ emergencyBeds: v })} />
      <Num label="ICU Beds" v={data.icuBeds} set={(v: any) => update({ icuBeds: v })} />
      <Num label="HDU Beds" v={data.hduBeds} set={(v: any) => update({ hduBeds: v })} />
      <Num label="Private Ward" v={data.privateBeds} set={(v: any) => update({ privateBeds: v })} />
      <Num label="Semi-Private" v={data.semiPrivateBeds} set={(v: any) => update({ semiPrivateBeds: v })} />
      <Num label="General Ward" v={data.generalBeds} set={(v: any) => update({ generalBeds: v })} />
    </div>
  </div>
);
