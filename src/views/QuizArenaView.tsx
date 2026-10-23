import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Check,
  Zap,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';
import { getCuratedQuestions, validateQuestion, sanitizeQuestions } from '../data/quizBank';

type QuizState = 'idle' | 'loading' | 'in_progress' | 'submitting' | 'completed' | 'error';

export const QuizArenaView: React.FC = () => {
  const { user, subjects, recordQuizAttempt, setActiveView } = useApp();

  // Configuration state
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [isAIGenerated, setIsAIGenerated] = useState<boolean>(false);
  const [negativeMarking, setNegativeMarking] = useState<boolean>(true);

  // Quiz lifecycle state machine: idle | loading | in_progress | submitting | completed | error
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active quiz session state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // in seconds
  const [totalQuizTime, setTotalQuizTime] = useState<number>(600);
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState<boolean>(false);

  // Submission lock ref to prevent race conditions or duplicate submissions
  const isSubmittingRef = useRef<boolean>(false);

  // Synchronize available subjects and chapters based on active curriculum
  const availableSubjects = subjects && subjects.length > 0 ? subjects : [];

  useEffect(() => {
    // If no subject is selected or current selection is invalid, set to first available subject
    if (availableSubjects.length > 0) {
      const subjectExists = availableSubjects.some(s => s.name === selectedSubject);
      if (!selectedSubject || !subjectExists) {
        const defaultSub = availableSubjects[0].name;
        setSelectedSubject(defaultSub);
      }
    }
  }, [availableSubjects, selectedSubject]);

  // Derive available chapters for the currently selected subject
  const currentSubjectObj = availableSubjects.find(s => s.name === selectedSubject);
  const availableChapters = currentSubjectObj?.chapters && currentSubjectObj.chapters.length > 0
    ? currentSubjectObj.chapters
    : [];

  useEffect(() => {
    if (availableChapters.length > 0) {
      const chapterExists = availableChapters.some(c => c.title === selectedChapter);
      if (!selectedChapter || !chapterExists) {
        setSelectedChapter(availableChapters[0].title);
      }
    } else if (selectedSubject) {
      // If subject has no chapters defined, provide a sensible default title
      if (!selectedChapter) {
        setSelectedChapter('Core Fundamentals & Concepts');
      }
    }
  }, [selectedSubject, availableChapters, selectedChapter]);

  // Reset validation error when user changes subject or chapter
  useEffect(() => {
    if (selectedSubject && selectedChapter) {
      setValidationError(null);
    }
  }, [selectedSubject, selectedChapter]);

  // Timer Effect: active only during 'in_progress' state when isTimed is enabled
  useEffect(() => {
    if (quizState !== 'in_progress' || !isTimed) return;

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [quizState, isTimed]);

  // Auto-submit when time expires
  const handleTimeExpired = () => {
    if (isSubmittingRef.current) return;
    setWasAutoSubmitted(true);
    finishQuiz(true);
  };

  // Start Quiz Handler with validation, error handling, and race condition guard
  const handleStartQuiz = async () => {
    // Prevent double clicks
    if (quizState === 'loading' || quizState === 'in_progress' || quizState === 'submitting') {
      return;
    }

    // Validation
    if (!selectedSubject || selectedSubject.trim().length === 0) {
      setValidationError('Please select a subject to continue.');
      return;
    }

    if (!selectedChapter || selectedChapter.trim().length === 0) {
      setValidationError('Please select a chapter to continue.');
      return;
    }

    setValidationError(null);
    setErrorMessage(null);
    setQuizState('loading');
    isSubmittingRef.current = false;
    setWasAutoSubmitted(false);

    const targetSeconds = isTimed ? Math.max(180, questionCount * 120) : 0; // 2 minutes per question
    setTimeLeft(targetSeconds);
    setTotalQuizTime(targetSeconds);

    try {
      let loadedQuestions: QuizQuestion[] = [];

      // If AI mode requested, attempt server API first
      if (isAIGenerated) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);

          const res = await fetch('/api/quiz/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              subject: selectedSubject,
              chapter: selectedChapter,
              userClass: user.programName || user.educationStage || 'Higher Education',
              difficulty,
              count: questionCount,
            }),
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.questions) && data.questions.length > 0) {
              const sanitized = sanitizeQuestions(data.questions);
              if (sanitized.length > 0) {
                loadedQuestions = sanitized.slice(0, questionCount);
              }
            }
          }
        } catch (apiErr) {
          console.warn('AI Quiz endpoint fetch failed, falling back to verified bank:', apiErr);
        }
      }

      // If AI did not return questions or AI generation is disabled, use curated verified bank
      if (loadedQuestions.length === 0) {
        const curated = getCuratedQuestions(selectedSubject, selectedChapter, difficulty, questionCount);
        loadedQuestions = curated;
      }

      // Final validation of question array
      const validQuestions = loadedQuestions.filter(validateQuestion);

      if (validQuestions.length === 0) {
        throw new Error(`No validated questions could be loaded for "${selectedChapter}".`);
      }

      // Transition to in_progress
      setQuestions(validQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanation(false);
      setQuizState('in_progress');
    } catch (err: any) {
      console.error('Quiz start error:', err);
      setErrorMessage(err?.message || 'Failed to initialize quiz. Please try again.');
      setQuizState('error');
    }
  };

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    if (quizState !== 'in_progress') return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  // Calculate results based on answer key and negative marking
  const calculateResults = () => {
    let correct = 0;
    let attempted = 0;

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen !== undefined && chosen >= 0) {
        attempted++;
        if (chosen === q.correctIndex) {
          correct++;
        }
      }
    });

    const incorrect = attempted - correct;
    const unattempted = questions.length - attempted;
    const rawScore = Math.max(0, correct - (negativeMarking ? incorrect * 0.25 : 0));
    const scorePercent = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const timeSpent = Math.max(1, totalQuizTime - timeLeft);

    return {
      correct,
      incorrect,
      attempted,
      unattempted,
      rawScore: parseFloat(rawScore.toFixed(2)),
      scorePercent,
      timeSpent,
    };
  };

  // Finish quiz and persist attempt in AppContext
  const finishQuiz = (isAuto = false) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setQuizState('submitting');

    const results = calculateResults();

    try {
      recordQuizAttempt({
        subject: selectedSubject,
        chapter: selectedChapter,
        totalQuestions: questions.length,
        correctAnswers: results.correct,
        scorePercent: results.scorePercent,
        timeSpentSeconds: results.timeSpent,
        isExamMode: false,
        negativeMarking,
        answers: questions.map((q, i) => ({
          questionId: q.id,
          selectedIndex: selectedAnswers[i] ?? -1,
          isCorrect: selectedAnswers[i] === q.correctIndex,
        })),
      });
    } catch (err) {
      console.error('Failed to record quiz attempt:', err);
    }

    if (isAuto) {
      setWasAutoSubmitted(true);
    }
    setQuizState('completed');
  };

  // Reset to setup
  const handleResetToSetup = () => {
    setQuizState('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setErrorMessage(null);
    setValidationError(null);
    setWasAutoSubmitted(false);
    isSubmittingRef.current = false;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Title Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Quiz Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive chapter quizzes with instant diagnostic feedback &amp; negative marking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {quizState === 'idle' && (
            <button
              onClick={() => setActiveView('exam')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              Switch to Full Exam Simulator
            </button>
          )}
          {quizState === 'in_progress' && (
            <button
              onClick={handleResetToSetup}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              Quit Quiz
            </button>
          )}
        </div>
      </div>

      {/* STATE 1: IDLE (Quiz Setup) */}
      {quizState === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Configuration Pane */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Quiz Setup &amp; Topic Targeting
              </h3>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                {user.programName || user.educationStage}
              </span>
            </div>

            {/* Validation Banner if missing required fields */}
            {validationError && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Required Selection Missing</p>
                  <p className="text-amber-300/80 mt-0.5">{validationError}</p>
                </div>
              </div>
            )}

            {/* Selectors: Program/Stage, Subject, Chapter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Education Level
                </label>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white truncate" title={user.programName || user.educationStage}>
                  {user.programName || user.educationStage}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Subject <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {availableSubjects.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                  {availableSubjects.length === 0 && (
                    <option value="General Science & Math">General Science &amp; Math</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Chapter / Topic <span className="text-rose-400">*</span>
                </label>
                <select
                  value={selectedChapter}
                  onChange={e => setSelectedChapter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {availableChapters.length > 0 ? (
                    availableChapters.map(c => (
                      <option key={c.id || c.title} value={c.title}>
                        {c.title}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Core Fundamentals & Concepts">Core Fundamentals &amp; Concepts</option>
                      <option value="Theory & Analytical Principles">Theory &amp; Analytical Principles</option>
                      <option value="Problem Solving & Numerical Applications">Problem Solving &amp; Numerical Applications</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 15].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      difficulty === d
                        ? d === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400'
                          : d === 'Medium'
                          ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400'
                          : 'bg-rose-500/20 text-rose-300 border-2 border-rose-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles: Timed Mode & AI Generated */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setIsTimed(!isTimed)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isTimed
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Timed Mode ({Math.max(3, questionCount * 2)}m)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px]">
                  {isTimed ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsAIGenerated(!isAIGenerated)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isAIGenerated
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Generated
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px]">
                  {isAIGenerated ? 'ON' : 'VERIFIED BANK'}
                </span>
              </button>
            </div>

            {/* Negative Marking Option */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div>
                <span className="font-semibold text-slate-200">Negative Marking</span>
                <p className="text-[11px] text-slate-400">Deducts 0.25 marks for incorrect answers (competitive standard)</p>
              </div>
              <button
                type="button"
                onClick={() => setNegativeMarking(!negativeMarking)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  negativeMarking
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                {negativeMarking ? 'Enabled (-0.25)' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Right Summary & Start Button */}
          <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quiz Summary
            </h3>

            {/* Summary metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">Questions</p>
                <p className="text-lg font-extrabold text-white">{questionCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">Time</p>
                <p className="text-lg font-extrabold text-white">
                  {isTimed ? `${Math.max(3, questionCount * 2)} min` : 'Untimed'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">Neg Mark</p>
                <p className={`text-lg font-extrabold ${negativeMarking ? 'text-rose-400' : 'text-slate-400'}`}>
                  {negativeMarking ? '-0.25' : 'None'}
                </p>
              </div>
            </div>

            {/* Target & Accuracy display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-28 h-28 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-900/40 shadow-inner">
                <div className="text-center">
                  <span className="text-2xl font-black text-cyan-400">80%+</span>
                  <span className="block text-[10px] text-slate-400">Target Score</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 text-center">
                Earn up to <span className="text-violet-400 font-bold">+{questionCount * 12 + 20} XP</span> &amp; climb leaderboard
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              disabled={!selectedSubject || !selectedChapter}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Start Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: LOADING */}
      {quizState === 'loading' && (
        <div className="p-12 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl flex flex-col items-center justify-center space-y-4 text-center max-w-xl mx-auto min-h-[340px]">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Preparing Your Quiz...
            </h3>
            <p className="text-xs text-slate-400">
              Targeting {questionCount} questions on <span className="text-cyan-300 font-semibold">{selectedChapter}</span> ({selectedSubject})
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleResetToSetup}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: ERROR */}
      {quizState === 'error' && (
        <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-rose-800/60 shadow-2xl space-y-5 text-center max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Quiz Loading Failed</h2>
            <p className="text-xs text-slate-300">
              {errorMessage || 'Unable to load validated questions for the selected chapter.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleStartQuiz}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={handleResetToSetup}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Back to Setup
            </button>
          </div>
        </div>
      )}

      {/* STATE 4: IN_PROGRESS */}
      {quizState === 'in_progress' && currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6">
          {/* Top Progress & Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-extrabold text-xs">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {selectedSubject} • <span className="text-slate-200">{selectedChapter}</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                difficulty === 'Medium' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {difficulty}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isTimed && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
                  timeLeft <= 60
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                    : timeLeft <= 180
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-cyan-400'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}

              <div className="text-xs text-slate-400 font-semibold">
                Answered: <span className="text-white font-bold">{Object.keys(selectedAnswers).length}</span>/{questions.length}
              </div>
            </div>
          </div>

          {/* Question Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {questions.map((_, idx) => {
              const isCurrent = idx === currentIndex;
              const hasAnswered = selectedAnswers[idx] !== undefined;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowExplanation(false);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0e1526]'
                      : hasAnswered
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                  title={`Go to Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Prompt */}
          <div className="space-y-2 pt-2">
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              <span className="text-cyan-400 font-extrabold mr-2">Q{currentIndex + 1}.</span>
              {currentQ.question}
            </h2>
          </div>

          {/* Interactive Options List */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;

              let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900';
              if (isSelected) {
                optionStyle = 'bg-cyan-950/40 border-cyan-400 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-extrabold'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Optional Practice Mode Explanation Toggle */}
          {selectedAnswers[currentIndex] !== undefined && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showExplanation ? 'Hide Concept Explanation' : 'Show Concept Explanation'}</span>
              </button>

              {showExplanation && (
                <div className="mt-2 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-1.5 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Concept Note
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls: Previous / Next / Submit */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                  setShowExplanation(false);
                }
              }}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex(currentIndex + 1);
                    setShowExplanation(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => finishQuiz(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Finish &amp; Review Results</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATE 5: SUBMITTING */}
      {quizState === 'submitting' && (
        <div className="p-12 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl flex flex-col items-center justify-center space-y-4 text-center max-w-xl mx-auto min-h-[300px]">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <h3 className="text-lg font-bold text-white">
            Calculating Score &amp; Updating Learning Progress...
          </h3>
          <p className="text-xs text-slate-400">
            Applying negative marking and recording diagnostic attempt
          </p>
        </div>
      )}

      {/* STATE 6: COMPLETED */}
      {quizState === 'completed' && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6 text-center max-w-3xl mx-auto">
            {wasAutoSubmitted && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Time Expired! Your answers were automatically submitted.</span>
              </div>
            )}

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Quiz Completed!</h2>
              <p className="text-xs text-slate-400">
                {selectedSubject} • <span className="text-slate-200">{selectedChapter}</span>
              </p>
            </div>

            {/* Results Grid */}
            {(() => {
              const res = calculateResults();
              const isPassing = res.scorePercent >= 70;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">Accuracy</p>
                      <p className={`text-2xl font-black ${isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {res.scorePercent}%
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">Correct / Total</p>
                      <p className="text-2xl font-black text-cyan-400">
                        {res.correct}/{questions.length}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">Raw Score</p>
                      <p className="text-2xl font-black text-white">
                        {res.rawScore}
                        {negativeMarking && (
                          <span className="text-[10px] text-rose-400 block font-normal">
                            (-{res.incorrect * 0.25} neg)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                      <p className="text-xs text-slate-400">XP &amp; Coins</p>
                      <p className="text-2xl font-black text-violet-400">
                        +{Math.round(res.scorePercent * 0.8) + 20}
                      </p>
                    </div>
                  </div>

                  {/* Diagnostic feedback text */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                    {res.scorePercent >= 80 ? (
                      <p className="text-emerald-300 font-semibold">
                        🏆 Outstanding Mastery! You have a solid grasp of this topic. Ready for the Exam Simulator.
                      </p>
                    ) : res.scorePercent >= 60 ? (
                      <p className="text-cyan-300 font-semibold">
                        👍 Good Effort! Review the incorrect questions below to bridge concept gaps.
                      </p>
                    ) : (
                      <p className="text-amber-300 font-semibold">
                        💡 Needs Revision. We recommend checking the Notes Library and AI Tutor explanations for this chapter.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStartQuiz}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={handleResetToSetup}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer border border-slate-700"
              >
                New Quiz Setup
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer border border-slate-800"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Question-by-Question Detailed Review */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6 max-w-3xl mx-auto">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              Detailed Question Review &amp; Explanations
            </h3>

            <div className="space-y-4">
              {questions.map((q, qIdx) => {
                const userChoice = selectedAnswers[qIdx];
                const isCorrect = userChoice === q.correctIndex;
                const wasSkipped = userChoice === undefined;

                return (
                  <div
                    key={q.id || qIdx}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold text-slate-300">
                        Q{qIdx + 1}. {q.question}
                      </span>
                      {wasSkipped ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 shrink-0">
                          Skipped
                        </span>
                      ) : isCorrect ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Correct
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1 shrink-0">
                          <XCircle className="w-3 h-3 text-rose-400" /> Incorrect
                        </span>
                      )}
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isUserChoice = userChoice === oIdx;
                        const isCorrectOption = oIdx === q.correctIndex;

                        let optClass = 'bg-slate-950/60 border-slate-800/70 text-slate-400';
                        if (isCorrectOption) {
                          optClass = 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-bold';
                        } else if (isUserChoice && !isCorrect) {
                          optClass = 'bg-rose-950/30 border-rose-500/50 text-rose-200 line-through';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 ${optClass}`}
                          >
                            <span className="w-5 h-5 rounded bg-slate-800/80 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Step by step explanation */}
                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                        <span className="font-bold text-cyan-300 block mb-0.5">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
