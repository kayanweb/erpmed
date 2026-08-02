import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

interface VoiceDictationProps {
  isAr: boolean;
  onTranscriptChange: (text: string) => void;
  initialText?: string;
}

export const VoiceDictationEngine: React.FC<VoiceDictationProps> = ({
  isAr,
  onTranscriptChange,
  initialText = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = isAr ? "ar-SA" : "en-US";

    recognition.onresult = (event: any) => {
      let currentResult = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentResult += event.results[i][0].transcript;
      }
      if (currentResult) {
        setTranscript(prev => {
          const updated = prev ? `${prev} ${currentResult}` : currentResult;
          onTranscriptChange(updated);
          return updated;
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [isAr, onTranscriptChange]);

  const toggleListening = () => {
    if (!recognitionSupported) {
      toast.error(isAr ? "متصفحك لا يدعم التعرف الصوتي المباشر" : "Web Speech API not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.info(isAr ? "تم إيقاف الإملاء الصوتي" : "Voice dictation paused");
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success(isAr ? "بدء الإملاء الصوتي... تحدث الآن" : "Voice dictation active... speak now");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isAr ? "محرك الإملاء الصوتي الطبي (Voice Dictation)" : "Medical Voice Dictation Engine"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">
            {isAr ? "العربية (السعودية)" : "English (US)"}
          </span>
          <button 
            onClick={toggleListening}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isListening 
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/50' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? (isAr ? "إيقاف التسجيل" : "Stop Dictation") : (isAr ? "بدء التسجيل الصوتي" : "Start Dictation")}
          </button>
        </div>
      </div>

      {isListening && (
        <div className="flex items-center gap-1 h-6 bg-slate-950 px-3 rounded-lg border border-slate-800">
          <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
          <div className="flex items-center gap-0.5 h-full">
            {[40, 70, 30, 90, 50, 80, 20, 60, 100, 40].map((h, i) => (
              <div 
                key={i} 
                className="w-1 bg-blue-500 rounded-full animate-pulse" 
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-blue-400 font-mono ml-auto">Microphone Active</span>
        </div>
      )}
    </div>
  );
};
