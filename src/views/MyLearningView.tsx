import React, { useState } from 'react';
import {
  BookMarked,
  Layers,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  BrainCircuit,
  Plus,
  BookOpen,
  FolderGit2,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Check,
  RotateCcw,
  SlidersHorizontal,
  GraduationCap,
  CheckSquare,
  Square,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject, Chapter, Topic, ChapterStatus, EducationCategory } from '../types';

export const MyLearningView: React.FC = () => {
  const {
    user,
    subjects,
    assignments,
    toggleAssignmentStatus,
    addAssignment,
    setActiveView,
    activeCategory,
    setChapterStatus,
    toggleChapterStatus,
    toggleTopicCompletion,
    toggleSubjectEnrollment,
    selectCourse,
    educationSectors,
    getOverallProgress,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'syllabus' | 'assignments' | 'custom_syllabus'>('syllabus');
  const [subjectFilter, setSubjectFilter] = useState<'enrolled' | 'all'>('enrolled');

  // Modal to customize course, class, and enrolled subjects
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [modalCategory, setModalCategory] = useState<EducationCategory>(user.educationCategory || 'school');
  const [modalProgram, setModalProgram] = useState(user.programName || '');
  const [modalSemester, setModalSemester] = useState(user.semesterOrYear || '');
  const [modalStream, setModalStream] = useState(user.streamOrSpecialization || '');
  const [modalSubjects, setModalSubjects] = useState<string[]>(user.subjects || []);

  // Filter subjects based on selection
  const relevantSubjects = subjects.filter(s => {
    if (subjectFilter === 'all') return true;
    // Check if enrolled by name or ID, or belongs to active category
    const isEnrolled = user.subjects.includes(s.name) || user.subjects.includes(s.id);
    const matchesCat = s.category === (user.educationCategory || activeCategory);
    return isEnrolled || matchesCat;
  });

  const displaySubjects = relevantSubjects.length > 0 ? relevantSubjects : subjects;

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(displaySubjects[0]?.id || 'cs-dsa');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  // Custom syllabus paste state
  const [customCourseTitle, setCustomCourseTitle] = useState('');
  const [customSyllabusText, setCustomSyllabusText] = useState('');
  const [isCustomSaved, setIsCustomSaved] = useState(false);

  // New assignment modal
  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState(displaySubjects[0]?.name || 'Computer Science');
  const [asgType, setAsgType] = useState<'Assignment' | 'Project' | 'Lab Presentation' | 'Term Paper'>('Assignment');
  const [asgDue, setAsgDue] = useState('2025-05-10');

  // Currently active subject, chapter, and topic
  const currentSubject = displaySubjects.find(s => s.id === selectedSubjectId) || displaySubjects[0];
  const currentChapter = currentSubject?.chapters.find(c => c.id === selectedChapterId) || currentSubject?.chapters[0];
  const activeTopic = currentChapter?.topics.find(t => t.id === selectedTopic?.id) || currentChapter?.topics[0];

  // Overall progress metrics
  const progressMetrics = getOverallProgress();

  const handleSaveCustomSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCourseTitle.trim() || !customSyllabusText.trim()) return;

    setIsCustomSaved(true);
    setTimeout(() => {
      setIsCustomSaved(false);
      setCustomCourseTitle('');
      setCustomSyllabusText('');
      alert('Custom university syllabus uploaded and registered into your academic curriculum!');
    }, 1200);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;

    addAssignment({
      title: asgTitle,
      subject: asgSubject,
      type: asgType,
      dueDate: asgDue,
      status: 'pending',
      objectives: ['Review core lecture units', 'Structure analysis and deliverables'],
      deliverables: 'Academic report submission adhering to semester requirements.',
    });

    setAsgTitle('');
    setShowNewAsgModal(false);
  };

  const handleSaveProgramModal = (e: React.FormEvent) => {
    e.preventDefault();
    selectCourse(
      modalCategory,
      modalProgram || 'Academic Curriculum',
      modalStream,
      modalSemester,
      user.institutionOrUniversity,
      modalSubjects
    );
    setShowProgramModal(false);
  };

  const toggleModalSubject = (subName: string) => {
    if (modalSubjects.includes(subName)) {
      if (modalSubjects.length > 1) {
        setModalSubjects(modalSubjects.filter(s => s !== subName));
      }
    } else {
      setModalSubjects([...modalSubjects, subName]);
    }
  };

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
      {/* Top Academic Program Banner */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {user.educationStage}
            </span>
            <span className="text-xs text-slate-400">
              {user.institutionOrUniversity || user.board}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-cyan-400">
              {progressMetrics.completedChapters}/{progressMetrics.totalChapters} Chapters ({progressMetrics.progressPercent}%)
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            {user.programName || 'Curriculum & Semester Learning Hub'}
          </h1>
          <p className="text-xs text-slate-400">
            {user.semesterOrYear} • {user.streamOrSpecialization}
          </p>
        </div>

        {/* Action Controls & Program Customizer */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setModalCategory(user.educationCategory || 'school');
              setModalProgram(user.programName || '');
              setModalSemester(user.semesterOrYear || '');
              setModalStream(user.streamOrSpecialization || '');
              setModalSubjects(user.subjects || []);
              setShowProgramModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Program &amp; Subjects</span>
          </button>

          {/* Action Tabs: Syllabus vs Assignments vs Custom Syllabus */}
          <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'syllabus'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Syllabus
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FolderGit2 className="w-3 h-3" />
              <span>Assignments ({assignments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('custom_syllabus')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'custom_syllabus'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'syllabus' ? (
        /* Modular Study System: Degree -> Semester -> Subject -> Unit -> Topic */
        <div className="space-y-6">
          {/* Subject Filter Bar and Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
              {displaySubjects.map(sub => {
                const isSelected = sub.id === currentSubject?.id;
                const completedChs = sub.chapters.filter(c => c.status === 'completed').length;
                const totalChs = sub.chapters.length || sub.chaptersCount;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubjectId(sub.id);
                      setSelectedChapterId(sub.chapters[0]?.id || '');
                      setSelectedTopic(sub.chapters[0]?.topics[0] || null);
                    }}
                    className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <div className="text-left">
                      <span className="block text-white text-xs">{sub.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {completedChs}/{totalChs} Chs • {sub.progressPercent}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <span className="text-[11px] text-slate-400">View:</span>
              <button
                onClick={() => setSubjectFilter('enrolled')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  subjectFilter === 'enrolled'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Enrolled ({user.subjects.length})
              </button>
              <button
                onClick={() => setSubjectFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  subjectFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Subjects ({subjects.length})
              </button>
            </div>
          </div>

          {currentSubject ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Modules / Units / Chapters */}
              <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Units / Chapters ({currentSubject.chapters.length})
                  </span>
                  <span className="text-xs text-cyan-400 font-bold">
                    {currentSubject.chapters.filter(c => c.status === 'completed').length}/{currentSubject.chapters.length} ({currentSubject.progressPercent}%)
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentSubject.chapters.map(ch => {
                    const isSelected = (selectedChapterId || currentSubject.chapters[0]?.id) === ch.id;
                    const isCompleted = ch.status === 'completed';

                    return (
                      <div
                        key={ch.id}
                        className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border-cyan-500/60 text-white shadow-md'
                            : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div
                          onClick={() => {
                            setSelectedChapterId(ch.id);
                            setSelectedTopic(ch.topics[0] || null);
                          }}
                          className="cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-cyan-400">
                              {ch.unitCode || `Chapter ${ch.chapterNumber}`}
                            </span>
                            {getStatusBadge(ch.status)}
                          </div>
                          <h4 className="text-xs font-bold text-slate-100">{ch.title}</h4>
                        </div>

                        {/* Chapter Completion Quick Toggler */}
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 text-[10px]">
                            {ch.completedTopics}/{ch.totalTopics} Topics
                          </span>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              toggleChapterStatus(currentSubject.id, ch.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{isCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: In-Depth Topic Learning, Case Studies & Solutions */}
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
                {currentChapter ? (
                  <>
                    {/* Active Chapter Details Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                            {currentChapter.unitCode || `Chapter ${currentChapter.chapterNumber}`}
                          </span>
                          {getStatusBadge(currentChapter.status)}
                        </div>
                        <h2 className="text-base sm:text-lg font-black text-white">
                          {currentChapter.title}
                        </h2>
                      </div>

                      {/* Explicit Chapter Status Setter Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase mr-1">Status:</span>
                        <button
                          onClick={() => setChapterStatus(currentSubject.id, currentChapter.id, 'not_started')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentChapter.status === 'not_started'
                              ? 'bg-slate-700 text-white ring-1 ring-slate-400'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          ○ Not Started
                        </button>
                        <button
                          onClick={() => setChapterStatus(currentSubject.id, currentChapter.id, 'in_progress')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentChapter.status === 'in_progress'
                              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          ⏳ In Progress
                        </button>
                        <button
                          onClick={() => setChapterStatus(currentSubject.id, currentChapter.id, 'completed')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentChapter.status === 'completed'
                              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          ✓ Completed
                        </button>
                      </div>
                    </div>

                    {/* Quick Study Navigation Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveView('tutor')}
                        className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Ask AI Tutor</span>
                      </button>
                      <button
                        onClick={() => setActiveView('quiz')}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>Practice Test</span>
                      </button>
                    </div>

                    {/* Topic Selector Pills with Checkboxes */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Topics ({currentChapter.completedTopics}/{currentChapter.totalTopics} Completed):
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Click checkbox to toggle topic completion
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {currentChapter.topics.map(t => {
                          const isTopicActive = activeTopic?.id === t.id;
                          return (
                            <div
                              key={t.id}
                              className={`flex items-center rounded-xl overflow-hidden border transition-all ${
                                isTopicActive
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400/40'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => toggleTopicCompletion(currentSubject.id, currentChapter.id, t.id)}
                                title={t.completed ? 'Mark Incomplete' : 'Mark Completed'}
                                className="p-2 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
                              >
                                {t.completed ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setSelectedTopic(t)}
                                className="py-2 pr-3.5 text-xs font-bold text-left cursor-pointer"
                              >
                                {t.title}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Topic Breakdown Card */}
                      {activeTopic && (
                        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                              {activeTopic.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              <span>{activeTopic.title}</span>
                            </h3>

                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                <span>~{activeTopic.estimatedMinutes} mins</span>
                              </div>

                              <button
                                onClick={() => toggleTopicCompletion(currentSubject.id, currentChapter.id, activeTopic.id)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                  activeTopic.completed
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                                }`}
                              >
                                {activeTopic.completed ? 'Topic Completed ✓' : 'Mark Topic Done'}
                              </button>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed">
                            {activeTopic.summary}
                          </div>

                          {/* Key Points */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                              Core Academic Principles &amp; Derivations
                            </h4>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {activeTopic.keyPoints.map((pt, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Worked Example or Case Study if present */}
                          {activeTopic.workedExample && (
                            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-1.5">
                              <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Worked Numerical / Example
                              </span>
                              <p className="text-xs text-slate-200 font-mono leading-relaxed">
                                {activeTopic.workedExample}
                              </p>
                            </div>
                          )}

                          {activeTopic.caseStudy && (
                            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5" /> Practical Clinical / Legal Case Study
                              </span>
                              <p className="text-xs text-slate-200 leading-relaxed">
                                {activeTopic.caseStudy}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-20 text-center text-slate-400">
                    <p className="text-sm">Select a module on the left to review syllabus units.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 space-y-2">
              <p className="text-sm font-semibold">No subjects enrolled in this view.</p>
              <button
                onClick={() => setSubjectFilter('all')}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs"
              >
                View All Available Subjects
              </button>
            </div>
          )}
        </div>
      ) : activeTab === 'assignments' ? (
        /* Assignments & Projects View */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-white">
                Academic Assignments, Projects &amp; Term Papers
              </h3>
              <p className="text-xs text-slate-400">
                Track deliverables, objectives, and upcoming university submission deadlines
              </p>
            </div>

            <button
              onClick={() => setShowNewAsgModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Assignment</span>
            </button>
          </div>

          <div className="space-y-4">
            {assignments.map(asg => {
              const isDone = asg.status === 'completed';
              return (
                <div
                  key={asg.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isDone
                      ? 'bg-slate-900/50 border-slate-800/60 opacity-75'
                      : 'bg-slate-900 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
                          {asg.type}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {asg.subject}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{asg.title}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Due: {asg.dueDate}
                      </span>
                      <button
                        onClick={() => toggleAssignmentStatus(asg.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isDone ? 'Completed ✓' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 text-xs text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Key Deliverables:
                    </span>
                    <p>{asg.deliverables}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Custom Syllabus Upload / Paste */
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">
              Import or Paste University Syllabus
            </h3>
            <p className="text-xs text-slate-400">
              BrainRoot AI supports custom university course structures. Paste your official module outlines below to create dedicated units.
            </p>
          </div>

          <form onSubmit={handleSaveCustomSyllabus} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Course / Subject Title
              </label>
              <input
                type="text"
                value={customCourseTitle}
                onChange={e => setCustomCourseTitle(e.target.value)}
                placeholder="e.g. Operating Systems (AKTU CS402)"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Syllabus Units &amp; Modules Text
              </label>
              <textarea
                value={customSyllabusText}
                onChange={e => setCustomSyllabusText(e.target.value)}
                rows={6}
                placeholder="Paste Unit 1, Unit 2 outlines, reading references, and topic lists here..."
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isCustomSaved}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              {isCustomSaved ? 'Registering Syllabus...' : 'Register Syllabus into My Learning'}
            </button>
          </form>
        </div>
      )}

      {/* Program & Enrolled Subjects Customization Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-[#060a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0e1628] border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Academic Configuration
                </span>
                <h2 className="text-xl font-black text-white">
                  Customize Program, Class &amp; Subjects
                </h2>
                <p className="text-xs text-slate-400">
                  Select your education field, degree/class, semester, and enrolled subjects.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProgramModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProgramModal} className="space-y-5">
              {/* Education Sector Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Education Field:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {educationSectors.map(sec => {
                    const isSecSelected = modalCategory === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => {
                          setModalCategory(sec.id);
                          setModalProgram(sec.popularPrograms[0]);
                          // Set relevant subjects for this sector
                          const relevant = subjects.filter(s => s.category === sec.id);
                          if (relevant.length > 0) {
                            setModalSubjects(relevant.map(s => s.name));
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          isSecSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="block truncate">{sec.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{sec.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Course / Program Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    2. Program / Degree / Exam
                  </label>
                  <input
                    type="text"
                    value={modalProgram}
                    onChange={e => setModalProgram(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science, Class 10, UPSC"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    3. Semester / Class / Year
                  </label>
                  <input
                    type="text"
                    value={modalSemester}
                    onChange={e => setModalSemester(e.target.value)}
                    placeholder="e.g. Semester 4, Final Term, Class 10"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Subject Selection (Multi-select) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  4. Select Enrolled Subjects ({modalSubjects.length} selected):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  {subjects.map(sub => {
                    const isChecked = modalSubjects.includes(sub.name) || modalSubjects.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => toggleModalSubject(sub.name)}
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
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Apply &amp; Update Learning Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewAsgModal && (
        <div className="fixed inset-0 z-50 bg-[#060a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0e1628] border border-cyan-500/40 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Add Academic Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={asgTitle}
                  onChange={e => setAsgTitle(e.target.value)}
                  placeholder="e.g. Implement AVL Tree in C++"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Subject</label>
                <select
                  value={asgSubject}
                  onChange={e => setAsgSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {displaySubjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Type</label>
                  <select
                    value={asgType}
                    onChange={e => setAsgType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Lab Presentation">Lab Presentation</option>
                    <option value="Term Paper">Term Paper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={asgDue}
                    onChange={e => setAsgDue(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAsgModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 text-white font-bold text-xs"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
