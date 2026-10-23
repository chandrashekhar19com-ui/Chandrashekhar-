import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Coins,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MissionsRewardsView: React.FC = () => {
  const { user, missions, badges, rewardShopItems, claimMissionReward, buyRewardItem } = useApp();
  const [tab, setTab] = useState<'missions' | 'badges' | 'shop'>('missions');

  const currentLevelXP = user.xp % 1000;
  const xpTarget = 1000;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Gamification &amp; Rewards Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Level up, earn BrainRoot coins, collect mastery badges, and customize your study mascot
            </p>
          </div>
        </div>

        {/* Tab Controls: Missions, Badges, Rewards Shop */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          {(['missions', 'badges', 'shop'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
                tab === t
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'missions' ? 'Daily Missions' : t === 'badges' ? 'Badges' : 'Rewards Shop'}
            </button>
          ))}
        </div>
      </div>

      {/* Explorer Level Showcase Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-cyan-400 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-[#090e1a] flex items-center justify-center font-black text-xl text-cyan-300">
                L{user.level}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Level {user.level} Explorer
              </h2>
              <p className="text-xs text-slate-300">
                Total XP: <span className="font-bold text-cyan-400">{user.xp} XP</span> • Balance:{' '}
                <span className="font-bold text-amber-400">{user.coins} Coins 🪙</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-orange-400/20" />
              <span>{user.streakDays} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 shadow-sm"
              style={{ width: `${Math.round((currentLevelXP / xpTarget) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{currentLevelXP} / {xpTarget} XP to Level {user.level + 1}</span>
            <span>{xpTarget - currentLevelXP} XP remaining</span>
          </div>
        </div>
      </div>

      {tab === 'missions' ? (
        /* Missions Tab */
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Daily Academic Missions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map(m => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <span className="text-xs font-bold text-cyan-400">
                      +{m.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{m.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {m.progress} / {m.target} completed
                    </span>

                    {m.isCompleted ? (
                      m.isClaimed ? (
                        <span className="text-slate-400 font-semibold text-[11px]">
                          Claimed ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => claimMissionReward(m.id)}
                          className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-extrabold text-xs shadow-md animate-pulse cursor-pointer"
                        >
                          Claim Reward (+{m.coinsReward} 🪙)
                        </button>
                      )
                    ) : (
                      <span className="text-slate-500 text-[11px]">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === 'badges' ? (
        /* Badges Tab */
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Curriculum &amp; Habit Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map(b => (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  b.unlocked
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md ${
                      b.unlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {b.unlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.unlocked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {b.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-white">{b.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{b.description}</p>
                </div>

                {b.unlockedAt && (
                  <p className="text-[10px] text-cyan-400 font-semibold pt-1">
                    Earned: {b.unlockedAt}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Rewards Shop Tab */
        <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              BrainRoot Virtual Rewards Shop
            </h3>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Balance: {user.coins} Coins
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewardShopItems.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <span className="text-xs text-amber-400 font-semibold">
                      {item.cost} Coins 🪙
                    </span>
                  </div>
                </div>

                {item.isPurchased ? (
                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold">
                    Equipped ✓
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      const success = buyRewardItem(item.id);
                      if (!success) {
                        alert('Not enough coins! Complete more quizzes and focus sessions.');
                      }
                    }}
                    disabled={user.coins < item.cost}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Unlock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
