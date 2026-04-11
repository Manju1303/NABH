'use client';

import React, { useState, useEffect } from 'react';
import api, { getMe } from '@/lib/api';
import { ArrowLeft, CheckCircle2, Clock, Info, Save, Upload, AlertCircle, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';

export default function RemediationPage() {
    const [user, setUser] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [selectedSub, setSelectedSub] = useState<any>(null);
    const [remediationData, setRemediationData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const u = await getMe();
                setUser(u);
                const res = await api.get('/api/submissions');
                setSubmissions(res.data.records);
                if (res.data.records.length > 0) {
                    setSelectedSub(res.data.records[res.data.records.length - 1]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (selectedSub) {
            fetchRemediation(selectedSub.id);
        }
    }, [selectedSub]);

    const fetchRemediation = async (subId: number) => {
        try {
            const res = await api.get(`/api/remediation/${subId}`);
            setRemediationData(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdate = async (defId: string, status: string, action: string) => {
        setSaving(defId);
        try {
            await api.post(`/api/remediation/${selectedSub.id}/${defId}`, {
                status,
                action_taken: action
            });
            await fetchRemediation(selectedSub.id);
        } catch (e) {
            alert('Failed to update remediation step.');
        } finally {
            setSaving(null);
        }
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-cyan-400" /></div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex items-center gap-4 mb-10">
                <Link href="/dashboard" className="hg-btn-outline p-2 rounded">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                        Remediation Tracking <Zap className="w-6 h-6 text-rose-500 fill-rose-500" />
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Closing Compliance Gaps & Evidence Management</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Submissions */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">Assessment History</h2>
                    {submissions.slice().reverse().map(sub => (
                        <div 
                            key={sub.id} 
                            onClick={() => setSelectedSub(sub)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                                selectedSub?.id === sub.id ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]' : 'bg-slate-900/50 border-white/5 hover:bg-white/5'
                            }`}
                        >
                            <p className="text-xs font-bold text-white mb-1">ID #{sub.id}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{new Date(sub.submitted_at).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>

                {/* Main: Deficiency List */}
                <div className="lg:col-span-3 space-y-6">
                    {!selectedSub ? (
                        <div className="hg-card p-20 text-center border-dashed border-white/10">
                            <Info className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No assessments found to remediate.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-white">Target Gaps for ID #{selectedSub.id}</h2>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    selectedSub.is_ready ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                }`}>
                                    {selectedSub.is_ready ? 'Initial Status: Pass' : `${selectedSub.deficiency_count} Deviations`}
                                </span>
                            </div>

                            {!selectedSub.deficiencies || selectedSub.deficiencies.length === 0 ? (
                                <div className="hg-card p-20 text-center">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                                    <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Perfect Score - No Remediation needed.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedSub.deficiencies.map((def: any) => {
                                        const step = remediationData.find(s => s.deficiency_id === def.id);
                                        const currentStatus = step?.status || 'pending';
                                        
                                        return (
                                            <div key={def.id} className="glass-card rounded-[24px] p-6 border border-white/5">
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className={`w-2 h-2 rounded-full ${
                                                                def.severity === 'critical' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-amber-500'
                                                            }`} />
                                                            <h3 className="font-bold text-white text-sm uppercase tracking-tight">{def.label || def.id}</h3>
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/5 text-slate-500 rounded border border-white/5">{def.nabh_reference || 'NABH'}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">{def.reasoning || def.message}</p>
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</p>
                                                                <select 
                                                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                                                                    value={currentStatus}
                                                                    onChange={(e) => handleUpdate(def.id, e.target.value, step?.action_taken || '')}
                                                                >
                                                                    <option value="pending">Pending Breakdown</option>
                                                                    <option value="in_progress">Action Implementation</option>
                                                                    <option value="resolved">Resolved (Awaiting Verification)</option>
                                                                    <option value="verified" disabled={user?.role !== 'admin'}>Verified by Auditor</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Corrective Action Taken</p>
                                                                <div className="relative">
                                                                    <textarea 
                                                                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 h-20 resize-none"
                                                                        placeholder="Describe implementation steps taken..."
                                                                        defaultValue={step?.action_taken || ''}
                                                                        onBlur={(e) => handleUpdate(def.id, currentStatus, e.target.value)}
                                                                    />
                                                                    {saving === def.id && (
                                                                        <div className="absolute top-2 right-2">
                                                                            <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
