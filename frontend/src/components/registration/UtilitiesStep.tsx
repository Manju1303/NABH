'use client';
import { Tog, Num, Sel } from './FormControls';

export const UtilitiesStep = ({ data, update }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Tog label="UPS Present?" c={data.upsPresent} set={(v: any) => update({ upsPresent: v })} />
      {data.upsPresent && <Num label="UPS Capacity (KV) *" v={data.upsKV} set={(v: any) => update({ upsKV: v })} />}
      <Tog label="Generator Present?" c={data.genPresent} set={(v: any) => update({ genPresent: v })} />
      {data.genPresent && <Num label="Generator Capacity (KV) *" v={data.genKV} set={(v: any) => update({ genKV: v })} />}
      <Num label="Total Water Tanks *" v={data.waterTanks} set={(v: any) => update({ waterTanks: v })} />
      <Num label="Total Water Capacity (1000L) *" v={data.waterCapacity} set={(v: any) => update({ waterCapacity: v })} />
      <Tog label="Alternate Water Source?" c={data.altWater} set={(v: any) => update({ altWater: v })} />
      {data.altWater && <Sel label="Usage" v={data.altWaterUsage} set={(v: any) => update({ altWaterUsage: v })} opts={['','Drinking','Not for drinking']} />}
      <Num label="Trolley Elevators" v={data.trolleyElevators} set={(v: any) => update({ trolleyElevators: v })} />
      <Num label="People Elevators" v={data.peopleElevators} set={(v: any) => update({ peopleElevators: v })} />
    </div>
  </div>
);
