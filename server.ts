import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gemini SDK on the server side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback educational tutor knowledge base when offline or quota is exceeded
const FALLBACK_KNOWLEDGE: Record<string, string> = {
  quadratic: `### Quadratic Equations ($ax^2 + bx + c = 0$)
A quadratic equation is a second-degree polynomial equation in a single variable $x$, with $a \\neq 0$.

**1. Standard Form:**
$$ax^2 + bx + c = 0$$

**2. Quadratic Formula:**
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

**3. Nature of Roots (Discriminant $D = b^2 - 4ac$):**
- **$D > 0$**: Two distinct real roots.
- **$D = 0$**: Two equal real roots ($x = -b/2a$).
- **$D < 0$**: No real roots (two complex conjugate roots).

**Quick Example:**
Solve $x^2 - 5x + 6 = 0$:
Here $a = 1, b = -5, c = 6$.
$D = (-5)^2 - 4(1)(6) = 25 - 24 = 1$.
$x = \\frac{-(-5) \\pm \\sqrt{1}}{2} = \\frac{5 \\pm 1}{2} \\implies x = 3$ or $x = 2$.`,
  photosynthesis: `### Photosynthesis
Photosynthesis is the process used by plants and other organisms to convert light energy into chemical energy.

**Chemical Equation:**
$$6CO_2 + 6H_2O \\xrightarrow{\\text{Light + Chlorophyll}} C_6H_{12}O_6 + 6O_2$$

**Two Main Stages:**
1. **Light-dependent reactions (Thylakoid membrane):**
   - Chlorophyll absorbs sunlight and splits water molecules ($H_2O \\to 2H^+ + \\frac{1}{2}O_2 + 2e^-$).
   - Produces ATP and NADPH, releasing Oxygen ($O_2$) as a byproduct.
2. **Calvin Cycle / Dark reactions (Stroma):**
   - Uses ATP and NADPH to convert Carbon Dioxide ($CO_2$) into Glucose ($C_6H_{12}O_6$).`,
  chemical_reactions: `### Chemical Reactions & Equations
A chemical reaction is a process where reactants undergo chemical transformations to form new products with different properties.

**Types of Chemical Reactions:**
1. **Combination Reaction:** $A + B \\to AB$ (e.g., $C + O_2 \\to CO_2$)
2. **Decomposition Reaction:** $AB \\to A + B$ (e.g., $2H_2O \\to 2H_2 + O_2$)
3. **Displacement Reaction:** More reactive element displaces a less reactive one. (e.g., $Fe + CuSO_4 \\to FeSO_4 + Cu$)
4. **Double Displacement:** Exchange of ions between compounds. (e.g., $Na_2SO_4 + BaCl_2 \\to BaSO_4\\downarrow + 2NaCl$)
5. **Redox (Oxidation & Reduction):** Oxidation is loss of electrons/gain of oxygen; Reduction is gain of electrons/loss of oxygen.`
};

// API: Health & Status
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'BrainRoot AI',
    tagline: 'Grow Your Knowledge. Master Your Future.',
    creator: 'Chandrashekhar Singh',
    hasGeminiKey: Boolean(ai),
    timestamp: new Date().toISOString(),
  });
});

// API: AI Tutor Chat
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      subject = 'General',
      topic = '',
      userClass = 'Higher Education',
      programName = '',
      language = 'English',
      explanationMode = 'intermediate',
      conversationHistory = []
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If Gemini client is available, call Gemini 3.8 Flash
    if (ai) {
      try {
        const langInstruction = language === 'Hindi'
          ? 'Respond primarily in clear, educational Hindi with technical terms in parentheses.'
          : language === 'Hinglish'
          ? 'Respond in natural, engaging Hinglish (conversational Hindi-English blend popular with students).'
          : 'Respond in clear, structured, encouraging English.';

        const modeInstruction = explanationMode === 'beginner'
          ? 'MODE: BEGINNER. Use highly intuitive daily-life analogies, simplified diagrams, clear step-by-step logic, and zero unexplained jargon.'
          : explanationMode === 'advanced'
          ? 'MODE: ADVANCED / RESEARCH-GRADE. Use rigorous mathematical/scientific proofs, formal definitions, citation-aware academic analysis, edge cases, and research methodology standards.'
          : 'MODE: INTERMEDIATE. Balance conceptual clarity with syllabus precision, formulas, worked examples, and exam-focused takeaways.';

        const systemInstruction = `You are BrainRoot AI Tutor, a world-class academic mentor created by Chandrashekhar Singh for students from Class 1 to Ph.D.
Current Learner Context:
- Academic Program: ${programName || userClass}
- Subject: ${subject}
- Topic: ${topic || 'General Inquiry'}
- Language: ${language} (${langInstruction})
- Depth Mode: ${explanationMode.toUpperCase()} (${modeInstruction})

Ethical & Academic Guidelines:
1. Explain concepts simply with intuitive real-world analogies, step-by-step problem solving, and clean formulas.
2. Structure responses with clear headings, bullet points, and highlight key terms.
3. Distinguish verified curriculum facts from generative recommendations. Never fabricate citations, university rules, or past exam claims.
4. Support assignment understanding and conceptual planning, but encourage original student work rather than promoting plagiarism.
5. Provide a quick follow-up question or practice mini-problem at the end to check understanding.
6. BrainRoot AI was crafted by Chandrashekhar Singh to empower students with joyful mastery across school, university, and professional disciplines.`;

        // Format history for context
        const formattedContext = conversationHistory
          .slice(-6)
          .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
          .join('\n\n');

        const prompt = formattedContext
          ? `${formattedContext}\n\nStudent: ${message}\nTutor:`
          : message;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 6000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.95,
          },
        });

        const geminiResponse = await Promise.race([geminiPromise, timeoutPromise]);
        const replyText = geminiResponse.text || "I couldn't generate an answer right now. Let's try another question!";
        return res.json({
          reply: replyText,
          source: 'gemini-3.8-flash',
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local curriculum mentor:', geminiError?.message || geminiError);
        // Fall back to intelligent fallback handler
      }
    }

    // Intelligent Curriculum Fallback
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('quadratic') || lower.includes('equation')) {
      reply = FALLBACK_KNOWLEDGE.quadratic;
    } else if (lower.includes('photosynthesis') || lower.includes('plant') || lower.includes('sunlight')) {
      reply = FALLBACK_KNOWLEDGE.photosynthesis;
    } else if (lower.includes('chemical') || lower.includes('reaction') || lower.includes('react')) {
      reply = FALLBACK_KNOWLEDGE.chemical_reactions;
    } else {
      reply = `### Key Concept in ${subject}: ${topic || 'Core Fundamentals'} (${userClass})

Here is a structured explanation to help you master this concept:

1. **Fundamental Definition:**
   In ${userClass} ${subject}, this topic centers on understanding how foundational principles govern natural and mathematical patterns.

2. **Step-by-Step Breakdown:**
   - **Step 1:** Identify the given values and formula required.
   - **Step 2:** Formulate your hypothesis or algebraic model.
   - **Step 3:** Verify dimensional balance and boundary conditions.

3. **Memory Trick / Pro Tip:**
   Always break complex problems into 2-3 manageable sub-goals before applying the final formula!

*Quick Question for you:* Would you like to see a solved numerical problem, or test yourself with a 2-minute quiz?`;
    }

    if (language === 'Hinglish') {
      reply += '\n\n*(Tip: Agar koi bhi step samajh na aaye, toh poochiye: "Explain step by step" ya "Give a daily life example".)*';
    }

    return res.json({
      reply,
      source: 'offline-curriculum',
      notice: !ai ? 'Running in offline mode. Connect your Gemini API key in Secrets for live generative responses.' : undefined,
    });
  } catch (error: any) {
    console.error('Tutor chat error:', error);
    res.status(500).json({ error: error?.message || 'Server error processing tutor chat' });
  }
});

// API: Generate Quiz Questions with Gemini
app.post('/api/quiz/generate', async (req: Request, res: Response) => {
  try {
    const { subject = 'Mathematics', chapter = 'General', topic = '', userClass = 'Class 10', count = 5, difficulty = 'Medium' } = req.body;

    if (ai) {
      try {
        const prompt = `Generate exactly ${count} multiple-choice quiz questions for ${userClass} ${subject}, chapter: "${chapter}" ${topic ? `(Topic: ${topic})` : ''} at ${difficulty} difficulty.
Return ONLY valid JSON matching this structure:
[
  {
    "id": "q1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Clear step-by-step reason why this is correct."
  }
]`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 4000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.5,
          },
        });

        const geminiResponse = await Promise.race([geminiPromise, timeoutPromise]);
        const text = geminiResponse.text?.trim() || '[]';
        const questions = JSON.parse(text);
        if (Array.isArray(questions) && questions.length > 0) {
          return res.json({ questions, source: 'gemini-3.8-flash' });
        }
      } catch (err) {
        console.warn('AI Quiz generation failed or timed out, returning curated curriculum questions:', err);
      }
    }

    // Intelligent Subject-Aware Fallback Questions
    const normSub = (subject || '').toLowerCase();
    const normCh = (chapter || '').toLowerCase();

    let fallbackPool = [
      {
        id: 'fb_1',
        question: `In ${subject} (${chapter}), what is the primary fundamental principle governing this topic?`,
        options: [
          `Conservation of energy and structural equilibrium in ${chapter}`,
          'Arbitrary randomized variance without boundary limits',
          'Empirical observation without systematic proof',
          'Static uncoupled state transitions',
        ],
        correctIndex: 0,
        explanation: `In ${subject}, ${chapter} relies on established conservation and balance laws to model behavior accurately.`,
      },
      {
        id: 'fb_2',
        question: `Which metric is most critical for evaluating performance in ${chapter}?`,
        options: [
          'Ratio of valid output to input resources or work',
          'Elapsed uncalibrated total cycle time',
          'Peak unconstrained theoretical limit',
          'Random ambient temperature fluctuations',
        ],
        correctIndex: 0,
        explanation: 'Standard academic analysis measures performance as useful output yield relative to expended input resources.',
      },
      {
        id: 'fb_3',
        question: `When solving problems in ${chapter}, what is the first essential step?`,
        options: [
          'Identify given variables and state boundary conditions clearly',
          'Guess numerical values before applying formulas',
          'Assume ideal conditions without verifying assumptions',
          'Skip derivation and estimate the end result',
        ],
        correctIndex: 0,
        explanation: 'Rigorous problem-solving requires explicitly defining parameters and initial boundary constraints.',
      },
      {
        id: 'fb_4',
        question: `How does increasing system scale or complexity impact ${chapter}?`,
        options: [
          'Introduces non-linear interactions requiring higher-order modeling',
          'Has zero impact on state transitions or throughput',
          'Automatically eliminates errors and noise',
          'Renders analytical verification impossible',
        ],
        correctIndex: 0,
        explanation: 'Real-world scaling generates non-linear interactions requiring robust control and parameter verification.',
      },
      {
        id: 'fb_5',
        question: `What is the standard method for error reduction in ${chapter}?`,
        options: [
          'Dimensional verification of units and checking asymptotic limits',
          'Omitting units to accelerate calculation speed',
          'Assuming linearity across all operational ranges',
          'Relying entirely on intuition without proof',
        ],
        correctIndex: 0,
        explanation: 'Dimensional analysis and edge-case limit testing prevent algebraic and conceptual errors.',
      },
    ];

    if (normSub.includes('math') || normCh.includes('quadratic') || normCh.includes('real number')) {
      fallbackPool = [
        {
          id: 'm_1',
          question: 'What is the discriminant formula for the quadratic equation ax² + bx + c = 0?',
          options: ['D = b² - 4ac', 'D = b² + 4ac', 'D = 2a / (-b)', 'D = a² - 4bc'],
          correctIndex: 0,
          explanation: 'The discriminant D = b² - 4ac determines whether roots are real and distinct (D > 0), equal (D = 0), or complex (D < 0).',
        },
        {
          id: 'm_2',
          question: 'What are the roots of the equation x² - 5x + 6 = 0?',
          options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = 0 and x = 5'],
          correctIndex: 0,
          explanation: 'Factoring: (x - 2)(x - 3) = 0 => x = 2 or x = 3.',
        },
        {
          id: 'm_3',
          question: 'What is the value of sin 30° + cos 60° in trigonometry?',
          options: ['1', '√3 / 2', '1 / 2', '2'],
          correctIndex: 0,
          explanation: 'sin 30° = 1/2 and cos 60° = 1/2. 1/2 + 1/2 = 1.',
        },
        {
          id: 'm_4',
          question: 'If HCF(a, b) = 12 and a × b = 1800, what is LCM(a, b)?',
          options: ['150', '120', '180', '200'],
          correctIndex: 0,
          explanation: 'HCF × LCM = a × b => LCM = 1800 / 12 = 150.',
        },
        {
          id: 'm_5',
          question: 'What is the product of roots (α × β) in ax² + bx + c = 0?',
          options: ['c / a', '-b / a', 'b / (2a)', '-c / a'],
          correctIndex: 0,
          explanation: 'Vieta’s relations establish that product of roots is c / a and sum is -b / a.',
        },
      ];
    } else if (normSub.includes('computer') || normSub.includes('data structure') || normSub.includes('algorithm') || normSub.includes('database')) {
      fallbackPool = [
        {
          id: 'cs_1',
          question: 'What is the worst-case time complexity of searching an element in an unsorted array of size N?',
          options: ['O(N)', 'O(1)', 'O(log N)', 'O(N²)'],
          correctIndex: 0,
          explanation: 'Linear search in an unsorted array must check up to all N elements in the worst case.',
        },
        {
          id: 'cs_2',
          question: 'Which data structure follows the LIFO (Last-In-First-Out) principle?',
          options: ['Stack', 'Queue', 'Binary Heap', 'Hash Table'],
          correctIndex: 0,
          explanation: 'A Stack strictly enforces Last-In-First-Out order.',
        },
        {
          id: 'cs_3',
          question: 'What does the "A" in ACID transactional properties represent?',
          options: ['Atomicity', 'Availability', 'Accuracy', 'Authentication'],
          correctIndex: 0,
          explanation: 'Atomicity ensures that all operations in a transaction succeed or all fail together.',
        },
        {
          id: 'cs_4',
          question: 'In an In-Order traversal of a Binary Search Tree (BST), elements are visited in:',
          options: ['Ascending sorted order', 'Descending order', 'Level-by-level order', 'Reverse pre-order'],
          correctIndex: 0,
          explanation: 'In-order traversal on a BST visits Left (< Root) -> Root -> Right (> Root), giving strictly ascending sorted order.',
        },
        {
          id: 'cs_5',
          question: 'Which normal form eliminates partial dependency on a composite primary key?',
          options: ['Second Normal Form (2NF)', 'First Normal Form (1NF)', 'Third Normal Form (3NF)', 'BCNF'],
          correctIndex: 0,
          explanation: '2NF requires 1NF and guarantees non-key attributes are fully dependent on the entire primary key.',
        },
      ];
    }

    res.json({ questions: fallbackPool.slice(0, count), source: 'curated-curriculum' });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// API: Generate Flashcards
app.post('/api/flashcards/generate', async (req: Request, res: Response) => {
  try {
    const { subject = 'Science', chapter = 'Chemical Reactions', userClass = 'Class 10', count = 4 } = req.body;

    if (ai) {
      try {
        const prompt = `Generate ${count} high-impact revision flashcards for ${userClass} ${subject}, chapter "${chapter}".
Return ONLY valid JSON in this format:
[
  {
    "front": "Concise concept, formula, or question",
    "back": "Clear, memorable answer, definition, or explanation",
    "topic": "Subtopic name"
  }
]`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const flashcards = JSON.parse(geminiResponse.text?.trim() || '[]');
        return res.json({ flashcards, source: 'gemini-3.8-flash' });
      } catch (err) {
        console.warn('AI Flashcard generation failed:', err);
      }
    }

    // Curated flashcards fallback
    const fallbackCards = [
      {
        front: 'What is the discriminant in a quadratic equation?',
        back: 'The discriminant D = b² - 4ac determines whether roots are real & distinct (D > 0), real & equal (D = 0), or complex (D < 0).',
        topic: 'Quadratic Equations',
      },
      {
        front: 'State Ohm\'s Law in Physics.',
        back: 'Potential difference (V) across a conductor is directly proportional to the current (I) flowing through it at constant temperature: V = I × R.',
        topic: 'Electricity',
      },
      {
        front: 'What is the powerhouse of the cell and why?',
        back: 'Mitochondria, because it generates most of the chemical energy needed by the cell in the form of ATP molecules.',
        topic: 'Cell Biology',
      },
      {
        front: 'What is the difference between exothermic and endothermic reactions?',
        back: 'Exothermic reactions release heat/energy to the surroundings (e.g., combustion). Endothermic reactions absorb heat/energy from surroundings (e.g., photosynthesis).',
        topic: 'Chemical Reactions',
      },
    ];

    res.json({ flashcards: fallbackCards.slice(0, count), source: 'curated-curriculum' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

// API: PDF Analysis (Summary, Definitions, MCQs, Flashcards)
app.post('/api/pdf/analyze', async (req: Request, res: Response) => {
  try {
    const { textContent, fileName = 'Document.pdf', subject = 'General Study' } = req.body;

    if (!textContent || textContent.trim().length < 20) {
      return res.status(400).json({ error: 'Sufficient document text is required for analysis' });
    }

    if (ai) {
      try {
        const prompt = `Analyze this educational study material from "${fileName}" (${subject}).
Extracted Text:
"""
${textContent.slice(0, 8000)}
"""

Provide a comprehensive study breakdown in valid JSON format:
{
  "title": "Topic or Document Title",
  "summary": "Clear, 3-paragraph executive educational summary.",
  "keyConcepts": [
    { "term": "Term Name", "definition": "Clear concise explanation" }
  ],
  "practiceQuestions": [
    { "question": "Question text?", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "Why" }
  ],
  "flashcards": [
    { "front": "Flashcard front", "back": "Flashcard back" }
  ],
  "studyTips": ["Tip 1", "Tip 2"]
}`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const analysis = JSON.parse(geminiResponse.text?.trim() || '{}');
        return res.json({ analysis, source: 'gemini-3.8-flash' });
      } catch (err) {
        console.warn('AI PDF analysis failed:', err);
      }
    }

    // Offline heuristic analysis
    const words = textContent.split(/\s+/).length;
    const lines = textContent.split('\n').filter((l: string) => l.trim().length > 0);

    const fallbackAnalysis = {
      title: fileName.replace(/\.pdf$/i, ''),
      summary: `This document contains approximately ${words} words across ${lines.length} key sections. It covers foundational principles, key formulas, and core revision highlights suitable for student revision.`,
      keyConcepts: [
        { term: 'Core Definition', definition: lines[0] ? lines[0].slice(0, 150) : 'Essential conceptual foundation outlined in the text.' },
        { term: 'Key Formula / Rule', definition: 'Derived relationships connecting dependent variables and boundary conditions.' },
        { term: 'Practical Application', definition: 'Real-world experimentation and examination problem scenarios.' }
      ],
      practiceQuestions: [
        {
          question: `Based on "${fileName}", which of the following is the primary objective of this topic?`,
          options: [
            'To understand foundational mechanisms and formulas',
            'To memorize numbers without reasoning',
            'To bypass syllabus guidelines',
            'None of the above',
          ],
          correctIndex: 0,
          explanation: 'The document emphasizes structural mastery and step-by-step conceptual clarity.',
        },
      ],
      flashcards: [
        {
          front: `Main takeaway from ${fileName}`,
          back: lines.slice(0, 2).join(' ') || 'Comprehensive understanding of core topics.',
        },
      ],
      studyTips: [
        'Review the key concepts before attempting the self-assessment test.',
        'Create hand-written formula cards for active recall.',
      ],
    };

    res.json({ analysis: fallbackAnalysis, source: 'heuristic-extractor' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to analyze PDF' });
  }
});

// Setup Vite in Dev or Serve Static in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BrainRoot AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
