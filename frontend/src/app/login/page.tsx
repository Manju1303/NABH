'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, ArrowRight, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const [customApiUrl, setCustomApiUrl] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);

  const testBackendConnection = (urlToTest: string) => {
    setIsOnline(null);
    const targetUrl = urlToTest.trim().replace(/\/$/, '');
    fetch(`${targetUrl}/`)
      .then(r => setIsOnline(r.ok))
      .catch(() => setIsOnline(false));
  };

  useEffect(() => {
    const savedCustomUrl = localStorage.getItem('nabh_custom_api_url') || '';
    setCustomApiUrl(savedCustomUrl);
    testBackendConnection(savedCustomUrl || API_BASE_URL);
  }, []);

  const saveCustomApiUrl = () => {
    if (customApiUrl.trim()) {
      localStorage.setItem('nabh_custom_api_url', customApiUrl.trim());
      testBackendConnection(customApiUrl.trim());
    } else {
      localStorage.removeItem('nabh_custom_api_url');
      testBackendConnection(API_BASE_URL);
    }
    setShowApiConfig(false);
  };

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('nabh_token');
    if (token) router.replace('/dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const activeBase = (localStorage.getItem('nabh_custom_api_url') || API_BASE_URL).replace(/\/$/, '');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${activeBase}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('nabh_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('nabh_refresh_token', data.refresh_token);
        }
        window.location.href = '/dashboard';
      } else {
        const err = await response.json().catch(() => ({}));
        setError(err.detail || 'Invalid credentials. Please check your email/password.');
      }
    } catch (e: any) {
      setError(`Connection failed. Backend unreachable at ${activeBase}. If deployed on Vercel, click 'Configure API' above.`);
      setShowApiConfig(true);
    } finally {
      setLoading(false);
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
            <p className="text-[11px] text-white/80 -mt-0.5">National Accreditation Board for Hospitals &amp; Healthcare Providers</p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button 
            type="button" 
            onClick={() => setShowApiConfig(!showApiConfig)}
            className="px-3 py-1 bg-white/10 border border-white/10 text-white rounded text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" /> Configure API
          </button>
          <div className={`w-2 h-2 rounded-full ${isOnline === true ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : isOnline === false ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-slate-500 animate-pulse'}`} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer" onClick={() => setShowApiConfig(true)}>
            {isOnline === true ? 'Backend Online' : isOnline === false ? 'Backend Offline' : 'Checking...'}
          </span>
        </div>
      </header>

      {/* Dynamic API Configurator Panel */}
      {showApiConfig && (
        <div className="bg-slate-900 border-b border-cyan-500/30 p-4 animate-in slide-in-from-top duration-300">
          <div className="max-w-md mx-auto space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Production Backend API Settings</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customApiUrl} 
                onChange={e => setCustomApiUrl(e.target.value)} 
                placeholder="e.g. https://nabh-backend.onrender.com" 
                className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-xs font-bold text-white focus:border-cyan-500 outline-none"
              />
              <button 
                type="button"
                onClick={saveCustomApiUrl} 
                className="px-4 py-2 bg-cyan-500 text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-cyan-400 transition-all"
              >
                CONNECT
              </button>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">Enter your HTTPS backend URL deployed on Render / Railway to connect Vercel frontend.</p>
          </div>
        </div>
      )}

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
              <div className="mb-4 p-3 rounded text-sm font-medium flex flex-col gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" /> {error}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="hg-label">Username / Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BDBDBD' }} />
                  <input type="text" required value={email} onChange={e => setEmail(e.target.value)}
                    className="hg-input" style={{ paddingLeft: '44px' }} placeholder="admin@nabh.com" />
                </div>
              </div>
              <div>
                <label className="hg-label">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="hg-input" style={{ paddingLeft: '44px', paddingRight: '44px' }}
                    placeholder="Enter password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="hg-btn-primary w-full py-3 text-base mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
          <p className="text-center text-xs mt-4" style={{ color: '#475569' }}>
            Copyright © 2026 NABH HealthGuard AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

