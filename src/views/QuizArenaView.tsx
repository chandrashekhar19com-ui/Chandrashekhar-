import React, { useState } from 'react';
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
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';

export const QuizArenaView: React.FC = () => {
  const { user, subjects, recordQuizAttempt, setActiveView } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [selectedChapter, setSelectedChapter] = useState<string>('Quadratic Equations');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [isAIGenerated, setIsAIGenerated] = useState<boolean>(false);
  const [negativeMarking, setNegativeMarking] = useState<boolean>(true);

  // Quiz state
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 mins

  const startQuiz = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          chapter: selectedChapter,
          userClass: user.educationStage,
          difficulty,
          count: 5,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('No questions generated');
      }
    } catch {
      // Curated backup questions
      setQuestions([
        {
          id: 'q1',
          question: 'What is the value of x if 2x + 4 = 16?',
          options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
          correctIndex: 1,
          explanation: 'Subtract 4 from both sides: 2x = 12. Divide by 2: x = 6.',
        },
        {
          id: 'q2',
          question: 'For quadratic equation ax² + bx + c = 0, what is the discriminant formula?',
          options: ['D = b² - 4ac', 'D = b² + 4ac', 'D = 2a / (-b)', 'D = a² - 4bc'],
          correctIndex: 0,
          explanation: 'Discriminant D = b² - 4ac reveals the nature of roots.',
        },
        {
          id: 'q3',
          question: 'If the discriminant D > 0, the roots of the equation are:',
          options: [
            'Real and equal',
            'Real and distinct',
            'Imaginary / complex',
            'Undefined',
          ],
          correctIndex: 1,
          explanation: 'When D > 0, the quadratic formula yields two distinct real numbers.',
        },
        {
          id: 'q4',
          question: 'What is the product of roots (α × β) in ax² + bx + c = 0?',
          options: ['-b / a', 'c / a', 'b / (2a)', '-c / a'],
          correctIndex: 1,
          explanation: 'By Vieta\'s formulas, product of roots = c / a and sum = -b / a.',
        },
        {
          id: 'q5',
          question: 'Which of the following is a quadratic equation?',
          options: ['x² + 2x = x²', '(x - 2)² = 2x - 3', 'x³ - x² = (x - 1)³', 'x + 1/x = 1'],
          correctIndex: 1,
          explanation: '(x - 2)² = x² - 4x + 4 = 2x - 3 => x² - 6x + 7 = 0, which is of degree 2.',
        },
      ]);
    } finally {
      setLoadingQuestions(false);
      setQuizActive(true);
      setQuizCompleted(false);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setShowExplanation(false);
      setTimeLeft(isTimed ? 900 : 0);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanation(true);
  };

  const calculateResults = () => {
    let correct = 0;
    let attempted = 0;

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen !== undefined) {
        attempted++;
        if (chosen === q.correctIndex) {
          correct++;
        }
      }
    });

    const incorrect = attempted - correct;
    let rawScore = correct - (negativeMarking ? incorrect * 0.25 : 0);
    rawScore = Math.max(0, rawScore);
    const scorePercent = Math.round((correct / questions.length) * 100);

    return { correct, incorrect, attempted, scorePercent, rawScore };
  };

  const finishQuiz = () => {
    const results = calculateResults();
    recordQuizAttempt({
      subject: selectedSubject,
      chapter: selectedChapter,
      totalQuestions: questions.length,
      correctAnswers: results.correct,
      scorePercent: results.scorePercent,
      timeSpentSeconds: 900 - timeLeft,
      isExamMode: false,
      negativeMarking,
      answers: questions.map((q, i) => ({
        questionId: q.id,
        selectedIndex: selectedAnswers[i] ?? -1,
        isCorrect: selectedAnswers[i] === q.correctIndex,
      })),
    });
    setQuizCompleted(true);
    setQuizActive(false);
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
              Interactive chapter quizzes with instant diagnostic feedback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('exam')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 transition-colors"
          >
            Switch to Full Exam Mode
          </button>
        </div>
      </div>

      {!quizActive && !quizCompleted ? (
        /* Quiz Setup Screen - Matching showcase layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Configuration Pane */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quiz Setup &amp; Topic Targeting
            </h3>

            {/* Selectors: Class, Subject, Chapter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Class
                </label>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
                  {user.educationStage} ({user.board})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Chapter
                </label>
                <select
                  value={selectedChapter}
                  onChange={e => setSelectedChapter(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Quadratic Equations">Quadratic Equations</option>
                  <option value="Real Numbers">Real Numbers</option>
                  <option value="Chemical Reactions">Chemical Reactions</option>
                  <option value="Life Processes">Life Processes</option>
                  <option value="Trigonometry">Introduction to Trigonometry</option>
                </select>
              </div>
            </div>

            {/* Toggles: Timed Mode & AI Generated */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setIsTimed(!isTimed)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                  isTimed
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Timed Mode
                </span>
                <span>{isTimed ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAIGenerated(!isAIGenerated)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                  isAIGenerated
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Generated
                </span>
                <span>{isAIGenerated ? 'ON' : 'OFF'}</span>
              </button>
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
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      difficulty === d
                        ? d === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400'
                          : d === 'Medium'
                          ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400'
                          : 'bg-rose-500/20 text-rose-300 border-2 border-rose-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Marking Option */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-slate-300">Negative Marking (-0.25 for incorrect answer)</span>
              <button
                type="button"
                onClick={() => setNegativeMarking(!negativeMarking)}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] ${
                  negativeMarking ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {negativeMarking ? 'Enabled (-0.25)' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* Right Summary & Start Button - Matching Showcase Layout */}
          <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quiz Summary
            </h3>

            {/* Summary metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">Questions</p>
                <p className="text-lg font-extrabold text-white">5</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">Time</p>
                <p className="text-lg font-extrabold text-white">{isTimed ? '15 min' : 'None'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400">Neg Mark</p>
                <p className="text-lg font-extrabold text-rose-400">{negativeMarking ? '-0.25' : '0'}</p>
              </div>
            </div>

            {/* Accuracy circle display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-28 h-28 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-black text-white">0%</span>
                  <span className="block text-[10px] text-slate-400">Target 80%+</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startQuiz}
              disabled={loadingQuestions}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingQuestions ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Start Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : quizActive && currentQ ? (
        /* Active Quiz Screen */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-400">
                {selectedSubject} • {selectedChapter}
              </span>
            </div>

            {isTimed && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-400">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Question Prompt */}
          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              Q{currentIndex + 1}. {currentQ.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              const hasAnswered = selectedAnswers[currentIndex] !== undefined;
              const isCorrect = idx === currentQ.correctIndex;

              let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700';
              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Instant Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-1.5 animate-in fade-in duration-200">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Explanation
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  setCurrentIndex(currentIndex - 1);
                  setShowExplanation(selectedAnswers[currentIndex - 1] !== undefined);
                }
              }}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold disabled:opacity-30"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentIndex(currentIndex + 1);
                  setShowExplanation(selectedAnswers[currentIndex + 1] !== undefined);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={finishQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20"
              >
                Finish &amp; Review Results
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Quiz Completed!</h2>
            <p className="text-xs text-slate-400">
              {selectedSubject} • {selectedChapter}
            </p>
          </div>

          {/* Results Cards */}
          {(() => {
            const results = calculateResults();
            return (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Accuracy</p>
                  <p className="text-2xl font-black text-emerald-400">{results.scorePercent}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Correct</p>
                  <p className="text-2xl font-black text-cyan-400">
                    {results.correct}/{questions.length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">XP Earned</p>
                  <p className="text-2xl font-black text-violet-400">
                    +{Math.round(results.scorePercent * 0.8) + 20}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={startQuiz}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
