'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import { ArrowLeft, Users, FileCheck, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface Decision {
  id: number;
  date: string;
  committee: string;
  decision: 'Approved' | 'Deferred' | 'Pending Review';
  remarks: string;
  validity: string;
}

export default function CommitteePage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/committee`)
      .then(res => {
        setDecisions(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  return (
    <div className="max-w-5xl mx-auto">
      <div className="hg-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#94A3B8' }}>Committee Decision</span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Link href="/dashboard" className="hg-btn-outline p-2 rounded" title="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold text-white">Committee Decision</h1>
      </div>

      {loading ? (
        <div className="hg-card p-20 flex flex-col items-center justify-center gap-3">
           <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
           <p className="text-sm text-gray-500 font-medium tracking-wide">Retrieving Committee Decisions...</p>
        </div>
      ) : decisions.length === 0 ? (

        <div className="hg-card p-12 text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
            <Users className="w-7 h-7 text-purple-400" />
          </div>
          <h2 className="text-base font-semibold mb-2 text-white">No Committee Decisions Yet</h2>
          <p className="text-sm max-w-md mx-auto text-slate-400">
            Committee decisions will appear here after your hospital assessment has been reviewed by the NABH Accreditation Committee.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              Step 1: Complete Registration
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              Step 2: Assessment Completed
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
              Step 3: Committee Review
            </div>
          </div>
        </div>
      ) : (
        <div className="hg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Committee</th>
                  <th className="px-5 py-3">Decision</th>
                  <th className="px-5 py-3">Validity</th>
                  <th className="px-5 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map(d => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="px-5 py-3 text-xs text-slate-500">{d.date}</td>
                    <td className="px-5 py-3 font-medium text-white">{d.committee}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={
                        d.decision === 'Approved' ? { background: 'rgba(34,197,94,0.1)', color: '#22C55E' } :
                        d.decision === 'Deferred' ? { background: 'rgba(234,179,8,0.1)', color: '#EAB308' } :
                        { background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }
                      }>{d.decision}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{d.validity}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{d.remarks}</td>
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

