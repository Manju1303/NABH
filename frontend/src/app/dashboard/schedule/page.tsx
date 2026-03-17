'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, Clock, MapPin, User } from 'lucide-react';

interface ScheduleEntry {
  id: number;
  date: string;
  time: string;
  type: string;
  assessor: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Pending';
}

const sampleSchedule: ScheduleEntry[] = [
  { id: 1, date: '2026-04-15', time: '10:00 AM', type: 'Pre-Assessment Visit', assessor: 'Dr. R. Sharma', location: 'On-Site', status: 'Scheduled' },
  { id: 2, date: '2026-05-20', time: '09:30 AM', type: 'Document Verification', assessor: 'Dr. P. Mehta', location: 'Virtual', status: 'Pending' },
  { id: 3, date: '2026-06-10', time: '10:00 AM', type: 'Final Assessment', assessor: 'Assessment Team', location: 'On-Site', status: 'Pending' },
];

export default function SchedulePage() {
  const [schedule] = useState<ScheduleEntry[]>(sampleSchedule);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="hope-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Assessment Schedule</span>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <Link href="/dashboard" className="hope-btn-outline p-2 rounded" title="Back">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-semibold" style={{ color: '#212121' }}>Assessment Schedule</h1>
      </div>

      <div className="hope-card overflow-hidden">
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E0E0E0' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#212121' }}>Upcoming Assessments</h2>
          <span className="text-xs px-2.5 py-1 rounded font-medium" style={{ background: '#E3F2FD', color: '#1565C0' }}>
            {schedule.length} Scheduled
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: '#E0E0E0' }}>
          {schedule.map((entry) => (
            <div key={entry.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0" style={{ background: '#E8F5E9' }}>
                <CalendarClock className="w-5 h-5" style={{ color: '#00695C' }} />
                <span className="text-[9px] font-semibold mt-0.5" style={{ color: '#00695C' }}>
                  {new Date(entry.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: '#212121' }}>{entry.type}</h3>
                <div className="flex flex-wrap gap-4 mt-1.5 text-xs" style={{ color: '#616161' }}>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {entry.time}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {entry.assessor}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {entry.location}</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded text-xs font-medium shrink-0" style={
                entry.status === 'Completed' ? { background: '#E8F5E9', color: '#2E7D32' } :
                entry.status === 'Scheduled' ? { background: '#E3F2FD', color: '#1565C0' } :
                { background: '#FFF8E1', color: '#F57F17' }
              }>
                {entry.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs mt-4" style={{ color: '#9E9E9E' }}>
        Assessment schedules are assigned by NABH after successful registration and document verification.
      </p>
    </div>
  );
}
