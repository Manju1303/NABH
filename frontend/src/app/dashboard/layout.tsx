'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Building2, MessageSquare, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/registration', label: 'Registration', icon: <Building2 className="w-4 h-4" /> },
    { href: '/dashboard/qci-checklist', label: 'Checklist', icon: <ShieldCheck className="w-4 h-4" /> },
    { href: '/dashboard/results', label: 'Results', icon: <Building2 className="w-4 h-4" /> },
    { href: '/dashboard/remarks', label: 'Remarks', icon: <MessageSquare className="w-4 h-4" /> },
    { href: '/dashboard/schedule', label: 'Schedule', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/committee', label: 'Committee', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#020617]">
      {/* Top Header */}
      <header className="hg-header px-4 sm:px-6 py-3 flex items-center justify-between z-[100] shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMenu} 
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Building2 className="w-4 h-4 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-black tracking-widest text-white uppercase">HealthGuard</h1>
              <p className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest">NABH Compliance Matrix</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2 hidden xs:flex">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status: Active</span>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Admin Portal</span>
          </div>
          <Link href="/login" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest">
            <LogOut className="w-3 h-3" /> Logout
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay for Mobile */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={toggleMenu}
          />
        )}

        {/* Sidebar (Desktop + Mobile Drawer) */}
        <aside className={`
          hg-sidebar w-64 lg:static fixed inset-y-0 left-0 z-[90] 
          transform transition-transform duration-300 ease-in-out
          flex flex-col shrink-0 border-r border-white/5
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-6">
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">System Core</p>
                <p className="text-[10px] font-black text-cyan-400">v4.2.0-STABLE</p>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto bg-[#020617] relative">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer (Simplified for Mobile) */}
      <footer className="shrink-0 py-3 text-center border-t border-white/5 bg-[#020617] px-4">
        <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
          HealthGuard AI Matrix © 2026 | Professional Compliance Verified
        </p>
      </footer>
    </div>
  );
}
