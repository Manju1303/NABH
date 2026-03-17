'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/dashboard/standards', label: 'Standards', icon: '📘' },
    { href: '/dashboard/documents', label: 'Documents', icon: '📄' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
    { href: '/dashboard/data', label: 'Database Logs', icon: '💾' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HOPE-style Top Header */}
      <header className="hope-header px-6 py-2.5 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">H</div>
          <div>
            <h1 className="text-base font-semibold tracking-wide">HOPE</h1>
            <p className="text-[10px] text-white/70 -mt-0.5">Healthcare Organisation Platform for Entry Level Certification</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/80 hidden sm:inline">Admin Portal</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">A</div>
          <Link href="/login" className="text-xs text-white/70 hover:text-white transition-colors" title="Logout">
            Logout
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* HOPE-style Sidebar */}
        <aside className="hope-sidebar w-56 hidden md:flex flex-col shrink-0">
          <nav className="flex-1 py-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-5 py-3 text-sm transition-all border-l-3 ${
                    isActive
                      ? 'active bg-white/5 text-white border-l-[3px]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent'
                  }`}
                  style={isActive ? { borderLeftColor: '#26A69A' } : {}}
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mx-3 mb-3 rounded text-xs text-center" style={{ background: 'rgba(255,255,255,0.05)', color: '#78909C' }}>
            Version 2.0.0
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto border-b" style={{ background: '#263238', borderColor: '#37474F' }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-2 px-4 py-3 text-xs whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-400'}`}
                style={isActive ? { borderBottom: '2px solid #26A69A' } : {}}>
                <span>{link.icon}</span> {link.label}
              </Link>
            );
          })}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto" style={{ background: '#F5F7FA' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
