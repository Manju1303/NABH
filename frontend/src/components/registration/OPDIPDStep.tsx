'use client';
import { Num } from './FormControls';

export const OPDIPDStep = ({ data, update }: any) => (
  <div className="space-y-5">
    <p className="text-xs p-3 rounded" style={{ background: '#FFF8E1', color: '#F57F17', border: '1px solid #FFE082' }}>Note: Take data of the past 3 months for monthly averages.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Num label="OPD Patients (past 12 months) *" v={data.opd12} set={(v: any) => update({ opd12: v })} />
      <Num label="Admissions (past 12 months) *" v={data.admissions12} set={(v: any) => update({ admissions12: v })} />
      <Num label="Inpatient Days (Monthly Avg)" v={data.inpatientDays} set={(v: any) => update({ inpatientDays: v })} />
      <Num label="Available Bed Days (Monthly Avg)" v={data.availableBedDays} set={(v: any) => update({ availableBedDays: v })} />
      <Num label="Average Occupancy %" v={data.avgOccupancy} set={(v: any) => update({ avgOccupancy: v })} />
      <Num label="ICU Occupancy %" v={data.icuOccupancy} set={(v: any) => update({ icuOccupancy: v })} />
      <Num label="Ward Occupancy %" v={data.wardOccupancy} set={(v: any) => update({ wardOccupancy: v })} />
      <Num label="ICU Inpatient Days (Monthly Avg)" v={data.icuInpatientDays} set={(v: any) => update({ icuInpatientDays: v })} />
      <Num label="Available ICU Bed Days (Monthly Avg)" v={data.availableIcuBedDays} set={(v: any) => update({ availableIcuBedDays: v })} />
    </div>
  </div>
);
