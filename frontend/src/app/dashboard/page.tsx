'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardList, FileCheck, Users, MessageSquareText, CalendarClock, ShieldCheck, Zap, Sparkles, Download, Loader2 } from 'lucide-react';
import api, { API_BASE_URL, getMe } from '@/lib/api';

const tiles = [
  {
    label: 'Registration Form',
    description: 'Submit hospital details, infrastructure, staffing and clinical data for NABH evaluation.',
    href: '/dashboard/registration',
    icon: <ClipboardList />,
    border: 'rgba(0, 242, 255, 0.4)',
    accent: 'from-cyan-400 to-blue-500'
  },
  {
    label: 'Assessment Results',
    description: 'View compliance scores, section-wise analysis and readiness status reports.',
    href: '/dashboard/results',
    icon: <FileCheck />,
    border: 'rgba(255, 0, 229, 0.4)',
    accent: 'from-fuchsia-500 to-purple-600'
  },
  {
    label: 'Assessment Schedule',
    description: 'Track scheduled assessments, upcoming visits and assessment timelines.',
    href: '/dashboard/schedule',
    icon: <CalendarClock />,
    border: 'rgba(59, 130, 246, 0.4)',
    accent: 'from-blue-500 to-indigo-600'
  },
  {
    label: 'Committee Decision',
    description: 'Review recommendations and final decisions from the accreditation committee.',
    href: '/dashboard/committee',
    icon: <Users />,
    border: 'rgba(168, 85, 247, 0.4)',
    accent: 'from-purple-500 to-pink-500'
  },
  {
    label: 'Remarks',
    description: 'View assessor notes, observations and additional remarks on submissions.',
    href: '/dashboard/remarks',
    icon: <MessageSquareText />,
    border: 'rgba(34, 197, 94, 0.4)',
    accent: 'from-emerald-400 to-teal-500'
  },
  {
    label: 'QCI Checklist',
    description: 'Self-assessment checklist based on QCI Edition 2 for predictive compliance analysis.',
    href: '/dashboard/qci-checklist',
    icon: <ShieldCheck />,
    border: 'rgba(234, 179, 8, 0.4)',
    accent: 'from-amber-400 to-orange-500'
  },
  {
    label: 'Remediation Tracking',
    description: 'Track progress on fixing identified deficiencies and upload closure evidence.',
    href: '/dashboard/remediation',
    icon: <Zap />,
    border: 'rgba(239, 68, 68, 0.4)',
    accent: 'from-rose-500 to-red-600'
  },
];

export default function HospitalDashboard() {
  const [downloading, setDownloading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await getMe();
        setUser(u);
      } catch (e) {
        console.error("Failed to fetch user profile", e);
      }
    };
    fetchUser();
  }, []);

  const handleDownloadReport = async () => {
    if (!user?.hospital_id && user?.role !== 'admin') {
       alert('Complete your registration first to generate a report.');
       return;
    }
    
    setDownloading(true);
    try {
      const token = localStorage.getItem('nabh_token');
      // Use the actual hospital_id or fallback to 1 for admins/demo
      const targetId = user?.hospital_id || 1; 

      const res = await fetch(`${API_BASE_URL}/api/reports/download/${targetId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NABH_Readiness_Report_${targetId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Could not download report. Make sure you have submitted the registration form.');
      }
    } catch (e) {
      alert('Network error while downloading report.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">
        <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Home</Link> 
        <span className="text-slate-700">/</span> 
        <span className="text-cyan-400">Hospital Dashboard</span>
      </div>

      {/* Welcome Banner */}
      <div className="glass-card mb-8 sm:mb-12 rounded-[32px] p-8 sm:p-10 border border-white/10 shadow-2xl overflow-hidden">
         <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500 blur-[120px] opacity-10"></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    Welcome back <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4">Portal Status: <span className="text-cyan-400">Verified System Administrator</span></p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                      <span className="text-emerald-500 font-bold">Secure Connection</span>
                  </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <button 
                  onClick={handleDownloadReport}
                  disabled={downloading}
                  className="hg-btn-primary flex items-center justify-center gap-3 active:scale-95"
                >
                  {downloading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {downloading ? 'Preparing Report...' : 'Download PDF Report'}
                </button>
                <div className="hidden lg:block p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Accreditation Readiness</p>
                    <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[78%]" style={{ boxShadow: '0 0 10px rgba(0, 242, 255, 0.4)' }}></div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Glow Title */}
      <h2 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-10 text-center opacity-80">Compliance Intelligence Matrix</h2>

      {/* Tile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group glass-card rounded-[24px] p-6 sm:p-8 transition-all hover:scale-[1.02]"
          >
            <div className="relative z-10">
                <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 bg-slate-800/50 group-hover:bg-gradient-to-br ${tile.accent}`}
                    style={{ border: `1px solid ${tile.border}` }}
                >
                    {React.cloneElement(tile.icon as React.ReactElement<any>, { className: 'w-6 h-6 text-white group-hover:scale-110 transition-transform' })}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-glow-cyan transition-all uppercase tracking-tight">{tile.label}</h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500 group-hover:text-slate-300 transition-colors">{tile.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Security Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-white/5">
        <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-md">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Military Grade Encryption</span>
            </div>
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] cursor-pointer hover:text-rose-500 transition-colors" onClick={async () => {
                if (user?.role !== 'admin') {
                    alert('Only System Administrators can perform a reset.');
                    return;
                }
                const resetKey = prompt('CRITICAL: Enter SYSTEM_RESET_KEY to confirm total data wipe:');
                if(!resetKey) return;

                if(confirm('FINAL WARNING: This will wipe the ENTIRE database. Proceed?')) {
                    const token = localStorage.getItem('nabh_token');
                    try {
                        const res = await fetch(`${API_BASE_URL}/api/system/factory-reset`, { 
                            method: 'DELETE',
                            headers: { 
                                'Authorization': `Bearer ${token}`,
                                'X-System-Reset-Key': resetKey
                            }
                        });
                        if(res.ok) {
                             alert('System Reset Successful. All data wiped.');
                             localStorage.clear();
                             window.location.reload();
                        } else {
                             const err = await res.json();
                             alert(`Access Denied: ${err.detail || 'Wrong Key'}`);
                        }
                    } catch(e) {
                         alert('Network error during reset.');
                    }
                }
            }}>
                Factory Reset
            </div>
        </div>
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
            <span className="hover:text-white transition-colors cursor-pointer">Security Audit v4.0</span>
            <span className="flex items-center gap-2 text-slate-400">Protected by HealthGuard AI <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" /></span>
        </div>
      </div>
    </div>
  );
}
