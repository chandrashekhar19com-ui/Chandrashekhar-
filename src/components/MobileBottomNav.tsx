import React from 'react';
import { Home, GraduationCap, Bot, BookMarked, BrainCircuit, Settings } from 'lucide-react';
import { useApp, ActiveView } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'education-field', label: 'Ed-Field', icon: GraduationCap },
    { id: 'tutor', label: 'AI Tutor', icon: Bot },
    { id: 'my-learning', label: 'Learning', icon: BookMarked },
    { id: 'quiz', label: 'Practice', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? 'text-cyan-400 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
