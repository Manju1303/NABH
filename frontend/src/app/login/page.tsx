'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      {/* HOPE-style Header */}
      <header className="hope-header px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">H</div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide">HOPE</h1>
            <p className="text-[11px] text-white/80 -mt-0.5">Healthcare Organisation Platform for Entry Level Certification</p>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="hope-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#E8F5E9' }}>
                <svg className="w-8 h-8" fill="none" stroke="#00695C" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.1.9-2 2-2h2a2 2 0 012 2v1m-6 0V9a4 4 0 118 0v2m-8 0h8m-8 0H7a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2h-1" /></svg>
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#00695C' }}>Sign In to Portal</h2>
              <p className="text-sm mt-1" style={{ color: '#9E9E9E' }}>Enter your credentials to access the dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded text-sm text-white font-medium" style={{ background: '#C62828' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="hope-label">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="hope-input" placeholder="admin@nabh.com" />
              </div>
              <div>
                <label className="hope-label">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="hope-input" placeholder="••••••••" />
              </div>
              <button type="submit" className="hope-btn-primary w-full py-3 text-base mt-2">
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center text-xs" style={{ color: '#9E9E9E' }}>
              Default: admin@nabh.com / nabh2026
            </div>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: '#9E9E9E' }}>
            © 2026 Healthcare Organisation Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
