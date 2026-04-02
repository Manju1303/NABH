'use client';

import Link from 'next/link';
import { ClipboardList, FileCheck, Users, MessageSquareText, CalendarClock, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const tiles = [
  {
    label: 'Registration Form',
    description: 'Submit hospital details, infrastructure, staffing and clinical data for NABH evaluation.',
    href: '/dashboard/registration',
    icon: <ClipboardList className="w-7 h-7 text-white" />,
    border: 'rgba(0, 242, 255, 0.5)',
    glow: 'glow-cyan',
    accent: '#00F2FF'
  },
  {
    label: 'Assessment Results',
    description: 'View compliance scores, section-wise analysis and readiness status reports.',
    href: '/dashboard/results',
    icon: <FileCheck className="w-7 h-7 text-white" />,
    border: 'rgba(255, 0, 229, 0.5)',
    glow: 'glow-magenta',
    accent: '#FF00E5'
  },
  {
    label: 'Assessment Schedule',
    description: 'Track scheduled assessments, upcoming visits and assessment timelines.',
    href: '/dashboard/schedule',
    icon: <CalendarClock className="w-7 h-7 text-white" />,
    border: 'rgba(59, 130, 246, 0.5)',
    glow: 'glow-blue',
    accent: '#3B82F6'
  },
  {
    label: 'Committee Decision',
    description: 'Review recommendations and final decisions from the accreditation committee.',
    href: '/dashboard/committee',
    icon: <Users className="w-7 h-7 text-white" />,
    border: 'rgba(168, 85, 247, 0.5)',
    glow: 'shadow-purple-500/20',
    accent: '#A855F7'
  },
  {
    label: 'Remarks',
    description: 'View assessor notes, observations and additional remarks on submissions.',
    href: '/dashboard/remarks',
    icon: <MessageSquareText className="w-7 h-7 text-white" />,
    border: 'rgba(34, 197, 94, 0.5)',
    glow: 'shadow-green-500/20',
    accent: '#22C55E'
  },
  {
    label: 'QCI Checklist',
    description: 'Self-assessment checklist based on QCI Edition 2 for predictive compliance analysis.',
    href: '/dashboard/qci-checklist',
    icon: <ShieldCheck className="w-7 h-7 text-white" />,
    border: 'rgba(234, 179, 8, 0.5)',
    glow: 'shadow-yellow-500/20',
    accent: '#EAB308'
  },
];

export default function HospitalDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">
        <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Home</Link> 
        <span className="text-slate-700">/</span> 
        <span className="text-cyan-400">Hospital Dashboard</span>
      </div>

      {/* Welcome Banner */}
      <div className="relative mb-8 sm:mb-12 overflow-hidden rounded-2xl sm:rounded-[40px] p-6 sm:p-10 bg-slate-900 border border-white/5 shadow-2xl">
         <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500 blur-[120px] opacity-10"></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 flex items-center gap-3">
                    Welcome, Administrator <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4">Application ID: <span className="text-cyan-400">SHCO/2026/00001</span></p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Status: <span className="text-emerald-500 font-bold">Verification Active</span>
                </div>
            </div>
            <div className="hidden lg:block">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Overall Progress</p>
                    <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[65%] glow-cyan"></div>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Glow Title */}
      <h2 className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-8 text-center">Compliance Control Dashboard</h2>

      {/* Tile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-16">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className={`group relative rounded-2xl sm:rounded-[32px] overflow-hidden transition-all hover:-translate-y-2 bg-slate-900 border border-white/5 p-5 sm:p-8`}
            style={{ 
                boxShadow: `0 20px 40px -20px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Hover Glow Background */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
              style={{ background: `radial-gradient(circle at center, ${tile.accent}, transparent)` }}
            ></div>
            
            <div className="relative z-10">
                <div 
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110 duration-500"
                    style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid ${tile.border}` }}
                >
                    {tile.icon}
                </div>
                
                <h3 className="text-base sm:text-xl font-black text-white mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{tile.label}</h3>
                <p className="text-[11px] sm:text-xs font-bold leading-relaxed text-slate-500 group-hover:text-slate-300 transition-colors">{tile.description}</p>
            </div>

            {/* Bottom Glow bar */}
            <div 
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: tile.accent, boxShadow: `0 0 10px ${tile.accent}` }}
            ></div>
          </Link>
        ))}
      </div>

      {/* Security Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:py-10 border-t border-white/5">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-white/5">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                System Version 4.0.2-Stable
            </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span className="text-slate-500">Privacy Policy</span>
            <span className="text-slate-500">Terms of Use</span>
            <span className="flex items-center gap-2 text-white">Secure Platform <Zap className="w-2.5 h-2.5 inline fill-yellow-400 text-yellow-400" /></span>
        </div>
      </div>
    </div>
  );
}
