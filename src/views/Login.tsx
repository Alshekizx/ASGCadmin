import { useState } from 'react';
import { Button, Input, Alert } from '../components/ui';
import type { AdminView } from '../types';

export default function Login({ onLogin, onNavigate }: { onLogin: () => void; onNavigate: (v: AdminView) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot' | 'reset-sent'>('login');
  const [forgotEmail, setForgotEmail] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@asgc.org' && password === 'admin123') {
        setLoading(false);
        onLogin();
      } else {
        setLoading(false);
        setError('Invalid email or password. Please try again.');
      }
    }, 800);
  }

  function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) return;
    setView('reset-sent');
  }

  if (view === 'forgot') {
    return (
      <LoginShell>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0B1F3A] font-serif">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send a reset link.</p>
        </div>
        <form onSubmit={handleForgot} className="flex flex-col gap-4">
          <Input label="Email Address" type="email" value={forgotEmail} onChange={setForgotEmail} placeholder="admin@asgc.org" required />
          <Button type="submit" className="w-full justify-center">Send Reset Link</Button>
          <button type="button" onClick={() => setView('login')} className="text-sm text-gray-500 hover:text-[#0B1F3A] text-center">← Back to Sign In</button>
        </form>
      </LoginShell>
    );
  }

  if (view === 'reset-sent') {
    return (
      <LoginShell>
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="text-xl font-bold text-[#0B1F3A] font-serif">Check Your Email</h2>
          <p className="text-sm text-gray-500 mt-2">A password reset link has been sent to <strong>{forgotEmail}</strong>. Please check your inbox and follow the instructions.</p>
          <Button variant="outline" onClick={() => setView('login')} className="mt-6 w-full justify-center">Back to Sign In</Button>
        </div>
      </LoginShell>
    );
  }

  return (
    <LoginShell>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0B1F3A] font-serif">Administrator Sign In</h2>
        <p className="text-sm text-gray-500 mt-1">Secure access for authorised personnel only.</p>
      </div>
      {error && <div className="mb-4"><Alert message={error} type="error" onClose={() => setError('')} /></div>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="admin@asgc.org" required />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#0B1F3A]">Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-xs text-gray-400">Demo: admin@asgc.org / admin123</p>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#C9A84C]"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <button type="button" onClick={() => setView('forgot')} className="text-sm text-[#C9A84C] hover:text-[#A8872C] font-medium">Forgot password?</button>
        </div>
        <Button type="submit" className="w-full justify-center" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </LoginShell>
  );
}

function LoginShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B1F3A] flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=800&fit=crop&auto=format)` }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <img src="/ASGC_White_Logo.png" alt="ASGC" className="w-10 h-10 object-contain flex-shrink-0" />
            <div>
              <p className="text-white font-bold">Ahmed Sule Global Centre</p>
              <p className="text-white/40 text-xs">Administration Portal</p>
            </div>
          </div>
          <div>
            <div className="w-12 h-0.5 bg-[#C9A84C] mb-6" />
            <h1 className="text-white font-serif text-4xl leading-snug mb-4">
              Empowering Africa's Economic Future
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Secure content management for ASGC's digital presence. Managing news, events, programmes, and partnerships that shape Africa's development narrative.
            </p>
          </div>
        </div>
        <p className="relative z-10 text-white/30 text-xs">
          &copy; {new Date().getFullYear()} Ahmed Sule Global Centre. All rights reserved.
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center bg-[#F4F5F7] p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="/ASGC_colored_logo.png" alt="ASGC" className="w-10 h-10 object-contain flex-shrink-0" />
            <div>
              <p className="font-bold text-[#0B1F3A] text-sm">ASGC</p>
              <p className="text-gray-400 text-xs">Admin Portal</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
