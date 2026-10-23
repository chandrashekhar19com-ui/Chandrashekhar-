import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Subject,
  QuizAttempt,
  FlashcardDeck,
  Flashcard,
  StudyTask,
  FocusSession,
  NoteItem,
  PDFLearningDoc,
  Mission,
  Badge,
  RewardItem,
  WeakTopicItem,
  LanguagePreference,
  EducationStage,
  BoardType,
  EducationCategory,
  ExplanationMode,
  CareerPathway,
  AcademicResource,
  SkillCourse,
  AssignmentProject,
  ChapterStatus,
  Chapter,
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_FLASHCARD_DECKS,
  INITIAL_NOTES,
  INITIAL_STUDY_TASKS,
  INITIAL_MISSIONS,
  INITIAL_BADGES,
  REWARD_SHOP_ITEMS,
} from '../data/curriculumData';
import {
  EDUCATION_SECTORS,
  HIGHER_ED_SUBJECTS,
  CAREER_PATHWAYS,
  ACADEMIC_RESOURCES,
  SKILL_COURSES,
  SAMPLE_ASSIGNMENTS,
  EducationSector,
} from '../data/higherEducationData';

export const normalizeChapter = (ch: Chapter): Chapter => {
  const topics = ch.topics || [];
  const totalTopics = topics.length > 0 ? topics.length : (ch.totalTopics || 0);
  const completedTopics = topics.length > 0 ? topics.filter(t => t.completed).length : (ch.completedTopics || 0);

  let status: ChapterStatus = ch.status || 'not_started';
  if (!ch.status) {
    if (completedTopics >= totalTopics && totalTopics > 0) {
      status = 'completed';
    } else if (completedTopics > 0) {
      status = 'in_progress';
    } else {
      status = 'not_started';
    }
  }

  const completed = status === 'completed';

  return {
    ...ch,
    topics,
    totalTopics,
    completedTopics,
    status,
    completed,
  };
};

export const normalizeSubject = (sub: Subject): Subject => {
  const chapters = (sub.chapters || []).map(normalizeChapter);
  const chaptersCount = chapters.length > 0 ? chapters.length : (sub.chaptersCount || 0);
  const topicsCount = chapters.reduce((sum, ch) => sum + ch.totalTopics, 0) || (sub.topicsCount || 0);
  const completedChaptersCount = chapters.filter(ch => ch.status === 'completed').length;
  const progressPercent = chaptersCount > 0 ? Math.round((completedChaptersCount / chaptersCount) * 100) : 0;

  return {
    ...sub,
    chapters,
    chaptersCount,
    topicsCount,
    completedChaptersCount,
    progressPercent,
  };
};

export type ActiveView =
  | 'dashboard'
  | 'education-field'
  | 'tutor'
  | 'my-learning'
  | 'curriculum'
  | 'quiz'
  | 'exam'
  | 'flashcards'
  | 'planner'
  | 'timer'
  | 'pdf'
  | 'notes'
  | 'visual'
  | 'voice'
  | 'weak-topics'
  | 'analytics'
  | 'missions'
  | 'career-explorer'
  | 'library'
  | 'skills'
  | 'settings'
  | 'profile';

interface AppContextType {
  user: UserProfile;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  showAboutModal: boolean;
  setShowAboutModal: (show: boolean) => void;
  // Academic & Sector Data
  subjects: Subject[];
  activeCategory: EducationCategory;
  setActiveCategory: (cat: EducationCategory) => void;
  educationSectors: EducationSector[];
  careerPathways: CareerPathway[];
  academicResources: AcademicResource[];
  skillCourses: SkillCourse[];
  assignments: AssignmentProject[];
  flashcardDecks: FlashcardDeck[];
  notes: NoteItem[];
  studyTasks: StudyTask[];
  focusSessions: FocusSession[];
  pdfDocs: PDFLearningDoc[];
  missions: Mission[];
  badges: Badge[];
  rewardShopItems: RewardItem[];
  quizHistory: QuizAttempt[];
  weakTopics: WeakTopicItem[];
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  // Actions
  loginAsGuest: () => void;
  loginWithEmail: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchEducationField: (category: EducationCategory, programName: string, institution?: string, semester?: string) => void;
  selectCourse: (
    category: EducationCategory,
    programName: string,
    stream?: string,
    semester?: string,
    institution?: string,
    selectedSubjectNames?: string[]
  ) => void;
  setChapterStatus: (subjectId: string, chapterId: string, status: ChapterStatus) => void;
  toggleChapterStatus: (subjectId: string, chapterId: string) => void;
  toggleTopicCompletion: (subjectId: string, chapterId: string, topicId: string) => void;
  toggleSubjectEnrollment: (subjectNameOrId: string) => void;
  getActiveCategorySubjects: (category?: EducationCategory) => Subject[];
  getOverallProgress: (category?: EducationCategory) => {
    totalChapters: number;
    completedChapters: number;
    progressPercent: number;
    totalTopics: number;
    completedTopics: number;
  };
  completeOnboarding: (data: {
    educationStage: EducationStage;
    board: BoardType;
    subjects: string[];
    preferredLanguage: LanguagePreference;
    dailyGoalMinutes: number;
    examDate?: string;
  }) => void;
  addXP: (amount: number, reason?: string) => void;
  addCoins: (amount: number) => void;
  recordStudyMinutes: (minutes: number) => void;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => void;
  claimMissionReward: (missionId: string) => void;
  updateFlashcardStatus: (deckId: string, cardId: string, status: 'again' | 'learning' | 'know_it') => void;
  addFlashcardDeck: (deck: FlashcardDeck) => void;
  addCustomFlashcard: (deckId: string, front: string, back: string) => void;
  saveNote: (note: Omit<NoteItem, 'id' | 'dateStr'> & { id?: string }) => void;
  deleteNote: (id: string) => void;
  toggleNoteBookmark: (id: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addStudyTask: (task: Omit<StudyTask, 'id'>) => void;
  deleteStudyTask: (taskId: string) => void;
  toggleAssignmentStatus: (assignmentId: string) => void;
  addAssignment: (assignment: Omit<AssignmentProject, 'id'>) => void;
  updateSkillCourseProgress: (courseId: string, deltaPercent: number) => void;
  recordFocusSession: (durationMinutes: number, tag?: string) => void;
  addPDFDoc: (doc: PDFLearningDoc) => void;
  buyRewardItem: (itemId: string) => boolean;
  exportUserData: () => void;
  importUserData: (jsonData: string) => boolean;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'brainroot_ai_state_v2';

const DEFAULT_USER: UserProfile = {
  name: 'Student Explorer',
  email: 'student@brainroot.ai',
  avatar: 'cosmic_robot',
  educationStage: 'Class 10',
  board: 'CBSE',
  educationCategory: 'school',
  programName: 'Class 10 Secondary Board',
  semesterOrYear: 'Class 10 (Final Term)',
  institutionOrUniversity: 'CBSE',
  streamOrSpecialization: 'General Secondary Curriculum',
  subjects: ['Mathematics', 'Science', 'English', 'Social Science'],
  preferredLanguage: 'English',
  explanationMode: 'intermediate',
  dailyGoalMinutes: 60,
  examDate: '2026-03-25',
  examName: 'Board Exam - Class 10',
  isGuest: false,
  xp: 420,
  level: 5,
  coins: 320,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 45,
  joinedDate: 'Apr 2025',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_user');
      return saved ? { ...DEFAULT_USER, ...JSON.parse(saved) } : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [activeCategory, setActiveCategory] = useState<EducationCategory>(
    user.educationCategory || 'school'
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY + '_auth') === 'true';
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY + '_onboarded') === 'true';
  });

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Combined Subjects: School + Higher Education with complete normalization
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_subjects');
      const allBase = [...INITIAL_SUBJECTS, ...HIGHER_ED_SUBJECTS];
      let baseList: Subject[] = saved ? JSON.parse(saved) : allBase;
      
      // Ensure any newly configured subjects are merged cleanly
      const merged = [...baseList];
      for (const item of allBase) {
        if (!merged.some(s => s.id === item.id)) {
          merged.push(item);
        }
      }
      return merged.map(normalizeSubject);
    } catch {
      return [...INITIAL_SUBJECTS, ...HIGHER_ED_SUBJECTS].map(normalizeSubject);
    }
  });

  const [careerPathways] = useState<CareerPathway[]>(CAREER_PATHWAYS);
  const [academicResources] = useState<AcademicResource[]>(ACADEMIC_RESOURCES);
  const [skillCourses, setSkillCourses] = useState<SkillCourse[]>(SKILL_COURSES);
  const [assignments, setAssignments] = useState<AssignmentProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_assignments');
      return saved ? JSON.parse(saved) : SAMPLE_ASSIGNMENTS;
    } catch {
      return SAMPLE_ASSIGNMENTS;
    }
  });

  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_flashcards');
      return saved ? JSON.parse(saved) : INITIAL_FLASHCARD_DECKS;
    } catch {
      return INITIAL_FLASHCARD_DECKS;
    }
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_tasks');
      return saved ? JSON.parse(saved) : INITIAL_STUDY_TASKS;
    } catch {
      return INITIAL_STUDY_TASKS;
    }
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_sessions');
      return saved ? JSON.parse(saved) : [
        { id: 'f-1', durationMinutes: 25, timestamp: 'Apr 21, 10:32', tag: 'Pomodoro', completed: true },
        { id: 'f-2', durationMinutes: 25, timestamp: 'Apr 21, 09:15', tag: 'Pomodoro', completed: true },
        { id: 'f-3', durationMinutes: 25, timestamp: 'Apr 20, 08:47', tag: 'Pomodoro', completed: true },
      ];
    } catch {
      return [];
    }
  });

  const [pdfDocs, setPdfDocs] = useState<PDFLearningDoc[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_pdf');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_missions');
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [rewardShopItems, setRewardShopItems] = useState<RewardItem[]>(REWARD_SHOP_ITEMS);

  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_quizzes');
      return saved ? JSON.parse(saved) : [
        {
          id: 'q-init-1',
          subject: 'Mathematics',
          chapter: 'Quadratic Equations',
          topic: 'Standard Form & Nature of Roots',
          totalQuestions: 10,
          correctAnswers: 7,
          scorePercent: 70,
          timeSpentSeconds: 420,
          timestamp: 'Apr 21, 2025',
          isExamMode: false,
          negativeMarking: true,
          answers: [],
        },
        {
          id: 'q-init-2',
          subject: 'Data Structures & Algorithms',
          chapter: 'Asymptotic Analysis & Linear Structures',
          topic: 'Big-O & Master Theorem',
          totalQuestions: 8,
          correctAnswers: 7,
          scorePercent: 87,
          timeSpentSeconds: 360,
          timestamp: 'Apr 22, 2025',
          isExamMode: false,
          negativeMarking: true,
          answers: [],
        },
      ];
    } catch {
      return [];
    }
  });

  const [weakTopics, setWeakTopics] = useState<WeakTopicItem[]>([
    {
      subject: 'Mathematics',
      topicName: 'Quadratic Equations (Math)',
      accuracy: 65,
      totalAttempts: 12,
      recommendedAction: 'Practice discriminant analysis & factoring roots',
    },
    {
      subject: 'Data Structures',
      topicName: 'AVL Tree Rotations (CS)',
      accuracy: 60,
      totalAttempts: 6,
      recommendedAction: 'Master Double-Rotation (LR/RL) height rebalancing',
    },
    {
      subject: 'Indian Polity',
      topicName: 'Basic Structure Doctrine (GS-II)',
      accuracy: 68,
      totalAttempts: 8,
      recommendedAction: 'Review Kesavananda Bharati & Minerva Mills case laws',
    },
  ]);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY + '_auth', String(isAuthenticated));
      localStorage.setItem(STORAGE_KEY + '_onboarded', String(isOnboarded));
      localStorage.setItem(STORAGE_KEY + '_subjects', JSON.stringify(subjects));
      localStorage.setItem(STORAGE_KEY + '_flashcards', JSON.stringify(flashcardDecks));
      localStorage.setItem(STORAGE_KEY + '_notes', JSON.stringify(notes));
      localStorage.setItem(STORAGE_KEY + '_tasks', JSON.stringify(studyTasks));
      localStorage.setItem(STORAGE_KEY + '_sessions', JSON.stringify(focusSessions));
      localStorage.setItem(STORAGE_KEY + '_quizzes', JSON.stringify(quizHistory));
      localStorage.setItem(STORAGE_KEY + '_missions', JSON.stringify(missions));
      localStorage.setItem(STORAGE_KEY + '_assignments', JSON.stringify(assignments));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [user, isAuthenticated, isOnboarded, subjects, flashcardDecks, notes, studyTasks, focusSessions, quizHistory, missions, assignments]);

  // Daily Streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = user.lastActiveDate === yesterday ? user.streakDays + 1 : 1;
      setUser(prev => ({
        ...prev,
        streakDays: newStreak,
        lastActiveDate: today,
      }));
    }
  }, [user.lastActiveDate, user.streakDays]);

  const addXP = (amount: number, reason?: string) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      if (newLevel > prev.level) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'],
        });
      }
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const addCoins = (amount: number) => {
    setUser(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const recordStudyMinutes = (minutes: number) => {
    setUser(prev => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + minutes,
    }));
  };

  const loginAsGuest = () => {
    setUser(prev => ({ ...prev, isGuest: true, name: 'Guest Explorer' }));
    setIsAuthenticated(true);
    setIsOnboarded(true);
  };

  const loginWithEmail = (email: string, name?: string) => {
    setUser(prev => ({
      ...prev,
      email,
      name: name || email.split('@')[0],
      isGuest: false,
    }));
    setIsAuthenticated(true);
    setIsOnboarded(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOnboarded(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    if (updates.educationCategory) {
      setActiveCategory(updates.educationCategory);
    }
  };

  const selectCourse = (
    category: EducationCategory,
    programName: string,
    stream?: string,
    semester?: string,
    institution?: string,
    selectedSubjectNames?: string[]
  ) => {
    setActiveCategory(category);

    // Determine relevant default subjects for this category if none supplied
    const catSubjects = subjects.filter(s => s.category === category);
    const defaultSubjectNames = catSubjects.length > 0 
      ? catSubjects.map(s => s.name)
      : ['General Curriculum'];

    const chosenSubjects = selectedSubjectNames && selectedSubjectNames.length > 0 
      ? selectedSubjectNames 
      : defaultSubjectNames;

    let stage: EducationStage = 'Undergraduate';
    if (category === 'school') stage = 'Class 10';
    else if (category === 'senior_secondary') stage = 'Class 12';
    else if (category === 'postgraduate') stage = 'Postgraduate';
    else if (category === 'doctoral_research') stage = 'Doctoral & Research';
    else if (category === 'professional') stage = 'Professional Studies';
    else if (category === 'diploma_vocational') stage = 'Diploma & Polytechnic';
    else if (category === 'competitive_exams') stage = 'Competitive Exams';
    else if (category === 'skills_certifications') stage = 'Lifelong & Skills';

    setUser(prev => ({
      ...prev,
      educationCategory: category,
      educationStage: stage,
      programName,
      streamOrSpecialization: stream || prev.streamOrSpecialization || 'Core Specialization',
      semesterOrYear: semester || prev.semesterOrYear || 'Current Term',
      institutionOrUniversity: institution || prev.institutionOrUniversity || 'Recognized Board / University',
      subjects: chosenSubjects,
      examName: `${programName} Exam`,
    }));

    addXP(50, `Switched to ${programName}`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const switchEducationField = (
    category: EducationCategory,
    programName: string,
    institution = 'Recognized Board / University',
    semester = 'Current Semester'
  ) => {
    selectCourse(category, programName, undefined, semester, institution);
  };

  const toggleSubjectEnrollment = (subjectNameOrId: string) => {
    setUser(prev => {
      const exists = prev.subjects.includes(subjectNameOrId);
      let updatedSubjects: string[];
      if (exists) {
        if (prev.subjects.length <= 1) return prev; // Keep at least one
        updatedSubjects = prev.subjects.filter(s => s !== subjectNameOrId);
      } else {
        updatedSubjects = [...prev.subjects, subjectNameOrId];
      }
      return { ...prev, subjects: updatedSubjects };
    });
  };

  const setChapterStatus = (subjectId: string, chapterId: string, status: ChapterStatus) => {
    setSubjects(prevSubjects => {
      const updated = prevSubjects.map(sub => {
        if (sub.id !== subjectId) return sub;

        const updatedChapters = sub.chapters.map(ch => {
          if (ch.id !== chapterId) return ch;

          const isComp = status === 'completed';
          const isNotStarted = status === 'not_started';

          const updatedTopics = ch.topics.map((t, idx) => ({
            ...t,
            completed: isComp 
              ? true 
              : isNotStarted 
              ? false 
              : (status === 'in_progress' ? (idx === 0 ? true : t.completed) : t.completed),
          }));

          const completedTopics = isComp
            ? updatedTopics.length
            : isNotStarted
            ? 0
            : Math.max(1, updatedTopics.filter(t => t.completed).length);

          return {
            ...ch,
            status,
            completed: isComp,
            topics: updatedTopics,
            totalTopics: updatedTopics.length,
            completedTopics,
            lastUpdated: new Date().toISOString(),
          };
        });

        return normalizeSubject({ ...sub, chapters: updatedChapters });
      });

      return updated;
    });

    if (status === 'completed') {
      addXP(40, 'Completed chapter module');
      addCoins(15);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6'],
      });
    }
  };

  const toggleChapterStatus = (subjectId: string, chapterId: string) => {
    const sub = subjects.find(s => s.id === subjectId);
    const ch = sub?.chapters.find(c => c.id === chapterId);
    if (!ch) return;

    const nextStatus: ChapterStatus = ch.status === 'completed' ? 'in_progress' : 'completed';
    setChapterStatus(subjectId, chapterId, nextStatus);
  };

  const toggleTopicCompletion = (subjectId: string, chapterId: string, topicId: string) => {
    setSubjects(prevSubjects => {
      return prevSubjects.map(sub => {
        if (sub.id !== subjectId) return sub;

        const updatedChapters = sub.chapters.map(ch => {
          if (ch.id !== chapterId) return ch;

          const updatedTopics = ch.topics.map(t => {
            if (t.id !== topicId) return t;
            return { ...t, completed: !t.completed };
          });

          const completedTopics = updatedTopics.filter(t => t.completed).length;
          const totalTopics = updatedTopics.length;

          let status: ChapterStatus = 'not_started';
          if (completedTopics >= totalTopics && totalTopics > 0) {
            status = 'completed';
          } else if (completedTopics > 0) {
            status = 'in_progress';
          }

          return {
            ...ch,
            topics: updatedTopics,
            completedTopics,
            totalTopics,
            status,
            completed: status === 'completed',
            lastUpdated: new Date().toISOString(),
          };
        });

        return normalizeSubject({ ...sub, chapters: updatedChapters });
      });
    });

    addXP(10, 'Completed topic');
  };

  const getActiveCategorySubjects = (category?: EducationCategory): Subject[] => {
    const targetCat = category || user.educationCategory || activeCategory;
    const catSubjects = subjects.filter(s => s.category === targetCat);
    return catSubjects.length > 0 ? catSubjects : subjects;
  };

  const getOverallProgress = (category?: EducationCategory) => {
    const targetSubjects = getActiveCategorySubjects(category);
    // Applicable chapters count:
    const totalChapters = targetSubjects.reduce((acc, s) => acc + (s.chapters.length || s.chaptersCount || 0), 0);
    const completedChapters = targetSubjects.reduce((acc, s) => acc + s.chapters.filter(c => c.status === 'completed').length, 0);
    const progressPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
    const totalTopics = targetSubjects.reduce((acc, s) => acc + (s.topicsCount || 0), 0);
    const completedTopics = targetSubjects.reduce((acc, s) => acc + s.chapters.reduce((sum, c) => sum + (c.completedTopics || 0), 0), 0);

    return {
      totalChapters,
      completedChapters,
      progressPercent,
      totalTopics,
      completedTopics,
    };
  };

  const completeOnboarding = (data: {
    educationStage: EducationStage;
    board: BoardType;
    subjects: string[];
    preferredLanguage: LanguagePreference;
    dailyGoalMinutes: number;
    examDate?: string;
  }) => {
    setUser(prev => ({
      ...prev,
      ...data,
      examDate: data.examDate || prev.examDate,
    }));
    setIsOnboarded(true);
    setActiveView('dashboard');
    addXP(100, 'Completed Onboarding');
  };

  const recordQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'timestamp'>) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: 'qa-' + Date.now(),
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setQuizHistory(prev => [newAttempt, ...prev]);

    setMissions(prev =>
      prev.map(m => {
        if (m.id === 'm-quiz') {
          const newProg = Math.min(m.target, m.progress + attemptData.totalQuestions);
          return {
            ...m,
            progress: newProg,
            isCompleted: newProg >= m.target,
          };
        }
        return m;
      })
    );

    const xpEarned = Math.round(attemptData.scorePercent * 0.8) + 20;
    const coinsEarned = Math.round(attemptData.correctAnswers * 3);
    addXP(xpEarned);
    addCoins(coinsEarned);

    if (attemptData.scorePercent < 75 && attemptData.chapter) {
      setWeakTopics(prev => {
        const existing = prev.find(w => w.topicName.includes(attemptData.chapter));
        if (existing) {
          return prev.map(w =>
            w.topicName === existing.topicName
              ? {
                  ...w,
                  accuracy: Math.round((w.accuracy + attemptData.scorePercent) / 2),
                  totalAttempts: w.totalAttempts + 1,
                }
              : w
          );
        } else {
          return [
            {
              subject: attemptData.subject,
              topicName: `${attemptData.chapter} (${attemptData.subject.slice(0, 4)})`,
              accuracy: attemptData.scorePercent,
              totalAttempts: attemptData.totalQuestions,
              recommendedAction: 'Review formula sheet & complete flashcards',
            },
            ...prev,
          ];
        }
      });
    }
  };

  const claimMissionReward = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || !mission.isCompleted || mission.isClaimed) return;

    addXP(mission.xpReward);
    addCoins(mission.coinsReward);

    setMissions(prev =>
      prev.map(m => (m.id === missionId ? { ...m, isClaimed: true } : m))
    );

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#34d399'],
    });
  };

  const updateFlashcardStatus = (
    deckId: string,
    cardId: string,
    status: 'again' | 'learning' | 'know_it'
  ) => {
    setFlashcardDecks(prev =>
      prev.map(deck => {
        if (deck.id !== deckId) return deck;
        const updatedCards = deck.cards.map(c => {
          if (c.id !== cardId) return c;
          const intervalDays = status === 'know_it' ? c.intervalDays * 2 : status === 'learning' ? 2 : 1;
          return {
            ...c,
            status,
            intervalDays,
            reviewCount: c.reviewCount + 1,
            lastReviewed: new Date().toISOString(),
          };
        });
        const masteredCount = updatedCards.filter(c => c.status === 'know_it').length;
        return {
          ...deck,
          cards: updatedCards,
          masteredCount,
        };
      })
    );

    addXP(5);
  };

  const addFlashcardDeck = (newDeck: FlashcardDeck) => {
    setFlashcardDecks(prev => [newDeck, ...prev]);
    addXP(30);
  };

  const addCustomFlashcard = (deckId: string, front: string, back: string) => {
    const newCard: Flashcard = {
      id: 'fc-' + Date.now(),
      front,
      back,
      subject: 'Custom',
      chapter: 'General',
      intervalDays: 1,
      status: 'new',
      reviewCount: 0,
    };

    setFlashcardDecks(prev =>
      prev.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cardsCount: deck.cardsCount + 1,
            cards: [...deck.cards, newCard],
          };
        }
        return deck;
      })
    );
  };

  const saveNote = (noteData: Omit<NoteItem, 'id' | 'dateStr'> & { id?: string }) => {
    if (noteData.id) {
      setNotes(prev =>
        prev.map(n => (n.id === noteData.id ? { ...n, ...noteData } : n))
      );
    } else {
      const newNote: NoteItem = {
        ...noteData,
        id: 'note-' + Date.now(),
        dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setNotes(prev => [newNote, ...prev]);
      addXP(15);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const toggleNoteBookmark = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isBookmarked: !n.isBookmarked } : n))
    );
  };

  const toggleTaskCompletion = (taskId: string) => {
    setStudyTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updated = !t.completed;
          if (updated) {
            addXP(25);
            addCoins(10);
          }
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  const addStudyTask = (taskData: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: 'task-' + Date.now(),
    };
    setStudyTasks(prev => [...prev, newTask]);
  };

  const deleteStudyTask = (taskId: string) => {
    setStudyTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          const nextStatus =
            a.status === 'completed' ? 'pending' : a.status === 'pending' ? 'in_progress' : 'completed';
          if (nextStatus === 'completed') {
            addXP(60);
            addCoins(25);
          }
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const addAssignment = (assignment: Omit<AssignmentProject, 'id'>) => {
    const newAsg: AssignmentProject = {
      ...assignment,
      id: 'asg-' + Date.now(),
    };
    setAssignments(prev => [newAsg, ...prev]);
    addXP(20);
  };

  const updateSkillCourseProgress = (courseId: string, deltaPercent: number) => {
    setSkillCourses(prev =>
      prev.map(sc => {
        if (sc.id === courseId) {
          const newProg = Math.min(100, Math.max(0, sc.progressPercent + deltaPercent));
          if (newProg === 100 && sc.progressPercent < 100) {
            confetti({ particleCount: 70, spread: 80 });
            addXP(150);
          }
          return { ...sc, progressPercent: newProg };
        }
        return sc;
      })
    );
  };

  const recordFocusSession = (durationMinutes: number, tag = 'Pomodoro') => {
    const newSession: FocusSession = {
      id: 'fs-' + Date.now(),
      durationMinutes,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tag,
      completed: true,
    };
    setFocusSessions(prev => [newSession, ...prev]);
    recordStudyMinutes(durationMinutes);
    addXP(Math.round(durationMinutes * 2));
    addCoins(Math.round(durationMinutes * 0.8));

    setMissions(prev =>
      prev.map(m => {
        if (m.id === 'm-focus') {
          return { ...m, progress: 1, isCompleted: true };
        }
        return m;
      })
    );
  };

  const addPDFDoc = (doc: PDFLearningDoc) => {
    setPdfDocs(prev => [doc, ...prev]);
    addXP(50);
  };

  const buyRewardItem = (itemId: string): boolean => {
    const item = rewardShopItems.find(i => i.id === itemId);
    if (!item || user.coins < item.cost || item.isPurchased) return false;

    setUser(prev => ({ ...prev, coins: prev.coins - item.cost }));
    setRewardShopItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, isPurchased: true } : i))
    );

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    return true;
  };

  const exportUserData = () => {
    const exportData = {
      user,
      subjects,
      flashcardDecks,
      notes,
      studyTasks,
      focusSessions,
      quizHistory,
      missions,
      assignments,
      exportedAt: new Date().toISOString(),
      app: 'BrainRoot AI',
      creator: 'Chandrashekhar Singh',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `brainroot_ai_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importUserData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.user) setUser(data.user);
      if (data.subjects) setSubjects(data.subjects);
      if (data.flashcardDecks) setFlashcardDecks(data.flashcardDecks);
      if (data.notes) setNotes(data.notes);
      if (data.studyTasks) setStudyTasks(data.studyTasks);
      if (data.quizHistory) setQuizHistory(data.quizHistory);
      if (data.assignments) setAssignments(data.assignments);
      return true;
    } catch {
      return false;
    }
  };

  const resetAllProgress = () => {
    localStorage.clear();
    setUser(DEFAULT_USER);
    setSubjects([...INITIAL_SUBJECTS, ...HIGHER_ED_SUBJECTS]);
    setFlashcardDecks(INITIAL_FLASHCARD_DECKS);
    setNotes(INITIAL_NOTES);
    setStudyTasks(INITIAL_STUDY_TASKS);
    setFocusSessions([]);
    setQuizHistory([]);
    setMissions(INITIAL_MISSIONS);
    setAssignments(SAMPLE_ASSIGNMENTS);
    setActiveView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeView,
        setActiveView,
        isAuthenticated,
        isOnboarded,
        showAboutModal,
        setShowAboutModal,
        subjects,
        activeCategory,
        setActiveCategory,
        educationSectors: EDUCATION_SECTORS,
        careerPathways,
        academicResources,
        skillCourses,
        assignments,
        flashcardDecks,
        notes,
        studyTasks,
        focusSessions,
        pdfDocs,
        missions,
        badges,
        rewardShopItems,
        quizHistory,
        weakTopics,
        theme,
        setTheme,
        loginAsGuest,
        loginWithEmail,
        logout,
        updateProfile,
        switchEducationField,
        selectCourse,
        setChapterStatus,
        toggleChapterStatus,
        toggleTopicCompletion,
        toggleSubjectEnrollment,
        getActiveCategorySubjects,
        getOverallProgress,
        completeOnboarding,
        addXP,
        addCoins,
        recordStudyMinutes,
        recordQuizAttempt,
        claimMissionReward,
        updateFlashcardStatus,
        addFlashcardDeck,
        addCustomFlashcard,
        saveNote,
        deleteNote,
        toggleNoteBookmark,
        toggleTaskCompletion,
        addStudyTask,
        deleteStudyTask,
        toggleAssignmentStatus,
        addAssignment,
        updateSkillCourseProgress,
        recordFocusSession,
        addPDFDoc,
        buyRewardItem,
        exportUserData,
        importUserData,
        resetAllProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
