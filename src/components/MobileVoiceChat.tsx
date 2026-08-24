import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { AkaiLogoMark } from './Logo';
import { useRealtimeVoiceChat } from '../hooks/useRealtimeVoiceChat';
import { addVocabularyWord } from '../services/firestoreService';
import { ArrowLeft, Mic, Volume2, BookmarkPlus, Check, Keyboard, Send, Sparkles } from 'lucide-react';

interface MobileVoiceChatProps {
  sessionId: string;
  topic: string;
  customJD?: string;
  onBack: () => void;
}

export const MobileVoiceChat: React.FC<MobileVoiceChatProps> = ({
  sessionId,
  topic,
  customJD = '',
  onBack,
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const {
    messages,
    isListening,
    transcript,
    loadingAi,
    selectedWord,
    speechError,
    startListening,
    stopListeningAndSend,
    sendMessage,
    speakText,
    lookupWord,
    clearSelectedWord,
  } = useRealtimeVoiceChat(user?.uid, sessionId, topic, customJD, language);

  const [inputMode, setInputMode] = useState<'voice' | 'keyboard'>('voice');
  const [textInput, setTextInput] = useState('');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    const chatContainer = document.getElementById('chat-scroll-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, transcript, loadingAi]);

  const handleSaveToVault = async () => {
    if (!user || !selectedWord) return;
    try {
      await addVocabularyWord(user.uid, {
        word: selectedWord.word,
        ipa: selectedWord.ipa,
        meaning: selectedWord.meaning,
        partOfSpeech: selectedWord.partOfSpeech || 'noun',
        example: selectedWord.example || `Used during ${topic} practice`,
        masteryLevel: 1,
      });
      setSavedToast(`Saved "${selectedWord.word}" to Vocabulary Vault!`);
      setTimeout(() => setSavedToast(null), 3000);
      clearSelectedWord();
    } catch (e) {
      console.error('Error saving word to vault:', e);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendMessage(textInput.trim());
      setTextInput('');
    }
  };

  // Split AI message text into interactive word tokens
  const renderInteractiveText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((chunk, index) => {
      const clean = chunk.replace(/[^a-zA-Z]/g, '');
      if (clean.length > 3) {
        return (
          <span
            key={index}
            onClick={() => lookupWord(clean)}
            className="text-teal-400 font-bold border-b border-teal-400/50 hover:bg-teal-400/10 cursor-pointer transition-colors px-0.5 rounded"
          >
            {chunk}
          </span>
        );
      }
      return <span key={index}>{chunk}</span>;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 relative font-sans text-slate-100">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#0D9488] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl z-50 flex items-center gap-2 animate-bounce border border-teal-400/30">
          <Check size={16} />
          {savedToast}
        </div>
      )}

      {/* Header */}
      <header className="p-4 md:px-8 md:py-4 flex items-center justify-between border-b border-white/10 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-2xl hover:bg-white/10 text-slate-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span className="text-xs font-bold hidden sm:inline">{t.backDashboard}</span>
            </button>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-teal-500/30 backdrop-blur-md p-1 shadow-sm">
                <AkaiLogoMark size={32} />
              </div>
              <div>
                <span className="text-sm font-bold text-white block leading-tight">{topic}</span>
                <span className="text-[10px] text-teal-400 font-mono">Gemini AI Real-time Voice</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="text-xs font-mono text-teal-400 bg-teal-950/80 border border-teal-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 hidden sm:flex">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>{t.liveSessionTag}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages Scroll Container */}
      <div
        id="chat-scroll-container"
        className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center relative z-0 pb-44 md:pb-40"
      >
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {/* Default initial AI greeting if no messages yet */}
          {messages.length === 0 && !loadingAi && (
            <div className="flex flex-col gap-1 self-start max-w-[85%] md:max-w-[75%]">
              <div className="bg-slate-900 p-4 rounded-3xl rounded-tl-none text-sm text-slate-200 leading-relaxed border border-white/10 shadow-lg">
                {(t.voiceChatWelcome || 'Welcome to your {topic} practice session! Tap the mic button below to start speaking.').replace('{topic}', topic || 'General')}
              </div>
            </div>
          )}

          {/* Render Messages */}
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id || idx} className={`flex flex-col gap-1 ${isUser ? 'self-end max-w-[85%] md:max-w-[75%]' : 'self-start max-w-[85%] md:max-w-[75%]'}`}>
                {/* Message Content */}
                <div
                  className={`p-4 md:p-5 rounded-3xl text-sm md:text-base leading-relaxed ${
                    isUser
                      ? 'bg-[#0D9488] text-white rounded-tr-none shadow-xl shadow-teal-950/30'
                      : 'bg-slate-900 text-slate-200 rounded-tl-none border border-white/10 shadow-xl'
                  }`}
                >
                  {isUser ? (
                    <p>{msg.text}</p>
                  ) : (
                    <div>
                      <p>{renderInteractiveText(msg.text)}</p>
                      <button
                        onClick={() => speakText(msg.text)}
                        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:underline bg-teal-950/60 border border-teal-500/20 px-3 py-1 rounded-xl w-max"
                      >
                        <Volume2 size={14} /> {t.listenPronunciation}
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Feedback Card */}
                {!isUser && msg.feedback && (
                  <div className="mt-1 bg-slate-900/90 border border-teal-500/30 rounded-2xl p-3 text-xs text-slate-300 flex flex-col gap-1 shadow-md">
                    <div className="flex items-center gap-1.5 text-teal-400 font-bold text-xs">
                      <Check size={14} />
                      <span>{msg.feedback.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{msg.feedback.detail}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Active Transcript / Listening state */}
          {isListening && (
            <div className="flex flex-col gap-1 self-end max-w-[85%] md:max-w-[75%] animate-pulse">
              <div className="bg-[#0D9488] text-white rounded-3xl rounded-tr-none p-4 text-sm md:text-base flex items-center gap-3 shadow-xl">
                <Mic size={20} className="animate-bounce shrink-0" />
                <span>{transcript || t.listeningText}</span>
              </div>
            </div>
          )}

          {/* AI Thinking state */}
          {loadingAi && (
            <div className="flex items-center gap-2 text-teal-400 text-xs font-mono p-2 bg-slate-900/80 rounded-2xl border border-teal-500/20 w-max">
              <Sparkles size={16} className="animate-spin" />
              <span>{t.geminiProcessing}</span>
            </div>
          )}

          {/* Speech Error Banner */}
          {speechError && (
            <div className="bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs p-3 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
              <span>{speechError}</span>
              <button
                onClick={() => setInputMode('keyboard')}
                className="shrink-0 bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-xl text-[11px] hover:bg-amber-400"
              >
                {t.switchToType || 'Use Keyboard'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Word Popover Modal */}
      {selectedWord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-teal-100 flex flex-col gap-3 relative text-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-lg font-bold text-slate-800 block">{selectedWord.word}</span>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                  {selectedWord.partOfSpeech || 'Word'}
                </span>
              </div>
              <button
                onClick={() => speakText(selectedWord.word)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-[#0D9488]"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-mono">{selectedWord.ipa}</p>
            <p className="text-sm text-slate-800 leading-relaxed italic font-medium">{selectedWord.meaning}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveToVault}
                className="flex-1 bg-[#0D9488] text-white text-xs py-2.5 rounded-2xl font-bold hover:bg-[#0f766e] transition-colors flex items-center justify-center gap-2 shadow-md shadow-teal-900/20"
              >
                <BookmarkPlus size={16} />
                <span>{t.saveToVaultBtn}</span>
              </button>
              <button
                onClick={clearSelectedWord}
                className="px-4 bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-2xl transition-colors"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Voice Dock Controls */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent flex flex-col items-center gap-3 z-20">
        <div className="w-full max-w-xl bg-slate-900/90 border border-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-5 shadow-2xl flex flex-col items-center gap-3">
          {/* Animated Sound Wave Indicator */}
          <div className="flex items-center justify-center gap-1.5 h-6">
            <div className="w-1 h-3 bg-teal-500 rounded-full" />
            <div className="w-1 h-5 bg-teal-500 rounded-full" />
            <div className={`w-1 h-7 bg-teal-400 rounded-full ${isListening ? 'animate-pulse' : ''}`} />
            <div className="w-1 h-4 bg-teal-500 rounded-full" />
            <div className="w-1 h-6 bg-teal-500 rounded-full" />
          </div>

          {/* Big FAB Mic Button or Text Form */}
          {inputMode === 'voice' ? (
            <button
              onClick={isListening ? stopListeningAndSend : startListening}
              className={`w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/30 cursor-pointer border-4 border-slate-950 ring-4 ring-teal-500/20 text-white transition-transform active:scale-95 hover:scale-105 ${
                isListening ? 'bg-red-600 ring-red-500/40 animate-pulse' : ''
              }`}
            >
              <Mic size={28} />
            </button>
          ) : (
            <form onSubmit={handleTextSubmit} className="w-full flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={t.typeResponsePlaceholder}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="p-3 rounded-2xl bg-[#0D9488] text-white hover:bg-[#0f766e]"
              >
                <Send size={18} />
              </button>
            </form>
          )}

          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
            <button
              onClick={() => setInputMode(inputMode === 'voice' ? 'keyboard' : 'voice')}
              className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
            >
              <Keyboard size={14} />
              <span>{inputMode === 'voice' ? t.switchToType : t.switchToVoice}</span>
            </button>
            <span>•</span>
            <span>{t.tapMicToSpeak}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
