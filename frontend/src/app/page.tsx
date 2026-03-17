'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F7FA' }}>
      {/* HOPE Header */}
      <header className="hope-header px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">H</div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide">HOPE</h1>
            <p className="text-[11px] text-white/80 -mt-0.5">Healthcare Organisation Platform for Entry Level Certification</p>
          </div>
        </div>
        <Link href="/login" className="text-sm text-white/90 hover:text-white border border-white/30 px-4 py-1.5 rounded hover:bg-white/10 transition-all">
          Login
        </Link>
      </header>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: '#E8F5E9', color: '#00695C' }}>
            NABH Entry Level Certification
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#212121' }}>
            Hospital Accreditation<br />
            <span style={{ color: '#00695C' }}>Compliance Platform</span>
          </h1>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#616161' }}>
            A comprehensive compliance engine that evaluates hospital readiness against NABH standards with deterministic scoring and deficiency tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="hope-btn-primary px-8 py-3 text-base rounded-md">
              Access Dashboard →
            </Link>
            <a href="#features" className="hope-btn-outline px-8 py-3 text-base rounded-md">
              Learn More
            </a>
          </div>

          {/* Feature cards */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            <FeatureCard
              title="Deterministic Scoring"
              description="Evaluate hospital metrics against exact NABH mandatory checklists and thresholds."
              icon="📋"
            />
            <FeatureCard
              title="Deficiency Tracking"
              description="Automatic flagging of non-compliant items with severity levels and remediation deadlines."
              icon="🔔"
            />
            <FeatureCard
              title="Document Management"
              description="Track required certificates, photographs, and MOUs across all NABH categories."
              icon="📁"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs" style={{ color: '#9E9E9E', borderTop: '1px solid #E0E0E0' }}>
        © 2026 Healthcare Organisation Platform for Entry Level Certification. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="hope-card p-6 hover:shadow-md transition-shadow">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold mb-2" style={{ color: '#212121' }}>{title}</h3>
      <p className="text-sm" style={{ color: '#616161' }}>{description}</p>
    </div>
  );
}
