'use client';
import { Num } from './FormControls';
import { Trash } from 'lucide-react';

const ListInput = ({ label, items, setItems, required }: any) => (
  <div className="space-y-3">
    <label className="hg-label font-semibold">{label}</label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((it: string, idx: number) => (
        <input key={idx} type="text" value={it} onChange={e => {
            const copy = [...items];
            copy[idx] = e.target.value;
            setItems(copy);
          }} 
          placeholder={`Rank #${idx + 1} ${idx < required ? '(Mandatory)' : ''}`}
          className={`hg-input ${idx < required && !it ? 'border-orange-300 bg-orange-50/30' : ''}`} 
        />
      ))}
    </div>
  </div>
);

export const ClinicalServicesStep = ({ data, update }: any) => (
  <div className="space-y-6">
    <ListInput label="Top 10 Clinical Services (first 5 required)" items={data.topServices} setItems={(v: any) => update({ topServices: v })} required={5} />
    <ListInput label="Top 10 Diagnoses for In-patients (first 5 required)" items={data.topDiagnoses} setItems={(v: any) => update({ topDiagnoses: v })} required={5} />
    <ListInput label="Top 10 Surgical Procedures (first 5 required)" items={data.topSurgeries} setItems={(v: any) => update({ topSurgeries: v })} required={5} />
    <Num label="Joint Replacements (last 1 year)" v={data.jointReplacements} set={(v: any) => update({ jointReplacements: v })} />
  </div>
);
