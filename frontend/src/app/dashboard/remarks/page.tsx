'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import { ArrowLeft, MessageSquareText, Send, User, Calendar, Search, AlertCircle } from 'lucide-react';

interface Remark {
  id: number;
  date: string;
  author: string;
  role: string;
  message: string;
  category: 'Observation' | 'Recommendation' | 'Correction Required';
}

export default function RemarksPage() {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [newRemark, setNewRemark] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-load if we have a registration in local session or just fetch latest for demo
  useEffect(() => {
    fetchLatestOrStored();
  }, []);

  const fetchLatestOrStored = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/submissions`);
      const records = res.data.records;
      if (records && records.length > 0) {
        // Just take the latest for this demo context
        const latest = records[records.length - 1];
        setRecord(latest);
        setRegNumber(latest.registration_number);
        fetchRemarks(latest.id);
      }
    } catch (err) {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRemarks = async (id: number) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/submissions/${id}/remarks`);
      setRemarks(res.data);
    } catch (err) {
      console.error('Failed to fetch remarks');
    }
  };

  const handleSearch = async () => {
    if (!regNumber.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/submissions`);
      const found = res.data.records.find((r: any) => r.registration_number === regNumber.trim());
      if (found) {
        setRecord(found);
        fetchRemarks(found.id);
      } else {
        setError('Hospital with this registration number not found.');
        setRecord(null);
        setRemarks([]);
      }
    } catch (err) {
      setError('Search failed. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRemark = async () => {
    if (!newRemark.trim() || !record) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/submissions/${record.id}/remarks`, {
        author: 'Hospital Admin',
        message: newRemark.trim(),
        role: 'Applicant',
        category: 'Observation'
      });
      setRemarks(prev => [...prev, res.data]);
      setNewRemark('');
    } catch (err) {
      alert('Failed to submit remark.');
    }
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
          <h1 className="text-lg font-semibold" style={{ color: '#212121' }}>Remarks & Communication</h1>
        </div>
        {record && (
          <span className="text-xs px-2.5 py-1 rounded font-medium" style={{ background: '#E8F5E9', color: '#00695C' }}>
            ID: {record.registration_number}
          </span>
        )}
      </div>

      {/* Lookup */}
      <div className="hope-card p-4 mb-5 border-l-4" style={{ borderColor: '#00695C' }}>
        <p className="text-xs mb-3 font-medium uppercase tracking-wider" style={{ color: '#757575' }}>Enter Registration Number to view remarks</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={regNumber}
              onChange={e => setRegNumber(e.target.value)}
              placeholder="HOSP-REG-123..."
              className="hope-input pl-10 h-[40px]"
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="hope-btn-primary px-6 h-[40px]">
            {loading ? 'Searching...' : 'Find Hospital'}
          </button>
        </div>
        {error && <div className="mt-3 flex items-center gap-2 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>}
      </div>

      {record && (
        <div className="mb-5 p-4 rounded-lg bg-white border shadow-sm flex items-center justify-between" style={{ borderColor: '#E0E0E0' }}>
          <div>
            <h2 className="font-bold text-sm" style={{ color: '#00695C' }}>{record.hospital_name}</h2>
            <p className="text-xs text-gray-500">Score: {record.score} / {record.max_score} ({record.readiness_percentage?.toFixed(1)}%)</p>
          </div>
          <div className="text-right">
            <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase ${record.is_ready ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              {record.is_ready ? 'Accreditation Ready' : 'Criteria Pending'}
            </span>
          </div>
        </div>
      )}

      {/* Add remark */}
      <div className={`hope-card p-4 mb-5 ${!record ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: '#E8F5E9' }}>
            <User className="w-4 h-4" style={{ color: '#00695C' }} />
          </div>
          <div className="flex-1">
            <textarea
              value={newRemark}
              onChange={e => setNewRemark(e.target.value)}
              rows={2}
              placeholder={record ? "Add a response or clarification..." : "Please find a hospital first..."}
              className="hope-input resize-none"
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleAddRemark} 
                disabled={!newRemark.trim() || !record || loading} 
                className="hope-btn-primary flex items-center gap-2 text-sm disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" /> Submit Response
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remarks list */}
      <div className="space-y-3 mb-10">
        {!record && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <MessageSquareText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Search for your hospital registration to load remark history.</p>
          </div>
        )}
        
        {record && remarks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400 italic">No formal remarks or observations have been recorded yet.</p>
</div>
        )}

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
