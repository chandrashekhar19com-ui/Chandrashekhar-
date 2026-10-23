import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Bookmark,
  Trash2,
  Sparkles,
  Save,
  Download,
  Bold,
  Italic,
  Underline,
  Code,
  List,
  Eye,
  Edit3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';

export const NotesLibraryView: React.FC = () => {
  const { notes, saveNote, deleteNote, toggleNoteBookmark, user } = useApp();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [isPreview, setIsPreview] = useState(false);

  // Active note editing states
  const activeNote = notes.find(n => n.id === selectedNoteId) || notes[0];
  const [title, setTitle] = useState(activeNote?.title || '');
  const [content, setContent] = useState(activeNote?.content || '');
  const [subject, setSubject] = useState(activeNote?.subject || 'Mathematics');

  // Sync when active note changes
  const handleSelectNote = (note: NoteItem) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    saveNote({
      id: activeNote?.id,
      title,
      content,
      subject,
      chapter: activeNote?.chapter || 'General',
      isBookmarked: activeNote?.isBookmarked || false,
      tags: activeNote?.tags || ['Study Notes'],
    });
    alert('Note saved successfully!');
  };

  const handleCreateNew = () => {
    const newNoteId = 'note-' + Date.now();
    const newNote: NoteItem = {
      id: newNoteId,
      title: 'New Study Note',
      subject: 'Mathematics',
      chapter: 'General Chapter',
      content: '## Key Concepts\n* Point 1:\n* Formula:\n',
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isBookmarked: false,
      tags: ['Revision'],
    };
    saveNote(newNote);
    setSelectedNoteId(newNoteId);
    setTitle(newNote.title);
    setContent(newNote.content);
    setSubject(newNote.subject);
  };

  const insertFormatting = (prefix: string, suffix = '') => {
    setContent(prev => prev + `${prefix}text${suffix}`);
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = subjectFilter === 'All' || n.subject === subjectFilter;
    return matchesSearch && matchesSub;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Notes &amp; Knowledge Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized textbook notes, formulas, and AI summaries organized by subject
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Split Workspace - Matching Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pane: Notes Directory & Search */}
        <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Subject Filter */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {['All', 'Mathematics', 'Science', 'English', 'Social Science'].map(s => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    subjectFilter === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Notes List - Matching Showcase layout */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredNotes.map(n => {
                const isSelected = n.id === activeNote?.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 border-cyan-500/50'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">
                        {n.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.dateStr}</span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">{n.title}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* New Note Button in Sidebar */}
          <button
            onClick={handleCreateNew}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Note</span>
          </button>
        </div>

        {/* Right Pane: Rich Note Editor & Viewer */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          {activeNote ? (
            <>
              {/* Title & Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="bg-transparent text-lg font-extrabold text-white focus:outline-none flex-1"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 border border-slate-800"
                    title={isPreview ? 'Edit mode' : 'Preview mode'}
                  >
                    {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isPreview ? 'Edit' : 'Preview'}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>

                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar - Matching Showcase Image */}
              {!isPreview && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 rounded hover:bg-slate-800"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 rounded hover:bg-slate-800"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('<u>', '</u>')}
                    className="p-1.5 rounded hover:bg-slate-800"
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('`', '`')}
                    className="p-1.5 rounded hover:bg-slate-800"
                    title="Code"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n* ')}
                    className="p-1.5 rounded hover:bg-slate-800"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('$$', '$$')}
                    className="p-1.5 rounded hover:bg-slate-800 text-[11px] font-mono font-bold"
                    title="Math Formula"
                  >
                    fx
                  </button>
                </div>
              )}

              {/* Editor / Markdown Preview Area */}
              {isPreview ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200 min-h-[380px] whitespace-pre-line leading-relaxed">
                  {content}
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Type your notes here in Markdown..."
                  className="w-full min-h-[380px] bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 font-mono leading-relaxed"
                />
              )}
            </>
          ) : (
            <div className="py-24 text-center text-slate-400">
              <p className="text-sm">Select or create a note to begin editing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
