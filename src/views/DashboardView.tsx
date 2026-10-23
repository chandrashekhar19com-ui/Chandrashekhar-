import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Coins,
  Clock,
  Award,
  ChevronRight,
  Bot,
  BrainCircuit,
  Layers,
  Timer,
  FileText,
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  BookMarked,
  Compass,
  FolderGit2,
  SlidersHorizontal,
  Check,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationCategory } from '../types';

export const DashboardView: React.FC = () => {
  const {
    user,
    setActiveView,
    missions,
    weakTopics,
    subjects,
    quizHistory,
    assignments,
    claimMissionReward,
    activeCategory,
    getOverallProgress,
    toggleChapterStatus,
    selectCourse,
    educationSectors,
  } = useApp();

  // Quick program switcher modal state
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const [modalCat, setModalCat] = useState<EducationCategory>(user.educationCategory || 'school');
  const [modalProg, setModalProg] = useState(user.programName || '');
  const [modalSem, setModalSem] = useState(user.semesterOrYear || '');
  const [modalStream, setModalStream] = useState(user.streamOrSpecialization || '');
  const [modalSubs, setModalSubs] = useState<string[]>(user.subjects || []);

  // Filter subjects applicable to user's enrolled subjects or active education category
  const relevantSubjects = subjects.filter(s => {
    const isEnrolled = user.subjects.includes(s.name) || user.subjects.includes(s.id);
    const matchesCat = s.category === (user.educationCategory || activeCategory);
    return isEnrolled || matchesCat;
  });

  const currentProgramSubjects = relevantSubjects.length > 0 ? relevantSubjects : subjects.slice(0, 4);

  // Overall syllabus metrics
  const overallMetrics = getOverallProgress();

  // XP progress calculation
  const currentXP = user.xp % 1000;
  const xpTarget = 1000;
  const xpPercent = Math.min(100, Math.round((currentXP / xpTarget) * 100));

  // Recent quiz accuracy
  const totalRecentQuestions = quizHistory.slice(0, 5).reduce((acc, q) => acc + q.totalQuestions, 0);
  const correctRecentQuestions = quizHistory.slice(0, 5).reduce((acc, q) => acc + q.correctAnswers, 0);
  const accuracyPercent = totalRecentQuestions > 0 ? Math.round((correctRecentQuestions / totalRecentQuestions) * 100) : 78;

  // Next chapter to study
  const allEnrolledChapters = currentProgramSubjects.flatMap(s =>
    s.chapters.map(c => ({ ...c, subjectId: s.id, subjectName: s.name }))
  );
  const nextChapter = allEnrolledChapters.find(c => c.status !== 'completed') || allEnrolledChapters[0];

  const quickActions = [
    { label: 'AI Tutor', icon: Bot, view: 'tutor', color: 'from-violet-600 to-indigo-600' },
    { label: 'Education Field', icon: GraduationCap, view: 'education-field', color: 'from-cyan-600 to-blue-600' },
    { label: 'My Learning', icon: BookMarked, view: 'my-learning', color: 'from-blue-600 to-cyan-600' },
    { label: 'Practice & Quiz', icon: BrainCircuit, view: 'quiz', color: 'from-fuchsia-600 to-pink-600' },
    { label: 'Focus Timer', icon: Timer, view: 'timer', color: 'from-emerald-600 to-teal-600' },
  ];

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    selectCourse(
      modalCat,
      modalProg || 'Academic Curriculum',
      modalStream,
      modalSem,
      user.institutionOrUniversity,
      modalSubs
    );
    setShowSwitcherModal(false);
  };

  const toggleModalSub = (subName: string) => {
    if (modalSubs.includes(subName)) {
      if (modalSubs.length > 1) {
        setModalSubs(modalSubs.filter(s => s !== subName));
      }
    } else {
      setModalSubs([...modalSubs, subName]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Personalized Academic Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#171439] via-[#0f172a] to-[#0c1f38] border border-cyan-500/25 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Good Morning, {user.name}! 🎓
            </h1>
            <span className="text-xs px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold border border-cyan-500/30">
              {user.programName || `${user.educationStage} • ${user.board}`}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {overallMetrics.completedChapters} of {overallMetrics.totalChapters} Chapters Completed ({overallMetrics.progressPercent}%) • Aligned with {user.institutionOrUniversity || user.board}.
          </p>
        </div>

        {/* Action quick links */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setModalCat(user.educationCategory || 'school');
              setModalProg(user.programName || '');
              setModalSem(user.semesterOrYear || '');
              setModalStream(user.streamOrSpecialization || '');
              setModalSubs(user.subjects || []);
              setShowSwitcherModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customize Program</span>
          </button>
          <button
            onClick={() => setActiveView('tutor')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Main Stats Row: Explorer Level & Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Explorer Level Bar & Badges */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Level {user.level} Academic Explorer
                </h3>
                <p className="text-xs text-slate-400">
                  {currentXP} / {xpTarget} XP to Level {user.level + 1}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('missions')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Rewards Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 transition-all duration-500 shadow-sm"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{xpPercent}% Milestone Reached</span>
              <span>{1000 - currentXP} XP to Level-Up</span>
            </div>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Study Time
                </p>
                <p className="text-sm sm:text-base font-extrabold text-white">
                  {user.totalStudyMinutes} min
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-950/60 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Daily Streak
                </p>
                <p className="text-sm sm:text-base font-extrabold text-white">
                  {user.streakDays} days
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Coins
                </p>
                <p className="text-sm sm:text-base font-extrabold text-white">
                  {user.coins}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus Completion Summary Diagnostic */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Syllabus Completion
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="my-auto py-2 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Curriculum Mastered</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {overallMetrics.progressPercent}%
              </p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span>{overallMetrics.completedChapters} of {overallMetrics.totalChapters}</span> chapters completed
              </p>
            </div>

            <div className="flex items-end gap-1.5 h-16 px-2">
              {currentProgramSubjects.map((sub, i) => (
                <div key={sub.id} className="flex flex-col items-center gap-1">
                  <div
                    className="w-4 rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-400 shadow-sm transition-all"
                    style={{ height: `${Math.max(15, sub.progressPercent)}%` }}
                    title={`${sub.name}: ${sub.progressPercent}%`}
                  />
                  <span className="text-[9px] text-slate-400">{sub.name.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('analytics')}
            className="w-full mt-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-cyan-300 font-semibold border border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Detailed Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Continue Learning + Recommended Learning Path Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-violet-950/30 border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Continue Learning
            </span>
            <span className="text-[11px] text-slate-400">
              Active Unit Roadmap
            </span>
          </div>

          {nextChapter ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {nextChapter.subjectName}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                    nextChapter.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : nextChapter.status === 'in_progress'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {nextChapter.status === 'completed' ? 'Completed ✓' : nextChapter.status === 'in_progress' ? 'In Progress ⏳' : 'Not Started'}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {nextChapter.unitCode || `Chapter ${nextChapter.chapterNumber}`}: {nextChapter.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {nextChapter.completedTopics}/{nextChapter.totalTopics} Topics Completed
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleChapterStatus(nextChapter.subjectId, nextChapter.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{nextChapter.status === 'completed' ? 'Completed ✓' : 'Mark Done'}</span>
                </button>

                <button
                  onClick={() => setActiveView('my-learning')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 whitespace-nowrap cursor-pointer"
                >
                  <span>Resume Study</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400">
              All enrolled units are completed! Explore more subjects or career pathways below.
            </div>
          )}
        </div>

        {/* Career & Higher-Study Pathways Shortcut */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Career &amp; Study Explorer
            </h3>
            <p className="text-xs text-slate-400">
              Explore eligibility, entrance requirements, and prospective career paths.
            </p>
          </div>

          <button
            onClick={() => setActiveView('career-explorer')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Explore Pathways</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
          Quick Study Navigation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setActiveView(action.view as any)}
                className="p-4 rounded-2xl bg-[#0e1526]/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Columns: My Courses & Syllabus Progress + Assignments & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Course & Subjects with Live Status */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-cyan-400" />
              My Enrolled Subjects ({currentProgramSubjects.length})
            </h3>
            <button
              onClick={() => setActiveView('my-learning')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              View Full Syllabus
            </button>
          </div>

          <div className="space-y-3">
            {currentProgramSubjects.map(s => {
              const compCount = s.chapters.filter(c => c.status === 'completed').length;
              const totalCount = s.chapters.length || s.chaptersCount;

              return (
                <div
                  key={s.id}
                  onClick={() => setActiveView('my-learning')}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="font-extrabold text-cyan-400">
                      {compCount}/{totalCount} Chapters ({s.progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${s.progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {s.chaptersCount} Modules / Units • {s.topicsCount} Topics
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignments & Projects Tracker */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-violet-400" />
              Assignments &amp; Projects
            </h3>
            <button
              onClick={() => setActiveView('my-learning')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Manage ({assignments.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {assignments.slice(0, 3).map(asg => (
              <div
                key={asg.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase px-2 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {asg.type}
                    </span>
                    <span className="text-xs font-bold text-white">{asg.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Due: {asg.dueDate} • {asg.subject}</p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  asg.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {asg.status === 'completed' ? 'Done ✓' : 'Pending'}
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming Exam Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-violet-950/50 border border-indigo-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-300">Target Assessment</span>
              <p className="text-xs font-extrabold text-white">{user.examName || 'Semester Examination'}</p>
              <p className="text-[10px] text-slate-400">Target Date: {user.examDate || 'March 2026'}</p>
            </div>
            <button
              onClick={() => setActiveView('planner')}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs cursor-pointer"
            >
              View Plan
            </button>
          </div>
        </div>
      </div>

      {/* Today's Missions & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missions */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Daily Study Missions
            </h3>
            <button
              onClick={() => setActiveView('missions')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {missions.slice(0, 3).map(m => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-200">{m.title}</p>
                    <span className="text-[11px] font-bold text-cyan-400">+{m.xpReward} XP</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                    />
                  </div>
                </div>

                {m.isCompleted ? (
                  m.isClaimed ? (
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 font-bold">
                      Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => claimMissionReward(m.id)}
                      className="text-[10px] px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold shadow-sm animate-pulse cursor-pointer"
                    >
                      Claim
                    </button>
                  )
                ) : (
                  <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-400 font-medium">
                    {m.progress}/{m.target}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Weak Topics &amp; Revision Remedies
            </h3>
            <button
              onClick={() => setActiveView('weak-topics')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold"
            >
              Diagnose
            </button>
          </div>

          <div className="space-y-2">
            {weakTopics.slice(0, 3).map(wt => (
              <div
                key={wt.topicName}
                onClick={() => setActiveView('quiz')}
                className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{wt.topicName}</p>
                    <p className="text-[10px] text-slate-400">{wt.recommendedAction}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                  <span>{wt.accuracy}%</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program Switcher Modal */}
      {showSwitcherModal && (
        <div className="fixed inset-0 z-50 bg-[#060a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0e1628] border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Academic Roadmap Switcher
                </span>
                <h2 className="text-xl font-black text-white">
                  Switch Field, Class &amp; Subjects
                </h2>
                <p className="text-xs text-slate-400">
                  Select your active education field, program, semester, and subjects.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSwitcherModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-5">
              {/* Field picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Education Field:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {educationSectors.map(sec => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setModalCat(sec.id);
                        setModalProg(sec.popularPrograms[0]);
                        const relevant = subjects.filter(s => s.category === sec.id);
                        if (relevant.length > 0) {
                          setModalSubs(relevant.map(s => s.name));
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        modalCat === sec.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="block truncate">{sec.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{sec.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Course and Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    2. Program / Degree / Class
                  </label>
                  <input
                    type="text"
                    value={modalProg}
                    onChange={e => setModalProg(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science, Class 10"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    3. Semester / Term / Year
                  </label>
                  <input
                    type="text"
                    value={modalSem}
                    onChange={e => setModalSem(e.target.value)}
                    placeholder="e.g. Semester 3, Final Term"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Enrolled Subjects */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  4. Enrolled Subjects ({modalSubs.length} selected):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  {subjects.map(sub => {
                    const isChecked = modalSubs.includes(sub.name) || modalSubs.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => toggleModalSub(sub.name)}
                        className={`p-2.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{sub.name}</span>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSwitcherModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Save &amp; Switch Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
