import { Subject, FlashcardDeck, NoteItem, StudyTask, Mission, Badge, RewardItem } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    category: 'school',
    iconName: 'Calculator',
    color: 'from-blue-600 to-cyan-500',
    accentColor: '#38bdf8',
    chaptersCount: 12,
    topicsCount: 48,
    progressPercent: 65,
    chapters: [
      {
        id: 'math-ch1',
        chapterNumber: 1,
        title: 'Real Numbers',
        totalTopics: 4,
        completedTopics: 4,
        topics: [
          {
            id: 't-euclid',
            title: 'Fundamental Theorem of Arithmetic',
            summary: 'Every composite number can be uniquely factored into primes, disregarding order.',
            estimatedMinutes: 25,
            completed: true,
            bookmarked: false,
            keyPoints: [
              'Unique prime factorization of composite numbers',
              'HCF × LCM = Product of two numbers',
              'Proof of irrationality for √2, √3, √5',
            ],
            formulas: ['HCF(a, b) × LCM(a, b) = a × b'],
          },
        ],
      },
      {
        id: 'math-ch4',
        chapterNumber: 4,
        title: 'Quadratic Equations',
        totalTopics: 5,
        completedTopics: 4,
        topics: [
          {
            id: 't-quad-std',
            title: 'Standard Form & Factorization',
            summary: 'ax² + bx + c = 0 where a ≠ 0. Splitting middle term method.',
            estimatedMinutes: 30,
            completed: true,
            bookmarked: true,
            keyPoints: [
              'Degree of quadratic polynomial is always 2',
              'Roots are x-values where ax² + bx + c = 0',
              'Splitting middle term: find p, q such that p+q = b and pq = ac',
            ],
            formulas: ['ax² + bx + c = 0 (a ≠ 0)'],
          },
          {
            id: 't-quad-formula',
            title: 'Quadratic Formula & Nature of Roots',
            summary: 'Using discriminant D = b² - 4ac to classify real and distinct roots.',
            estimatedMinutes: 35,
            completed: true,
            bookmarked: true,
            keyPoints: [
              'D > 0: Two distinct real roots',
              'D = 0: Two equal real roots (x = -b / 2a)',
              'D < 0: No real roots (complex roots)',
            ],
            formulas: [
              'x = (-b ± √(b² - 4ac)) / (2a)',
              'D = b² - 4ac',
            ],
          },
          {
            id: 't-quad-apps',
            title: 'Word Problems & Real-World Modeling',
            summary: 'Speed, time, distance, and geometric area quadratic models.',
            estimatedMinutes: 40,
            completed: false,
            bookmarked: false,
            keyPoints: [
              'Upstream speed = (x - y) km/h, Downstream speed = (x + y) km/h',
              'Reject negative roots for physical quantities like age or length',
            ],
            formulas: ['Time = Distance / Speed'],
          },
        ],
      },
      {
        id: 'math-ch8',
        chapterNumber: 8,
        title: 'Introduction to Trigonometry',
        totalTopics: 4,
        completedTopics: 2,
        topics: [
          {
            id: 't-trig-ratios',
            title: 'Trigonometric Ratios & Values',
            summary: 'sin, cos, tan, cosec, sec, cot defined on right triangles.',
            estimatedMinutes: 35,
            completed: true,
            bookmarked: true,
            keyPoints: [
              'sin θ = Opposite / Hypotenuse',
              'cos θ = Adjacent / Hypotenuse',
              'tan θ = Opposite / Adjacent',
            ],
            formulas: ['sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = cosec²θ'],
          },
        ],
      },
      {
        id: 'math-ch14',
        chapterNumber: 14,
        title: 'Probability & Statistics',
        totalTopics: 4,
        completedTopics: 3,
        topics: [
          {
            id: 't-prob-basics',
            title: 'Theoretical Probability of Events',
            summary: 'P(E) = Number of favorable outcomes / Total outcomes.',
            estimatedMinutes: 20,
            completed: true,
            bookmarked: false,
            keyPoints: [
              '0 ≤ P(E) ≤ 1',
              'P(Sure event) = 1, P(Impossible) = 0',
              'P(E) + P(not E) = 1',
            ],
            formulas: ['P(E) = n(E) / n(S)'],
          },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    category: 'school',
    iconName: 'Atom',
    color: 'from-emerald-600 to-teal-400',
    accentColor: '#34d399',
    chaptersCount: 15,
    topicsCount: 62,
    progressPercent: 58,
    chapters: [
      {
        id: 'sci-ch1',
        chapterNumber: 1,
        title: 'Chemical Reactions & Equations',
        totalTopics: 4,
        completedTopics: 3,
        topics: [
          {
            id: 't-chem-eq',
            title: 'Balancing Chemical Equations',
            summary: 'Law of Conservation of Mass: total mass of reactants equals products.',
            estimatedMinutes: 30,
            completed: true,
            bookmarked: true,
            keyPoints: [
              'Atoms of each element must balance on both sides',
              'Include physical states: (s), (l), (g), (aq)',
              'Coefficients adjust atom counts, subscripts must never change',
            ],
            formulas: ['2H₂ + O₂ → 2H₂O', 'Fe + CuSO₄ → FeSO₄ + Cu'],
          },
          {
            id: 't-chem-types',
            title: 'Types of Reactions & Redox',
            summary: 'Combination, Decomposition, Displacement, Double Displacement, Oxidation & Reduction.',
            estimatedMinutes: 35,
            completed: true,
            bookmarked: false,
            keyPoints: [
              'Oxidation is gain of Oxygen or loss of Hydrogen / electrons',
              'Reduction is gain of Hydrogen or loss of Oxygen / electrons',
              'Corrosion and Rancidity are everyday redox phenomena',
            ],
            formulas: ['CuO + H₂ → Cu + H₂O'],
          },
        ],
      },
      {
        id: 'sci-ch6',
        chapterNumber: 6,
        title: 'Life Processes (Biology)',
        totalTopics: 5,
        completedTopics: 3,
        topics: [
          {
            id: 't-photo',
            title: 'Photosynthesis & Autotrophic Nutrition',
            summary: 'Chloroplasts absorb sunlight to synthesize glucose from CO₂ and H₂O.',
            estimatedMinutes: 30,
            completed: true,
            bookmarked: true,
            keyPoints: [
              'Site: Chloroplast thylakoids and stroma',
              'Byproduct released: Oxygen (O₂)',
              'Stomata regulate gas exchange and transpiration',
            ],
            formulas: ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂'],
          },
          {
            id: 't-resp',
            title: 'Cellular Respiration in Humans',
            summary: 'Breakdown of glucose in cytoplasm (glycolysis) and mitochondria (Krebs cycle).',
            estimatedMinutes: 30,
            completed: false,
            bookmarked: false,
            keyPoints: [
              'Aerobic respiration yields 36-38 ATP per glucose molecule',
              'Anaerobic respiration in human muscle generates lactic acid',
            ],
          },
        ],
      },
      {
        id: 'sci-ch10',
        chapterNumber: 10,
        title: 'Light - Reflection & Refraction',
        totalTopics: 5,
        completedTopics: 2,
        topics: [
          {
            id: 't-optics-lens',
            title: 'Mirror & Lens Formulas',
            summary: 'Cartesian sign convention, focal length, and magnification.',
            estimatedMinutes: 40,
            completed: true,
            bookmarked: true,
            keyPoints: [
              'Mirror Formula: 1/f = 1/v + 1/u',
              'Lens Formula: 1/f = 1/v - 1/u',
              'Power of lens P = 1 / f (in meters), unit is Diopter (D)',
            ],
            formulas: ['1/f = 1/v + 1/u', 'm = -v/u (mirror)', 'P = 1/f(m)'],
          },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'English',
    category: 'school',
    iconName: 'BookOpen',
    color: 'from-purple-600 to-pink-500',
    accentColor: '#c084fc',
    chaptersCount: 10,
    topicsCount: 40,
    progressPercent: 45,
    chapters: [
      {
        id: 'eng-ch1',
        chapterNumber: 1,
        title: 'A Letter to God (First Flight)',
        totalTopics: 3,
        completedTopics: 2,
        topics: [
          {
            id: 't-lencho',
            title: 'Lencho’s Faith & Irony',
            summary: 'A poor farmer whose faith in God is unwavering, despite devastating hailstorms.',
            estimatedMinutes: 20,
            completed: true,
            bookmarked: false,
            keyPoints: [
              'Lencho’s cornfield ruined by hailstones',
              'Writes letter to God requesting 100 pesos',
              'Postmaster collects 70 pesos out of generosity',
              'Irony: Lencho calls post office workers a "bunch of crooks"',
            ],
          },
        ],
      },
      {
        id: 'eng-ch2',
        chapterNumber: 2,
        title: 'Nelson Mandela: Long Walk to Freedom',
        totalTopics: 3,
        completedTopics: 1,
        topics: [
          {
            id: 't-mandela',
            title: 'Inauguration & Meaning of Courage',
            summary: 'Mandela reflects on the triumph of human justice and the twins of obligation.',
            estimatedMinutes: 25,
            completed: true,
            bookmarked: true,
            keyPoints: [
              '10th May 1994: Historic oath taking at Union Buildings amphitheater',
              'Courage is not the absence of fear, but triumph over it',
              'Oppressor and oppressed alike are robbed of humanity',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'social',
    name: 'Social Science',
    category: 'school',
    iconName: 'Globe',
    color: 'from-amber-600 to-orange-500',
    accentColor: '#fbbf24',
    chaptersCount: 12,
    topicsCount: 50,
    progressPercent: 38,
    chapters: [
      {
        id: 'soc-ch1',
        chapterNumber: 1,
        title: 'The Rise of Nationalism in Europe',
        totalTopics: 4,
        completedTopics: 2,
        topics: [
          {
            id: 't-frederic',
            title: 'Frédéric Sorrieu Vision & French Revolution',
            summary: 'Utopian vision of democratic and social republics, end of absolute monarchies.',
            estimatedMinutes: 30,
            completed: true,
            bookmarked: false,
            keyPoints: [
              '1848: Sorrieu’s four prints depicting nations paying homage to Liberty',
              'Civil Code of 1804 (Napoleonic Code) established equality before law',
              'Zollverein (1834): German customs union abolishing tariff barriers',
            ],
          },
        ],
      },
      {
        id: 'soc-ch2',
        chapterNumber: 2,
        title: 'Nationalism in India',
        totalTopics: 4,
        completedTopics: 1,
        topics: [
          {
            id: 't-satyagraha',
            title: 'First World War, Khilafat & Non-Cooperation',
            summary: 'Gandhiji’s philosophy of Satyagraha, Rowlatt Act, and the Jallianwala Bagh massacre.',
            estimatedMinutes: 35,
            completed: true,
            bookmarked: true,
            keyPoints: [
              'Early satyagrahas: Champaran (1917), Kheda (1918), Ahmedabad (1918)',
              '13 April 1919: General Dyer opens fire at Jallianwala Bagh',
              '1920: Nagpur session adopts Non-Cooperation movement',
            ],
          },
        ],
      },
    ],
  },
];

export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-quad',
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    cardsCount: 12,
    masteredCount: 8,
    cards: [
      {
        id: 'fc-1',
        front: 'What is the discriminant in a quadratic equation?',
        back: 'The discriminant is D = b² - 4ac. It determines the nature of the roots: real & distinct (D > 0), real & equal (D = 0), or no real roots (D < 0).',
        subject: 'Mathematics',
        chapter: 'Quadratic Equations',
        intervalDays: 3,
        status: 'know_it',
        reviewCount: 4,
      },
      {
        id: 'fc-2',
        front: 'What are the roots of ax² + bx + c = 0 when D = 0?',
        back: 'Both roots are identical and real: x = -b / (2a).',
        subject: 'Mathematics',
        chapter: 'Quadratic Equations',
        intervalDays: 2,
        status: 'learning',
        reviewCount: 2,
      },
      {
        id: 'fc-3',
        front: 'State Vieta\'s formula for the product of roots.',
        back: 'For ax² + bx + c = 0 with roots α and β, Product αβ = c / a. (Sum α + β = -b / a).',
        subject: 'Mathematics',
        chapter: 'Quadratic Equations',
        intervalDays: 1,
        status: 'again',
        reviewCount: 1,
      },
      {
        id: 'fc-4',
        front: 'How do you form a quadratic equation if sum of roots (S) and product (P) are given?',
        back: 'The equation is: x² - Sx + P = 0, or k[x² - (α + β)x + αβ] = 0.',
        subject: 'Mathematics',
        chapter: 'Quadratic Equations',
        intervalDays: 4,
        status: 'know_it',
        reviewCount: 3,
      },
    ],
  },
  {
    id: 'deck-chem',
    title: 'Chemical Reactions',
    subject: 'Science',
    cardsCount: 15,
    masteredCount: 9,
    cards: [
      {
        id: 'fc-chem-1',
        front: 'What happens when quicklime (CaO) reacts with water?',
        back: 'It reacts vigorously to form slaked lime [Ca(OH)₂] releasing a large amount of heat (Exothermic combination reaction).',
        subject: 'Science',
        chapter: 'Chemical Reactions & Equations',
        intervalDays: 3,
        status: 'know_it',
        reviewCount: 5,
      },
      {
        id: 'fc-chem-2',
        front: 'Why is respiration considered an exothermic reaction?',
        back: 'During digestion, food is broken into glucose. In cells, glucose combines with oxygen to produce CO₂, H₂O, and releases cellular energy (ATP).',
        subject: 'Science',
        chapter: 'Chemical Reactions & Equations',
        intervalDays: 2,
        status: 'learning',
        reviewCount: 2,
      },
    ],
  },
  {
    id: 'deck-bio',
    title: 'Cell Structure & Organelles',
    subject: 'Science',
    cardsCount: 10,
    masteredCount: 6,
    cards: [
      {
        id: 'fc-cell-1',
        front: 'Why are lysosomes called suicide bags of the cell?',
        back: 'Lysosomes contain powerful digestive enzymes. When the cell gets damaged, lysosomes may burst and digest their own cell.',
        subject: 'Science',
        chapter: 'Life Processes',
        intervalDays: 4,
        status: 'know_it',
        reviewCount: 3,
      },
    ],
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Quadratic Equations Master Summary',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    dateStr: 'Apr 21, 2025',
    isBookmarked: true,
    tags: ['Formulas', 'CBSE Exam Prep', 'Algebra'],
    content: `## Quadratic Equations (Class 10)

### Key points:
* Standard form: $ax^2 + bx + c = 0$, where $a \\neq 0$.
* Discriminant: $D = b^2 - 4ac$
* Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

### Nature of Roots:
1. If $D > 0 \\implies$ two distinct real roots.
2. If $D = 0 \\implies$ two equal real roots: $x = -\\frac{b}{2a}$.
3. If $D < 0 \\implies$ no real roots (complex roots).

### Important Exam Tip:
Always check if $a \\neq 0$. If $x^2$ coefficient is negative, multiply the whole equation by -1 first to simplify factoring!`,
  },
  {
    id: 'note-2',
    title: 'Cell Structure & Energy Systems',
    subject: 'Science',
    chapter: 'Life Processes',
    dateStr: 'Apr 20, 2025',
    isBookmarked: false,
    tags: ['Biology', 'Organelles', 'Diagrams'],
    content: `## Cell Structure & Life Functions

### Key Organelles:
1. **Mitochondria:** Generates ATP via oxidative phosphorylation (Powerhouse).
2. **Chloroplast:** Contains chlorophyll pigments in thylakoid discs for photosynthesis.
3. **Endoplasmic Reticulum:** Rough ER (protein synthesis with ribosomes) & Smooth ER (lipid synthesis).
4. **Golgi Apparatus:** Packaging and secretional modifications.`,
  },
  {
    id: 'note-3',
    title: 'Important Physics Formulas (Optics & Electricity)',
    subject: 'Science',
    chapter: 'Light & Electricity',
    dateStr: 'Apr 18, 2025',
    isBookmarked: true,
    tags: ['Formulas', 'Quick Revision'],
    content: `## High-Yield Physics Formulas

### Optics:
* Mirror formula: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$
* Magnification (mirror): $m = -\\frac{v}{u} = \\frac{h'}{h}$
* Lens formula: $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$
* Lens power: $P = \\frac{1}{f \\text{ (in meters)}}$ (Unit: Diopters)

### Electricity:
* Ohm's Law: $V = I \\cdot R$
* Resistance: $R = \\rho \\frac{l}{A}$
* Series Resistance: $R_s = R_1 + R_2 + R_3$
* Parallel Resistance: $\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$
* Joule's Heating Law: $H = I^2 R t$`,
  },
  {
    id: 'note-4',
    title: 'Chemical Reactions & Balanced Equations',
    subject: 'Science',
    chapter: 'Chemical Reactions',
    dateStr: 'Apr 16, 2025',
    isBookmarked: false,
    tags: ['Chemistry', 'Equations'],
    content: `## Chemical Reactions & Types

### 1. Combination:
$CaO(s) + H_2O(l) \\to Ca(OH)_2(aq) + \\text{Heat}$

### 2. Decomposition:
$2FeSO_4(s) \\xrightarrow{\\Delta} Fe_2O_3(s) + SO_2(g) + SO_3(g)$

### 3. Displacement:
$Zn(s) + CuSO_4(aq) \\to ZnSO_4(aq) + Cu(s)$`,
  },
];

export const INITIAL_STUDY_TASKS: StudyTask[] = [
  {
    id: 'st-1',
    day: 'Mon 21',
    dateStr: '2025-04-21',
    subject: 'Maths',
    chapterTitle: 'Quadratic Equations (Ex 4.2 & 4.3)',
    durationHours: 1.5,
    completed: true,
    targetExam: 'Board Exam - Class 10',
  },
  {
    id: 'st-2',
    day: 'Tue 22',
    dateStr: '2025-04-22',
    subject: 'Science',
    chapterTitle: 'Life Processes (Nutrition & Respiration)',
    durationHours: 1.5,
    completed: true,
    targetExam: 'Board Exam - Class 10',
  },
  {
    id: 'st-3',
    day: 'Wed 23',
    dateStr: '2025-04-23',
    subject: 'English',
    chapterTitle: 'Beehive / First Flight Poems & Grammar',
    durationHours: 1.0,
    completed: false,
    targetExam: 'Board Exam - Class 10',
  },
  {
    id: 'st-4',
    day: 'Thu 24',
    dateStr: '2025-04-24',
    subject: 'Social Science',
    chapterTitle: 'Nationalism in India (Map Work & Timeline)',
    durationHours: 1.5,
    completed: false,
    targetExam: 'Board Exam - Class 10',
  },
  {
    id: 'st-5',
    day: 'Fri 25',
    dateStr: '2025-04-25',
    subject: 'Revision',
    chapterTitle: 'Full Syllabus Weekly Mock Test & Analysis',
    durationHours: 2.0,
    completed: false,
    targetExam: 'Board Exam - Class 10',
  },
  {
    id: 'st-6',
    day: 'Sat 26',
    dateStr: '2025-04-26',
    subject: 'Maths',
    chapterTitle: 'Coordinate Geometry & Triangles',
    durationHours: 1.5,
    completed: false,
    targetExam: 'Board Exam - Class 10',
  },
  {
    id: 'st-7',
    day: 'Sun 27',
    dateStr: '2025-04-27',
    subject: 'Rest & Revision',
    chapterTitle: 'Weekly Flashcard Blitz & Weak Topic Fix',
    durationHours: 1.0,
    completed: false,
    targetExam: 'Board Exam - Class 10',
  },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm-focus',
    title: 'Complete a 15 min focus session',
    description: 'Use the Pomodoro Focus Timer for sustained deep learning.',
    xpReward: 50,
    coinsReward: 20,
    progress: 1,
    target: 1,
    isCompleted: true,
    isClaimed: false,
    icon: 'Timer',
  },
  {
    id: 'm-quiz',
    title: 'Answer 10 practice questions',
    description: 'Test your understanding in Quiz Arena or Exam Simulator.',
    xpReward: 50,
    coinsReward: 25,
    progress: 6,
    target: 10,
    isCompleted: false,
    isClaimed: false,
    icon: 'CheckCircle2',
  },
  {
    id: 'm-flashcard',
    title: 'Review 5 flashcards',
    description: 'Strengthen memory retention with spaced repetition revision.',
    xpReward: 30,
    coinsReward: 15,
    progress: 4,
    target: 5,
    isCompleted: false,
    isClaimed: false,
    icon: 'Layers',
  },
  {
    id: 'm-tutor',
    title: 'Ask BrainRoot AI Tutor 2 doubts',
    description: 'Deepen your mastery with step-by-step AI guidance.',
    xpReward: 40,
    coinsReward: 20,
    progress: 2,
    target: 2,
    isCompleted: true,
    isClaimed: true,
    icon: 'Bot',
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-first-quiz',
    name: 'Curious Explorer',
    description: 'Completed your first Quiz Arena challenge.',
    icon: 'Trophy',
    unlocked: true,
    unlockedAt: '2 days ago',
  },
  {
    id: 'b-streak-3',
    name: 'Consistency Champion',
    description: 'Achieved a 3-day active learning streak.',
    icon: 'Flame',
    unlocked: true,
    unlockedAt: 'Yesterday',
  },
  {
    id: 'b-focus-master',
    name: 'Deep Focus Zen',
    description: 'Finished 5 Pomodoro focus sessions without pausing.',
    icon: 'Brain',
    unlocked: false,
  },
  {
    id: 'b-math-wizard',
    name: 'Algebra Prodigy',
    description: 'Scored 90%+ in Quadratic Equations Exam.',
    icon: 'Zap',
    unlocked: true,
    unlockedAt: 'Today',
  },
  {
    id: 'b-ai-scholar',
    name: 'AI Knowledge Seeker',
    description: 'Engaged with BrainRoot AI Tutor for 10 distinct topics.',
    icon: 'Sparkles',
    unlocked: false,
  },
];

export const REWARD_SHOP_ITEMS: RewardItem[] = [
  {
    id: 'avatar-cosmic',
    title: 'Cosmic Astro Robot (Showcase Mascot)',
    cost: 150,
    category: 'avatar',
    icon: 'Bot',
    isPurchased: true,
  },
  {
    id: 'avatar-sage',
    title: 'Cyber Scholar Owl',
    cost: 300,
    category: 'avatar',
    icon: 'GraduationCap',
    isPurchased: false,
  },
  {
    id: 'theme-nebula',
    title: 'Supernova Neon Theme',
    cost: 400,
    category: 'theme',
    icon: 'Palette',
    isPurchased: false,
  },
  {
    id: 'boost-double-xp',
    title: '2X XP Boost (2 Hours)',
    cost: 250,
    category: 'boost',
    icon: 'Rocket',
    isPurchased: false,
  },
];
