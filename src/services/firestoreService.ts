import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { VocabularyWord, VoiceSession, SessionMessage, StreakDay } from '../types';

// Vocabulary Vault Services
export const subscribeToVocabulary = (
  userId: string,
  callback: (words: VocabularyWord[]) => void
) => {
  if (!userId) return () => {};
  const vocabRef = collection(db, 'users', userId, 'vocabulary');
  const q = query(vocabRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const words: VocabularyWord[] = [];
      snapshot.forEach((docSnap) => {
        words.push({ id: docSnap.id, ...docSnap.data() } as VocabularyWord);
      });
      callback(words);
    },
    (error) => {
      console.error('Error listening to vocabulary:', error);
    }
  );
};

export const addVocabularyWord = async (
  userId: string,
  wordData: Omit<VocabularyWord, 'id' | 'createdAt'>
) => {
  if (!userId) throw new Error('User not authenticated');
  const vocabRef = collection(db, 'users', userId, 'vocabulary');
  const newWord = {
    ...wordData,
    createdAt: new Date().toISOString(),
    masteryLevel: wordData.masteryLevel || 1,
  };
  const docRef = await addDoc(vocabRef, newWord);
  return docRef.id;
};

export const deleteVocabularyWord = async (userId: string, vocabId: string) => {
  if (!userId || !vocabId) return;
  const wordRef = doc(db, 'users', userId, 'vocabulary', vocabId);
  await deleteDoc(wordRef);
};

// Voice Sessions Services
export const createVoiceSession = async (
  userId: string,
  topic: string,
  customJD: string = ''
): Promise<string> => {
  if (!userId) throw new Error('User not authenticated');
  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const newSession = {
    topic,
    customJD,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const docRef = await addDoc(sessionsRef, newSession);
  return docRef.id;
};

export const subscribeToSessions = (
  userId: string,
  callback: (sessions: VoiceSession[]) => void
) => {
  if (!userId) return () => {};
  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('updatedAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const sessions: VoiceSession[] = [];
      snapshot.forEach((docSnap) => {
        sessions.push({ id: docSnap.id, ...docSnap.data() } as VoiceSession);
      });
      callback(sessions);
    },
    (error) => {
      console.error('Error listening to sessions:', error);
    }
  );
};

// Session Messages Services
export const subscribeToMessages = (
  userId: string,
  sessionId: string,
  callback: (messages: SessionMessage[]) => void
) => {
  if (!userId || !sessionId) return () => {};
  const messagesRef = collection(db, 'users', userId, 'sessions', sessionId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: SessionMessage[] = [];
      snapshot.forEach((docSnap) => {
        messages.push({ id: docSnap.id, ...docSnap.data() } as SessionMessage);
      });
      callback(messages);
    },
    (error) => {
      console.error('Error listening to messages:', error);
    }
  );
};

export const addMessageToSession = async (
  userId: string,
  sessionId: string,
  message: Omit<SessionMessage, 'id' | 'createdAt'>
) => {
  if (!userId || !sessionId) return;
  const messagesRef = collection(db, 'users', userId, 'sessions', sessionId, 'messages');
  
  // Clean undefined fields so Firestore addDoc doesn't throw invalid data errors
  const cleanMessage: Record<string, any> = {
    ...message,
    createdAt: new Date().toISOString(),
  };
  Object.keys(cleanMessage).forEach((key) => {
    if (cleanMessage[key] === undefined) {
      delete cleanMessage[key];
    }
  });

  const docRef = await addDoc(messagesRef, cleanMessage);

  // Update parent session updatedAt
  const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    updatedAt: new Date().toISOString(),
  });

  return docRef.id;
};

// Streak History Listener
export const subscribeToStreakHistory = (
  userId: string,
  callback: (streaks: StreakDay[]) => void
) => {
  if (!userId) return () => {};
  const streaksRef = collection(db, 'users', userId, 'streaks');
  const q = query(streaksRef, orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const streaks: StreakDay[] = [];
      snapshot.forEach((docSnap) => {
        streaks.push({ ...docSnap.data() } as StreakDay);
      });
      callback(streaks);
    },
    (error) => {
      console.error('Error listening to streak history:', error);
    }
  );
};
