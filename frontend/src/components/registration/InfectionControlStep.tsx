'use client';
import { Tog } from './FormControls';

export const InfectionControlStep = ({ data, update }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Tog label="Infection Control Committee? *" c={data.icCommittee} set={(v: any) => update({ icCommittee: v })} />
    <Tog label="Nurses Trained IC? *" c={data.nursesIC} set={(v: any) => update({ nursesIC: v })} />
    <Tog label="Hand Hygiene Audit? *" c={data.handHygiene} set={(v: any) => update({ handHygiene: v })} />
    <Tog label="BMW Authorization? *" c={data.bmwAuth} set={(v: any) => update({ bmwAuth: v })} />
    <Tog label="Colour Coded Bins? *" c={data.colorBins} set={(v: any) => update({ colorBins: v })} />
    <Tog label="Segregation Instructions? *" c={data.segregationInstr} set={(v: any) => update({ segregationInstr: v })} />
    <Tog label="Closed Transport? *" c={data.closedTransport} set={(v: any) => update({ closedTransport: v })} />
    <Tog label="Needle Cutters? *" c={data.needleCutters} set={(v: any) => update({ needleCutters: v })} />
    <Tog label="BMW Storage Facility? *" c={data.bmwStorage} set={(v: any) => update({ bmwStorage: v })} />
    <Tog label="Biohazard Sign? *" c={data.biohazardSign} set={(v: any) => update({ biohazardSign: v })} />
    <Tog label="Housekeeping Checklists?" c={data.housekeeping} set={(v: any) => update({ housekeeping: v })} />
    <Tog label="Laundry Segregation?" c={data.laundryProcess} set={(v: any) => update({ laundryProcess: v })} />
  </div>
);
