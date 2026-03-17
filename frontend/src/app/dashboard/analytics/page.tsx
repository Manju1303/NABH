'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';

interface SubmissionRecord { hospital_name: string; registration_number: string; score: number; readiness_percentage: number; is_ready: boolean; }
interface SubmissionsResponse { total: number; records: SubmissionRecord[]; }

export default function AnalyticsPage() {
  const [data, setData] = useState<SubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<SubmissionsResponse>(`${API_BASE_URL}/api/submissions`)
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalHospitals = data?.total ?? 0;
  const records = data?.records ?? [];
  const avgScore = records.length > 0 ? Math.round(records.reduce((s, r) => s + r.readiness_percentage, 0) / records.length) : 0;
  const readyCount = records.filter(r => r.is_ready).length;
  const notReadyCount = totalHospitals - readyCount;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="hope-breadcrumb mb-3"><a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Analytics</span></div>
      <div className="hope-banner mb-6">Analytics Panel — Aggregated Insights</div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><span className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: '#00695C', borderTopColor: 'transparent' }}></span></div>
      ) : totalHospitals === 0 ? (
        <div className="hope-card p-12 text-center">
          <p className="text-2xl mb-2">📊</p>
          <h2 className="text-lg font-semibold" style={{ color: '#424242' }}>No Submissions Yet</h2>
          <p className="text-sm mt-1" style={{ color: '#9E9E9E' }}>Submit from the <a href="/dashboard" style={{ color: '#0277BD' }}>Dashboard</a> to see analytics.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPI label="Total Hospitals" value={totalHospitals.toString()} icon="🏥" color="#1565C0" />
            <KPI label="Avg Readiness" value={`${avgScore}%`} icon="📈" color="#2E7D32" />
            <KPI label="Ready for NABH" value={readyCount.toString()} icon="✅" color="#00695C" />
            <KPI label="Not Ready" value={notReadyCount.toString()} icon="⚠️" color="#F57F17" />
          </div>

          <div className="hope-card p-6 mb-6">
            <h2 className="text-base font-semibold mb-4" style={{ color: '#212121' }}>Readiness Distribution</h2>
            <div className="w-full h-6 rounded-full overflow-hidden flex" style={{ background: '#E0E0E0' }}>
              <div className="h-full transition-all duration-1000" style={{ width: `${totalHospitals > 0 ? (readyCount / totalHospitals) * 100 : 0}%`, background: '#2E7D32' }} />
              <div className="h-full transition-all duration-1000" style={{ width: `${totalHospitals > 0 ? (notReadyCount / totalHospitals) * 100 : 0}%`, background: '#F57F17' }} />
            </div>
            <div className="flex gap-6 mt-3 text-sm" style={{ color: '#616161' }}>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#2E7D32' }}></span> Ready ({readyCount})</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#F57F17' }}></span> Not Ready ({notReadyCount})</span>
            </div>
          </div>

          <div className="hope-card overflow-hidden">
            <div className="p-4" style={{ borderBottom: '1px solid #E0E0E0' }}><h2 className="text-base font-semibold" style={{ color: '#212121' }}>Submission History</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead style={{ background: '#F5F7FA' }}>
                  <tr className="text-xs uppercase tracking-wider" style={{ color: '#616161' }}>
                    <th className="px-5 py-3">#</th><th className="px-5 py-3">Hospital</th><th className="px-5 py-3">Reg.</th><th className="px-5 py-3">Score</th><th className="px-5 py-3">Readiness</th><th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors" style={{ borderTop: '1px solid #E0E0E0' }}>
                      <td className="px-5 py-3" style={{ color: '#9E9E9E' }}>{i + 1}</td>
                      <td className="px-5 py-3 font-medium" style={{ color: '#212121' }}>{rec.hospital_name}</td>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: '#616161' }}>{rec.registration_number}</td>
                      <td className="px-5 py-3 font-mono" style={{ color: '#424242' }}>{rec.score}/100</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: '#E0E0E0' }}>
                            <div className="h-full rounded-full" style={{ width: `${rec.readiness_percentage}%`, background: rec.is_ready ? '#2E7D32' : '#F57F17' }} />
                          </div>
                          <span className="text-xs" style={{ color: '#9E9E9E' }}>{Math.round(rec.readiness_percentage)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {rec.is_ready ? (
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: '#E8F5E9', color: '#2E7D32' }}>Ready</span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: '#FFF8E1', color: '#F57F17' }}>Not Ready</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KPI({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="hope-card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs" style={{ color: '#9E9E9E' }}>{label}</p>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        </div>
      </div>
    </div>
  );
}
