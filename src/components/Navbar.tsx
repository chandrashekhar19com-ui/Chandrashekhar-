import React, { useState } from 'react';
import {
  Menu,
  Flame,
  Coins,
  Bell,
  Search,
  Sparkles,
  CheckCircle,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC<{ onOpenMobileMenu: () => void }> = ({ onOpenMobileMenu }) => {
  const { user, setActiveView, missions } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingMissions = missions.filter(m => m.isCompleted && !m.isClaimed);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0a0e1a]/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Education Program Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/70"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Education Field Chip - Clickable to switch */}
        <button
          onClick={() => setActiveView('education-field')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer group"
          title="Click to explore and switch Education Field"
        >
          <GraduationCap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="truncate max-w-[140px] sm:max-w-[260px]">
            {user.programName || `${user.educationStage} • ${user.board}`}
          </span>
          <ChevronDown className="w-3 h-3 text-cyan-400/70" />
        </button>
      </div>

      {/* Center Search (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search school, degrees, entrance exams, or skills..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActiveView('education-field');
              }
            }}
          />
        </div>
      </div>

      {/* Right Stats: Streak, Coins, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak counter */}
        <div
          title={`${user.streakDays} Day Learning Streak`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-400 font-semibold text-xs cursor-pointer hover:border-orange-500/50 transition-colors"
          onClick={() => setActiveView('analytics')}
        >
          <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400/20" />
          <span>{user.streakDays}d</span>
        </div>

        {/* Coins counter */}
        <div
          title="BrainRoot Virtual Coins"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-semibold text-xs cursor-pointer hover:border-amber-500/50 transition-colors"
          onClick={() => setActiveView('missions')}
        >
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>{user.coins}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingMissions.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0a0e1a]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Notifications &amp; Alerts
                </span>
                <span className="text-[10px] text-slate-400">
                  {pendingMissions.length} rewards ready
                </span>
              </div>
              <div className="py-2 space-y-2">
                {pendingMissions.length > 0 ? (
                  pendingMissions.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveView('missions');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-800/40 hover:border-violet-600/60 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{m.title}</p>
                          <p className="text-[10px] text-cyan-300">Reward: +{m.xpReward} XP</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
                        Claim
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">
                    No new alerts. Keep up your active study streak!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Level */}
        <button
          onClick={() => setActiveView('settings')}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left leading-none">
            <span className="block text-xs font-semibold text-slate-200 truncate max-w-[90px]">
              {user.name}
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">
              Lvl {user.level}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
