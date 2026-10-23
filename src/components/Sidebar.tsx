import React from 'react';
import {
  Home,
  GraduationCap,
  Bot,
  BookMarked,
  BrainCircuit,
  Calendar,
  Library,
  Sparkles,
  BarChart3,
  Settings,
  Layers,
  Timer,
  Compass,
  Volume2,
  Trophy,
} from 'lucide-react';
import { useApp, ActiveView } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<{ isOpenMobile?: boolean; onCloseMobile?: () => void }> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activeView, setActiveView } = useApp();

  // Navigation matching Section 9 Requirements:
  // Home, Education Field, AI Tutor, My Learning, Practice & Exams, Study Planner, Library, Skills, Progress, Profile & Settings
  const coreNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'education-field', label: 'Education Field', icon: GraduationCap, badge: '9 Fields', badgeColor: 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white' },
    { id: 'tutor', label: 'AI Tutor', icon: Bot, badge: 'Gemini', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'my-learning', label: 'My Learning', icon: BookMarked },
    { id: 'quiz', label: 'Practice & Exams', icon: BrainCircuit },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'library', label: 'Academic Library', icon: Library },
    { id: 'skills', label: 'Skills & Certifications', icon: Sparkles, badge: 'Jobs' },
    { id: 'analytics', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];

  const boosterNavItems: NavItem[] = [
    { id: 'career-explorer', label: 'Course & Career Explorer', icon: Compass },
    { id: 'flashcards', label: 'Flashcards (Spaced Repetition)', icon: Layers },
    { id: 'timer', label: 'Pomodoro Focus Timer', icon: Timer },
    { id: 'voice', label: 'Voice Learning Studio', icon: Volume2 },
    { id: 'missions', label: 'Missions & XP Rewards', icon: Trophy, badge: 'XP' },
  ];

  const handleSelect = (view: ActiveView) => {
    setActiveView(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0e1a]/95 lg:bg-[#0d1322]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <BrandLogo size="md" showTagline={false} />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Academic Navigation</span>
              <span className="text-cyan-400 font-mono text-[9px]">Class 1–Ph.D</span>
            </div>
            <nav className="space-y-1">
              {coreNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors shrink-0 ${
                          isActive ? 'text-cyan-400' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 font-bold rounded-md shrink-0 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Specialized Learning Tools */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Study Tools &amp; Career
            </div>
            <nav className="space-y-1">
              {boosterNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info: Creator signature */}
        <div className="p-4 border-t border-slate-800/60 bg-[#070b14]/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Platform Architect</p>
              <p className="text-xs font-bold text-slate-200">Chandrashekhar Singh</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-semibold">
              v2.0 Ed-Field
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
