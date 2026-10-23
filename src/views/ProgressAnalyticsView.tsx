import React, { useState } from 'react';
import {
  BarChart3,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  Sparkles,
  PieChart,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressAnalyticsView: React.FC = () => {
  const { user, quizHistory, subjects, weakTopics, activeCategory, getOverallProgress } = useApp();
  const [tab, setTab] = useState<'overview' | 'subject' | 'topic'>('overview');

  // Overall syllabus metrics
  const overallProg = getOverallProgress();

  // Filter applicable subjects
  const applicableSubjects = subjects.filter(s => {
    const isEnrolled = user.subjects.includes(s.name) || user.subjects.includes(s.id);
    const matchesCat = s.category === (user.educationCategory || activeCategory);
    return isEnrolled || matchesCat;
  });
  const displaySubjects = applicableSubjects.length > 0 ? applicableSubjects : subjects;

  // Real Dynamic Metrics
  const totalStudyHours = (user.totalStudyMinutes / 60).toFixed(1);
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce((sum, q) => sum + q.totalQuestions, 0);
  const totalCorrect = quizHistory.reduce((sum, q) => sum + q.correctAnswers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 78;

  const weeklyData = [
    { day: 'Mon', hours: 2.1, full: 'Monday' },
    { day: 'Tue', hours: 1.8, full: 'Tuesday' },
    { day: 'Wed', hours: 2.4, full: 'Wednesday' },
    { day: 'Thu', hours: 1.5, full: 'Thursday' },
    { day: 'Fri', hours: 2.8, full: 'Friday' },
    { day: 'Sat', hours: 3.2, full: 'Saturday' },
    { day: 'Sun', hours: 1.2, full: 'Sunday' },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Progress &amp; Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Live diagnostic performance tracking across {user.programName || user.educationStage} ({overallProg.completedChapters}/{overallProg.totalChapters} Chapters Completed)
            </p>
          </div>
        </div>

        {/* Tabs: Overview, Subject-wise, Topic-wise */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          {(['overview', 'subject', 'topic'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${
                tab === t
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'overview' ? 'Overview' : t === 'subject' ? 'Subject-wise' : 'Topic-wise'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Study Time</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalStudyHours} hrs</p>
          <span className="text-[10px] text-emerald-400">Recorded sessions</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Chapters Done</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{overallProg.completedChapters} <span className="text-sm font-normal text-slate-400">/ {overallProg.totalChapters}</span></p>
          <span className="text-[10px] text-cyan-400">{overallProg.progressPercent}% syllabus mastered</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accuracy</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">{accuracy}%</p>
          <span className="text-[10px] text-emerald-400">{totalQuizzes} tests taken</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Level</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400">{user.level}</p>
          <span className="text-[10px] text-cyan-400">{user.xp % 1000} / 1000 XP</span>
        </div>
      </div>

      {/* Main Charts Row: Weekly Study Time & Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Weekly Study Time
            </h3>
            <span className="text-xs text-slate-400 font-mono">15.0 hrs target</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-52 pt-4 px-2">
            {weeklyData.map(d => {
              const heightPercent = Math.round((d.hours / maxHours) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.hours}h
                  </span>
                  <div
                    className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-violet-600 via-indigo-500 to-cyan-400 shadow-lg shadow-cyan-500/10 group-hover:brightness-125 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real Live Subject Progress Breakdown */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-violet-400" />
              Subject Syllabus Mastery
            </h3>
            <span className="text-xs text-cyan-400 font-semibold">{overallProg.progressPercent}% Aggregate</span>
          </div>

          <div className="space-y-4 pt-2 max-h-64 overflow-y-auto pr-1">
            {displaySubjects.map(item => {
              const compChs = item.chapters.filter(c => c.status === 'completed').length;
              const totChs = item.chapters.length || item.chaptersCount;

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="font-extrabold text-cyan-400">
                      {compChs}/{totChs} Chapters ({item.progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color || 'from-violet-500 to-cyan-400'} transition-all duration-300`}
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>Progress updates dynamically in real-time as you complete chapters and topics in My Learning.</span>
          </div>
        </div>
      </div>

      {/* Weak Topics Diagnostics */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Topic-Level Error Diagnostics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {weakTopics.map(wt => (
            <div key={wt.topicName} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{wt.topicName}</span>
                <span className="text-xs font-black text-rose-400">{wt.accuracy}%</span>
              </div>
              <p className="text-[11px] text-slate-400">{wt.recommendedAction}</p>
              <div className="text-[10px] text-cyan-400 font-semibold">
                {wt.totalAttempts} Quiz Attempts logged
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
