'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', email); // backend uses 'username' field
      formData.append('password', password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('nabh_token', data.access_token);
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Please check your email/password.');
      }
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#020617' }}>
      <header className="hg-header px-6 py-3 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-white">NABH</h1>
            <p className="text-[11px] text-white/80 -mt-0.5">National Accreditation Board for Hospitals & Healthcare Providers</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="hg-card p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,242,255,0.1)' }}>
                <Lock className="w-6 h-6" style={{ color: '#00F2FF' }} />
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#F8FAFC' }}>Sign In to Portal</h2>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>Enter your credentials to access the dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded text-sm font-medium flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                <Lock className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="hg-label">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BDBDBD' }} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="hg-input" style={{ paddingLeft: '44px' }} placeholder="admin@nabh.com" />
                </div>
              </div>
              <div>
                <label className="hg-label">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BDBDBD' }} />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    className="hg-input" style={{ paddingLeft: '44px' }} placeholder="Enter password" />
                </div>
              </div>
              <button type="submit" className="hg-btn-primary w-full py-3 text-base mt-2 flex items-center justify-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>

          <p className="text-center text-xs mt-4" style={{ color: '#475569' }}>
            Copyright © 2026 NABH. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
