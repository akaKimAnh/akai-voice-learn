import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { subscribeToVocabulary, subscribeToStreakHistory, createVoiceSession } from '../services/firestoreService';
import { CustomInterviewModal } from './CustomInterviewModal';
import { VocabularyVaultView } from './VocabularyVaultView';
import { AkaiLogo, AkaiLogoMark } from './Logo';
import { Flame, Bell, Play, BookOpen, Home, Compass, BarChart2, User as UserIcon, LogOut, Coffee, Briefcase, Plane, Sparkles, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  onStartVoiceChat: (sessionId: string, topic: string, customJD?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onStartVoiceChat }) => {
  const { user, userProfile, logout } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'vault' | 'profile'>('home');
  const [vocabCount, setVocabCount] = useState(0);
  const [streakDays, setStreakDays] = useState<{ date: string; checkedIn: boolean }[]>([]);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);

  // Subscribe to real-time Vocabulary count
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToVocabulary(user.uid, (words) => {
      setVocabCount(words.length);
    });
    return () => unsubscribe();
  }, [user]);

  // Subscribe to real-time Streak History
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToStreakHistory(user.uid, (streaks) => {
      setStreakDays(streaks);
    });
    return () => unsubscribe();
  }, [user]);

  // Helper to start a voice chat session in Firestore and launch component
  const handleLaunchTopic = async (topic: string, customJD: string = '') => {
    setIsStartingSession(true);
    const fallbackSessionId = 'session-' + Date.now();
    try {
      let sessionId = fallbackSessionId;
      if (user) {
        try {
          sessionId = await createVoiceSession(user.uid, topic, customJD);
        } catch (dbErr) {
          console.warn('Firestore session create error, using local session id:', dbErr);
        }
      }
      onStartVoiceChat(sessionId, topic, customJD);
    } catch (e) {
      console.error('Error starting session:', e);
      onStartVoiceChat(fallbackSessionId, topic, customJD);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleStartCustomInterview = (jdText: string) => {
    setIsJdModalOpen(false);
    handleLaunchTopic('Custom Job Interview', jdText);
  };

  // Generate last 7 days array for streak widget
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(locale, { weekday: 'narrow' });
      const checkedIn = streakDays.some((s) => s.date === dateStr && s.checkedIn);
      days.push({ dateStr, dayName, checkedIn: checkedIn || i === 0 });
    }
    return days;
  };

  const dayList = getLast7Days();

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <AkaiLogoMark size={38} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-[#005357] leading-none">AKAI</span>
                <span className="text-xs font-bold text-slate-700 leading-none">Voice AI</span>
              </div>
              <span className="text-[10px] text-[#0D9488] font-bold uppercase tracking-wider block mt-0.5">{t.brandSubtitle}</span>
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'home' ? 'bg-white text-[#0D9488] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home size={15} />
              <span>{t.dashboardTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'explore' ? 'bg-white text-[#0D9488] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass size={15} />
              <span>{t.exploreTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'vault' ? 'bg-white text-[#0D9488] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen size={15} />
              <span>{t.vaultTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'profile' ? 'bg-white text-[#0D9488] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserIcon size={15} />
              <span>{t.profileTab}</span>
            </button>
          </nav>

          {/* Language Toggle & User Actions Header Right */}
          <div className="flex items-center gap-3">
            <LanguageToggle variant="light" />

            <div className="hidden sm:flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
              <Flame size={14} className="text-[#0D9488] fill-[#0D9488]" />
              <span className="text-xs font-bold text-[#0D9488]">{userProfile?.streakCount || 7} {t.days}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-teal-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-[#0D9488]">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (userProfile?.displayName || 'A').charAt(0)
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{userProfile?.displayName || 'Alex Nguyen'}</p>
                <p className="text-[10px] text-slate-400 font-medium">{userProfile?.email}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title={t.logOut}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors hidden sm:block"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content Container */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1 space-y-6 pb-24 md:pb-12">
        {activeTab === 'home' && (
          <>
            {/* Top Grid: Streak Banner + Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 7-Day Streak Card Banner */}
              <section className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 md:col-span-2 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{t.dailyHabit}</span>
                    <h3 className="text-sm font-bold text-slate-800">{t.weeklyActivity}</h3>
                  </div>
                  <span className="text-xs font-bold text-[#0D9488] bg-teal-50 border border-teal-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Flame size={14} className="fill-[#0D9488]" />
                    <span>{userProfile?.streakCount || 7} {t.days} {t.activeStreak}</span>
                  </span>
                </div>

                {/* 7-Day Streak Tracker Bubbles */}
                <div className="flex justify-between gap-2">
                  {dayList.map((d, i) => (
                    <div
                      key={i}
                      className={`flex-1 aspect-square md:aspect-auto md:py-3 rounded-2xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                        d.checkedIn
                          ? 'bg-[#0D9488] text-white shadow-xs'
                          : i === 0
                          ? 'bg-teal-100 text-[#0D9488]'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <span>{d.dayName}</span>
                      {d.checkedIn && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" />}
                    </div>
                  ))}
                </div>
              </section>

              {/* Metric Cards Stack */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">{t.vocabVaultMetric}</p>
                  <p className="text-3xl font-extrabold text-slate-800">{vocabCount} <span className="text-xs text-slate-400 font-normal">{t.wordsCount}</span></p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 mb-1 tracking-wider uppercase">{t.fluencyMetric}</p>
                  <p className="text-3xl font-extrabold text-[#0D9488]">{userProfile?.fluencyPercentage || 75}%</p>
                </div>
              </div>
            </div>

            {/* Primary Voice Action Buttons */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleLaunchTopic('General Practice')}
                disabled={isStartingSession}
                className="bg-[#0D9488] hover:bg-[#0f766e] text-white p-5 rounded-2xl font-bold shadow-md shadow-teal-900/10 transition-all active:scale-98 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                    <Play size={22} className="fill-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base">{t.startVoicePractice}</h3>
                    <p className="text-xs text-teal-100 opacity-90 font-medium">{isStartingSession ? t.initializingAi : t.startVoiceSub}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <Play size={16} className="fill-white" />
                </div>
              </button>

              <button
                onClick={() => setIsJdModalOpen(true)}
                className="bg-white border border-slate-200 hover:border-[#0D9488] text-slate-800 p-5 rounded-2xl font-bold shadow-xs transition-all active:scale-98 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
                    <Sparkles size={22} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-base">{t.practiceWithJd}</h3>
                    <p className="text-xs text-slate-400 font-medium">{t.practiceWithJdSub}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-50 text-[#0D9488] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <Sparkles size={16} />
                </div>
              </button>
            </section>

            {/* Scenarios Header */}
            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                  {t.featuredScenarios}
                </span>
                <h3 className="text-base font-bold text-slate-800">{t.selectContext}</h3>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="text-xs font-bold text-[#0D9488] hover:underline"
              >
                {t.seeAllScenarios}
              </button>
            </div>

            {/* Scenarios Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Coffee Shop */}
              <div
                onClick={() => handleLaunchTopic('Coffee Shop')}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#0D9488] cursor-pointer group transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center mb-3 text-xl font-bold">
                    ☕
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#0D9488] transition-colors">{t.coffeeShopTitle}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">{t.coffeeShopDesc}</p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#0D9488] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t.practiceNow}</span>
                  <Play size={12} className="fill-[#0D9488]" />
                </div>
              </div>

              {/* Job Interview */}
              <div
                onClick={() => handleLaunchTopic('Job Interview')}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#0D9488] cursor-pointer group transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center mb-3 text-xl font-bold">
                    💼
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#0D9488] transition-colors">{t.interviewTitle}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">{t.interviewDesc}</p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#0D9488] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t.practiceNow}</span>
                  <Play size={12} className="fill-[#0D9488]" />
                </div>
              </div>

              {/* Airport & Hotel */}
              <div
                onClick={() => handleLaunchTopic('Airport Check-in')}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#0D9488] cursor-pointer group transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center mb-3 text-xl font-bold">
                    ✈️
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#0D9488] transition-colors">{t.airportTitle}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">{t.airportDesc}</p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#0D9488] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t.practiceNow}</span>
                  <Play size={12} className="fill-[#0D9488]" />
                </div>
              </div>

              {/* Custom JD */}
              <div
                onClick={() => setIsJdModalOpen(true)}
                className="bg-[#0D9488] text-white rounded-2xl p-5 shadow-md hover:bg-[#0f766e] cursor-pointer group transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-3">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="text-sm font-bold">{t.customJdTitle}</h3>
                  <p className="text-xs text-teal-100 opacity-90 font-medium mt-1">{t.customJdDesc}</p>
                </div>
                <div className="mt-4 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t.uploadJdBtn}</span>
                  <Play size={12} className="fill-white" />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Explore Tab */}
        {activeTab === 'explore' && (
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                {t.practiceLibrary}
              </span>
              <h2 className="text-xl font-bold text-slate-800">{t.exploreScenariosTitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setIsJdModalOpen(true)}
                className="p-5 bg-[#0D9488] text-white rounded-2xl shadow-md cursor-pointer flex items-center justify-between hover:bg-[#0f766e] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{t.customAiInterview}</h3>
                    <p className="text-xs text-teal-100 font-medium">{t.customInterviewDesc}</p>
                  </div>
                </div>
                <Play size={20} className="fill-white" />
              </div>

              <div
                onClick={() => handleLaunchTopic('Job Interview')}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs cursor-pointer flex items-center justify-between hover:border-[#0D9488] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800">{t.behavioralInterviewTitle}</h3>
                    <p className="text-xs text-slate-400 font-medium">{t.behavioralInterviewDesc}</p>
                  </div>
                </div>
                <Play size={20} className="text-[#0D9488]" />
              </div>

              <div
                onClick={() => handleLaunchTopic('Coffee Shop')}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs cursor-pointer flex items-center justify-between hover:border-[#0D9488] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
                    <Coffee size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800">{t.coffeeSmallTalkTitle}</h3>
                    <p className="text-xs text-slate-400 font-medium">{t.coffeeSmallTalkDesc}</p>
                  </div>
                </div>
                <Play size={20} className="text-[#0D9488]" />
              </div>

              <div
                onClick={() => handleLaunchTopic('Airport Check-in')}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs cursor-pointer flex items-center justify-between hover:border-[#0D9488] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0">
                    <Plane size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800">{t.airportHotelTitle}</h3>
                    <p className="text-xs text-slate-400 font-medium">{t.airportHotelDesc}</p>
                  </div>
                </div>
                <Play size={20} className="text-[#0D9488]" />
              </div>
            </div>
          </div>
        )}

        {/* Vault Tab */}
        {activeTab === 'vault' && (
          <VocabularyVaultView onStartCustomInterview={() => setIsJdModalOpen(true)} />
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4 pt-2 max-w-2xl mx-auto">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                {t.accountSettings}
              </span>
              <h2 className="text-xl font-bold text-slate-800">{t.userProfileTitle}</h2>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-teal-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-2xl font-bold text-[#0D9488]">
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (userProfile?.displayName || 'A').charAt(0)
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{userProfile?.displayName || 'Alex Nguyen'}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{userProfile?.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mt-2 pt-6 border-t border-slate-100">
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{t.activeStreakLabel}</p>
                  <p className="text-xl font-bold text-[#0D9488]">{userProfile?.streakCount || 7} {t.days}</p>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{t.vaultWordsLabel}</p>
                  <p className="text-xl font-bold text-[#0D9488]">{vocabCount} {t.wordsCount}</p>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="w-full mt-2 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                <span>{t.logOutAccount}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Custom Interview Modal */}
      <CustomInterviewModal
        isOpen={isJdModalOpen}
        onClose={() => setIsJdModalOpen(false)}
        onStartInterview={handleStartCustomInterview}
      />

      {/* Mobile Navigation Dock Bar (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3 z-30 shadow-lg">
        <div className="flex justify-between items-center max-w-xs mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home' ? 'text-[#0D9488] font-bold' : 'text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'home' ? 'bg-teal-50 text-[#0D9488]' : ''}`}>
              <Home size={18} />
            </div>
            <span className="text-[10px] font-bold">{t.dashboardTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'explore' ? 'text-[#0D9488] font-bold' : 'text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'explore' ? 'bg-teal-50 text-[#0D9488]' : ''}`}>
              <Compass size={18} />
            </div>
            <span className="text-[10px] font-bold">{t.exploreTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'vault' ? 'text-[#0D9488] font-bold' : 'text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'vault' ? 'bg-teal-50 text-[#0D9488]' : ''}`}>
              <BookOpen size={18} />
            </div>
            <span className="text-[10px] font-bold">{t.vaultTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile' ? 'text-[#0D9488] font-bold' : 'text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'profile' ? 'bg-teal-50 text-[#0D9488]' : ''}`}>
              <UserIcon size={18} />
            </div>
            <span className="text-[10px] font-bold">{t.profileTab}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
