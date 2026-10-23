export type EducationStage =
  | 'Class 1-5 (Primary)'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Doctoral & Research'
  | 'Professional Studies'
  | 'Diploma & Polytechnic'
  | 'Competitive Exams'
  | 'Lifelong & Skills';

export type EducationCategory =
  | 'school'
  | 'senior_secondary'
  | 'undergraduate'
  | 'postgraduate'
  | 'doctoral_research'
  | 'professional'
  | 'diploma_vocational'
  | 'competitive_exams'
  | 'skills_certifications';

export type BoardType = 'CBSE' | 'ICSE' | 'State Board' | 'University / AICTE' | 'Autonomous / UGC' | 'Professional Council' | 'Custom';

export type LanguagePreference = 'English' | 'Hindi' | 'Hinglish';

export type ExplanationMode = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  educationStage: EducationStage;
  board: BoardType;
  educationCategory?: EducationCategory;
  programName?: string; // e.g., 'B.Tech Computer Science & Engineering', 'MBBS', 'Class 10', 'UPSC CSE'
  semesterOrYear?: string; // e.g., 'Semester 4', 'Year 2', 'Class 10'
  institutionOrUniversity?: string; // e.g., 'Delhi University', 'IIT / AKTU', 'CBSE'
  streamOrSpecialization?: string; // e.g., 'Data Science', 'PCM', 'Corporate Law'
  subjects: string[];
  preferredLanguage: LanguagePreference;
  explanationMode: ExplanationMode;
  dailyGoalMinutes: number;
  examDate?: string;
  examName?: string;
  isGuest: boolean;
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string;
  totalStudyMinutes: number;
  joinedDate: string;
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  completed: boolean;
  bookmarked: boolean;
  keyPoints: string[];
  formulas?: string[];
  caseStudy?: string;
  workedExample?: string;
}

export type ChapterStatus = 'not_started' | 'in_progress' | 'completed';

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  unitCode?: string;
  topics: Topic[];
  totalTopics: number;
  completedTopics: number;
  status?: ChapterStatus;
  completed?: boolean;
  syllabusSource?: string;
  verifiedYear?: string;
  lastUpdated?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  category?: EducationCategory;
  programNames?: string[];
  iconName: string;
  color: string;
  accentColor: string;
  chaptersCount: number;
  topicsCount: number;
  completedChaptersCount?: number;
  progressPercent: number;
  chapters: Chapter[];
  credits?: number;
  semester?: string;
}

export interface CareerPathway {
  id: string;
  title: string;
  category: EducationCategory;
  degreeType: string;
  duration: string;
  eligibility: string;
  entranceExams: string[];
  coreSubjects: string[];
  skillsNeeded: string[];
  potentialCareers: string[];
  higherStudyOptions: string[];
  approxCostRange: string;
  officialSourceLabel: string;
  officialSourceUrl?: string;
  verifiedYear: string;
  verificationStatus: 'Official Authority' | 'Curated Syllabus' | 'Sample Model';
  overview: string;
}

export interface AcademicResource {
  id: string;
  title: string;
  category: EducationCategory;
  subjectName: string;
  resourceType: 'Syllabus' | 'Notes' | 'Formulas' | 'PastPaper' | 'PracticalLab' | 'ResearchGuide';
  institutionOrBoard: string;
  yearOrSemester: string;
  verifiedYear: string;
  isVerified: boolean;
  summary: string;
  fileSize?: string;
  content: string;
}

export interface SkillCourse {
  id: string;
  title: string;
  domain: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Advanced';
  durationHours: number;
  modulesCount: number;
  icon: string;
  skills: string[];
  curriculumOverview: string[];
  certificateType: string;
  progressPercent: number;
}

export interface AssignmentProject {
  id: string;
  title: string;
  subject: string;
  type: 'Assignment' | 'Project' | 'Lab Presentation' | 'Term Paper';
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  objectives: string[];
  deliverables: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
  id: string;
  subject: string;
  chapter: string;
  topic?: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  timeSpentSeconds: number;
  timestamp: string;
  isExamMode: boolean;
  negativeMarking: boolean;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  chapter: string;
  topic?: string;
  lastReviewed?: string;
  nextReview?: string;
  intervalDays: number;
  status: 'again' | 'learning' | 'know_it' | 'new';
  reviewCount: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  category?: EducationCategory;
  cardsCount: number;
  masteredCount: number;
  cards: Flashcard[];
}

export interface StudyTask {
  id: string;
  day: string;
  dateStr: string;
  subject: string;
  chapterTitle: string;
  durationHours: number;
  completed: boolean;
  targetExam?: string;
  category?: EducationCategory;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  timestamp: string;
  tag: string;
  completed: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  content: string;
  dateStr: string;
  isBookmarked: boolean;
  tags: string[];
  category?: EducationCategory;
}

export interface PDFLearningDoc {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: string;
  summary: string;
  keyConcepts: { term: string; definition: string }[];
  practiceQuestions: QuizQuestion[];
  flashcards: { front: string; back: string }[];
  extractedTextSample: string;
  category?: EducationCategory;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinsReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  isClaimed: boolean;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  category: 'avatar' | 'theme' | 'boost';
  icon: string;
  isPurchased: boolean;
}

export interface WeakTopicItem {
  subject: string;
  topicName: string;
  accuracy: number;
  totalAttempts: number;
  recommendedAction: string;
}
