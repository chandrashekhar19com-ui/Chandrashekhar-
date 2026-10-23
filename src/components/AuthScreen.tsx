import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const AuthScreen: React.FC = () => {
  const { loginAsGuest, loginWithEmail } = useApp();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('student@brainroot.ai');
  const [password, setPassword] = useState('mastery2026');
  const [name, setName] = useState('Student Explorer');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or mobile number.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginWithEmail(emailOrPhone, name);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginWithEmail('chandrashekhar19.com@gmail.com', 'Chandrashekhar');
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-[#080d1a] flex items-center justify-center p-4 lg:p-8">
      {/* Background Cosmic Glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-slate-800 bg-[#0d1322]/80 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        {/* Left Hero Banner - Matching the Showcase layout */}
        <div className="relative p-8 lg:p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#12102e] via-[#0d172a] to-[#071322] border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div className="space-y-6 z-10">
            <BrandLogo size="lg" showTagline={true} />

            <div className="space-y-2 mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Empowering Class 1 - 12 Students
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                AI-Powered <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
                  Gamified Education
                </span>
              </h1>
              <p className="text-sm text-slate-300/90 leading-relaxed max-w-sm">
                Interactive quizzes, exam simulations, AI tutor mentoring, smart flashcards, and weak-topic diagnostics all in one futuristic study hub.
              </p>
            </div>
          </div>

          {/* Center Mascot Artwork */}
          <div className="relative my-6 flex items-center justify-center z-10">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-600/30 to-fuchsia-500/20 p-2 flex items-center justify-center shadow-2xl border border-cyan-500/30 animate-pulse-glow">
              {/* Astro Bot Mascot */}
              <div className="w-full h-full rounded-full bg-[#0a0f1d] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 p-1 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full rounded-xl bg-[#090e1a] flex flex-col items-center justify-center relative">
                    {/* Robot Visor */}
                    <div className="w-16 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 flex items-center justify-around px-2 shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                      <div className="w-2 h-2 rounded-full bg-[#0a0f1d] animate-ping" />
                      <div className="w-2 h-2 rounded-full bg-[#0a0f1d]" />
                    </div>
                    {/* Headset / Antenna */}
                    <div className="absolute -top-3 w-2 h-3 bg-cyan-400 rounded-t-full" />
                    <div className="absolute -top-4 w-3 h-3 bg-violet-400 rounded-full shadow-[0_0_10px_#a78bfa]" />
                  </div>
                </div>
                {/* Books & Neon Base */}
                <div className="mt-3 flex gap-1 items-center">
                  <span className="h-1.5 w-6 rounded bg-cyan-400/80" />
                  <span className="h-1.5 w-8 rounded bg-violet-400/80" />
                  <span className="h-1.5 w-6 rounded bg-emerald-400/80" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 z-10">
            <span>Created by: <strong className="text-slate-200">Chandrashekhar Singh</strong></span>
            <span className="flex items-center gap-1 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Free-First EdTech
            </span>
          </div>
        </div>

        {/* Right Auth Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-[#0a0e1c]/90">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Tabs: Login / Sign Up */}
            <div className="flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  tab === 'login'
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  tab === 'signup'
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <span>⚠️ {errorMsg}</span>
              </div>
            )}

            {/* Forgot Password Modal */}
            {showForgotPassword ? (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Reset Password</h3>
                <p className="text-xs text-slate-400">
                  Enter your email or registered phone number to receive your reset link.
                </p>
                {resetSent ? (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Password reset link sent to {emailOrPhone}!
                  </div>
                ) : (
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={e => setEmailOrPhone(e.target.value)}
                    placeholder="Enter email or mobile"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                  />
                )}
                <div className="flex gap-2">
                  {!resetSent && (
                    <button
                      type="button"
                      onClick={() => setResetSent(true)}
                      className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
                    >
                      Send Reset Link
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSent(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      required
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={e => setEmailOrPhone(e.target.value)}
                    placeholder="student@brainroot.ai"
                    required
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{tab === 'login' ? 'Login' : 'Create Student Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Alternative Auth Dividers */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0a0e1c] px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Or
              </span>
            </div>

            {/* Google Continue */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Guest Mode - Exactly as in the showcase image */}
            <button
              type="button"
              onClick={loginAsGuest}
              className="w-full py-2.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Explore as Guest Mode</span>
            </button>

            {/* Bottom Toggle */}
            <p className="text-center text-xs text-slate-400">
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 ml-1"
              >
                {tab === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
