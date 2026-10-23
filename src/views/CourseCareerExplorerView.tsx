import React, { useState } from 'react';
import {
  Compass,
  Search,
  ExternalLink,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Clock,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CareerPathway } from '../types';

export const CourseCareerExplorerView: React.FC = () => {
  const { careerPathways, switchEducationField, setActiveView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPathway, setSelectedPathway] = useState<CareerPathway>(careerPathways[0]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [comparePathwayA, setComparePathwayA] = useState<CareerPathway>(careerPathways[0]);
  const [comparePathwayB, setComparePathwayB] = useState<CareerPathway>(careerPathways[1]);

  const filteredPathways = careerPathways.filter(cp =>
    cp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cp.potentialCareers.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    cp.entranceExams.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151235] via-[#0f172a] to-[#0d2238] border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" /> Career Intelligence &amp; Admissions Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Course &amp; Career Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Detailed official eligibility criteria, entrance exams, syllabus structure, salary benchmarks, and side-by-side comparison.
          </p>
        </div>

        <button
          onClick={() => setIsCompareMode(!isCompareMode)}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            isCompareMode
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
              : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400'
          }`}
        >
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>{isCompareMode ? 'Exit Comparison' : 'Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* Mandatory Regulatory Transparency Notice */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 block">Admissions &amp; Regulatory Disclaimer</span>
          <p className="text-[11px] leading-relaxed">
            All eligibility thresholds, entrance exam patterns, and statutory fees reflect verified 2024–2026 notifications from official councils (AICTE, NMC, BCI, ICAI, UPSC). Requirements may vary by institution. BrainRoot AI provides academic counseling and does not guarantee admissions or employment.
          </p>
        </div>
      </div>

      {!isCompareMode ? (
        /* Standard Single Pathway Inspector */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left List of Pathways */}
          <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search degree or career..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {filteredPathways.map(cp => {
                const isSelected = selectedPathway.id === cp.id;
                return (
                  <div
                    key={cp.id}
                    onClick={() => setSelectedPathway(cp)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border-cyan-500/60 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-cyan-400">
                      {cp.degreeType}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{cp.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{cp.duration}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detailed Career Pathway Card */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedPathway.degreeType}
                </span>
                <h2 className="text-xl font-black text-white">{selectedPathway.title}</h2>
              </div>

              <button
                onClick={() => {
                  switchEducationField(selectedPathway.category, selectedPathway.title);
                  setActiveView('my-learning');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <span>Study this Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {selectedPathway.overview}
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Duration &amp; Structure
                </span>
                <p className="font-extrabold text-white">{selectedPathway.duration}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" /> Approx. Fee Range
                </span>
                <p className="font-extrabold text-white">{selectedPathway.approxCostRange}</p>
              </div>
            </div>

            {/* Eligibility & Authority */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs">
              <span className="font-bold text-cyan-300 uppercase tracking-wider block">
                Official Eligibility Requirements
              </span>
              <p className="text-slate-200">{selectedPathway.eligibility}</p>
              <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20 text-[11px] text-slate-400">
                <span>Verified Authority: <strong className="text-slate-200">{selectedPathway.officialSourceLabel}</strong></span>
                <span className="text-emerald-400 font-bold">Year: {selectedPathway.verifiedYear}</span>
              </div>
            </div>

            {/* Entrance Exams & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                  Entrance &amp; Qualifying Exams:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPathway.entranceExams.map(ex => (
                    <span key={ex} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-semibold">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Core Skills to Develop:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPathway.skillsNeeded.map(sk => (
                    <span key={sk} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Opportunities & Higher Study */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Potential Career Roles &amp; Higher Study:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPathway.potentialCareers.map(car => (
                  <span key={car} className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{car}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Side-by-Side Comparison Tool */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            Compare Two Educational Pathways
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pathway A */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  Select Program 1
                </label>
                <select
                  value={comparePathwayA.id}
                  onChange={e => {
                    const found = careerPathways.find(c => c.id === e.target.value);
                    if (found) setComparePathwayA(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white"
                >
                  {careerPathways.map(cp => (
                    <option key={cp.id} value={cp.id}>
                      {cp.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p><strong>Duration:</strong> {comparePathwayA.duration}</p>
                <p><strong>Entrance:</strong> {comparePathwayA.entranceExams.join(', ')}</p>
                <p><strong>Eligibility:</strong> {comparePathwayA.eligibility}</p>
                <p><strong>Approx Fees:</strong> {comparePathwayA.approxCostRange}</p>
                <p><strong>Top Careers:</strong> {comparePathwayA.potentialCareers.join(', ')}</p>
              </div>
            </div>

            {/* Pathway B */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-violet-500/30 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-violet-400 uppercase tracking-wider mb-1">
                  Select Program 2
                </label>
                <select
                  value={comparePathwayB.id}
                  onChange={e => {
                    const found = careerPathways.find(c => c.id === e.target.value);
                    if (found) setComparePathwayB(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white"
                >
                  {careerPathways.map(cp => (
                    <option key={cp.id} value={cp.id}>
                      {cp.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p><strong>Duration:</strong> {comparePathwayB.duration}</p>
                <p><strong>Entrance:</strong> {comparePathwayB.entranceExams.join(', ')}</p>
                <p><strong>Eligibility:</strong> {comparePathwayB.eligibility}</p>
                <p><strong>Approx Fees:</strong> {comparePathwayB.approxCostRange}</p>
                <p><strong>Top Careers:</strong> {comparePathwayB.potentialCareers.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
