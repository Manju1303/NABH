'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import API_BASE_URL from '@/lib/api';
import { ArrowLeft, CalendarClock, Clock, MapPin, User, Loader2 } from 'lucide-react';

interface ScheduleEntry {
  id: number;
  date: string;
  time: string;
  type: string;
  assessor: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/schedule`)
      .then(res => {
        setSchedule(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  return (
    <div className="max-w-5xl mx-auto">
      <div className="hg-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#94A3B8' }}>Assessment Schedule</span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Link href="/dashboard" className="hg-btn-outline p-2 rounded" title="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold text-white">Assessment Schedule</h1>
      </div>

      <div className="hg-card overflow-hidden">
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-sm font-semibold text-white">Upcoming Assessments</h2>
          <span className="text-xs px-2.5 py-1 rounded font-medium" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
            {schedule.length} Scheduled
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
             <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
             <p className="text-sm text-gray-400">Loading your schedule...</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>

          {schedule.map((entry) => (
            <div key={entry.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0" style={{ background: 'rgba(0,242,255,0.1)' }}>
                <CalendarClock className="w-5 h-5 text-cyan-400" />
                <span className="text-[9px] font-semibold mt-0.5 text-cyan-400">
                  {new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white">{entry.type}</h3>
                <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {entry.time}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {entry.assessor}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {entry.location}</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded text-xs font-medium shrink-0" style={
                entry.status === 'Completed' ? { background: 'rgba(34,197,94,0.1)', color: '#22C55E' } :
                entry.status === 'Scheduled' ? { background: 'rgba(59,130,246,0.1)', color: '#3B82F6' } :
                { background: 'rgba(234,179,8,0.1)', color: '#EAB308' }
              }>
                {entry.status}
              </span>
            </div>
          ))}
          </div>
        )}
      </div>


      <p className="text-xs mt-4 text-slate-500">
        Assessment schedules are assigned by NABH after successful registration and document verification.
      </p>
    </div>
  );
}

