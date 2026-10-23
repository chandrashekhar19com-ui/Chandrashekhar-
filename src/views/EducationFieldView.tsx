import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  BookOpen,
  Building2,
  Award,
  Microscope,
  Briefcase,
  Wrench,
  Target,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Compass,
  Library,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Check,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationCategory } from '../types';

export const EducationFieldView: React.FC = () => {
  const {
    educationSectors,
    user,
    switchEducationField,
    selectCourse,
    setActiveView,
    subjects,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EducationCategory | 'all'>('all');
  const [selectedSectorModal, setSelectedSectorModal] = useState<any | null>(null);

  // Modal customizer state
  const [modalChosenProgram, setModalChosenProgram] = useState('');
  const [modalChosenSemester, setModalChosenSemester] = useState('Current Term');
  const [modalSelectedSubs, setModalSelectedSubs] = useState<string[]>([]);

  const getSectorIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap': return GraduationCap;
      case 'BookOpen': return BookOpen;
      case 'Building2': return Building2;
      case 'Award': return Award;
      case 'Microscope': return Microscope;
      case 'Briefcase': return Briefcase;
      case 'Wrench': return Wrench;
      case 'Target': return Target;
      default: return Sparkles;
    }
  };

  const filteredSectors = educationSectors.filter(sec => {
    const matchesFilter = selectedCategory === 'all' || sec.id === selectedCategory;
    const matchesQuery =
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.popularPrograms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  const openSectorModal = (sector: any) => {
    setSelectedSectorModal(sector);
    setModalChosenProgram(sector.popularPrograms[0] || '');
    setModalChosenSemester('Current Semester / Year');
    const secSubs = subjects.filter(s => s.category === sector.id);
    setModalSelectedSubs(secSubs.map(s => s.name));
  };

  const handleEnrollFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectorModal) return;

    selectCourse(
      selectedSectorModal.id,
      modalChosenProgram,
      undefined,
      modalChosenSemester,
      selectedSectorModal.supportedBoardsOrUniversities[0],
      modalSelectedSubs
    );
    setSelectedSectorModal(null);
  };

  const toggleModalSub = (subName: string) => {
    if (modalSelectedSubs.includes(subName)) {
      if (modalSelectedSubs.length > 1) {
        setModalSelectedSubs(modalSelectedSubs.filter(s => s !== subName));
      }
    } else {
      setModalSelectedSubs([...modalSelectedSubs, subName]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171439] via-[#0f172a] to-[#0c1f38] border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> 9 Academic Domains Supported
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Education Field Navigator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Select, customize, or deselect your study domain across school, higher education, professional licensure, and all-India competitive examinations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveView('career-explorer')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Course &amp; Career Explorer</span>
          </button>
          <button
            onClick={() => setActiveView('library')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Library className="w-4 h-4 text-cyan-400" />
            <span>Academic Library</span>
          </button>
        </div>
      </div>

      {/* Current Enrolled Program Notice Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Currently Selected Field &amp; Ecosystem
            </span>
            <p className="text-sm font-extrabold text-white">
              {user.programName || `${user.educationStage} • ${user.board}`}
            </p>
            <p className="text-[11px] text-slate-400">
              Enrolled: {user.subjects.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.educationCategory !== 'school' && (
            <button
              onClick={() => {
                selectCourse(
                  'school',
                  'Class 10 Board Exam',
                  'General Secondary',
                  'Final Term',
                  'CBSE',
                  ['Mathematics', 'Science', 'English', 'Social Science']
                );
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset to School (Class 10)</span>
            </button>
          )}

          <button
            onClick={() => setActiveView('my-learning')}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Go to My Learning</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search programs e.g. B.Tech, MBBS, UPSC, CA, Class 10..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredSectors.length}</strong> of 9 Fields
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All 9 Fields
          </button>
          {educationSectors.map(sec => (
            <button
              key={sec.id}
              onClick={() => setSelectedCategory(sec.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === sec.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of the 9 Education Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSectors.map(sector => {
          const Icon = getSectorIcon(sector.iconName);
          const isCurrentActive = user.educationCategory === sector.id;

          // Real live sector stats
          const sectorSubjects = subjects.filter(s => s.category === sector.id);
          const sectorTotalChs = sectorSubjects.reduce((acc, s) => acc + (s.chapters.length || s.chaptersCount || 0), 0);
          const sectorCompChs = sectorSubjects.reduce((acc, s) => acc + s.chapters.filter(c => c.status === 'completed').length, 0);
          const sectorProgress = sectorTotalChs > 0 ? Math.round((sectorCompChs / sectorTotalChs) * 100) : 0;

          return (
            <div
              key={sector.id}
              className={`p-6 rounded-3xl bg-[#0e1526]/90 border transition-all flex flex-col justify-between space-y-4 shadow-xl hover:shadow-cyan-500/10 group ${
                isCurrentActive
                  ? 'border-cyan-500/60 ring-1 ring-cyan-500/40 bg-[#0d172c]'
                  : 'border-slate-800/80 hover:border-cyan-500/40'
              }`}
            >
              <div className="space-y-3">
                {/* Sector Header */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sector.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform shrink-0`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-900 text-cyan-300 border border-slate-700/80">
                      {sector.badge}
                    </span>
                    {isCurrentActive ? (
                      <span className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active Field
                      </span>
                    ) : sectorTotalChs > 0 ? (
                      <span className="text-[10px] text-slate-400 mt-1">
                        {sectorCompChs}/{sectorTotalChs} Chapters ({sectorProgress}%)
                      </span>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {sector.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {sector.subtitle}
                  </p>
                </div>

                {/* Popular Programs Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Featured Curricula:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sector.popularPrograms.slice(0, 3).map((prog, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                      >
                        {prog}
                      </span>
                    ))}
                    {sector.popularPrograms.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900/60 text-slate-400">
                        +{sector.popularPrograms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openSectorModal(sector)}
                  className="text-xs text-slate-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
                >
                  Configure &amp; Enroll
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const firstProg = sector.popularPrograms[0];
                    switchEducationField(sector.id, firstProg, sector.supportedBoardsOrUniversities[0]);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrentActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                      : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 hover:brightness-110'
                  }`}
                >
                  <span>{isCurrentActive ? 'Active ✓' : 'Select Field'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sector Details & Program Picker Modal */}
      {selectedSectorModal && (
        <div className="fixed inset-0 z-50 bg-[#060a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#0e1628] border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedSectorModal.badge}
                </span>
                <h2 className="text-xl font-black text-white">
                  {selectedSectorModal.title}
                </h2>
                <p className="text-xs text-slate-400">{selectedSectorModal.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSectorModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {selectedSectorModal.description}
            </p>

            <form onSubmit={handleEnrollFromModal} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Select Program / Degree:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                  {selectedSectorModal.popularPrograms.map((prog: string) => (
                    <button
                      key={prog}
                      type="button"
                      onClick={() => setModalChosenProgram(prog)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                        modalChosenProgram === prog
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 ring-1 ring-cyan-400/40'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate">{prog}</span>
                      {modalChosenProgram === prog && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester / Year input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Semester / Year / Stage:
                </label>
                <input
                  type="text"
                  value={modalChosenSemester}
                  onChange={e => setModalChosenSemester(e.target.value)}
                  placeholder="e.g. Semester 3, Year 2, Final Term"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Subjects in this sector */}
              {subjects.filter(s => s.category === selectedSectorModal.id).length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase">
                    Select Subjects to Enroll ({modalSelectedSubs.length} selected):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                    {subjects
                      .filter(s => s.category === selectedSectorModal.id)
                      .map(sub => {
                        const isChecked = modalSelectedSubs.includes(sub.name);
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => toggleModalSub(sub.name)}
                            className={`p-2 rounded-lg border text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${
                              isChecked
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            <span className="truncate">{sub.name}</span>
                            {isChecked ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedSectorModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Enroll in Field &amp; Update Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
