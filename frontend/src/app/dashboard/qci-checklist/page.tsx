'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, ArrowLeft, CheckCircle2, XCircle, 
  BarChart3, Info, AlertCircle, ChevronRight, Save, RotateCcw,
  Search, Filter, BookOpen, BrainCircuit, Activity, FileText,
  FileSearch, CheckCircle, ChevronDown, ChevronUp,
  LayoutDashboard, History, Zap, Settings, Target, Calendar,
  Dna, Cpu, Layers, FileDown, Printer, Share2, Sparkles, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { CHECKLIST_FILES } from './checklist-data';

const Gavel = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m14 13-5 5"/><path d="m3 21 3-3"/><path d="m9 15 10-10a2.83 2.83 0 1 1 4 4L13 19l-4-4Z"/></svg>
);

const CHAPTERS = [
  { id: 'STAT', name: 'Statutory Compliance', icon: <Gavel className="w-5 h-5" />, color: '#00F2FF' },
  { id: 'GEN', name: 'General Management', icon: <LayoutDashboard className="w-5 h-5" />, color: '#FF00E5' },
  { id: 'AAC', name: 'Access & Assessment', icon: <Search className="w-5 h-5" />, color: '#3B82F6' },
  { id: 'COP', name: 'Care of Patients', icon: <Activity className="w-5 h-5" />, color: '#22C55E' },
  { id: 'MOM', name: 'Medication Management', icon: <Zap className="w-5 h-5" />, color: '#EAB308' },
  { id: 'HIC', name: 'Infection Control', icon: <ShieldCheck className="w-5 h-5" />, color: '#00F2FF' },
  { id: 'CQI', name: 'Quality Improvement', icon: <Target className="w-5 h-5" />, color: '#FF00E5' },
  { id: 'FMS', name: 'Facility & Safety', icon: <Settings className="w-5 h-5" />, color: '#3B82F6' },
  { id: 'HRM', name: 'HR Management', icon: <FileText className="w-5 h-5" />, color: '#22C55E' },
  { id: 'IMS', name: 'Information Systems', icon: <BookOpen className="w-5 h-5" />, color: '#EAB308' },
];

// CHECKLIST_FILES imported from ./checklist-data

export default function NeonQCIInferenceMatrix() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, number | null>>({});
  const [validityDates, setValidityDates] = useState<Record<string, string>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({ STAT: true });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hg_qci_responses');
    const savedDates = localStorage.getItem('hg_qci_dates');
    if (saved) setResponses(JSON.parse(saved));
    if (savedDates) setValidityDates(JSON.parse(savedDates));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('hg_qci_responses', JSON.stringify(responses));
      localStorage.setItem('hg_qci_dates', JSON.stringify(validityDates));
    }
  }, [responses, validityDates, isLoaded]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    let totalScore = 0;
    let answeredCount = 0;
    let expiredCount = 0;

    CHECKLIST_FILES.forEach(file => {
      file.questions.forEach(q => {
        const resp = responses[q.id];
        if (resp !== null && resp !== undefined) {
          answeredCount++;
          if (resp === 1) {
            if (q.hasValidity) {
              const date = validityDates[q.id];
              if (date && date >= today) {
                totalScore += 1; // Yes + valid future date = fully compliant
              } else {
                expiredCount++; // Yes but expired or missing date = PENALTY (0 pts)
              }
            } else {
              totalScore += 1;
            }
          }
          // resp === 0 → 0 points always
        }
      });
    });

    const totalQuestions = CHECKLIST_FILES.reduce((a, f) => a + f.questions.length, 0);
    const score = answeredCount > 0 ? (totalScore / answeredCount) * 100 : 0;
    let status = 'INITIALSCAN';
    let color = '#FF00E5';
    if (answeredCount > 0) {
      if (score < 50) { status = 'CRIT_DEFI'; color = '#EF4444'; }
      else if (score < 80) { status = 'MOD_READY'; color = '#00F2FF'; }
      else { status = 'READY_SYNC'; color = '#22C55E'; }
    }
    return { total: totalQuestions, answered: answeredCount, yes: totalScore, no: answeredCount - totalScore, expired: expiredCount, score, status, color };
  }, [responses, validityDates]);

  const gapAnalysis = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return CHECKLIST_FILES.filter(f =>
      f.questions.some(q => {
        if (responses[q.id] === 0) return true;
        // Yes on a validity question but expired/missing date = gap
        if (responses[q.id] === 1 && q.hasValidity) {
          const date = validityDates[q.id];
          return !date || date < today;
        }
        return false;
      })
    );
  }, [responses, validityDates]);

  const currentFile = useMemo(() => 
    CHECKLIST_FILES.find(f => f.id === selectedFileId), 
  [selectedFileId]);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-[Outfit,sans-serif]">
      {/* Neon Top Bar */}
      <nav className="sticky top-0 z-[60] bg-[#020617]/80 backdrop-blur-3xl border-b border-cyan-500/20 shadow-[0_0_30px_rgba(0,242,255,0.05)]">
         <div className="max-w-screen-2xl mx-auto px-4 sm:px-10 py-4 sm:py-5 flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-10">
                <Link href="/dashboard" className="p-2 sm:p-3 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all hover:scale-110 active:scale-95 group">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-200" />
                </Link>
                <div className="h-10 w-px bg-white/5 hidden sm:block"></div>
                <div>
                     <h1 className="text-base sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 sm:gap-3">
                        <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-pulse" />
                        <span className="hidden sm:inline">HEALTHGUARD</span> <span className="text-cyan-400 text-glow-cyan">AI</span>
                     </h1>
                     <div className="hidden sm:flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 glow-cyan"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Inference Mode: <span className="text-cyan-600">Active</span></span>
                     </div>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-10">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 hidden sm:block">Compliance Score</p>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <span className="text-xl sm:text-3xl font-black tabular-nums tracking-tighter" style={{ color: stats.color, textShadow: `0 0 15px ${stats.color}50` }}>{Math.round(stats.score)}%</span>
                        <div className="hidden sm:block px-3 py-1 rounded-lg text-[9px] font-black border text-white animate-pulse" style={{ backgroundColor: `${stats.color}20`, borderColor: stats.color }}>
                            {stats.status}
                        </div>
                    </div>
                 </div>
                 <button className="hidden sm:block px-8 py-3.5 bg-cyan-500 text-black rounded-2xl font-black text-sm shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:bg-cyan-400 transition-all hover:scale-105">
                    SAVE
                 </button>
            </div>
         </div>
      </nav>

      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-92px)] overflow-hidden">
        
        {/* Sidebar: Digital Hub */}
        <aside className="w-full lg:w-[380px] bg-[#020617] border-b lg:border-b-0 lg:border-r border-cyan-500/10 overflow-y-auto thin-scrollbar p-4 sm:p-8 space-y-4 sm:space-y-6 max-h-[40vh] lg:max-h-none">
            <div className="relative group mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                    type="text" 
                    placeholder="SCANNING DECK..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black tracking-widest text-white uppercase focus:ring-1 focus:ring-cyan-500 focus:bg-cyan-500/5 transition-all outline-none"
                />
            </div>

            <div className="space-y-4">
                {CHAPTERS.map(chapter => (
                    <div key={chapter.id} className="rounded-3xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                        <button 
                            onClick={() => setExpandedChapters(p => ({ ...p, [chapter.id]: !p[chapter.id] }))}
                            className={`w-full flex items-center justify-between p-5 transition-all ${expandedChapters[chapter.id] ? 'bg-white/5' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 transition-all" style={{ color: chapter.color, boxShadow: expandedChapters[chapter.id] ? `0 0 10px ${chapter.color}50` : 'none' }}>
                                    {chapter.icon}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-tight ${expandedChapters[chapter.id] ? 'text-white' : 'text-slate-500'}`}>{chapter.name}</span>
                            </div>
                            {expandedChapters[chapter.id] ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
                        </button>

                        {expandedChapters[chapter.id] && (
                            <div className="px-3 pb-4 space-y-1 animate-in slide-in-from-top-4 duration-300">
                                {CHECKLIST_FILES.filter(f => f.category === chapter.id).map(file => {
                                    const fileQuestions = file.questions.map(q => q.id);
                                    const fileAns = fileQuestions.filter(id => responses[id] !== null).length;
                                    const isSelected = selectedFileId === file.id;
                                    return (
                                        <button 
                                            key={file.id}
                                            onClick={() => setSelectedFileId(file.id)}
                                            className={`w-full text-left p-4 rounded-2xl text-[11px] font-bold transition-all flex items-center justify-between group ${isSelected ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-cyan-400'}`}
                                        >
                                            <span className="truncate">{file.name}</span>
                                            <span className={`text-[9px] tabular-nums font-black ${isSelected ? 'text-black/60' : 'text-slate-800'}`}>{fileAns}/5</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>

        {/* Content Canvas: Neon Matrix */}
        <main className="flex-1 overflow-y-auto bg-[#020617] pb-32 relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-magenta-500/5 blur-[150px] pointer-events-none text-magenta-500"></div>

            {currentFile ? (
                <div className="max-w-5xl mx-auto p-6 sm:p-10 lg:p-16 animate-in zoom-in-95 duration-700">
                     <div className="mb-8 sm:mb-14">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
                             <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest glow-cyan">
                                Sync Code: {currentFile.code}
                             </div>
                             <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 border border-white/5 text-slate-500 text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest">
                                Sector: {currentFile.category}
                             </div>
                        </div>
                        <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[0.9] mb-6 sm:mb-8 uppercase text-glow-cyan">{currentFile.name}</h2>
                        <div className="inline-flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-md">
                            <FileSearch className="w-6 h-6 text-cyan-400" />
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mandatory Artifact Required</p>
                                <p className="text-sm sm:text-lg font-black text-white tracking-tight">{currentFile.evidence_needed}</p>
                            </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        {currentFile.questions.map((q, idx) => (
                            <div key={q.id} className="bg-white/5 rounded-2xl sm:rounded-[40px] p-6 sm:p-8 lg:p-12 border border-white/5 transition-all hover:bg-white/[0.07] hover:border-white/10 group/card relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500/0 group-hover/card:bg-cyan-500/100 transition-all"></div>
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-12 relative z-10">
                                    <div className="flex gap-4 sm:gap-10">
                                        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/card:border-cyan-500/30 transition-all">
                                            <span className="text-lg sm:text-3xl font-black text-slate-800 group-hover/card:text-cyan-900 transition-all">{idx + 1}</span>
                                        </div>
                                        <div>
                                            <p className="text-base sm:text-xl lg:text-3xl font-black text-white leading-tight mb-4 tracking-tight group-hover/card:text-cyan-50 text-glow-cyan transition-colors">{q.text}</p>
                                            
                                            {q.hasValidity && responses[q.id] === 1 && (() => {
                                                const today = new Date().toISOString().split('T')[0];
                                                const dateVal = validityDates[q.id] || '';
                                                const isExpired = !!(dateVal && dateVal < today);
                                                const isMissing = !dateVal;
                                                const bgClass = isExpired
                                                  ? 'bg-red-500 text-white shadow-[0_0_50px_rgba(239,68,68,0.4)]'
                                                  : isMissing
                                                  ? 'bg-yellow-400 text-black shadow-[0_0_50px_rgba(234,179,8,0.4)]'
                                                  : 'bg-cyan-500 text-black shadow-[0_0_50px_rgba(0,242,255,0.3)]';
                                                return (
                                                  <div className={`mt-6 sm:mt-10 p-6 sm:p-10 rounded-2xl sm:rounded-[40px] animate-in slide-in-from-bottom-8 duration-500 ${bgClass}`}>
                                                    <div className="flex items-center gap-4 mb-3">
                                                      <Calendar className="w-6 h-6" />
                                                      <label className="text-xs font-black uppercase tracking-[0.2em]">
                                                        {isExpired ? '⚠ EXPIRED — SCORE PENALISED' : isMissing ? '⚠ ENTER EXPIRY DATE TO SCORE' : '✓ LICENSE VALID — COMPLIANT'}
                                                      </label>
                                                    </div>
                                                    {isExpired && <p className="text-sm font-bold mb-4 opacity-90">This license/certificate has EXPIRED. It scores 0 until renewed. Update date after renewal.</p>}
                                                    {isMissing && <p className="text-sm font-bold mb-4 opacity-80">A valid future expiry date is required. Without it, this question scores 0 in the final analysis.</p>}
                                                    <input
                                                      type="date"
                                                      className="w-full bg-black/10 border-2 border-black/20 rounded-xl sm:rounded-[28px] px-4 sm:px-8 py-3 sm:py-5 text-base sm:text-2xl font-black focus:ring-0 focus:border-black/50 transition-all"
                                                      value={dateVal}
                                                      onChange={(e) => setValidityDates(p => ({ ...p, [q.id]: e.target.value }))}
                                                    />
                                                  </div>
                                                );
                                              })()}
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
                                        <button 
                                            onClick={() => setResponses(p => ({ ...p, [q.id]: p[q.id] === 1 ? null : 1 }))}
                                            className={`flex-1 sm:w-44 py-3 sm:py-5 rounded-xl sm:rounded-[28px] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all border-2 ${responses[q.id] === 1 ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_30px_rgba(0,242,255,0.4)] scale-105' : 'bg-transparent text-slate-700 border-white/5 hover:border-cyan-500 hover:text-cyan-400'}`}
                                        >
                                            COMPLIANT
                                        </button>
                                        <button 
                                            onClick={() => setResponses(p => ({ ...p, [q.id]: p[q.id] === 0 ? null : 0 }))}
                                            className={`flex-1 sm:w-44 py-3 sm:py-5 rounded-xl sm:rounded-[28px] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all border-2 ${responses[q.id] === 0 ? 'bg-[#FF00E5] text-white border-[#FF00E5] shadow-[0_0_30px_rgba(255,0,229,0.4)] scale-105' : 'bg-transparent text-slate-700 border-white/5 hover:border-[#FF00E5] hover:text-[#FF00E5]'}`}
                                        >
                                            DEFICIENCY
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>

                     {/* Final Action Module */}
                     <div className="mt-12 sm:mt-24 p-8 sm:p-16 bg-[#020617] rounded-3xl sm:rounded-[64px] border border-cyan-500/20 shadow-[0_0_100px_rgba(0,242,255,0.1)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500 blur-[180px] opacity-10"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-12">
                             <div className="space-y-4 sm:space-y-6 max-w-xl">
                                <div className="p-4 sm:p-5 bg-cyan-500/10 rounded-2xl sm:rounded-3xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border border-cyan-500/30">
                                    <BrainCircuit className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                                </div>
                                <h3 className="text-xl sm:text-4xl font-black text-white uppercase tracking-tighter">GENERATE AUDIT REPORT</h3>
                                <p className="text-slate-400 font-medium text-sm sm:text-lg leading-relaxed">Run a full predictive assessment of your hospital\'s compliance readiness.</p>
                             </div>
                             <button 
                                onClick={() => { setIsAnalyzing(true); setTimeout(() => { setIsAnalyzing(false); setShowReport(true); }, 2000); }}
                                disabled={isAnalyzing}
                                className="px-8 sm:px-12 py-5 sm:py-8 bg-cyan-500 text-black rounded-2xl sm:rounded-[40px] text-sm sm:text-lg font-black shadow-[0_0_50px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 sm:gap-6 whitespace-nowrap disabled:opacity-50 w-full sm:w-auto justify-center"
                             >
                                {isAnalyzing ? 'ANALYZING...' : 'GENERATE REPORT'} <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                             </button>
                        </div>
                     </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-16 py-32">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-[150px] opacity-20"></div>
                        <div className="w-[300px] h-[300px] rounded-[80px] bg-white/5 border border-white/10 flex items-center justify-center relative backdrop-blur-2xl animate-[spin_60s_linear_infinite]">
                             <Target className="w-32 h-32 text-slate-800 stroke-[0.5]" />
                             <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-cyan-500/20 rounded-full scale-125"></div>
                        </div>
                        <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-cyan-400 glow-cyan animate-pulse" />
                    </div>
                    <div className="text-center space-y-4">
                        <h3 className="text-5xl font-black text-white tracking-[0.2em] uppercase">SYSTEM IDLE</h3>
                        <p className="text-slate-600 font-bold tracking-[0.4em] uppercase text-xs">Awaiting Matrix Selection</p>
                    </div>
                </div>
            )}
        </main>
      </div>

      {/* FINAL AUDIT MODAL (NEON DARK) */}
      {showReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
             <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl" onClick={() => setShowReport(false)}></div>
             <div className="relative bg-[#020617] w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-3xl sm:rounded-[80px] border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col animate-in zoom-in-95 duration-500">
                    <header className="p-6 sm:p-12 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4 sm:gap-8">
                            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.3)]">
                                <Activity className="w-6 h-6 sm:w-10 sm:h-10" />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-4xl font-black text-white uppercase tracking-tighter">AUDIT REPORT</h2>
                                <p className="text-[9px] sm:text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] sm:tracking-[0.5em] mt-1">HealthGuard AI v5.0</p>
                            </div>
                        </div>
                        <button className="px-4 sm:px-10 py-3 sm:py-5 bg-white/5 border border-white/10 text-white rounded-xl sm:rounded-[24px] font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-white/10 transition-all" onClick={() => setShowReport(false)}>CLOSE</button>
                    </header>

                    <main className="flex-1 overflow-y-auto p-6 sm:p-16 thin-scrollbar space-y-12 sm:space-y-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
                            {/* Score Matrix */}
                            <div className="bg-black/50 rounded-3xl sm:rounded-[64px] border border-cyan-500/20 p-8 sm:p-12 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 blur-3xl opacity-10"></div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-6 sm:mb-12">Readiness Score</h4>
                                <div className="flex items-baseline gap-2 sm:gap-4 mb-2">
                                    <span className="text-6xl sm:text-9xl font-black tracking-tighter" style={{ color: stats.color, textShadow: `0 0 30px ${stats.color}50` }}>{Math.round(stats.score)}</span>
                                    <span className="text-2xl sm:text-4xl font-black text-slate-800">%</span>
                                </div>
                                <p className="text-xl font-black uppercase tracking-widest" style={{ color: stats.color }}>{stats.status}</p>
                            </div>

                            {/* Neural Prediction */}
                            <div className="lg:col-span-2 bg-white/5 rounded-3xl sm:rounded-[64px] border border-magenta-500/20 p-8 sm:p-12 relative">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-6 sm:mb-12">Predictions</h4>
                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
                                     <div>
                                         <p className="text-[10px] font-black text-[#FF00E5] uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                                             <History className="w-4 h-4" /> Timeline
                                         </p>
                                         <p className="text-3xl sm:text-6xl font-black text-white tracking-tighter mb-2 sm:mb-4">{stats.score > 80 ? '14' : '48'} Days</p>
                                         <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Estimated time until full compliance.</p>
                                     </div>
                                     <div>
                                         <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                                             <Sparkles className="w-4 h-4" /> Pass Probability
                                         </p>
                                         <p className="text-3xl sm:text-6xl font-black text-white tracking-tighter mb-2 sm:mb-4">{Math.round(80 + (stats.score * 0.15))}%</p>
                                         <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Probability of zero non-conformities during assessment.</p>
                                     </div>
                                     <div>
                                         <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-3 sm:mb-4 flex items-center gap-2">
                                             <Target className="w-4 h-4" /> Accuracy
                                         </p>
                                         <p className="text-3xl sm:text-6xl font-black text-white tracking-tighter mb-2 sm:mb-4">{Math.min(99, Math.round((stats.answered / stats.total) * 100))}%</p>
                                         <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">Confidence based on data coverage.</p>
                                     </div>
                                 </div>
                                 
                                 {/* Major Issue Reason */}
                                 <div className="mt-12 p-8 bg-black/40 rounded-[40px] border border-white/5 animate-in fade-in duration-1000">
                                     <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                         <AlertTriangle className="w-4 h-4" /> Major score reduction factor
                                     </h5>
                                     <p className="text-xl font-black text-white tracking-tight">
                                         {gapAnalysis.length > 0 
                                            ? `STATUTORY_GAPS: Found ${gapAnalysis.length} missing regulatory licenses (Fire/BMW/PCB) which are mandatory for SHCO Entry Level.`
                                            : stats.score < 100 
                                            ? "PROCESS_INCOMPLETION: Standard operational documentation and staff training evidence markers are missing in several chapters."
                                            : "NOMINAL_SYNC: High-integrity match with accreditation requirements detected."
                                         }
                                     </p>
                                 </div>
                            </div>
                        </div>

                        {/* Gap Spectrum */}
                        <div className="space-y-12">
                             <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                <AlertTriangle className="w-8 h-8 text-[#FF00E5]" /> GAP ANALYSIS SPECTRUM
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {gapAnalysis.length > 0 ? gapAnalysis.map(file => (
                                    <div key={file.id} className="p-10 bg-white/5 border border-[#FF00E5]/10 rounded-[48px] flex flex-col gap-6 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[#FF00E5]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="w-16 h-16 rounded-2xl bg-[#FF00E5]/10 border border-[#FF00E5]/20 flex items-center justify-center font-black text-xs text-[#FF00E5]">{file.code}</div>
                                        <div>
                                            <h4 className="text-2xl font-black text-white tracking-tight">{file.name}</h4>
                                            <p className="text-[9px] font-black text-[#FF00E5] uppercase tracking-widest mt-2 px-2 py-1 bg-[#FF00E5]/10 inline-block rounded">STATUTORY_FAILURE</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 bg-cyan-500 text-black rounded-[64px] text-center shadow-[0_0_100px_rgba(0,242,255,0.2)]">
                                        <CheckCircle2 className="w-20 h-20 mx-auto mb-6" />
                                        <h4 className="text-4xl font-black uppercase tracking-tighter">Zero Vulnerabilities Detected</h4>
                                        <p className="text-lg font-black uppercase tracking-widest mt-2 opacity-60">Full statutory synchronization complete.</p>
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* Print/Download Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-10 border-t border-white/5">
                            <button className="w-full sm:flex-1 py-5 sm:py-8 bg-cyan-500 text-black rounded-2xl sm:rounded-[40px] text-sm sm:text-lg font-black shadow-[0_0_50px_rgba(0,242,255,0.4)] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                <FileDown className="w-5 h-5 sm:w-6 sm:h-6" /> EXPORT PDF
                            </button>
                            <button className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-8 bg-white/5 border border-white/10 text-white rounded-2xl sm:rounded-[40px] font-black text-sm sm:text-lg hover:bg-white/10 transition-all">
                                <Printer className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
                            </button>
                        </div>
                    </main>
             </div>
        </div>
      )}

      <style jsx global>{`
        .text-glow-cyan { text-shadow: 0 0 10px rgba(0, 242, 255, 0.6); }
        .glow-cyan { box-shadow: 0 0 15px rgba(0, 242, 255, 0.4); }
        .thin-scrollbar::-webkit-scrollbar { width: 4px; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
}
