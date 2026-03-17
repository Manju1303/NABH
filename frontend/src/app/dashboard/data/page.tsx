'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';

interface DataRecord {
  id: number;
  submitted_at: string;
  hospital_name: string;
  registration_number: string;
  contact_email: string;
  total_sanctioned_beds: number;
  operational_beds: number;
  score: number;
  max_score: number;
  readiness_percentage: number;
  is_ready: boolean;
  section_scores: Record<string, number>;
}

export default function DataPage() {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    axios.get<{ total: number; records: DataRecord[] }>(`${API_BASE_URL}/api/submissions`)
      .then(res => { setRecords(res.data.records); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/submissions/${id}`);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch { alert('Failed to delete record.'); }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    window.open(`${API_BASE_URL}/api/export-csv`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="hope-breadcrumb mb-3"><a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Database Logs</span></div>

      <div className="hope-banner flex items-center justify-between mb-4">
        <span>Database Logs — All Submissions</span>
        <div className="flex gap-2">
          <button onClick={fetchData} className="px-3 py-1 text-xs rounded bg-white/20 hover:bg-white/30 transition-colors">↻ Refresh</button>
          <button onClick={handleExportCSV} disabled={records.length === 0} className="px-3 py-1 text-xs rounded bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-40">⬇ Export CSV</button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><span className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: '#00695C', borderTopColor: 'transparent' }}></span></div>
      ) : records.length === 0 ? (
        <div className="hope-card p-12 text-center">
          <p className="text-2xl mb-2">📋</p>
          <h2 className="text-lg font-semibold" style={{ color: '#424242' }}>No Records Found</h2>
          <p className="text-sm mt-1" style={{ color: '#9E9E9E' }}>Submit a hospital form from the <a href="/dashboard" style={{ color: '#0277BD' }}>Dashboard</a> to populate this table.</p>
        </div>
      ) : (
        <div className="hope-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ background: '#F5F7FA' }}>
                <tr className="text-xs uppercase tracking-wider" style={{ color: '#616161' }}>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Hospital</th>
                  <th className="px-5 py-3">Reg #</th>
                  <th className="px-5 py-3">Beds</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">Readiness</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition-colors" style={{ borderTop: '1px solid #E0E0E0' }}>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: '#9E9E9E' }}>#{rec.id}</td>
                    <td className="px-5 py-3 text-xs" style={{ color: '#616161' }}>{new Date(rec.submitted_at).toLocaleString()}</td>
                    <td className="px-5 py-3 font-medium" style={{ color: '#212121' }}>{rec.hospital_name}</td>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: '#616161' }}>{rec.registration_number}</td>
                    <td className="px-5 py-3" style={{ color: '#424242' }}>{rec.operational_beds}/{rec.total_sanctioned_beds}</td>
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
                      {rec.is_ready ? (
                        <span className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: '#E8F5E9', color: '#2E7D32' }}>Ready</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded text-xs font-medium" style={{ background: '#FFF8E1', color: '#F57F17' }}>Not Ready</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => handleDelete(rec.id)} className="p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer" style={{ color: '#C62828' }} title="Delete">🗑️</button>
                    </td>
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
