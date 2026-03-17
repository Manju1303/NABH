'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

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
}

export default function ResultsPage() {
  const [records, setRecords] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<{ total: number; records: SubmissionRecord[] }>(`${API_BASE_URL}/api/submissions`)
      .then(res => { setRecords(res.data.records); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const latest = records.length > 0 ? records[records.length - 1] : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="hope-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Assessment Results</span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Link href="/dashboard" className="hope-btn-outline p-2 rounded" title="Back to Dashboard">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold" style={{ color: '#212121' }}>Assessment Results</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <span className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: '#00695C', borderTopColor: 'transparent' }} />
        </div>
      ) : records.length === 0 ? (
        <div className="hope-card p-12 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3" style={{ color: '#BDBDBD' }} />
          <h2 className="text-base font-semibold" style={{ color: '#424242' }}>No Results Available</h2>
          <p className="text-sm mt-2" style={{ color: '#9E9E9E' }}>
            Please submit the <Link href="/dashboard/registration" style={{ color: '#0277BD' }}>Registration Form</Link> first to view assessment results.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="hope-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#E3F2FD' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#1565C0' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#9E9E9E' }}>Total Submissions</p>
                  <p className="text-xl font-bold" style={{ color: '#1565C0' }}>{records.length}</p>
                </div>
              </div>
            </div>
            <div className="hope-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#E8F5E9' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#2E7D32' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#9E9E9E' }}>Ready for Accreditation</p>
                  <p className="text-xl font-bold" style={{ color: '#2E7D32' }}>{records.filter(r => r.is_ready).length}</p>
                </div>
              </div>
            </div>
            <div className="hope-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#FFF8E1' }}>
                  <XCircle className="w-5 h-5" style={{ color: '#F57F17' }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#9E9E9E' }}>Needs Improvement</p>
                  <p className="text-xl font-bold" style={{ color: '#F57F17' }}>{records.filter(r => !r.is_ready).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Result Detail */}
          {latest && (
            <div className="hope-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: '#00695C' }}>Latest Assessment — {latest.hospital_name}</h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {latest.is_ready ? (
                      <CheckCircle className="w-5 h-5" style={{ color: '#2E7D32' }} />
                    ) : (
                      <AlertTriangle className="w-5 h-5" style={{ color: '#F57F17' }} />
                    )}
                    <span className="text-base font-semibold" style={{ color: latest.is_ready ? '#2E7D32' : '#F57F17' }}>
                      {latest.is_ready ? 'Hospital is Accreditation Ready' : 'Actions Required — Deficiencies Found'}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#616161' }}>
                    Score: <strong>{latest.score}/{latest.max_score}</strong> ({Math.round(latest.readiness_percentage)}% readiness)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(latest.section_scores).map(([k, v]) => (
                      <span key={k} className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: '#F5F7FA', color: '#424242', border: '1px solid #E0E0E0' }}>
                        {k.replace(/_/g, ' ')}: <strong style={{ color: '#00695C' }}>{v}%</strong>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{
                    background: latest.is_ready ? '#E8F5E9' : '#FFF8E1',
                    color: latest.is_ready ? '#2E7D32' : '#F57F17',
                    border: `3px solid ${latest.is_ready ? '#2E7D32' : '#F57F17'}`
                  }}>
                  {Math.round(latest.readiness_percentage)}%
                </div>
              </div>
            </div>
          )}

          {/* Full Table */}
          <div className="hope-card overflow-hidden">
            <div className="p-4" style={{ borderBottom: '1px solid #E0E0E0' }}>
              <h2 className="text-sm font-semibold" style={{ color: '#212121' }}>Submission History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead style={{ background: '#F5F7FA' }}>
                  <tr className="text-xs uppercase tracking-wider" style={{ color: '#616161' }}>
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Hospital</th>
                    <th className="px-5 py-3">Score</th>
                    <th className="px-5 py-3">Readiness</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(rec => (
                    <tr key={rec.id} className="hover:bg-gray-50 transition-colors" style={{ borderTop: '1px solid #E0E0E0' }}>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: '#9E9E9E' }}>#{rec.id}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: '#616161' }}>{new Date(rec.submitted_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3 font-medium" style={{ color: '#212121' }}>{rec.hospital_name}</td>
                      <td className="px-5 py-3 font-mono" style={{ color: '#424242' }}>{rec.score}/{rec.max_score}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: '#E0E0E0' }}>
                            <div className="h-full rounded-full" style={{ width: `${rec.readiness_percentage}%`, background: rec.is_ready ? '#2E7D32' : '#F57F17' }} />
                          </div>
                          <span className="text-xs" style={{ color: '#9E9E9E' }}>{Math.round(rec.readiness_percentage)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-1 rounded text-xs font-medium" style={rec.is_ready ? { background: '#E8F5E9', color: '#2E7D32' } : { background: '#FFF8E1', color: '#F57F17' }}>
                          {rec.is_ready ? 'Ready' : 'Not Ready'}
                        </span>
                      </td>
                    </tr>
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
