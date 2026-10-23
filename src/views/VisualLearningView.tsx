import React, { useState } from 'react';
import { Sparkles, Eye, Info, CheckCircle2, RotateCcw } from 'lucide-react';

export const VisualLearningView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'cell' | 'photosynthesis' | 'parabola' | 'optics'>('cell');

  // Parabola slider state
  const [aCoeff, setACoeff] = useState(1);
  const [bCoeff, setBCoeff] = useState(-4);
  const [cCoeff, setCCoeff] = useState(3);

  // Cell organelle selector
  const [activeOrganelle, setActiveOrganelle] = useState<string>('mitochondria');

  // Discriminant calculation
  const disc = bCoeff * bCoeff - 4 * aCoeff * cCoeff;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Visual Learning &amp; Interactive Diagrams
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive STEM models, biology structures, and dynamic mathematical curves
            </p>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
          {[
            { id: 'cell', label: 'Cell Organelles' },
            { id: 'photosynthesis', label: 'Photosynthesis' },
            { id: 'parabola', label: 'Quadratic Parabola' },
            { id: 'optics', label: 'Optics Ray Diagram' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTopic(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                selectedTopic === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Diagram Display */}
      {selectedTopic === 'cell' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Cell SVG Diagram */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col items-center justify-center space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Interactive Animal Cell Structure (Click Organelles)
            </span>

            <div className="relative w-full max-w-md h-72 sm:h-80 bg-[#090e1a] rounded-3xl border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Plasma Membrane */}
                <ellipse cx="200" cy="150" rx="170" ry="120" fill="#0f172a" stroke="#06b6d4" strokeWidth="4" />
                {/* Cytoplasm */}
                <ellipse cx="200" cy="150" rx="160" ry="110" fill="#131d33" />

                {/* Nucleus */}
                <circle
                  cx="200"
                  cy="150"
                  r="45"
                  fill={activeOrganelle === 'nucleus' ? '#8b5cf6' : '#6d28d9'}
                  stroke="#c084fc"
                  strokeWidth="3"
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => setActiveOrganelle('nucleus')}
                />
                {/* Nucleolus */}
                <circle cx="195" cy="145" r="18" fill="#a78bfa" />
                <text x="180" y="150" fill="#fff" fontSize="10" fontWeight="bold">Nucleus</text>

                {/* Mitochondria 1 */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveOrganelle('mitochondria')}
                >
                  <ellipse
                    cx="100"
                    cy="120"
                    rx="30"
                    ry="18"
                    transform="rotate(-25 100 120)"
                    fill={activeOrganelle === 'mitochondria' ? '#10b981' : '#047857'}
                    stroke="#34d399"
                    strokeWidth="2"
                  />
                  <path d="M 85 120 Q 95 110 100 120 T 115 120" fill="none" stroke="#6ee7b7" strokeWidth="2" />
                  <text x="75" y="145" fill="#34d399" fontSize="9" fontWeight="bold">Mitochondria</text>
                </g>

                {/* Ribosomes / Endoplasmic Reticulum */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveOrganelle('er')}
                >
                  <path
                    d="M 260 120 Q 280 140 260 160 T 260 190"
                    fill="none"
                    stroke={activeOrganelle === 'er' ? '#f59e0b' : '#b45309'}
                    strokeWidth="4"
                  />
                  <circle cx="265" cy="125" r="2" fill="#fbbf24" />
                  <circle cx="270" cy="145" r="2" fill="#fbbf24" />
                  <circle cx="265" cy="165" r="2" fill="#fbbf24" />
                  <text x="275" y="160" fill="#fbbf24" fontSize="9" fontWeight="bold">Endoplasmic Reticulum</text>
                </g>

                {/* Lysosome */}
                <g
                  className="cursor-pointer transition-all"
                  onClick={() => setActiveOrganelle('lysosome')}
                >
                  <circle
                    cx="140"
                    cy="210"
                    r="14"
                    fill={activeOrganelle === 'lysosome' ? '#f43f5e' : '#be123c'}
                    stroke="#fb7185"
                    strokeWidth="2"
                  />
                  <text x="120" y="235" fill="#fb7185" fontSize="9" fontWeight="bold">Lysosome</text>
                </g>
              </svg>
            </div>
            <p className="text-[11px] text-slate-400">
              Click on the colored organelles inside the cell above to inspect textbook functions.
            </p>
          </div>

          {/* Right Organelle Details */}
          <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Organelle Inspector
            </h3>

            {activeOrganelle === 'mitochondria' && (
              <div className="space-y-3 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-sm font-extrabold text-emerald-400">Mitochondria (Powerhouse)</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Generates cellular energy in the form of **ATP** (Adenosine Triphosphate) via aerobic respiration.
                </p>
                <div className="text-[11px] text-emerald-300 space-y-1">
                  <p>• Contains its own circular DNA and 70S ribosomes.</p>
                  <p>• Inner folded membrane (cristae) increases surface area for ATP production.</p>
                </div>
              </div>
            )}

            {activeOrganelle === 'nucleus' && (
              <div className="space-y-3 p-4 rounded-2xl bg-violet-950/20 border border-violet-500/30">
                <span className="text-sm font-extrabold text-violet-400">Nucleus (Control Center)</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Houses genetic material (DNA/chromosomes) and directs all cellular metabolism, cell division, and growth.
                </p>
                <div className="text-[11px] text-violet-300 space-y-1">
                  <p>• Surrounded by a double-layer nuclear membrane with pores.</p>
                  <p>• Nucleolus inside is the site of ribosome assembly.</p>
                </div>
              </div>
            )}

            {activeOrganelle === 'er' && (
              <div className="space-y-3 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                <span className="text-sm font-extrabold text-amber-400">Endoplasmic Reticulum (ER)</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Tubular network for intracellular transport and macromolecule synthesis.
                </p>
                <div className="text-[11px] text-amber-300 space-y-1">
                  <p>• <strong>Rough ER:</strong> Studded with ribosomes for protein synthesis.</p>
                  <p>• <strong>Smooth ER:</strong> Synthesizes lipids and detoxifies poisons.</p>
                </div>
              </div>
            )}

            {activeOrganelle === 'lysosome' && (
              <div className="space-y-3 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-sm font-extrabold text-rose-400">Lysosome (Suicide Bag)</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Membrane-bound sacs packed with digestive hydrolytic enzymes capable of destroying foreign bacteria and dead organelles.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTopic === 'parabola' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Curve Visualization */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono text-base">
                y = {aCoeff}x² {bCoeff >= 0 ? `+ ${bCoeff}x` : `- ${Math.abs(bCoeff)}x`} {cCoeff >= 0 ? `+ ${cCoeff}` : `- ${Math.abs(cCoeff)}`}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                disc > 0 ? 'bg-emerald-500/20 text-emerald-300' : disc === 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                D = {disc} ({disc > 0 ? '2 Real Roots' : disc === 0 ? '1 Real Root' : 'No Real Roots'})
              </span>
            </div>

            <div className="w-full h-64 bg-[#090e1a] rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <svg viewBox="-50 -50 100 100" className="w-full h-full">
                {/* Axes */}
                <line x1="-50" y1="0" x2="50" y2="0" stroke="#334155" strokeWidth="1" />
                <line x1="0" y1="-50" x2="0" y2="50" stroke="#334155" strokeWidth="1" />

                {/* Parabola Polyline */}
                <path
                  d={(() => {
                    const points = [];
                    for (let x = -20; x <= 20; x += 0.5) {
                      const y = aCoeff * x * x + bCoeff * x + cCoeff;
                      points.push(`${x * 2},${-y * 2}`);
                    }
                    return `M ${points.join(' L ')}`;
                  })()}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Sliders Control */}
          <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Coefficient Controls
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  a (Curvature &amp; Direction): {aCoeff}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={aCoeff}
                  onChange={e => setACoeff(parseFloat(e.target.value) || 1)}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  b (Vertex Shift): {bCoeff}
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={bCoeff}
                  onChange={e => setBCoeff(parseFloat(e.target.value))}
                  className="w-full accent-violet-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  c (y-intercept): {cCoeff}
                </label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="1"
                  value={cCoeff}
                  onChange={e => setCCoeff(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTopic === 'photosynthesis' && (
        <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <h3 className="text-lg font-black text-white">Photosynthesis Chemical Model</h3>
            <p className="text-xs text-slate-300">
              6CO₂ + 6H₂O + Sunlight &rarr; C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <h4 className="text-sm font-bold text-cyan-300">1. Light Reaction (Thylakoids)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Water molecules are photolyzed into protons, electrons, and Oxygen (O₂). Energy is stored as ATP and NADPH.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h4 className="text-sm font-bold text-emerald-300">2. Dark Reaction / Calvin Cycle (Stroma)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                CO₂ is fixed using ATP &amp; NADPH into high-energy sugars (Glucose) which nourish plant tissues.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedTopic === 'optics' && (
        <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <h3 className="text-lg font-black text-white">Optics &amp; Lens Formula</h3>
            <p className="text-xs text-slate-300">
              1/f = 1/v - 1/u (Lens) • 1/f = 1/v + 1/u (Mirror)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Cartesian Sign Convention Rules
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>• Object distance (u) is always <strong>negative</strong> because it lies to the left of the lens.</li>
              <li>• Convex lens focal length (f) is always <strong>positive</strong>.</li>
              <li>• Concave lens focal length (f) is always <strong>negative</strong>.</li>
              <li>• Real and inverted images have positive v and negative magnification (m).</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
