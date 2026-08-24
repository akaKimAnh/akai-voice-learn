import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Sparkles, Play, X } from 'lucide-react';

interface CustomInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: (jdText: string) => void;
}

export const CustomInterviewModal: React.FC<CustomInterviewModalProps> = ({
  isOpen,
  onClose,
  onStartInterview,
}) => {
  const { t } = useLanguage();
  const [jdText, setJdText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jdText.trim()) {
      onStartInterview(jdText.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                {t.tailoredMockInterview}
              </span>
              <h3 className="text-base font-bold text-slate-800 mt-0.5">{t.customJdModalTitle}</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                {t.customJdModalDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder={t.jdPlaceholder}
            className="w-full h-36 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-xs text-slate-800 focus:outline-none focus:border-[#0D9488] focus:bg-white resize-none"
          />

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Sparkles size={16} className="text-[#0D9488]" />
              <span>{t.aiAnalyzeNotice}</span>
            </div>

            <button
              type="submit"
              disabled={!jdText.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-[#0D9488] hover:bg-[#0f766e] disabled:opacity-40 text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-900/10 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Play size={16} />
              <span>{t.startAiInterviewBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
