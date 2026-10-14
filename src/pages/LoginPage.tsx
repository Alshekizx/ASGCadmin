import { useState } from 'react';
import type { AdminPage } from '../types/admin';

interface Props {
  page: AdminPage;
  setPage: (p: AdminPage) => void;
  onLogin: () => void;
}

export default function LoginPage({ page, setPage, onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    if (email === 'admin@asgc.org' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid credentials. Use admin@asgc.org / password');
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);
    setPage('reset-sent');
  };

  if (page === 'forgot-password') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #132040 60%, #1a2f4a 100%)' }}>
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 text-center" style={{ background: 'linear-gradient(135deg, #0a1628, #132040)' }}>
              <ASGCLogo />
            </div>
            <div className="px-8 py-8">
              <button onClick={() => setPage('login')} className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: '#6b7280' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
                Back to login
              </button>
              <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>Reset Password</h2>
              <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Enter your email address and we'll send you a recovery link.</p>
              <form onSubmit={handleRecovery} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Email Address</label>
                  <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} placeholder="you@asgc.org" className="w-full px-4 py-2.5 rounded-lg border text-sm" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity" style={{ background: 'linear-gradient(135deg, #0a1628, #132040)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending...' : 'Send Recovery Link'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'reset-sent') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #132040 60%, #1a2f4a 100%)' }}>
        <div className="w-full max-w-md mx-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 text-center" style={{ background: 'linear-gradient(135deg, #0a1628, #132040)' }}>
              <ASGCLogo />
            </div>
            <div className="px-8 py-10 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>Check Your Email</h2>
              <p className="text-sm mb-6" style={{ color: '#6b7280' }}>A password recovery link has been sent to <strong>{recoveryEmail || 'your email'}</strong>. Please check your inbox and follow the instructions.</p>
              <p className="text-xs mb-6" style={{ color: '#9ca3af' }}>Didn't receive an email? Check your spam folder or try again.</p>
              <button onClick={() => setPage('login')} className="w-full py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #0a1628, #132040)', color: '#fff' }}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #132040 60%, #1a2f4a 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 p-12 border-r" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
        <ASGCLogo />
        <div>
          <div className="w-8 h-0.5 mb-6" style={{ background: '#c9a84c' }} />
          <blockquote className="text-lg leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
            "Championing sustainable growth and strategic partnerships across Africa and the global south."
          </blockquote>
          <p className="text-xs" style={{ color: 'rgba(201,168,76,0.7)' }}>ASGC Content Management System</p>
        </div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © 2026 Africa Strategic Growth Council. Secure Admin Portal.
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <ASGCLogo />
          </div>
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-8 py-7 border-b" style={{ borderColor: '#f0f2f5' }}>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>Administrator Login</h2>
              <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Sign in to manage ASGC content and settings</p>
            </div>
            <div className="px-8 py-8">
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@asgc.org" className="w-full px-4 py-2.5 rounded-lg border text-sm transition-colors" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} autoComplete="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#374151' }}>Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="w-full px-4 py-2.5 pr-11 rounded-lg border text-sm" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:opacity-70 transition-opacity" style={{ color: '#9ca3af' }}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: '#c9a84c' }} />
                    <span className="text-sm" style={{ color: '#374151' }}>Remember Me</span>
                  </label>
                  <button type="button" onClick={() => setPage('forgot-password')} className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: '#c9a84c' }}>
                    Forgot Password?
                  </button>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #0a1628, #132040)', color: '#fff', opacity: loading ? 0.75 : 1 }}>
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Signing in…
                    </>
                  ) : 'Sign In'}
                </button>
              </form>
              <p className="text-xs text-center mt-6" style={{ color: '#9ca3af' }}>
                Secure access — authorised personnel only.<br />Demo: admin@asgc.org / password
              </p>
            </div>
          </div>
          <div className="text-center mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Protected by 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}

function ASGCLogo() {
  return <img src="/ASGC_colored_logo.png" alt="ASGC" className="w-32 h-auto object-contain bg-white rounded-lg p-3" />;
}

function EyeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
