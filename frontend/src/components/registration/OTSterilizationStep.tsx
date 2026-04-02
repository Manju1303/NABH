'use client';
import { Num, Tog, Inp } from './FormControls';

export const OTSterilizationStep = ({ data, update }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Num label="Number of OTs *" v={data.numOTs} set={(v: any) => update({ numOTs: v })} />
      <Tog label="Performs Super-Speciality Surgeries?" c={data.superSpeciality} set={(v: any) => update({ superSpeciality: v })} />
      {data.superSpeciality && (
        <>
          <Tog label="Exclusive OT for Super-Speciality?" c={data.exclusiveOT} set={(v: any) => update({ exclusiveOT: v })} />
          <Num label="Number of Super-Speciality OTs" v={data.numSuperOTs} set={(v: any) => update({ numSuperOTs: v })} />
        </>
      )}
    </div>
    <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#00695C' }}>Sterilization Methods</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Tog label="Steam Autoclave" c={data.steamAutoclave} set={(v: any) => update({ steamAutoclave: v })} />
      <Tog label="ETO" c={data.eto} set={(v: any) => update({ eto: v })} />
      <Tog label="Plasma" c={data.plasma} set={(v: any) => update({ plasma: v })} />
      <Tog label="Flash" c={data.flash} set={(v: any) => update({ flash: v })} />
      <Inp label="Other" v={data.otherSterilization} set={(v: any) => update({ otherSterilization: v })} />
    </div>
  </div>
);
