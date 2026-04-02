'use client';
import Link from 'next/link';
import { Building2, ShieldCheck, BarChart3, FileText, ArrowRight, Cpu, Zap, Activity, Target, BrainCircuit, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-[Outfit,sans-serif] selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background Neon Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[150px] pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-3xl border-b border-cyan-500/10 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between shadow-[0_0_30px_rgba(0,242,255,0.05)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.1)]">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                HEALTHGUARD <span className="text-cyan-400 text-glow-cyan uppercase">AI</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] -mt-1">Neural Verification Matrix</p>
          </div>
        </div>
        <Link href="/login" className="px-4 sm:px-8 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all active:scale-95">
          LOGIN
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-10 pt-20 sm:pt-32 pb-24 sm:pb-40 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,242,255,0.25)] animate-in slide-in-from-top-8 duration-1000">
          <ShieldCheck className="w-4 h-4 animate-bounce" /> Accreditation Protocol v5.2 Ready
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 leading-[0.85] tracking-tighter uppercase text-glow-cyan animate-in fade-in zoom-in-95 duration-700">
            Automated <br />Compliance <br /><span className="text-cyan-400">Inference.</span>
        </h1>

        <p className="text-base sm:text-xl md:text-2xl mb-10 sm:mb-16 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed animate-in slide-in-from-bottom-8 duration-700">
            A specialized decision support system utilizing a hybrid rule-based and linguistic audit matrix to track hospital readiness against 210+ mandatory compliance standards.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in slide-in-from-bottom-12 duration-700">
            <Link href="/login" className="px-10 sm:px-16 py-4 sm:py-6 bg-cyan-500 text-black text-xs sm:text-sm font-black uppercase tracking-[0.3em] rounded-[32px] shadow-[0_0_50px_rgba(0,242,255,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-4 group">
              ACCESS DASHBOARD <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 text-xs font-black text-slate-600 uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-emerald-500 glow-cyan"></div>
               SYSTEM STATUS: NOMINAL
            </div>
        </div>

        {/* Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-20 sm:mt-40 w-full max-w-6xl px-2">
            <IntelligenceCard 
                title="Deterministic Matrix" 
                desc="Evaluate hospital operational nodes against binary mandatory thresholds with zero-tolerance gap detection." 
                icon={<Activity className="w-8 h-8 text-cyan-400" />} 
                color="rgba(0, 242, 255, 0.1)"
            />
            <IntelligenceCard 
                title="Neural Gap Sync" 
                desc="Automatic severity flagging of non-compliant certificates with AI-driven remediation timeline projections." 
                icon={<BrainCircuit className="w-8 h-8 text-[#FF00E5]" />} 
                color="rgba(255, 0, 229, 0.1)"
            />
            <IntelligenceCard 
                title="Predictive Audit" 
                desc="Generate probability-weighted reports of passing official assessments based on current matrix synchronization." 
                icon={<Target className="w-8 h-8 text-yellow-400" />} 
                color="rgba(234, 179, 8, 0.1)"
            />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 sm:py-12 px-6 sm:px-10 border-t border-white/5 bg-[#020617]/50 backdrop-blur-xl flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Copyright © 2026 Developed by <span className="text-white">MANJU1303</span>
                </p>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">HealthGuard AI Engine v4.0.2</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <span className="text-slate-600">Privacy Policy</span>
            <span className="text-slate-600">Terms of Use</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/5 border border-cyan-500/20 rounded-lg text-cyan-500">
               <ShieldCheck className="w-3 h-3" /> SECURITY_VERIFIED
            </div>
        </div>
      </footer>

      <style jsx global>{`
        .text-glow-cyan { text-shadow: 0 0 15px rgba(0, 242, 255, 0.5); }
        .glow-cyan { box-shadow: 0 0 15px rgba(0, 242, 255, 0.4); }
      `}</style>
    </div>
  );
}

function IntelligenceCard({ title, desc, icon, color }: { title: string; desc: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-10 rounded-[40px] bg-slate-900 border border-white/5 hover:border-white/10 transition-all group hover:-translate-y-4 duration-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{ background: color }}></div>
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 transition-all group-hover:scale-110 duration-500">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-sm font-medium text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors">{desc}</p>
      </div>
    </div>
  );
}
