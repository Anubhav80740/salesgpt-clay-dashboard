'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [username, setUsername] = useState('dashboard@salesgpt.ai');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(redirectPath);
        router.refresh();
      } else {
        setError(data.message || 'Invalid login credentials. Please check your password.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillTeamCredentials = () => {
    setUsername('dashboard@salesgpt.ai');
    setPassword('Mountain-Ocean-Storm25#');
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Employee Login</h2>
          <p className="text-[11px] text-slate-500">Sign in to access comparative analytics</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Protected Route
        </span>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Username / Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Employee User / Email
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. dashboard@salesgpt.ai"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={fillTeamCredentials}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Fill Team Credentials
            </button>
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter team password"
              className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to Dashboard</span>
            </>
          )}
        </button>
      </form>

      {/* Preset hint box for team */}
      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50/70 p-3 rounded-xl border border-slate-200/50 space-y-1">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          Team Access Credentials:
        </div>
        <div className="font-mono text-[10px] text-slate-600">
          User: <span className="text-slate-900 font-semibold">dashboard@salesgpt.ai</span>
        </div>
        <div className="font-mono text-[10px] text-slate-600">
          Password: <span className="text-blue-700 font-semibold font-mono">Mountain-Ocean-Storm25#</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 font-sans text-slate-900 antialiased">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SalesGPT Data Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Internal Team Access Control & Reconciliation Engine
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card text-center text-xs text-slate-500">
            Loading authentication portal...
          </div>
        }>
          <LoginForm />
        </Suspense>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400">
          Internal SalesGPT Analytics System • Restricted Access
        </p>
      </div>
    </div>
  );
}
