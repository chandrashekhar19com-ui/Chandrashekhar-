import React, { useState, useEffect, useRef } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Coffee,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FocusTimerView: React.FC = () => {
  const { focusSessions, recordFocusSession, user } = useApp();

  const [mode, setMode] = useState<'pomodoro' | 'custom'>('pomodoro');
  const [timerType, setTimerType] = useState<'focus' | 'break'>('focus');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(3);
  const targetSessions = 4;

  const totalSeconds = (timerType === 'focus' ? durationMinutes : breakMinutes) * 60;
  const progressPercent = Math.min(100, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100));

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);

    if (timerType === 'focus') {
      recordFocusSession(durationMinutes, 'Pomodoro Focus');
      setSessionCount(prev => prev + 1);
      // Switch to break
      setTimerType('break');
      setSecondsLeft(breakMinutes * 60);
    } else {
      // Switch back to focus
      setTimerType('focus');
      setSecondsLeft(durationMinutes * 60);
    }

    // Play subtle audio beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = timerType === 'focus' ? 880 : 440;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // AudioContext fallback
    }
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft((timerType === 'focus' ? durationMinutes : breakMinutes) * 60);
  };

  const handleSelectPreset = (focus: number, brk: number) => {
    setIsRunning(false);
    setDurationMinutes(focus);
    setBreakMinutes(brk);
    setTimerType('focus');
    setSecondsLeft(focus * 60);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <TimerIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Focus Timer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Pomodoro deep study cycles with verified XP rewards
            </p>
          </div>
        </div>

        {/* Tab Controls: Pomodoro vs Custom */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => {
              setMode('pomodoro');
              handleSelectPreset(25, 5);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'pomodoro'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'custom'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Main Focus Ring Card - Matching Showcase Layout */}
      <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl flex flex-col items-center space-y-6">
        {/* Custom Presets if mode is custom */}
        {mode === 'custom' && (
          <div className="flex gap-2">
            {[15, 25, 45, 60].map(minsOption => (
              <button
                key={minsOption}
                onClick={() => handleSelectPreset(minsOption, 10)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  durationMinutes === minsOption
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                {minsOption} min
              </button>
            ))}
          </div>
        )}

        {/* Big Circular Dial with SVG Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-800/80"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#timerGradient)"
              strokeWidth="5"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mt-1">
              {timerType === 'focus' ? 'Focus Time' : 'Recharge Break'}
            </span>

            {/* Play/Pause Button in Center */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleTogglePlay}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={isRunning ? 'Pause' : 'Start'}
              >
                {isRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>
              <button
                onClick={handleReset}
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-colors cursor-pointer"
                title="Reset Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills: Focus, Break, Sessions - Matching Showcase Image */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Focus
            </p>
            <p className="text-sm sm:text-base font-extrabold text-white">
              {durationMinutes} min
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Break
            </p>
            <p className="text-sm sm:text-base font-extrabold text-cyan-400">
              {breakMinutes} min
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Sessions
            </p>
            <p className="text-sm sm:text-base font-extrabold text-violet-400">
              {sessionCount}/{targetSessions}
            </p>
          </div>
        </div>
      </div>

      {/* Session History Log - Matching Showcase Image Layout */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>Session History</span>
          <span className="text-xs text-cyan-400 font-semibold">Today: {user.totalStudyMinutes} min</span>
        </h3>

        <div className="space-y-2.5">
          {focusSessions.map(s => (
            <div
              key={s.id}
              className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {s.durationMinutes} min focus session
                  </p>
                  <p className="text-[10px] text-slate-400">{s.tag}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">{s.timestamp}</span>
                <span className="text-emerald-400 text-xs font-bold">✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
