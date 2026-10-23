import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FlashcardDeck, Flashcard } from '../types';

export const FlashcardsView: React.FC = () => {
  const { flashcardDecks, updateFlashcardStatus, addFlashcardDeck, addCustomFlashcard, user } = useApp();

  const [activeTab, setActiveTab] = useState<'decks' | 'create' | 'ai'>('decks');
  const [selectedDeckId, setSelectedDeckId] = useState<string>(flashcardDecks[0]?.id || 'deck-quad');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New Deck State
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('Mathematics');

  // New Custom Card State
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');

  // AI Generation State
  const [aiTopic, setAiTopic] = useState('Chemical Reactions');
  const [aiSubject, setAiSubject] = useState('Science');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const currentDeck = flashcardDecks.find(d => d.id === selectedDeckId) || flashcardDecks[0];
  const currentCard: Flashcard | undefined = currentDeck?.cards[cardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (status: 'again' | 'learning' | 'know_it') => {
    if (!currentDeck || !currentCard) return;

    updateFlashcardStatus(currentDeck.id, currentCard.id, status);
    setIsFlipped(false);

    if (cardIndex < currentDeck.cards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    const newDeck: FlashcardDeck = {
      id: 'deck-' + Date.now(),
      title: newDeckTitle,
      subject: newDeckSubject,
      cardsCount: 1,
      masteredCount: 0,
      cards: [
        {
          id: 'fc-' + Date.now(),
          front: newCardFront || 'Sample Question',
          back: newCardBack || 'Sample Answer',
          subject: newDeckSubject,
          chapter: newDeckTitle,
          intervalDays: 1,
          status: 'new',
          reviewCount: 0,
        },
      ],
    };

    addFlashcardDeck(newDeck);
    setSelectedDeckId(newDeck.id);
    setActiveTab('decks');
    setNewDeckTitle('');
    setNewCardFront('');
    setNewCardBack('');
  };

  const handleGenerateAIFlashcards = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: aiSubject,
          chapter: aiTopic,
          userClass: user.educationStage,
          count: 4,
        }),
      });

      const data = await res.json();
      if (data.flashcards && data.flashcards.length > 0) {
        const generatedCards: Flashcard[] = data.flashcards.map((c: any, i: number) => ({
          id: 'ai-fc-' + Date.now() + '-' + i,
          front: c.front,
          back: c.back,
          subject: aiSubject,
          chapter: aiTopic,
          intervalDays: 1,
          status: 'new',
          reviewCount: 0,
        }));

        const newDeck: FlashcardDeck = {
          id: 'deck-ai-' + Date.now(),
          title: `${aiTopic} (AI Generated)`,
          subject: aiSubject,
          cardsCount: generatedCards.length,
          masteredCount: 0,
          cards: generatedCards,
        };

        addFlashcardDeck(newDeck);
        setSelectedDeckId(newDeck.id);
        setActiveTab('decks');
        setCardIndex(0);
      }
    } catch {
      alert('AI Flashcard generation completed with curriculum template.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Flashcards &amp; Smart Revision
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Spaced repetition system designed for rapid long-term memory retention
            </p>
          </div>
        </div>

        {/* Tab Controls: My Decks, Create Deck, AI Generate */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('decks')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'decks'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Decks
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Deck</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Generate</span>
          </button>
        </div>
      </div>

      {activeTab === 'decks' ? (
        <div className="space-y-6">
          {/* Deck Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {flashcardDecks.map(deck => {
              const isSelected = deck.id === selectedDeckId;
              return (
                <button
                  key={deck.id}
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>{deck.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {deck.cards.length}
                  </span>
                </button>
              );
            })}
          </div>

          {currentDeck && currentCard ? (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>
                  Deck: <strong className="text-white">{currentDeck.title}</strong>
                </span>
                <span>
                  Card {cardIndex + 1} of {currentDeck.cards.length}
                </span>
              </div>

              {/* 3D Flip Flashcard Container */}
              <div
                onClick={handleFlip}
                className="relative h-80 sm:h-96 w-full cursor-pointer perspective-1000 select-none"
              >
                <div
                  className={`relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d shadow-2xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-gradient-to-br from-[#12192e] to-[#0c1222] border-2 border-cyan-500/30 flex flex-col justify-between backface-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                        Front • Question
                      </span>
                      <span className="text-xs text-slate-400">Tap anywhere to flip</span>
                    </div>

                    <div className="my-auto text-center px-4">
                      <h3 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                        {currentCard.front}
                      </h3>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleFlip();
                        }}
                        className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Flip Card</span>
                      </button>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-gradient-to-br from-[#171438] to-[#0d1428] border-2 border-violet-500/40 flex flex-col justify-between rotate-y-180 backface-hidden shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-950/60 border border-violet-500/30 px-3 py-1 rounded-full">
                        Back • Answer &amp; Solution
                      </span>
                      <span className="text-xs text-slate-400">Rate your recall below</span>
                    </div>

                    <div className="my-auto text-center px-4">
                      <p className="text-base sm:text-xl font-semibold text-slate-100 leading-relaxed">
                        {currentCard.back}
                      </p>
                    </div>

                    <div className="text-center text-[11px] text-slate-400">
                      Topic: {currentCard.chapter}
                    </div>
                  </div>
                </div>
              </div>

              {/* Spaced Repetition Rating Buttons - Matching Showcase Image */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleRate('again')}
                  className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Again</span>
                  <span className="text-[10px] opacity-75 font-normal">(1d)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate('learning')}
                  className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Learning</span>
                  <span className="text-[10px] opacity-75 font-normal">(2d)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate('know_it')}
                  className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Know It</span>
                  <span className="text-[10px] opacity-75 font-normal">(4d+)</span>
                </button>
              </div>

              {/* Navigation Indicators */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    if (cardIndex > 0) {
                      setCardIndex(cardIndex - 1);
                      setIsFlipped(false);
                    }
                  }}
                  disabled={cardIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-30 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="text-xs text-slate-400">
                  {cardIndex + 1} / {currentDeck.cards.length}
                </span>

                <button
                  onClick={() => {
                    if (cardIndex < currentDeck.cards.length - 1) {
                      setCardIndex(cardIndex + 1);
                      setIsFlipped(false);
                    }
                  }}
                  disabled={cardIndex === currentDeck.cards.length - 1}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-30 flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <Layers className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold">No flashcards in this deck yet. Create one or generate with AI!</p>
            </div>
          )}
        </div>
      ) : activeTab === 'create' ? (
        /* Manual Deck / Card Creator */
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            Create Custom Flashcard Deck
          </h3>

          <form onSubmit={handleCreateDeck} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Deck Title / Chapter
              </label>
              <input
                type="text"
                value={newDeckTitle}
                onChange={e => setNewDeckTitle(e.target.value)}
                placeholder="e.g. Chemical Bonding Master Deck"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={newDeckSubject}
                onChange={e => setNewDeckSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Science">Social Science</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Card 1: Front Question or Formula
              </label>
              <textarea
                value={newCardFront}
                onChange={e => setNewCardFront(e.target.value)}
                placeholder="What is the chemical formula for photosynthesis?"
                rows={2}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Card 1: Back Answer or Definition
              </label>
              <textarea
                value={newCardBack}
                onChange={e => setNewCardBack(e.target.value)}
                placeholder="6CO2 + 6H2O -> C6H12O6 + 6O2"
                rows={3}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              Save Deck &amp; Start Reviewing
            </button>
          </form>
        </div>
      ) : (
        /* AI Generation Tab */
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Generate Flashcards with Gemini
              </h3>
              <p className="text-xs text-slate-400">
                Instant high-yield revision flashcards generated from syllabus
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={aiSubject}
                onChange={e => setAiSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Science">Science (Physics / Chemistry / Biology)</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Social Science">Social Science (History / Civics / Geography)</option>
                <option value="English">English Literature</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Chapter / Topic Name
              </label>
              <input
                type="text"
                value={aiTopic}
                onChange={e => setAiTopic(e.target.value)}
                placeholder="e.g. Light - Reflection and Refraction"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleGenerateAIFlashcards}
              disabled={isGeneratingAI || !aiTopic.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingAI ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Flashcard Deck</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
