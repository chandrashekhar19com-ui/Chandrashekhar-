import React from 'react';
import { ArrowLeft, Sparkles, Brain, Code2, ShieldCheck, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

export const AboutAppModal: React.FC = () => {
  const { showAboutModal, setShowAboutModal } = useApp();

  if (!showAboutModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060a14]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1322] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Back button */}
        <div className="p-5 border-b border-slate-800/80 bg-gradient-to-r from-violet-950/40 via-slate-900 to-cyan-950/40 flex items-center justify-between">
          <button
            onClick={() => setShowAboutModal(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Settings</span>
          </button>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            About App
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-center">
          {/* Logo & Identity */}
          <div className="flex flex-col items-center">
            <BrandLogo size="lg" showTagline={false} />
            <p className="text-sm font-semibold text-cyan-300 mt-2">
              Grow Your Knowledge. Master Your Future.
            </p>
          </div>

          {/* Creator Attribution Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900/30 via-slate-900/60 to-cyan-900/30 border border-violet-500/30 space-y-1">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Created By
            </p>
            <p className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Chandrashekhar Singh
            </p>
            <p className="text-[11px] text-slate-400">
              Full-Stack Architect, Educational Product Designer &amp; AI Engineer
            </p>
          </div>

          {/* App Purpose & Mission */}
          <div className="text-left space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Brain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">App Purpose</strong>
                An AI-powered learning platform for school, higher education, professional studies and lifelong learning.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">Core AI Engine</strong>
                Google Gemini integration for contextual tutoring in English, Hindi, and Hinglish with zero-latency curriculum fallback.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold mb-0.5">Privacy First</strong>
                Local study history, full JSON backup/restore, zero ads, no predatory gamification.
              </div>
            </div>
          </div>

          {/* Technical Specs & Version */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Platform: Web SPA (Vite + React 19)</span>
            </div>
            <div className="font-semibold text-slate-300">
              Version: <span className="text-cyan-400">2.0.0 (Higher Ed Expansion)</span>
            </div>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="p-4 bg-[#0a0f1d] border-t border-slate-800 flex justify-center">
          <button
            onClick={() => setShowAboutModal(false)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
