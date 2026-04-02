'use client';
import { Sel, Tog, Inp } from './FormControls';

export const AccreditationStep = ({ data, update }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Sel label="Accreditation Type Applied For" v={data.accredType} set={(v: any) => update({ accredType: v })} opts={['Entry Level','Full Accreditation','Progressive']} />
      <Tog label="Previously Accredited?" c={data.prevAccred} set={(v: any) => update({ prevAccred: v })} />
      {data.prevAccred && (
        <Inp label="Date of Previous Accreditation" v={data.prevAccredDate} set={(v: any) => update({ prevAccredDate: v })} type="date" />
      )}
    </div>
    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">!</div>
      <p className="text-sm text-blue-800 leading-relaxed font-medium">Please review all sections carefully. Once submitted, your data will be evaluated against NABH Entry Level standards, and deficiencies will be flagged automatically.</p>
    </div>
  </div>
);
