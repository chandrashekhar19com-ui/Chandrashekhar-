import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Bookmark,
  AlertCircle,
  Award,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';

export const ExamSimulatorView: React.FC = () => {
  const { user, subjects, recordQuizAttempt, setActiveView } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [syllabusType, setSyllabusType] = useState('Full Syllabus');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [negativeMarking, setNegativeMarking] = useState(true);

  const [isExamRunning, setIsExamRunning] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'eq1',
      question: 'What is the value of x if 2x + 4 = 16?',
      options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'],
      correctIndex: 1,
      explanation: 'Subtract 4: 2x = 12. Divide by 2: x = 6.',
      topic: 'Linear & Quadratic Equations',
    },
    {
      id: 'eq2',
      question: 'The discriminant D of ax² + bx + c = 0 is defined as:',
      options: ['D = b² - 4ac', 'D = b² + 4ac', 'D = 4ac - b²', 'D = 2a / (-b)'],
      correctIndex: 0,
      explanation: 'D = b² - 4ac determines root characteristics.',
      topic: 'Quadratic Equations',
    },
    {
      id: 'eq3',
      question: 'If sin θ = 1/2, then what is the value of cos θ (for acute angle θ)?',
      options: ['√3 / 2', '1 / √2', '1 / 2', '√3'],
      correctIndex: 0,
      explanation: 'sin²θ + cos²θ = 1 => cos θ = √(1 - 1/4) = √3 / 2.',
      topic: 'Trigonometry',
    },
    {
      id: 'eq4',
      question: 'Which of the following numbers is an irrational number?',
      options: ['√4', '3.14', '√5', '22 / 7'],
      correctIndex: 2,
      explanation: '√5 is an irrational number as 5 is a prime.',
      topic: 'Real Numbers',
    },
    {
      id: 'eq5',
      question: 'What is the 10th term of the AP: 2, 7, 12, ...?',
      options: ['45', '47', '49', '50'],
      correctIndex: 1,
      explanation: 'a = 2, d = 5. a₁₀ = a + 9d = 2 + 9(5) = 47.',
      topic: 'Arithmetic Progressions',
    },
    {
      id: 'eq6',
      question: 'What is the distance between points (0, 0) and (3, 4)?',
      options: ['7 units', '5 units', '√7 units', '6 units'],
      correctIndex: 1,
      explanation: 'Distance = √(3² + 4²) = √(9 + 16) = √25 = 5.',
      topic: 'Coordinate Geometry',
    },
    {
      id: 'eq7',
      question: 'Two triangles are similar if their corresponding angles are:',
      options: ['Supplementary', 'Equal', 'Complementary', 'Unequal'],
      correctIndex: 1,
      explanation: 'AAA similarity requires all corresponding angles to be equal.',
      topic: 'Triangles',
    },
    {
      id: 'eq8',
      question: 'A tangent to a circle intersects it in how many point(s)?',
      options: ['Exactly one', 'Two', 'Zero', 'Infinitely many'],
      correctIndex: 0,
      explanation: 'A tangent touches the circle at exactly one distinct point.',
      topic: 'Circles',
    },
    {
      id: 'eq9',
      question: 'The empirical relationship between the three measures of central tendency is:',
      options: [
        '3 Median = Mode + 2 Mean',
        'Mode = 3 Mean - 2 Median',
        '2 Median = 3 Mode - Mean',
        'Mean = Mode + Median',
      ],
      correctIndex: 0,
      explanation: 'Empirical formula: 3 Median = Mode + 2 Mean.',
      topic: 'Statistics',
    },
    {
      id: 'eq10',
      question: 'What is the probability of an impossible event?',
      options: ['1', '0.5', '0', '-1'],
      correctIndex: 2,
      explanation: 'The probability of an impossible event is always 0.',
      topic: 'Probability',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});

  // Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isExamRunning && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamRunning, secondsRemaining]);

  const startExam = () => {
    setIsExamRunning(true);
    setIsExamFinished(false);
    setSecondsRemaining(durationMinutes * 60);
    setAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const submitExam = () => {
    setIsExamRunning(false);
    setIsExamFinished(true);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    recordQuizAttempt({
      subject: selectedSubject,
      chapter: syllabusType,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercent,
      timeSpentSeconds: durationMinutes * 60 - secondsRemaining,
      isExamMode: true,
      negativeMarking,
      answers: questions.map((q, idx) => ({
        questionId: q.id,
        selectedIndex: answers[idx] ?? -1,
        isCorrect: answers[idx] === q.correctIndex,
      })),
    });
  };

  // Status counts
  const answeredCount = Object.keys(answers).length;
  const notAnsweredCount = questions.length - answeredCount;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;

  const currentQ = questions[currentIndex];

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {!isExamRunning && !isExamFinished ? (
        /* Pre-Exam Setup Screen */
        <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Exam Simulator
              </h1>
              <p className="text-xs text-slate-400">
                Official timed simulation matching CBSE / State Board standards
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Syllabus Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Full Syllabus', 'Term 1 Only'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSyllabusType(s)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${
                      syllabusType === s
                        ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Exam Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all ${
                      durationMinutes === mins
                        ? 'bg-violet-500/20 text-violet-300 border-2 border-violet-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Enable Negative Marking (-0.25)</span>
              <button
                type="button"
                onClick={() => setNegativeMarking(!negativeMarking)}
                className={`px-3 py-1 rounded-lg font-bold ${
                  negativeMarking ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {negativeMarking ? 'YES (-0.25)' : 'NO'}
              </button>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:scale-[1.01] transition-all cursor-pointer"
          >
            Launch Exam Simulator
          </button>
        </div>
      ) : isExamRunning ? (
        /* Live Exam Running Screen - Matching Showcase Image Layout */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Workspace (3 columns) */}
          <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6">
            {/* Top Bar with Question meta */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                  {selectedSubject} • {syllabusType}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Question {currentIndex + 1} of {questions.length}
                </h2>
              </div>

              <button
                onClick={toggleMarkForReview}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  markedForReview[currentIndex]
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{markedForReview[currentIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Radio Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#0a0e1a]" />}
                    </div>
                    <span className="font-bold text-slate-400 mr-1">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Controls */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold disabled:opacity-30"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitExam}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20"
                  >
                    Submit Exam
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Status Sidebar (1 column) */}
          <div className="space-y-6">
            {/* Circular Timer & Exam Counts - Exactly as in the showcase image */}
            <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl flex flex-col items-center space-y-5">
              {/* Big Circular Clock */}
              <div className="relative w-36 h-36 rounded-full border-4 border-cyan-500/40 flex items-center justify-center bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <div className="text-center">
                  <p className="text-2xl font-mono font-black text-white tracking-wider">
                    {formatTimer(secondsRemaining)}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                    Time Left
                  </p>
                </div>
              </div>

              {/* Status breakdown metrics */}
              <div className="w-full space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Answered
                  </span>
                  <span className="font-extrabold text-white">{answeredCount}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2 text-slate-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-slate-500" /> Not Answered
                  </span>
                  <span className="font-extrabold text-white">{notAnsweredCount}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2 text-amber-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Marked for Review
                  </span>
                  <span className="font-extrabold text-white">{reviewCount}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={submitExam}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Submit Exam
              </button>
            </div>

            {/* Question Matrix Palette */}
            <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Question Palette
              </span>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => {
                  const isAns = answers[i] !== undefined;
                  const isRev = markedForReview[i];
                  const isCur = currentIndex === i;

                  let bg = 'bg-slate-900 text-slate-400 border-slate-800';
                  if (isAns) bg = 'bg-emerald-500/30 text-emerald-300 border-emerald-500/60 font-bold';
                  if (isRev) bg = 'bg-amber-500/30 text-amber-300 border-amber-500/60 font-bold';
                  if (isCur) bg += ' ring-2 ring-cyan-400 scale-105';

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-all ${bg}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Exam Finished / Diagnostic Score Report */
        <div className="p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl space-y-6 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 mx-auto flex items-center justify-center text-white shadow-xl shadow-cyan-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Exam Simulation Complete</h2>
            <p className="text-xs text-slate-400">
              {selectedSubject} ({syllabusType}) • {user.educationStage} {user.board}
            </p>
          </div>

          {/* Diagnostic Metrics */}
          {(() => {
            let correct = 0;
            questions.forEach((q, idx) => {
              if (answers[idx] === q.correctIndex) correct++;
            });
            const accuracy = Math.round((correct / questions.length) * 100);
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="text-2xl font-black text-emerald-400">
                    {correct}/{questions.length}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Accuracy</p>
                  <p className="text-2xl font-black text-cyan-400">{accuracy}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">Time Taken</p>
                  <p className="text-2xl font-black text-violet-400">
                    {Math.round((durationMinutes * 60 - secondsRemaining) / 60)} min
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <p className="text-xs text-slate-400">XP Awarded</p>
                  <p className="text-2xl font-black text-amber-400">
                    +{Math.round(accuracy * 1.2)}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Question-wise Review Accordion */}
          <div className="text-left space-y-2 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question Diagnostics &amp; Explanations
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {questions.map((q, i) => {
                const userAns = answers[i];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-rose-950/20 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Q{i + 1}. {q.topic || 'Concept'}</span>
                      <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {isCorrect ? 'Correct ✓' : userAns !== undefined ? 'Incorrect ✗' : 'Skipped'}
                      </span>
                    </div>
                    <p className="text-slate-300">{q.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={startExam}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam</span>
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
