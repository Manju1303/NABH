'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, FileCheck, Clock, AlertCircle } from 'lucide-react';

interface Decision {
  id: number;
  date: string;
  committee: string;
  decision: 'Approved' | 'Deferred' | 'Pending Review';
  remarks: string;
  validity: string;
}

const sampleDecisions: Decision[] = [];

export default function CommitteePage() {
  const [decisions] = useState<Decision[]>(sampleDecisions);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="hope-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Committee Decision</span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Link href="/dashboard" className="hope-btn-outline p-2 rounded" title="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold" style={{ color: '#212121' }}>Committee Decision</h1>
      </div>

      {decisions.length === 0 ? (
        <div className="hope-card p-12 text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#F3E5F5' }}>
            <Users className="w-7 h-7" style={{ color: '#6A1B9A' }} />
          </div>
          <h2 className="text-base font-semibold mb-2" style={{ color: '#424242' }}>No Committee Decisions Yet</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#9E9E9E' }}>
            Committee decisions will appear here after your hospital assessment has been reviewed by the NABH Accreditation Committee.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-xs" style={{ color: '#616161' }}>
              <FileCheck className="w-3.5 h-3.5" style={{ color: '#1565C0' }} />
              Step 1: Complete Registration
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#616161' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: '#F57F17' }} />
              Step 2: Assessment Completed
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#616161' }}>
              <AlertCircle className="w-3.5 h-3.5" style={{ color: '#6A1B9A' }} />
              Step 3: Committee Review
            </div>
          </div>
        </div>
      ) : (
        <div className="hope-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ background: '#F5F7FA' }}>
                <tr className="text-xs uppercase tracking-wider" style={{ color: '#616161' }}>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Committee</th>
                  <th className="px-5 py-3">Decision</th>
                  <th className="px-5 py-3">Validity</th>
                  <th className="px-5 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors" style={{ borderTop: '1px solid #E0E0E0' }}>
                    <td className="px-5 py-3 text-xs" style={{ color: '#616161' }}>{d.date}</td>
                    <td className="px-5 py-3 font-medium" style={{ color: '#212121' }}>{d.committee}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={
                        d.decision === 'Approved' ? { background: '#E8F5E9', color: '#2E7D32' } :
                        d.decision === 'Deferred' ? { background: '#FFF8E1', color: '#F57F17' } :
                        { background: '#E3F2FD', color: '#1565C0' }
                      }>{d.decision}</span>
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: '#616161' }}>{d.validity}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: '#616161' }}>{d.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
