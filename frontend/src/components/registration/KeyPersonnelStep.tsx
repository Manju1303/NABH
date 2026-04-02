'use client';
import { Inp } from './FormControls';

export const KeyPersonnelStep = ({ data, update }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <Inp label="Medical Director/Superintendent *" v={data.medDirector} set={(v: any) => update({ medDirector: v })} />
    <Inp label="NABH/Quality Manager *" v={data.qualityManager} set={(v: any) => update({ qualityManager: v })} />
    <Inp label="Administrator/CEO *" v={data.administrator} set={(v: any) => update({ administrator: v })} />
  </div>
);
