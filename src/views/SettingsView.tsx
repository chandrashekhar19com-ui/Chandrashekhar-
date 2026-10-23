import React, { useState } from 'react';
import {
  Settings,
  User,
  Database,
  ShieldCheck,
  Info,
  Moon,
  Sun,
  ChevronRight,
  Download,
  Upload,
  Trash2,
  Sparkles,
  LogOut,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateProfile,
    exportUserData,
    importUserData,
    resetAllProgress,
    setShowAboutModal,
    logout,
    theme,
    setTheme,
  } = useApp();

  const [nameInput, setNameInput] = useState(user.name);
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoalMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      dailyGoalMinutes: dailyGoal,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      const success = importUserData(content);
      if (success) {
        alert('Data imported successfully!');
      } else {
        alert('Failed to import JSON data. Please verify the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white shadow-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Settings &amp; Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage your student profile, data storage, and app configurations
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Menu - Exactly as laid out in the showcase image */}
      <div className="space-y-4">
        {/* Profile & Preferences */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <User className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Profile &amp; Preferences</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Daily Goal (Minutes)
                </label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={e => setDailyGoal(parseInt(e.target.value, 10))}
                  min={15}
                  max={240}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Grade: <strong className="text-white">{user.educationStage}</strong> • Board:{' '}
                <strong className="text-white">{user.board}</strong>
              </span>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Update Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Data & Backup */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-violet-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Data &amp; Backup</h3>
              <p className="text-[11px] text-slate-400">Export, import, or clear local study records</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportUserData}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Learning Backup (.JSON)</span>
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4 text-violet-400" />
              <span>Import Data Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Privacy &amp; Security</h3>
                <p className="text-[11px] text-slate-400">
                  Your learning data and study sessions stay safe on your device
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Encrypted Local Storage
            </span>
          </div>
        </div>

        {/* About BrainRoot AI - Small, elegant row item matching specification */}
        <div
          onClick={() => setShowAboutModal(true)}
          className="p-5 rounded-3xl bg-[#0e1526]/90 hover:bg-slate-850 border border-slate-800/90 hover:border-cyan-500/40 shadow-xl cursor-pointer transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                About BrainRoot AI
              </h3>
              <p className="text-[11px] text-slate-400">
                Version 2.0.0 • Created by Chandrashekhar Singh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 group-hover:text-cyan-300">
            <span className="text-xs font-semibold">Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Dark Mode Row */}
        <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Dark Mode</h3>
              <p className="text-[11px] text-slate-400">Cosmic navy theme optimized for student eye comfort</p>
            </div>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              theme === 'dark' ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Danger Zone: Reset Progress & Logout */}
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/20 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-rose-300">Account &amp; Data Reset</h3>

          <div className="flex flex-wrap items-center gap-3">
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300">Are you sure? This cannot be undone.</span>
                <button
                  onClick={() => {
                    resetAllProgress();
                    setShowResetConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Learning Progress</span>
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
