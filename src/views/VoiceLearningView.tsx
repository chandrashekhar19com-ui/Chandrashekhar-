import React, { useState } from 'react';
import { Volume2, Mic, MicOff, Sparkles, BookOpen, RotateCcw, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoiceLearningView: React.FC = () => {
  const { user } = useApp();
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiVoiceReply, setAiVoiceReply] = useState('');
  const [loading, setLoading] = useState(false);

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use the typed input box below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        await processVoiceQuestion(text);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const processVoiceQuestion = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          subject: 'Voice Learning',
          language,
          userClass: user.educationStage,
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Voice answer generated.';
      setAiVoiceReply(reply);
      speakText(reply);
    } catch {
      const fallback = 'In ' + user.educationStage + ', remember to review core definitions and formulas.';
      setAiVoiceReply(fallback);
      speakText(fallback);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[$#*_`]/g, ''));
      utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Voice Learning Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Speak your doubts and listen to step-by-step explanations in English or Hindi
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          {(['English', 'Hindi'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                language === l
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Main Microphone Interaction Circle */}
      <div className="p-10 rounded-3xl bg-[#0e1526]/90 border border-slate-800/90 shadow-2xl flex flex-col items-center text-center space-y-6">
        <button
          onClick={startVoiceInput}
          disabled={loading}
          className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse scale-110 shadow-rose-500/40'
              : 'bg-gradient-to-tr from-violet-600 to-cyan-500 text-white hover:scale-105 shadow-cyan-500/30'
          }`}
        >
          {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
        </button>

        <div>
          <h3 className="text-lg font-extrabold text-white">
            {isListening ? 'Listening to your question...' : 'Tap to Speak Your Doubt'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Language: <strong className="text-cyan-400">{language}</strong> • Works with Web Speech API
          </p>
        </div>

        {/* Transcript Area */}
        {transcript && (
          <div className="w-full max-w-lg p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 space-y-1">
            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
              You Asked:
            </span>
            <p className="font-semibold text-white">&ldquo;{transcript}&rdquo;</p>
          </div>
        )}

        {/* AI Audio Response Area */}
        {aiVoiceReply && (
          <div className="w-full max-w-xl p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Spoken Explanation
              </span>
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakText(aiVoiceReply)}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stop Speech</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Replay Audio</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {aiVoiceReply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
