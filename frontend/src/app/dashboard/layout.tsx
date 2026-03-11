'use client';

import { Activity, LayoutDashboard, Database, Settings, BookOpen, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Onboarding', icon: <ClipboardList className="w-5 h-5" /> },
    { href: '/dashboard/standards', label: 'Standards', icon: <BookOpen className="w-5 h-5" /> },
    { href: '/dashboard/analytics', label: 'Analytics', icon: <Activity className="w-5 h-5" /> },
    { href: '/dashboard/data', label: 'Database Logs', icon: <Database className="w-5 h-5" /> },
    { href: '/', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-card border-none md:border-r border-slate-800 p-6 flex flex-col md:h-screen sticky top-0 md:rounded-none rounded-b-3xl z-40">
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-2xl mb-12 animate-pulse-glow">
          <Activity className="w-8 h-8" />
          <span>Aura NABH</span>
        </div>

        <nav className="flex-1 space-y-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 text-xs text-slate-500 text-center">
          Admin Portal <br /> Version 1.0.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 relative overflow-y-auto w-full h-full pb-20 md:pb-6">
        {/* Subtle mesh behind content */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
}
