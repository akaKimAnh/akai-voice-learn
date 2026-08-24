import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToVocabulary, addVocabularyWord, deleteVocabularyWord } from '../services/firestoreService';
import { VocabularyWord } from '../types';
import { Volume2, PlusCircle, Trash2, BookOpen, Sparkles, X, Check } from 'lucide-react';

export const VocabularyVaultView: React.FC<{ onStartCustomInterview: () => void }> = ({ onStartCustomInterview }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('noun');
  const [newExample, setNewExample] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToVocabulary(user.uid, (fetchedWords) => {
      setWords(fetchedWords);
    });
    return () => unsubscribe();
  }, [user]);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newWord.trim() || !newMeaning.trim()) return;

    try {
      await addVocabularyWord(user.uid, {
        word: newWord.trim(),
        ipa: newIpa.trim() || `/${newWord.trim().toLowerCase()}/`,
        meaning: newMeaning.trim(),
        partOfSpeech: newPartOfSpeech,
        example: newExample.trim(),
        masteryLevel: 1,
      });

      setToast(`Added "${newWord}" to Vault!`);
      setTimeout(() => setToast(null), 3000);

      setNewWord('');
      setNewIpa('');
      setNewMeaning('');
      setNewExample('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding vocabulary word:', err);
    }
  };

  const handleDelete = async (vocabId: string | undefined, wordName: string) => {
    if (!user || !vocabId) return;
    try {
      await deleteVocabularyWord(user.uid, vocabId);
      setToast(`Removed "${wordName}" from Vault.`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Error deleting word:', err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-28 font-sans text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#0D9488] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl z-50 flex items-center gap-2 animate-bounce border border-teal-300/30">
          <Check size={16} />
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
          {t.vocabStorageTag}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-1">
          {t.savedVaultTitle}
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {t.vaultSubtitle}
        </p>
      </div>

      {/* Custom AI Interview Quick Banner */}
      <section className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{t.customAiInterview}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {t.customInterviewDesc}
            </p>
          </div>
        </div>
        <button
          onClick={onStartCustomInterview}
          className="w-full py-3 px-4 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-900/10 transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          <span>{t.launchJdBtn}</span>
        </button>
      </section>

      {/* Vocabulary Vault Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#0D9488]" size={18} />
            <h3 className="text-sm font-bold text-slate-800">{t.savedWordsTitle}</h3>
            <span className="text-[10px] bg-teal-50 text-[#0D9488] font-bold px-2 py-0.5 rounded-full ml-1">
              {words.length} {t.savedTag}
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-[#0D9488] font-bold text-xs hover:underline flex items-center gap-1"
          >
            <PlusCircle size={15} />
            {t.addWordBtn}
          </button>
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {words.length === 0 ? (
            <div className="col-span-2 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-white">
              <BookOpen size={28} className="text-[#0D9488]/60" />
              <p className="text-xs font-bold text-slate-700">{t.noSavedWords}</p>
              <p className="text-[11px] text-slate-400">{t.noSavedWordsSub}</p>
            </div>
          ) : (
            words.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="text-base font-bold text-[#0D9488]">{item.word}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speak(item.word)}
                        className="p-1 rounded-full hover:bg-teal-50 text-[#0D9488] transition-colors"
                      >
                        <Volume2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.word)}
                        className="p-1 rounded-full hover:bg-red-50 text-red-500 transition-colors opacity-70 hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <span className="inline-block bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono mb-2 font-medium">
                    {item.ipa} • {item.partOfSpeech}
                  </span>

                  <p className="text-xs font-bold text-slate-800 leading-snug">{item.meaning}</p>
                  {item.example && (
                    <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2">"{item.example}"</p>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Add New Word Card */}
          <div
            onClick={() => setShowAddModal(true)}
            className="border-2 border-dashed border-slate-200 bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-[#0D9488] hover:text-[#0D9488] transition-all cursor-pointer min-h-[120px]"
          >
            <PlusCircle size={24} className="mb-1" />
            <span className="text-xs font-bold">{t.addCustomWord}</span>
          </div>
        </div>
      </section>

      {/* Manual Add Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800">{t.addCustomWord}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 block">{t.wordLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Synergy"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs focus:outline-none focus:border-[#0D9488] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 block">{t.ipaLabel}</label>
                  <input
                    type="text"
                    placeholder="/ˈsɪnərdʒi/"
                    value={newIpa}
                    onChange={(e) => setNewIpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs focus:outline-none focus:border-[#0D9488] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 block">{t.partOfSpeechLabel}</label>
                  <select
                    value={newPartOfSpeech}
                    onChange={(e) => setNewPartOfSpeech(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs focus:outline-none focus:border-[#0D9488] focus:bg-white"
                  >
                    <option value="noun">noun</option>
                    <option value="verb">verb</option>
                    <option value="adjective">adjective</option>
                    <option value="adverb">adverb</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 block">{t.meaningLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="Sự cộng hưởng, hợp lực"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs focus:outline-none focus:border-[#0D9488] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 block">{t.exampleLabel}</label>
                <input
                  type="text"
                  placeholder="The synergy between the two teams was clear."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs focus:outline-none focus:border-[#0D9488] focus:bg-white"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0D9488] text-white rounded-2xl font-bold text-xs hover:bg-[#0f766e] shadow-md shadow-teal-900/10"
                >
                  {t.saveToVaultBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs"
                >
                  {t.cancelBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
