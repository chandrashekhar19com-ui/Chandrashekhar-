import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  BookOpen,
  Trash2,
  CalendarDays,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudyTask } from '../types';

export const StudyPlannerView: React.FC = () => {
  const { studyTasks, toggleTaskCompletion, addStudyTask, deleteStudyTask, user } = useApp();

  const [activeTab, setActiveTab] = useState<'weekly' | 'exam'>('weekly');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form state
  const [newDay, setNewDay] = useState('Mon 21');
  const [newSubject, setNewSubject] = useState('Maths');
  const [newChapter, setNewChapter] = useState('');
  const [newHours, setNewHours] = useState(1.5);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapter.trim()) return;

    addStudyTask({
      day: newDay,
      dateStr: '2025-04-21',
      subject: newSubject,
      chapterTitle: newChapter,
      durationHours: newHours,
      completed: false,
      targetExam: user.examName || 'Board Exam',
    });

    setNewChapter('');
    setShowAddTaskModal(false);
  };

  const completedHours = studyTasks
    .filter(t => t.completed)
    .reduce((acc, t) => acc + t.durationHours, 0);

  const totalPlannedHours = studyTasks.reduce((acc, t) => acc + t.durationHours, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Study Planner &amp; Timetable
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized syllabus targets balanced against target exam dates
            </p>
          </div>
        </div>

        {/* Tab Controls: Weekly Plan vs Exam Planner */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Plan
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exam Planner
          </button>
        </div>
      </div>

      {activeTab === 'weekly' ? (
        <div className="space-y-6">
          {/* Week Date Navigator Header - Matching Showcase Image */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-cyan-400" />
              Apr 21 – Apr 27, 2025
            </span>
            <button className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Planned Hours Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#0e1526]/80 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Total Planned Study</p>
              <p className="text-2xl font-black text-white">{totalPlannedHours} hrs</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1526]/80 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Completed This Week</p>
              <p className="text-2xl font-black text-emerald-400">{completedHours} hrs</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e1526]/80 border border-slate-800 space-y-1">
              <p className="text-xs text-slate-400">Daily Study Goal</p>
              <p className="text-2xl font-black text-cyan-400">
                {user.dailyGoalMinutes} min/day
              </p>
            </div>
          </div>

          {/* Schedule List - Matching Showcase Image Layout */}
          <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Daily Study Targets
              </span>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {studyTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    task.completed
                      ? 'bg-slate-900/50 border-slate-800/60 opacity-80'
                      : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-14 text-xs font-extrabold text-slate-400 uppercase">
                      {task.day}
                    </span>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400">
                          {task.subject}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {task.chapterTitle}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Target duration: {task.durationHours}h
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        deleteStudyTask(task.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Exam Planner Tab */
        <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Target className="w-6 h-6 text-indigo-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Target Exam Milestone</h3>
              <p className="text-xs text-slate-400">
                {user.examName || 'Board Exam - Class 10'} (March 25, 2026)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Strategic Syllabus Countdown
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                With approximately 330 days remaining, allocating 1.5 hours per subject per week allows 3 full revisions before practicals and board mock exams commence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-400">Phase 1: Syllabus Completion</span>
                <p className="text-xs text-slate-400">Target: Oct 30, 2025</p>
                <div className="w-full h-2 rounded-full bg-slate-800">
                  <div className="w-3/5 h-full rounded-full bg-cyan-400" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-violet-400">Phase 2: Sample Papers &amp; Mocks</span>
                <p className="text-xs text-slate-400">Target: Dec 15 - Feb 10, 2026</p>
                <div className="w-full h-2 rounded-full bg-slate-800">
                  <div className="w-1/4 h-full rounded-full bg-violet-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-[#060a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0e1628] border border-cyan-500/30 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white">Add Study Target</h3>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Day
                </label>
                <input
                  type="text"
                  value={newDay}
                  onChange={e => setNewDay(e.target.value)}
                  placeholder="e.g. Mon 21, Sat 26"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Maths">Maths</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Revision">Revision</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Chapter &amp; Focus Area
                </label>
                <input
                  type="text"
                  value={newChapter}
                  onChange={e => setNewChapter(e.target.value)}
                  placeholder="e.g. Trigonometry Identities Ex 8.4"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newHours}
                  onChange={e => setNewHours(parseFloat(e.target.value))}
                  min="0.5"
                  max="6"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
