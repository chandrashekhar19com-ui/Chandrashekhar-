import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, BookOpen, GraduationCap, Clock, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationStage, BoardType, LanguagePreference } from '../types';

export const OnboardingModal: React.FC = () => {
  const { completeOnboarding, user } = useApp();

  const [step, setStep] = useState(1);
  const [stage, setStage] = useState<EducationStage>(user.educationStage || 'Class 10');
  const [board, setBoard] = useState<BoardType>(user.board || 'CBSE');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    user.subjects.length > 0 ? user.subjects : ['Mathematics', 'Science', 'English', 'Social Science']
  );
  const [language, setLanguage] = useState<LanguagePreference>(user.preferredLanguage || 'English');
  const [dailyMinutes, setDailyMinutes] = useState<number>(user.dailyGoalMinutes || 60);
  const [examDate, setExamDate] = useState<string>(user.examDate || '2026-03-25');

  const allSubjects = [
    'Mathematics',
    'Science',
    'English',
    'Social Science',
    'Computer Science & AI',
    'Hindi',
  ];

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      educationStage: stage,
      board,
      subjects: selectedSubjects,
      preferredLanguage: language,
      dailyGoalMinutes: dailyMinutes,
      examDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b16]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0e1628] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Header decoration */}
        <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-gradient-to-r from-violet-950/40 via-slate-900 to-cyan-950/40 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3 h-3" /> Step {step} of 6
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Welcome to BrainRoot AI!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Let&apos;s personalize your intelligent study roadmap
            </p>
          </div>

          {/* Stepper circles */}
          <div className="hidden sm:flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div
                key={num}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === num
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400'
                    : step > num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > num ? '✓' : num}
              </div>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                Select Your Education Stage / Class
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'] as EducationStage[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setStage(c)}
                    className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all ${
                      stage === c
                        ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-2 border-cyan-400 shadow-lg'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Sample syllabus questions are preloaded for Class 10 CBSE, with cross-curriculum compatibility.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-400" />
                Select Your Educational Board / Curriculum
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['CBSE', 'ICSE', 'State Board', 'Custom'] as BoardType[]).map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBoard(b)}
                    className={`py-4 px-4 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
                      board === b
                        ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 text-cyan-300 border-2 border-cyan-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{b}</span>
                    {board === b && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-white">
                Select Your Subjects <span className="text-xs text-slate-400 font-normal">(Multi-select enabled)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {allSubjects.map(sub => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`p-3 rounded-2xl text-xs font-semibold text-center transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400 shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {sub} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-white">
                Preferred Explanation Language for AI Tutor
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['English', 'Hindi', 'Hinglish'] as LanguagePreference[]).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`py-4 px-3 rounded-2xl text-xs sm:text-sm font-bold text-center transition-all ${
                      language === lang
                        ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-2 border-cyan-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Hinglish provides friendly Hindi explanations with English technical terms.
              </p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Daily Focus Study Goal
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[30, 45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all ${
                      dailyMinutes === mins
                        ? 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {mins} min/day
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <label className="block text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Target Exam Date (Optional)
              </label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300">
                🎉 Setup complete! You will earn <strong>+100 XP</strong> on starting your journey.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800/80 bg-[#0a0f1d] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <span>Start Learning Journey 🚀</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
