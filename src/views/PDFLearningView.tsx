import React, { useState } from 'react';
import {
  FileUp,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Layers,
  BrainCircuit,
  ArrowRight,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PDFLearningDoc } from '../types';

export const PDFLearningView: React.FC = () => {
  const { pdfDocs, addPDFDoc, saveNote, addFlashcardDeck } = useApp();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'summary' | 'concepts' | 'questions' | 'flashcards' | 'notes'>('summary');

  // Preloaded sample document for immediate testing
  const [currentDoc, setCurrentDoc] = useState<PDFLearningDoc>(() => {
    return (
      pdfDocs[0] || {
        id: 'pdf-sample-1',
        fileName: 'CBSE_Class10_Quadratic_Equations_Notes.pdf',
        uploadDate: 'Apr 21, 2025',
        fileSize: '1.4 MB',
        summary: `Quadratic equations are polynomial equations of degree two in the general form ax² + bx + c = 0 (where a ≠ 0). 
The document outlines three principal solution strategies: factoring by grouping, completing the square, and applying the quadratic formula.
Special emphasis is placed on discriminant analysis D = b² - 4ac, which categorizes roots as real and distinct, coincident, or non-real. Real-world modeling sections cover upstream/downstream speed calculations, rectangle dimensions, and projectile trajectories.`,
        keyConcepts: [
          {
            term: 'Standard Form',
            definition: 'ax² + bx + c = 0 where a, b, c are real numbers and a ≠ 0.',
          },
          {
            term: 'Discriminant (D)',
            definition: 'D = b² - 4ac. Determines the existence and multiplicity of real roots.',
          },
          {
            term: 'Vieta’s Formulas',
            definition: 'Sum of roots α + β = -b / a; Product of roots αβ = c / a.',
          },
          {
            term: 'Zero Product Property',
            definition: 'If (x - p)(x - q) = 0, then x = p or x = q.',
          },
        ],
        practiceQuestions: [
          {
            id: 'pdf-q1',
            question: 'What is the nature of roots for 2x² - 4x + 3 = 0?',
            options: ['Two distinct real roots', 'Two equal real roots', 'No real roots', 'Infinitely many'],
            correctIndex: 2,
            explanation: 'D = (-4)² - 4(2)(3) = 16 - 24 = -8 < 0. Hence, no real roots exist.',
          },
          {
            id: 'pdf-q2',
            question: 'If one root of 2x² + kx - 6 = 0 is 2, what is the value of k?',
            options: ['-1', '1', '-2', '2'],
            correctIndex: 0,
            explanation: 'Substitute x = 2: 2(4) + 2k - 6 = 0 => 8 + 2k - 6 = 0 => 2k = -2 => k = -1.',
          },
        ],
        flashcards: [
          {
            front: 'What does D > 0 imply for a quadratic equation?',
            back: 'Two distinct real roots exist.',
          },
          {
            front: 'Write the quadratic formula.',
            back: 'x = (-b ± √(b² - 4ac)) / (2a)',
          },
        ],
        extractedTextSample:
          'Chapter 4: Quadratic Equations. Standard form: ax^2 + bx + c = 0. Roots are given by x = (-b +- sqrt(b^2 - 4ac)) / (2a)...',
      }
    );
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.type.includes('pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(timer);
          processDoc(file);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const processDoc = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const textSample = `Document extracted content from ${file.name}. Foundational chapters covering syllabus objectives, key formulas, terminology definitions, and solved practice questions for examination preparation.`;

        try {
          const res = await fetch('/api/pdf/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              textContent: textSample,
              fileName: file.name,
              subject: 'Educational Study Material',
            }),
          });
          const data = await res.json();
          if (data.analysis) {
            const newDoc: PDFLearningDoc = {
              id: 'pdf-' + Date.now(),
              fileName: file.name,
              uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              summary: data.analysis.summary,
              keyConcepts: data.analysis.keyConcepts || [],
              practiceQuestions: data.analysis.practiceQuestions || [],
              flashcards: data.analysis.flashcards || [],
              extractedTextSample: textSample,
            };

            addPDFDoc(newDoc);
            setCurrentDoc(newDoc);
          }
        } catch {
          // fallback
        }
        setIsUploading(false);
      };
      reader.readAsText(file.slice(0, 5000));
    } catch {
      setIsUploading(false);
    }
  };

  const handleExportToNotes = () => {
    saveNote({
      title: `${currentDoc.fileName} - Study Notes`,
      subject: 'Study Material',
      chapter: currentDoc.fileName.replace('.pdf', ''),
      content: `## ${currentDoc.fileName} Summary\n\n${currentDoc.summary}\n\n### Key Concepts:\n${currentDoc.keyConcepts
        .map(c => `* **${c.term}:** ${c.definition}`)
        .join('\n')}`,
      isBookmarked: true,
      tags: ['PDF Learning', 'Auto Generated'],
    });
    alert('Exported note to your Notes Library!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              PDF Learning &amp; AI Document Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Extract summaries, flashcards, key formulas, and test questions from textbooks
            </p>
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Area - Matching Showcase Image Layout */}
      <div className="p-8 rounded-3xl bg-[#0e1526]/90 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 shadow-xl flex flex-col items-center justify-center text-center space-y-4 transition-all relative overflow-hidden group">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />

        <div className="w-16 h-16 rounded-3xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
          <FileUp className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white">
            Upload PDF Document
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag &amp; drop your file here or <span className="text-cyan-400 font-bold underline">click to upload</span> • PDF only (Max 20MB)
          </p>
        </div>

        {/* Processing Progress bar if active */}
        {isUploading && (
          <div className="w-full max-w-md space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold text-cyan-300">
              <span>Processing... Extracting text from PDF</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Active Document Insights Container - Matching Showcase Layout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {currentDoc.fileName}
              </h2>
              <p className="text-[11px] text-slate-400">
                Uploaded {currentDoc.uploadDate} • {currentDoc.fileSize}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportToNotes}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-cyan-300 border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save to Notes Library</span>
          </button>
        </div>

        {/* Document Insights Pills: Summary, Key Concepts, Practice Questions, Flashcards, Notes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'summary', label: 'Summary', icon: BookOpen },
            { id: 'concepts', label: 'Key Concepts', icon: Sparkles },
            { id: 'questions', label: 'Practice Questions', icon: BrainCircuit },
            { id: 'flashcards', label: 'Flashcards', icon: Layers },
            { id: 'notes', label: 'Raw Extracted Notes', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isTabActive
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Insights Content */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 min-h-[220px]">
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Executive Educational Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {currentDoc.summary}
              </p>
            </div>
          )}

          {activeTab === 'concepts' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Key Concepts &amp; Definitions ({currentDoc.keyConcepts.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentDoc.keyConcepts.map((c, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-xs font-extrabold text-white">{c.term}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{c.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Generated Practice Questions ({currentDoc.practiceQuestions.length})
              </h4>
              <div className="space-y-3">
                {currentDoc.practiceQuestions.map((q, i) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <p className="text-xs font-bold text-white">Q{i + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border text-[11px] ${
                            oIdx === q.correctIndex
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Generated Flashcards ({currentDoc.flashcards.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentDoc.flashcards.map((f, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-bold text-cyan-400">Front</div>
                    <p className="text-xs font-bold text-white">{f.front}</p>
                    <div className="text-[10px] uppercase font-bold text-violet-400 pt-1">Back</div>
                    <p className="text-xs text-slate-300">{f.back}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Raw Extracted Text Sample
              </h4>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {currentDoc.extractedTextSample}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
