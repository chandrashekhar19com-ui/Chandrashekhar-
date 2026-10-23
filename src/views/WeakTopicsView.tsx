import React from 'react';
import { AlertCircle, CheckCircle2, ChevronRight, BrainCircuit, Bot, Layers, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WeakTopicsView: React.FC = () => {
  const { weakTopics, setActiveView } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Weak-Topic Diagnostic &amp; Error Remediation
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Pinpoints exact conceptual bottlenecks and provides personalized study remedies
            </p>
          </div>
        </div>
      </div>

      {/* Weak Topics List */}
      <div className="space-y-4">
        {weakTopics.map(wt => (
          <div
            key={wt.topicName}
            className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  {wt.subject}
                </span>
                <h3 className="text-base font-extrabold text-white">{wt.topicName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{wt.recommendedAction}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xl font-black text-rose-400">{wt.accuracy}%</span>
                  <p className="text-[10px] text-slate-400">{wt.totalAttempts} Quiz Attempts</p>
                </div>
              </div>
            </div>

            {/* Targeted Actions Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => setActiveView('quiz')}
                className="px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Practice 5 MCQs</span>
              </button>

              <button
                onClick={() => setActiveView('tutor')}
                className="px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Tutor to Explain</span>
              </button>

              <button
                onClick={() => setActiveView('flashcards')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Review Flashcards</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
