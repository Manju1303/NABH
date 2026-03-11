'use client';

import Link from 'next/link';
import { ShieldCheck, Activity, BrainCircuit, ArrowRight, ActivitySquare } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-8 glass-card p-12 lg:p-20 shadow-2xl">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/30 mb-4 animate-pulse-glow">
          <ActivitySquare className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-medium text-indigo-300">NABH Entry Level Intelligence</span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          Hospital Accreditation <br />
          <span className="text-gradient">Redefined by AI & Rules</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
          A hybrid compliance engine combining strict, deterministic scoring with machine learning to evaluate and predict your hospital&apos;s true readiness for NABH standards.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link href="/dashboard" className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]">
            Go to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#how-it-works" className="px-8 py-4 rounded-full font-semibold text-slate-300 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 glass-card">
            Learn More
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full pt-12 border-t border-slate-800/50">
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
            title="Deterministic Rules"
            description="Strictly evaluates your hospital metrics against exact NABH checklists."
          />
          <FeatureCard 
            icon={<Activity className="w-8 h-8 text-blue-400" />}
            title="Data Integrity"
            description="Logical validation prevents incorrect occupancy limits and documentation errors."
          />
          <FeatureCard 
            icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
            title="AI Predictions"
            description="Machine learning probabilistically estimates your likelihood of clearance."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-slate-900/40 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors duration-300 group">
      <div className="p-4 bg-slate-800/50 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
