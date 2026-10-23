import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LanguagePreference, ExplanationMode } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  topic?: string;
  mode?: ExplanationMode;
}

export const AITutorView: React.FC = () => {
  const { user, subjects, addXP } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.name || 'Mathematics');
  const [selectedTopic, setSelectedTopic] = useState<string>('Quadratic Equations');
  const [language, setLanguage] = useState<LanguagePreference>(user.preferredLanguage || 'English');
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>(user.explanationMode || 'intermediate');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${user.name}! 🌟 I am your **BrainRoot Education AI Tutor**.

Currently configured for **${user.programName || user.educationStage}** in **${explanationMode.toUpperCase()}** depth mode.

I can assist you with:
* Step-by-step conceptual derivations & mathematical proofs
* Numerical problems, algorithm code & complexity breakdowns
* Practical case studies & clinical reasoning
* Assignment planning, research paper analysis & ethical citations

What academic concept or problem would you like to explore?`,
      timestamp: 'Just now',
      topic: 'Academic Orientation',
      mode: 'intermediate',
    },
  ]);

  const quickPrompts = [
    'Explain simply',
    'Step by step derivation',
    'Assignment & Code guidance',
    'Research paper / Case study',
    'Generate practice test & hints',
    'Exam tips & tricks',
  ];

  // Topics for selected subject
  const currentSubjectObj = subjects.find(s => s.name === selectedSubject);
  const availableTopics = currentSubjectObj
    ? currentSubjectObj.chapters.flatMap(ch => ch.topics.map(t => t.title))
    : ['General Concepts'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputMessage).trim();
    if (!prompt || isLoading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      topic: selectedTopic,
      mode: explanationMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          subject: selectedSubject,
          topic: selectedTopic,
          userClass: user.educationStage,
          programName: user.programName,
          language,
          explanationMode,
          conversationHistory: messages.slice(-5),
        }),
      });

      const data = await response.json();
      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.reply || "I'm reviewing your question. Could you clarify that topic?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: selectedTopic,
        mode: explanationMode,
      };

      setMessages(prev => [...prev, botMsg]);
      addXP(10);
    } catch (err) {
      const fallbackMsg: Message = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        content: `I'm currently assisting multiple students offline! In ${selectedSubject} (${selectedTopic}), remember the golden rule: **Break down each problem into given variables, governing principles, and boundary conditions.** Let's try another inquiry!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: selectedTopic,
        mode: explanationMode,
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-To-Speech (Web Speech API)
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const cleanText = text
        .replace(/[$#*_`]/g, '')
        .replace(/\n+/g, ' ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.rate = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-To-Text (Web Speech API)
  const toggleVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your question directly.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'new-1',
        role: 'assistant',
        content: `Conversation refreshed! What topic in **${selectedSubject}** would you like to explore next?`,
        timestamp: 'Just now',
        mode: explanationMode,
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-16">
      {/* Header & Controls Card */}
      <div className="p-5 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                BrainRoot Education AI Tutor
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Level: <strong className="text-cyan-300">{user.programName || user.educationStage}</strong> ({user.institutionOrUniversity || user.board})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded-lg flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Anti-Plagiarism / Original Thinking
            </span>
            <button
              onClick={clearChat}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>
        </div>

        {/* 4 Filters Row: Subject, Topic, Explanation Mode, Language */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/60">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={e => {
                setSelectedSubject(e.target.value);
                const firstSub = subjects.find(s => s.name === e.target.value);
                if (firstSub && firstSub.chapters[0]?.topics[0]) {
                  setSelectedTopic(firstSub.chapters[0].topics[0].title);
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500/60"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Topic / Chapter
            </label>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500/60"
            >
              {availableTopics.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Explanation Mode
            </label>
            <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-800">
              {(['beginner', 'intermediate', 'advanced'] as ExplanationMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setExplanationMode(m)}
                  className={`flex-1 py-1 text-[10px] font-bold capitalize rounded-lg transition-all ${
                    explanationMode === m
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'beginner' ? 'Basic' : m === 'intermediate' ? 'Standard' : 'Research'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Language
            </label>
            <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-800">
              {(['English', 'Hindi', 'Hinglish'] as LanguagePreference[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all ${
                    language === l
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e1526]/80 border border-slate-800/90 shadow-xl min-h-[460px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Content formatted with clean line breaks and styling */}
                <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                  {msg.content}
                </div>

                {/* Footer of message */}
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {msg.mode && (
                      <span className="capitalize px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono text-[9px]">
                        {msg.mode} mode
                      </span>
                    )}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => speakText(msg.content)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        title={isSpeaking ? 'Stop Audio' : 'Listen with Voice'}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-violet-950/60 border border-violet-500/40 flex items-center justify-center text-cyan-400 animate-spin">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="animate-pulse">
              BrainRoot AI Tutor is formulating verified explanation in {explanationMode} mode...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Suggestions:
        </span>
        {quickPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-[#0e1526] border border-slate-800 focus-within:border-cyan-500/60 shadow-xl"
      >
        <button
          type="button"
          onClick={toggleVoiceRecognition}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
          }`}
          title="Speech to Text Question"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder={`Ask about ${selectedTopic} in ${language} (${explanationMode} depth)...`}
          className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold disabled:opacity-40 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
