'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@nabh.com' && password === 'nabh2026') {
      router.push('/dashboard');
    } else if (!email || !password) {
      setError('Please enter email and password.');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F7FA' }}>
      <header className="hope-header px-6 py-3 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-white">NABH</h1>
            <p className="text-[11px] text-white/80 -mt-0.5">National Accreditation Board for Hospitals &amp; Healthcare Providers</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="hope-card p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#E8F5E9' }}>
                <Lock className="w-6 h-6" style={{ color: '#00695C' }} />
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#00695C' }}>Sign In to Portal</h2>
              <p className="text-sm mt-1" style={{ color: '#9E9E9E' }}>Enter your credentials to access the dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded text-sm font-medium flex items-center gap-2" style={{ background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2' }}>
                <Lock className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="hope-label">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BDBDBD' }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="hope-input pl-10" placeholder="admin@nabh.com" />
                </div>
              </div>
              <div>
                <label className="hope-label">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BDBDBD' }} />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="hope-input pl-10" placeholder="Enter password" />
                </div>
              </div>
              <button type="submit" className="hope-btn-primary w-full py-3 text-base mt-2 flex items-center justify-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs" style={{ color: '#9E9E9E' }}>
              Default credentials: admin@nabh.com / nabh2026
            </div>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: '#9E9E9E' }}>
            Copyright © 2026 NABH. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
