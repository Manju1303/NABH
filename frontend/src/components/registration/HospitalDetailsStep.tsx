'use client';

import React from 'react';
import { Num, Sel } from './FormControls';
import { CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export const HospitalDetailsStep = ({ data, update }: any) => {
  const operational = Number(data.operationalBeds) || 0;
  const emergency = Number(data.emergencyBeds) || 0;
  const icu = Number(data.icuBeds) || 0;
  const hdu = Number(data.hduBeds) || 0;
  const privateW = Number(data.privateBeds) || 0;
  const semiPrivate = Number(data.semiPrivateBeds) || 0;
  const general = Number(data.generalBeds) || 0;

  const totalAllocated = emergency + icu + hdu + privateW + semiPrivate + general;
  const isMatch = operational > 0 && totalAllocated === operational;
  const isOver = totalAllocated > operational;
  const isUnder = operational > 0 && totalAllocated < operational;

  return (
    <div className="space-y-8">
      {/* Infrastructure Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Sel 
          label="Hospital Type *" 
          v={data.hospitalType} 
          set={(v: any) => update({ hospitalType: v })} 
          opts={['','Government','Private','NGO','Armed Forces']} 
          labels={['Select Type','Government','Private','NGO','Armed Forces']} 
        />
        <Sel 
          label="Ownership Type *" 
          v={data.ownershipType} 
          set={(v: any) => update({ ownershipType: v })} 
          opts={['','Proprietorship','Partnership','Trust','Society','Corporate']} 
          labels={['Select','Proprietorship','Partnership','Trust','Society','Corporate']} 
        />
        <Num label="Built-up Area (sq.mt) *" v={data.builtUpArea} set={(v: any) => update({ builtUpArea: v })} min={1} />
        <Num label="Number of Buildings *" v={data.buildings} set={(v: any) => update({ buildings: v })} min={1} />
      </div>

      <div className="pt-6 border-t border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" /> Bed Capacity & Ward Distribution
            </h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Ensure total allocated ward beds match Total Operational Beds.
            </p>
          </div>
        </div>

        {/* Primary Capacity Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Num label="Sanctioned Beds *" v={data.sanctionedBeds} set={(v: any) => update({ sanctionedBeds: v })} min={1} />
          <Num label="Operational Beds *" v={data.operationalBeds} set={(v: any) => update({ operationalBeds: v })} min={1} />
        </div>

        {/* Ward Breakdown Inputs */}
        <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl space-y-6">
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/5 pb-3">
            Departmental Ward Breakdown
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Num label="Emergency / Casualty" v={data.emergencyBeds} set={(v: any) => update({ emergencyBeds: v })} min={0} />
            <Num label="ICU Beds" v={data.icuBeds} set={(v: any) => update({ icuBeds: v })} min={0} />
            <Num label="HDU Beds" v={data.hduBeds} set={(v: any) => update({ hduBeds: v })} min={0} />
            <Num label="Private Ward" v={data.privateBeds} set={(v: any) => update({ privateBeds: v })} min={0} />
            <Num label="Semi-Private Ward" v={data.semiPrivateBeds} set={(v: any) => update({ semiPrivateBeds: v })} min={0} />
            <Num label="General / Maternity Ward" v={data.generalBeds} set={(v: any) => update({ generalBeds: v })} min={0} />
          </div>
        </div>

        {/* LIVE BED TALLY CALCULATOR CARD */}
        <div className={`p-6 rounded-3xl border transition-all ${
          isMatch 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : isOver 
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
            : isUnder 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
            : 'bg-white/5 border-white/10 text-slate-400'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isMatch ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-pulse" />
              ) : (
                <AlertTriangle className="w-6 h-6 shrink-0" />
              )}
              <div>
                <p className="text-xs font-black uppercase tracking-widest">
                  {isMatch 
                    ? '✓ PERFECT BED TALLY MATCH' 
                    : isOver 
                    ? `⚠ OVER-ALLOCATED: +${totalAllocated - operational} BEDS EXCESS` 
                    : isUnder 
                    ? `⚠ UNALLOCATED: ${operational - totalAllocated} BEDS REMAINING` 
                    : 'BED TALLY CALCULATOR'}
                </p>
                <p className="text-[10px] font-bold opacity-80 mt-0.5">
                  Operational: <span className="font-black">{operational}</span> | Allocated Breakdown Sum: <span className="font-black">{totalAllocated}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-black tabular-nums">{totalAllocated} / {operational}</span>
              <span className="text-[10px] font-bold block uppercase tracking-widest opacity-70">Beds Tally</span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isMatch ? 'bg-emerald-400' : isOver ? 'bg-rose-500' : 'bg-amber-400'
              }`} 
              style={{ width: `${Math.min(100, operational > 0 ? (totalAllocated / operational) * 100 : 0)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

