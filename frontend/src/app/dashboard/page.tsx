'use client';

import Link from 'next/link';
import { ClipboardList, FileCheck, Users, MessageSquareText, CalendarClock } from 'lucide-react';

const tiles = [
  {
    label: 'Registration Form',
    description: 'Submit hospital details, infrastructure, staffing and clinical data for NABH evaluation.',
    href: '/dashboard/registration',
    icon: <ClipboardList className="w-7 h-7 text-white" />,
    bg: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
  },
  {
    label: 'Assessment Results',
    description: 'View compliance scores, section-wise analysis and readiness status reports.',
    href: '/dashboard/results',
    icon: <FileCheck className="w-7 h-7 text-white" />,
    bg: 'linear-gradient(135deg, #C62828 0%, #B71C1C 100%)',
  },
  {
    label: 'Assessment Schedule',
    description: 'Track scheduled assessments, upcoming visits and assessment timelines.',
    href: '/dashboard/schedule',
    icon: <CalendarClock className="w-7 h-7 text-white" />,
    bg: 'linear-gradient(135deg, #E65100 0%, #BF360C 100%)',
  },
  {
    label: 'Committee Decision',
    description: 'Review recommendations and final decisions from the accreditation committee.',
    href: '/dashboard/committee',
    icon: <Users className="w-7 h-7 text-white" />,
    bg: 'linear-gradient(135deg, #6A1B9A 0%, #4A148C 100%)',
  },
  {
    label: 'Remarks',
    description: 'View assessor notes, observations and additional remarks on submissions.',
    href: '/dashboard/remarks',
    icon: <MessageSquareText className="w-7 h-7 text-white" />,
    bg: 'linear-gradient(135deg, #00695C 0%, #004D40 100%)',
  },
];

export default function HospitalDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="hope-breadcrumb mb-3">
        <a href="/dashboard">Home</a> / <span style={{ color: '#424242' }}>Hospital Dashboard</span>
      </div>

      {/* Application info bar */}
      <div className="hope-banner flex items-center justify-between mb-6">
        <span>Your Application Number is <strong>SHCO/2026/00001</strong></span>
      </div>

      {/* Tile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group block rounded overflow-hidden transition-all hover:shadow-lg"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center gap-4 p-5 text-white" style={{ background: tile.bg }}>
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {tile.icon}
              </div>
              <div>
                <h3 className="font-semibold text-base leading-tight">{tile.label}</h3>
              </div>
            </div>
            <div className="bg-white p-4" style={{ borderTop: 'none' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#616161' }}>{tile.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Privacy note */}
      <div className="text-xs" style={{ color: '#26A69A' }}>
        <a href="#" className="hover:underline" style={{ color: '#0277BD' }}>Privacy Policy</a>: Accepted
      </div>
    </div>
  );
}
