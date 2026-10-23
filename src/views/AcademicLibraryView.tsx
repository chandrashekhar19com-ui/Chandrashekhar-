import React, { useState } from 'react';
import {
  Library,
  Search,
  FileText,
  Download,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AcademicResource } from '../types';

export const AcademicLibraryView: React.FC = () => {
  const { academicResources, pdfDocs, setActiveView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedResource, setSelectedResource] = useState<AcademicResource | null>(academicResources[0]);

  const filteredResources = academicResources.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.institutionOrBoard.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || r.resourceType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Syllabus &amp; Academic Resource Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Verified statutory syllabi, formula cheat sheets, past papers, and university study guides
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('pdf')}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <FileUp className="w-4 h-4" />
          <span>Upload Custom Study PDF</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search syllabus, formulas, university, or exam papers..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Syllabus', 'Formulas', 'Notes'].map(tf => (
            <button
              key={tf}
              onClick={() => setTypeFilter(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                typeFilter === tf
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Resource Directory & Document Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Repository Items */}
        <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Academic Materials ({filteredResources.length})
          </span>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredResources.map(res => {
              const isSelected = selectedResource?.id === res.id;
              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border-cyan-500/50 text-white'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-cyan-400 uppercase">
                      {res.resourceType}
                    </span>
                    <span className="text-slate-400">{res.yearOrSemester}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{res.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {res.institutionOrBoard}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Academic Reader */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
          {selectedResource ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {selectedResource.resourceType}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedResource.institutionOrBoard} ({selectedResource.verifiedYear})
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white">
                    {selectedResource.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Official
                  </span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {selectedResource.summary}
              </p>

              {/* Full Content Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Document Content Preview
                </span>
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-mono max-h-[420px] overflow-y-auto">
                  {selectedResource.content}
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400">
              <p className="text-sm">Select an academic resource from the left to view.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
