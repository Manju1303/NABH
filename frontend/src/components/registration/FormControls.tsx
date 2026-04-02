'use client';

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const Inp = ({ label, v, set, type = 'text', placeholder = '', error, touched }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 block">
        {label}
    </label>
    <div className="relative group">
        <input 
            type={type} 
            value={v} 
            onChange={e => set(e.target.value)} 
            placeholder={placeholder} 
            className={`w-full bg-slate-900 border-2 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none 
                ${error && touched ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/20' : 'border-white/5 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20'}
                ${!error && touched && v ? 'border-emerald-500/50' : ''}`}
            style={touched ? { paddingRight: '48px' } : {}}
        />
        {touched && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                {error ? <AlertCircle className="w-5 h-5 text-rose-500" /> : v ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : null}
            </div>
        )}
    </div>
    {error && touched && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-2">{error}</p>}
  </div>
);

export const Num = ({ label, v, set, error, touched }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 block">{label}</label>
    <div className="relative">
        <input 
            type="number" 
            value={v} 
            onChange={e => set(Number(e.target.value))} 
            className={`w-full bg-slate-900 border-2 rounded-2xl px-5 py-4 text-sm font-bold transition-all outline-none
                ${error && touched ? 'border-rose-500' : 'border-white/5 focus:border-cyan-500'}`}
        />
        {error && touched && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-2">{error}</p>}
    </div>
  </div>
);

export const Sel = ({ label, v, set, opts, labels }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1 block">{label}</label>
    <select 
        value={v} 
        onChange={e => set(e.target.value)} 
        className="w-full bg-slate-900 border-2 border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-cyan-500 transition-all outline-none appearance-none"
    >
      {opts.map((o: any, i: any) => <option key={i} value={o}>{labels ? labels[i] : o}</option>)}
    </select>
  </div>
);

export const Tog = ({ label, c, set }: any) => (
  <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-white/5 transition-all hover:bg-slate-800/50">
    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{label}</span>
    <div 
        onClick={() => set(!c)} 
        className={`relative w-14 h-7 rounded-full cursor-pointer transition-all duration-300 ${c ? 'bg-cyan-500 shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'bg-slate-800'}`}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${c ? 'left-8' : 'left-1'}`} />
    </div>
  </div>
);
