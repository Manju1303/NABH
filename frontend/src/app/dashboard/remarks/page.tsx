'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquareText, Send, User, Calendar } from 'lucide-react';

interface Remark {
  id: number;
  date: string;
  author: string;
  role: string;
  message: string;
  category: 'Observation' | 'Recommendation' | 'Correction Required';
}

export default function RemarksPage() {
  const [remarks, setRemarks] = useState<Remark[]>([
    { id: 1, date: '2026-03-15', author: 'Dr. R. Sharma', role: 'Assessor', message: 'Infection control documentation appears to be incomplete. Please ensure all BMW authorization certificates are uploaded.', category: 'Correction Required' },
    { id: 2, date: '2026-03-14', author: 'System', role: 'Auto-generated', message: 'Hospital registration form has been submitted successfully. Assessment scheduling is in progress.', category: 'Observation' },
  ]);
  const [newRemark, setNewRemark] = useState('');

  const handleAddRemark = () => {
    if (!newRemark.trim()) return;
    setRemarks(prev => [...prev, {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      author: 'Hospital Admin',
      role: 'Applicant',
      message: newRemark.trim(),
      category: 'Observation',
    }]);
    setNewRemark('');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="hope-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Remarks</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="hope-btn-outline p-2 rounded" title="Back">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg font-semibold" style={{ color: '#212121' }}>Remarks</h1>
        </div>
        <span className="text-xs px-2.5 py-1 rounded font-medium" style={{ background: '#E8F5E9', color: '#00695C' }}>
          {remarks.length} Remarks
        </span>
      </div>

      {/* Add remark */}
      <div className="hope-card p-4 mb-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: '#E8F5E9' }}>
            <User className="w-4 h-4" style={{ color: '#00695C' }} />
          </div>
          <div className="flex-1">
            <textarea
              value={newRemark}
              onChange={e => setNewRemark(e.target.value)}
              rows={2}
              placeholder="Add a remark or response..."
              className="hope-input resize-none"
            />
            <div className="flex justify-end mt-2">
              <button onClick={handleAddRemark} disabled={!newRemark.trim()} className="hope-btn-primary flex items-center gap-2 text-sm disabled:opacity-40">
                <Send className="w-3.5 h-3.5" /> Submit Remark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remarks list */}
      <div className="space-y-3">
        {remarks.slice().reverse().map(remark => (
          <div key={remark.id} className="hope-card p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{
                background: remark.role === 'Assessor' ? '#E3F2FD' : remark.role === 'Auto-generated' ? '#F5F7FA' : '#E8F5E9'
              }}>
                <User className="w-4 h-4" style={{
                  color: remark.role === 'Assessor' ? '#1565C0' : remark.role === 'Auto-generated' ? '#9E9E9E' : '#00695C'
                }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className="text-sm font-semibold" style={{ color: '#212121' }}>{remark.author}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F5F7FA', color: '#9E9E9E' }}>{remark.role}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={
                    remark.category === 'Correction Required' ? { background: '#FFEBEE', color: '#C62828' } :
                    remark.category === 'Recommendation' ? { background: '#FFF8E1', color: '#F57F17' } :
                    { background: '#E8F5E9', color: '#2E7D32' }
                  }>{remark.category}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#424242' }}>{remark.message}</p>
                <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: '#BDBDBD' }}>
                  <Calendar className="w-3 h-3" /> {remark.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
