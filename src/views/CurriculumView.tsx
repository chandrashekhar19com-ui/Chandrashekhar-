import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  BrainCircuit,
  ArrowLeft,
  Check,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject, Chapter, Topic, ChapterStatus } from '../types';

export const CurriculumView: React.FC = () => {
  const {
    subjects,
    user,
    setActiveView,
    setChapterStatus,
    toggleChapterStatus,
    toggleTopicCompletion,
  } = useApp();

  // Store IDs instead of object copies to prevent stale state issues
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Always resolve from canonical subjects in AppContext
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || null;
  const activeChapter = activeSubject?.chapters.find(c => c.id === selectedChapterId) || activeSubject?.chapters[0] || null;
  const activeTopic = activeChapter?.topics.find(t => t.id === selectedTopicId) || activeChapter?.topics[0] || null;

  // Filtered subjects or topics by search query
  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.chapters.some(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topics.some(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const getStatusBadge = (status?: ChapterStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            ○ Not Started
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {activeSubject && (
              <button
                onClick={() => {
                  setSelectedSubjectId(null);
                  setSelectedChapterId(null);
                  setSelectedTopicId(null);
                }}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {activeSubject ? activeSubject.name : 'Study Material & Curriculum'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {activeSubject
              ? `Exploring syllabus for ${user.programName || user.educationStage} (${user.institutionOrUniversity || user.board})`
              : 'Verified curriculum modules, key concepts, formulas, and topic objectives'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chapters or topics..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      </div>

      {/* Main Content: Overview or Detailed Chapter breakdown */}
      {!activeSubject ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Curriculum Subjects ({subjects.length})
            </span>
            <span className="text-xs text-cyan-400 font-semibold">
              {user.programName || `${user.educationStage} • ${user.board}`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubjects.map(sub => {
              const completedChs = sub.chapters.filter(c => c.status === 'completed').length;
              const totalChs = sub.chapters.length || sub.chaptersCount;

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setSelectedChapterId(sub.chapters[0]?.id || null);
                    setSelectedTopicId(sub.chapters[0]?.topics[0]?.id || null);
                  }}
                  className="p-6 rounded-3xl bg-[#0e1526]/80 hover:bg-[#11192e] border border-slate-800/80 hover:border-cyan-500/40 shadow-xl cursor-pointer transition-all space-y-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.color} flex items-center justify-center text-white shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform`}
                      >
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {completedChs}/{totalChs} Chapters Completed • {sub.topicsCount} Topics
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-cyan-400">
                        {sub.progressPercent}%
                      </span>
                      <p className="text-[10px] text-slate-400">Mastered</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${sub.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Sample chapter pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sub.chapters.slice(0, 3).map(ch => (
                      <span
                        key={ch.id}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                          ch.status === 'completed'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        Ch {ch.chapterNumber}: {ch.title}
                      </span>
                    ))}
                    {sub.chapters.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-slate-900/60 text-[11px] text-slate-400">
                        +{sub.chapters.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                    <span>Explore Syllabus Units</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Detailed Subject View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chapters List */}
          <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Chapters ({activeSubject.chapters.length})</span>
              <span className="text-xs text-cyan-400 font-bold">{activeSubject.progressPercent}% Complete</span>
            </h3>

            <div className="space-y-2.5">
              {activeSubject.chapters.map(ch => {
                const isSelected = activeChapter?.id === ch.id;
                const isCompleted = ch.status === 'completed';

                return (
                  <div
                    key={ch.id}
                    className={`p-3.5 rounded-2xl transition-all border space-y-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border-cyan-500/50 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => {
                        setSelectedChapterId(ch.id);
                        setSelectedTopicId(ch.topics[0]?.id || null);
                      }}
                      className="cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-cyan-400">
                          {ch.unitCode || `Chapter ${ch.chapterNumber}`}
                        </span>
                        {getStatusBadge(ch.status)}
                      </div>
                      <p className="text-xs font-semibold text-slate-100">{ch.title}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                      <span className="text-[10px] text-slate-400">
                        {ch.completedTopics}/{ch.totalTopics} Topics
                      </span>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleChapterStatus(activeSubject.id, ch.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{isCompleted ? 'Completed ✓' : 'Mark Done'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Topic Details & Learning Content */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
            {activeChapter ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-cyan-400 font-bold">
                        {activeChapter.unitCode || `Chapter ${activeChapter.chapterNumber}`}
                      </span>
                      {getStatusBadge(activeChapter.status)}
                    </div>
                    <h2 className="text-lg font-extrabold text-white">
                      {activeChapter.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Status:</span>
                    <button
                      onClick={() => setChapterStatus(activeSubject.id, activeChapter.id, 'not_started')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activeChapter.status === 'not_started'
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ○ Not Started
                    </button>
                    <button
                      onClick={() => setChapterStatus(activeSubject.id, activeChapter.id, 'in_progress')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activeChapter.status === 'in_progress'
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ⏳ In Progress
                    </button>
                    <button
                      onClick={() => setChapterStatus(activeSubject.id, activeChapter.id, 'completed')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        activeChapter.status === 'completed'
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      ✓ Completed
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView('quiz')}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Take Quiz</span>
                  </button>
                  <button
                    onClick={() => setActiveView('tutor')}
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>

                {/* Topics Tabs with interactive completion */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Topics in this chapter ({activeChapter.completedTopics}/{activeChapter.totalTopics} Completed):
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {activeChapter.topics.map(t => {
                      const isTopicActive = activeTopic?.id === t.id;
                      return (
                        <div
                          key={t.id}
                          className={`flex items-center rounded-xl overflow-hidden border transition-all ${
                            isTopicActive
                              ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400'
                              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleTopicCompletion(activeSubject.id, activeChapter.id, t.id)}
                            className="p-2 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
                          >
                            {t.completed ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTopicId(t.id)}
                            className="py-2 pr-3.5 text-xs font-bold text-left cursor-pointer"
                          >
                            {t.title}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Topic Content Card */}
                  {activeTopic && (
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                          {activeTopic.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          <span>{activeTopic.title}</span>
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>~{activeTopic.estimatedMinutes} mins</span>
                          </div>

                          <button
                            onClick={() => toggleTopicCompletion(activeSubject.id, activeChapter.id, activeTopic.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              activeTopic.completed
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                            }`}
                          >
                            {activeTopic.completed ? 'Topic Completed ✓' : 'Mark Topic Done'}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        {activeTopic.summary}
                      </p>

                      {/* Key Points */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                          Key Concepts &amp; Exam Highlights
                        </h5>
                        <ul className="space-y-1.5 text-xs text-slate-200">
                          {activeTopic.keyPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Formulas if any */}
                      {activeTopic.formulas && activeTopic.formulas.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <h5 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                            High-Yield Formulas
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {activeTopic.formulas.map((form, i) => (
                              <div
                                key={i}
                                className="p-2.5 rounded-xl bg-violet-950/30 border border-violet-500/30 font-mono text-xs text-violet-200 flex items-center justify-center text-center font-bold"
                              >
                                {form}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold">Select a chapter from the left to view notes &amp; topics.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
