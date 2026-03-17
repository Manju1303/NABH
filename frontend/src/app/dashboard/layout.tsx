'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, MessageSquare, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/dashboard/registration', label: 'Hospital', icon: <Building2 className="w-4 h-4" /> },
    { href: '/dashboard/remarks', label: 'Remarks', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="hope-header px-6 py-2.5 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-wide text-white">NABH</h1>
            <p className="text-[10px] text-white/70 -mt-0.5">National Accreditation Board for Hospitals &amp; Healthcare Providers</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/80 hidden sm:inline">Admin Portal</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">A</div>
          <Link href="/login" className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors" title="Logout">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hope-sidebar w-52 hidden md:flex flex-col shrink-0">
          <nav className="flex-1 py-4">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all border-l-[3px] ${
                    isActive
                      ? 'bg-white/5 text-white font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                  style={isActive ? { borderLeftColor: '#26A69A' } : {}}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 mx-3 mb-3 rounded text-xs text-center" style={{ background: 'rgba(255,255,255,0.05)', color: '#78909C' }}>
            Version 2.0.0
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto" style={{ background: '#263238', borderBottom: '1px solid #37474F' }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-2 px-4 py-3 text-xs whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-400'}`}
                style={isActive ? { borderBottom: '2px solid #26A69A' } : {}}>
                {link.icon} {link.label}
              </Link>
            );
          })}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto" style={{ background: '#F5F7FA' }}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center py-3 text-xs" style={{ color: '#9E9E9E', borderTop: '1px solid #E0E0E0', background: '#FFFFFF' }}>
        Copyright © 2026 <span style={{ color: '#0277BD' }}>NABH</span> All rights reserved.
      </footer>
    </div>
  );
}
