import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { MobileVoiceChat } from './components/MobileVoiceChat';
import { Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [activeSession, setActiveSession] = useState<{
    sessionId: string;
    topic: string;
    customJD?: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center animate-spin mb-3 shadow-lg shadow-teal-900/20">
          <Sparkles size={24} />
        </div>
        <p className="text-sm font-bold text-[#0D9488]">{t.loading}</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  if (activeSession) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col">
        <MobileVoiceChat
          sessionId={activeSession.sessionId}
          topic={activeSession.topic}
          customJD={activeSession.customJD}
          onBack={() => setActiveSession(null)}
        />
      </div>
    );
  }

  return (
    <DashboardView
      onStartVoiceChat={(sessionId, topic, customJD) => {
        setActiveSession({ sessionId, topic, customJD });
      }}
    />
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
          <MainApp />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
