export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: string;
  streakCount: number;
  lastActiveDate: string | null; // Format: YYYY-MM-DD
  weeklyActivity?: number[]; // Minutes practiced per day Mon-Sun
  fluencyLevel?: string;
  fluencyPercentage?: number;
}

export interface VocabularyWord {
  id?: string;
  word: string;
  ipa: string;
  meaning: string;
  partOfSpeech: string;
  example?: string;
  createdAt: string;
  masteryLevel: number;
}

export interface VoiceSession {
  id?: string;
  topic: string;
  customJD?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionMessage {
  id?: string;
  role: 'user' | 'model' | 'assistant' | 'system';
  text: string;
  audioUrl?: string;
  createdAt: string;
  feedback?: {
    type: 'good' | 'improvement' | 'grammar';
    title: string;
    detail: string;
  };
}

export interface StreakDay {
  date: string; // YYYY-MM-DD
  checkedIn: boolean;
  timestamp: string;
}

export interface WordLookupResult {
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaning: string;
  example?: string;
}
