'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp, TrendingDown, Building2, ShieldCheck, AlertTriangle,
  Activity, Users, HeartPulse, Flame, Trash2, FileCheck, BrainCircuit
} from 'lucide-react';

interface SectionScores {
  infrastructure: number;
  infection_control: number;
  patient_documentation: number;
  biomedical_waste: number;
  safety_management: number;
  hr_training: number;
  clinical_services: number;
}

interface SubmissionRecord {
  hospital_name: string;
  registration_number: string;
  score: number;
  readiness_percentage: number;
  is_ready: boolean;
  form_data: Record<string, unknown>;
}

interface SubmissionsResponse {
  total: number;
  records: SubmissionRecord[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<SubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<SubmissionsResponse>('http://localhost:8000/api/submissions')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalHospitals = data?.total ?? 0;
  const records = data?.records ?? [];
  const avgScore = records.length > 0
    ? Math.round(records.reduce((s, r) => s + r.readiness_percentage, 0) / records.length)
    : 0;
  const readyCount = records.filter(r => r.is_ready).length;
  const notReadyCount = totalHospitals - readyCount;

  // Aggregate section-level scores across all submissions
  const sectionAverages: SectionScores = {
    infrastructure: 0, infection_control: 0, patient_documentation: 0,
    biomedical_waste: 0, safety_management: 0, hr_training: 0, clinical_services: 0,
  };

  if (records.length > 0) {
    records.forEach(r => {
      const formResult = r.form_data as Record<string, unknown>;
      // We'll recompute section scores from the stored score data
      // For now aggregate from the record scores
    });
  }

  // Find common compliance gaps (sections with lowest scores)
  const sectionLabels: { key: string; label: string; max: number; icon: React.ReactNode; color: string }[] = [
    { key: 'infrastructure', label: 'Infrastructure', max: 20, icon: <Building2 className="w-5 h-5" />, color: 'text-blue-400' },
    { key: 'infection_control', label: 'Infection Control', max: 20, icon: <HeartPulse className="w-5 h-5" />, color: 'text-emerald-400' },
    { key: 'patient_documentation', label: 'Patient Documentation', max: 20, icon: <FileCheck className="w-5 h-5" />, color: 'text-violet-400' },
    { key: 'biomedical_waste', label: 'Biomedical Waste', max: 10, icon: <Trash2 className="w-5 h-5" />, color: 'text-amber-400' },
    { key: 'safety_management', label: 'Safety Management', max: 10, icon: <Flame className="w-5 h-5" />, color: 'text-red-400' },
    { key: 'hr_training', label: 'HR Training', max: 10, icon: <Users className="w-5 h-5" />, color: 'text-cyan-400' },
    { key: 'clinical_services', label: 'Clinical Services', max: 10, icon: <Activity className="w-5 h-5" />, color: 'text-pink-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <header className="border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
          Analytics Panel
        </h1>
        <p className="text-slate-400 font-light">Aggregated insights across all hospital submissions.</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></span>
        </div>
      ) : totalHospitals === 0 ? (
        <div className="glass-card p-12 text-center space-y-4 border border-slate-800">
          <BrainCircuit className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-slate-300">No Submissions Yet</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Head to the <a href="/dashboard" className="text-indigo-400 underline hover:text-indigo-300">Compliance Form</a> and submit at least one hospital record to see analytics here.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              icon={<Building2 className="w-6 h-6 text-blue-400" />}
              label="Total Hospitals"
              value={totalHospitals.toString()}
              accent="border-blue-500/30"
            />
            <KPICard
              icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
              label="Avg Readiness"
              value={`${avgScore}%`}
              accent="border-emerald-500/30"
            />
            <KPICard
              icon={<ShieldCheck className="w-6 h-6 text-green-400" />}
              label="Ready for NABH"
              value={readyCount.toString()}
              accent="border-green-500/30"
            />
            <KPICard
              icon={<AlertTriangle className="w-6 h-6 text-amber-400" />}
              label="Not Ready"
              value={notReadyCount.toString()}
              accent="border-amber-500/30"
            />
          </div>

          {/* Readiness Distribution Bar */}
          <div className="glass-card p-8 border border-slate-800 space-y-6">
            <h2 className="text-xl font-semibold text-slate-200">Readiness Distribution</h2>
            <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-1000"
                style={{ width: `${totalHospitals > 0 ? (readyCount / totalHospitals) * 100 : 0}%` }} />
              <div className="h-full bg-gradient-to-r from-amber-500 to-red-400 transition-all duration-1000"
                style={{ width: `${totalHospitals > 0 ? (notReadyCount / totalHospitals) * 100 : 0}%` }} />
            </div>
            <div className="flex gap-8 text-sm text-slate-400">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Ready ({readyCount})</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Not Ready ({notReadyCount})</span>
            </div>
          </div>

          {/* NABH Section Score Breakdown */}
          <div className="glass-card p-8 border border-slate-800 space-y-6">
            <h2 className="text-xl font-semibold text-slate-200">NABH Compliance Sections (Weight Distribution)</h2>
            <div className="space-y-4">
              {sectionLabels.map(sec => (
                <div key={sec.key} className="flex items-center gap-4 group">
                  <div className={`p-2 rounded-lg bg-slate-900 ${sec.color}`}>{sec.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-300">{sec.label}</span>
                      <span className="text-sm text-slate-500">{sec.max} pts max</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 group-hover:shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                        style={{ width: `${(sec.max / 20) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hospital Records Table */}
          <div className="glass-card border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-slate-200">Submission History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Hospital</th>
                    <th className="px-6 py-4">Reg. Number</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Readiness</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, i) => (
                    <tr key={i} className="border-t border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                      <td className="px-6 py-4 text-white font-medium">{rec.hospital_name}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono">{rec.registration_number}</td>
                      <td className="px-6 py-4 text-slate-300 font-mono">{rec.score}/100</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${rec.is_ready ? 'bg-emerald-500' : 'bg-amber-500'}`}
                              style={{ width: `${rec.readiness_percentage}%` }} />
                          </div>
                          <span className="text-slate-400 text-xs">{Math.round(rec.readiness_percentage)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {rec.is_ready ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Ready</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">Not Ready</span>
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

function KPICard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className={`glass-card p-6 border ${accent} hover:scale-[1.03] transition-all duration-300 cursor-default group`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-900/60 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
