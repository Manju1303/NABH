'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import { Database, Trash2, RefreshCw, Download, HardDrive, FileJson } from 'lucide-react';

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
    } catch {
      alert('Failed to delete record.');
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    // Download the fully flattened CSV from the backend (all hospital fields + scores)
    window.open(`${API_BASE_URL}/api/export-csv`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <header className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
            Database Logs
          </h1>
          <p className="text-slate-400 font-light">All hospital submission records stored locally.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all text-sm cursor-pointer">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleExportCSV} disabled={records.length === 0} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 transition-all text-sm disabled:opacity-40 cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </header>

      {/* Storage info */}
      <div className="glass-card p-5 border border-slate-800 flex items-center gap-4 text-sm">
        <div className="p-3 bg-slate-900 rounded-xl">
          <HardDrive className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex-1">
          <p className="text-slate-300 font-medium">Storage: <span className="font-mono text-cyan-400">backend/nabh_data.json</span></p>
          <p className="text-slate-500 text-xs mt-0.5">Data persists on disk in JSON format. Survives server restarts. {records.length} record(s) stored.</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl">
          <FileJson className="w-5 h-5 text-slate-600" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <span className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></span>
        </div>
      ) : records.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4 border border-slate-800">
          <Database className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-slate-300">No Records Found</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Submit a hospital form from the <a href="/dashboard" className="text-indigo-400 underline hover:text-indigo-300">Compliance Form</a> page to populate this table.
          </p>
        </div>
      ) : (
        <div className="glass-card border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Hospital</th>
                  <th className="px-5 py-4">Reg #</th>
                  <th className="px-5 py-4">Beds</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4">Readiness</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr key={rec.id} className="border-t border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                    <td className="px-5 py-4 text-slate-500 font-mono">#{rec.id}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{new Date(rec.submitted_at).toLocaleString()}</td>
                    <td className="px-5 py-4 text-white font-medium">{rec.hospital_name}</td>
                    <td className="px-5 py-4 text-slate-400 font-mono">{rec.registration_number}</td>
                    <td className="px-5 py-4 text-slate-300">{rec.operational_beds}/{rec.total_sanctioned_beds}</td>
                    <td className="px-5 py-4 text-slate-300 font-mono">{rec.score}/{rec.max_score}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${rec.is_ready ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${rec.readiness_percentage}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{Math.round(rec.readiness_percentage)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {rec.is_ready ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Ready</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">Not Ready</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => handleDelete(rec.id)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete record">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
