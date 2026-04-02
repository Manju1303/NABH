'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Deficiency {
  id: string;
  label: string;
  severity: 'critical' | 'high' | 'medium';
  description: string;
}

interface SubmissionRecord {
  id: number;
  submitted_at: string;
  hospital_name: string;
  registration_number: string;
  score: number;
  max_score: number;
  readiness_percentage: number;
  is_ready: boolean;
  section_scores: Record<string, number>;
  deficiencies?: Deficiency[];
  deficiency_count?: number;
}

export default function ResultsPage() {
  const [records, setRecords] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    axios.get<{ total: number; records: SubmissionRecord[] }>(`${API_BASE_URL}/api/submissions`)
      .then(res => { setRecords(res.data.records); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const latest = records.length > 0 ? records[records.length - 1] : null;
  const toggleExpand = (id: number) => setExpandedId(expandedId === id ? null : id);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="hg-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#94A3B8' }}>Assessment Results</span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Link href="/dashboard" className="hg-btn-outline p-2 rounded" title="Back to Dashboard">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold text-white">Assessment Results</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <span className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: '#00F2FF', borderTopColor: 'transparent' }} />
        </div>
      ) : records.length === 0 ? (
        <div className="hg-card p-12 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-slate-500" />
          <h2 className="text-base font-semibold text-white">No Results Available</h2>
          <p className="text-sm mt-2 text-slate-400">
            Please submit the <Link href="/dashboard/registration" className="text-cyan-400 hover:underline">Registration Form</Link> first to view assessment results.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="hg-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Submissions</p>
                  <p className="text-xl font-bold text-blue-400">{records.length}</p>
                </div>
              </div>
            </div>
            <div className="hg-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ready for Accreditation</p>
                  <p className="text-xl font-bold text-emerald-400">{records.filter(r => r.is_ready).length}</p>
                </div>
              </div>
            </div>
            <div className="hg-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.1)' }}>
                  <XCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Needs Improvement</p>
                  <p className="text-xl font-bold text-yellow-400">{records.filter(r => !r.is_ready).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Result Detail */}
          {latest && (
            <div className="hg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide mb-4 text-cyan-400">Latest Assessment — {latest.hospital_name}</h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {latest.is_ready ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-base font-semibold" style={{ color: latest.is_ready ? '#22C55E' : '#EAB308' }}>
                      {latest.is_ready ? 'Hospital is Accreditation Ready' : 'Actions Required — Deficiencies Found'}
                    </span>
                  </div>
                  <p className="text-sm mb-4 text-slate-400">
                    Score: <strong className="text-white">{latest.score}/{latest.max_score}</strong> ({Math.round(latest.readiness_percentage)}% readiness)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(latest.section_scores).map(([k, v]) => (
                      <span key={k} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {k.replace(/_/g, ' ')}: <strong className="text-cyan-400">{v}%</strong>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{
                    background: latest.is_ready ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                    color: latest.is_ready ? '#22C55E' : '#EAB308',
                    border: `3px solid ${latest.is_ready ? '#22C55E' : '#EAB308'}`
                  }}>
                  {Math.round(latest.readiness_percentage)}%
                </div>
              </div>
            </div>
          )}

          {/* Full Table */}
          <div className="hg-card overflow-hidden">
            <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-sm font-semibold text-white">Submission History & Detail Reports</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Hospital / Date</th>
                    <th className="px-5 py-3">Score</th>
                    <th className="px-5 py-3">Deficiencies</th>
                    <th className="px-5 py-3 text-right pr-10">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {records.slice().reverse().map(rec => (
                    <React.Fragment key={rec.id}>
                      <tr className={`${expandedId === rec.id ? 'bg-cyan-500/5' : 'hover:bg-white/5'} transition-colors cursor-pointer`} onClick={() => toggleExpand(rec.id)}>
                        <td className="px-5 py-4 font-mono text-xs text-slate-500">#{rec.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-sm text-white">{rec.hospital_name}</p>
                          <p className="text-[10px] uppercase font-bold tracking-tight mt-0.5 text-slate-500">
                            {new Date(rec.submitted_at).toLocaleDateString()} at {new Date(rec.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-12 h-1.5 rounded-full overflow-hidden bg-slate-800">
                                <div className="h-full" style={{ width: `${rec.readiness_percentage}%`, background: rec.is_ready ? '#22C55E' : '#EAB308' }} />
                             </div>
                             <span className="text-[11px] font-bold" style={{ color: rec.is_ready ? '#22C55E' : '#EAB308' }}>{Math.round(rec.readiness_percentage)}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {rec.deficiency_count && rec.deficiency_count > 0 ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                              <AlertCircle className="w-3 h-3" /> {rec.deficiency_count} Pending Fixes
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                              <CheckCircle className="w-3 h-3" /> All Criteria Met
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right pr-8">
                           <button className="flex items-center gap-1.5 ml-auto text-xs font-bold uppercase tracking-wider transition-colors text-cyan-400">
                              {expandedId === rec.id ? <><ChevronUp className="w-4 h-4" /> Close Report</> : <><ChevronDown className="w-4 h-4" /> View Report</>}
                           </button>
                        </td>
                      </tr>
                      {expandedId === rec.id && (
                        <tr style={{ background: 'rgba(0,242,255,0.02)' }}>
                          <td colSpan={5} className="px-10 py-6 border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="lg:col-span-1 border-r pr-8" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">Analysis Summary</h4>
                                <div className="space-y-4">
                                  {Object.entries(rec.section_scores).map(([k, v]) => (
                                    <div key={k}>
                                      <div className="flex justify-between text-xs mb-1">
                                        <span className="capitalize text-slate-400">{k.replace(/_/g, ' ')}</span>
                                        <span className="font-bold text-white">{v}%</span>
                                      </div>
                                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${v}%`, background: v >= 100 ? '#22C55E' : v >= 50 ? '#EAB308' : '#EF4444' }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="lg:col-span-2">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">Standard-wise Deficiency List</h4>
                                {rec.deficiencies && rec.deficiencies.length > 0 ? (
                                  <div className="space-y-3">
                                    {rec.deficiencies.map((def, idx) => (
                                      <div key={def.id || idx} className="p-3 rounded border flex items-start gap-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                                          def.severity === 'critical' ? 'bg-red-500 animate-pulse' : 
                                          def.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                                        }`} />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-xs text-white">{def.label}</span>
                                            <span className={`text-[10px] font-bold uppercase px-1.5 rounded ${
                                              def.severity === 'critical' ? 'text-red-400 bg-red-500/10' : 
                                              def.severity === 'high' ? 'text-orange-400 bg-orange-500/10' : 'text-yellow-400 bg-yellow-500/10'
                                            }`}>{def.severity}</span>
                                          </div>
                                          <p className="text-xs text-slate-400 leading-relaxed font-medium">{def.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                                    <p className="text-sm font-bold text-emerald-400">Perfect Compliance!</p>
                                    <p className="text-xs text-emerald-500/70">No mandatory deficiencies found for this submission.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
