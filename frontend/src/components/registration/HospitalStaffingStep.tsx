'use client';
import { Tog, Sel, Inp } from './FormControls';
import { Plus, Trash } from 'lucide-react';

export const HospitalStaffingStep = ({ data, update }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Tog label="Nurses Present at Hospital?" c={data.nursesPresent} set={(v: any) => update({ nursesPresent: v })} />
      {!data.nursesPresent && (
        <Sel label="Insource or Outsource Nurses?" v={data.nursesOutsourced} set={(v: any) => update({ nursesOutsourced: v })} opts={['','Insourced','Outsourced']} labels={['Select','Insourced','Outsourced']} />
      )}
    </div>
    
    {data.nursesPresent && (
      <div className="p-5 rounded-lg border bg-white" style={{ borderColor: '#E0E0E0' }}>
        <div className="flex items-center justify-between mb-4 pb-2" style={{ borderBottom: '1px solid #E0E0E0' }}>
          <h4 className="text-sm font-semibold" style={{ color: '#00695C' }}>Nurse Details</h4>
          <button onClick={() => update({ nursesList: [...data.nursesList, {name: '', qualification: '', certificate_name: ''}] })} className="flex items-center gap-1 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded hover:bg-blue-100 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Nurse
          </button>
        </div>

        <div className="space-y-4">
          {data.nursesList.map((nurse: any, idx: number) => (
            <div key={idx} className="p-4 rounded border bg-gray-50 flex flex-col gap-4 relative">
              {data.nursesList.length > 1 && (
                <button onClick={() => update({ nursesList: data.nursesList.filter((_: any, i: any) => i !== idx) })} className="absolute right-3 top-3 text-red-500 hover:text-red-700">
                  <Trash className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Inp label="Name *" v={nurse.name} set={(v: any) => {
                  const copy = [...data.nursesList]; copy[idx].name = v; update({ nursesList: copy });
                }} />
                <Inp label="Qualification *" v={nurse.qualification} set={(v: any) => {
                  const copy = [...data.nursesList]; copy[idx].qualification = v; update({ nursesList: copy });
                }} />
                <Inp label="Certificate Name" v={nurse.certificate_name} set={(v: any) => {
                  const copy = [...data.nursesList]; copy[idx].certificate_name = v; update({ nursesList: copy });
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
