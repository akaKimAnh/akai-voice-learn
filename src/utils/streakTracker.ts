import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

export const updateStreakOnActivity = async (userId: string): Promise<number> => {
  if (!userId) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return 1;

  const userData = userSnap.data() as UserProfile;
  const lastActiveDate = userData.lastActiveDate;
  let newStreak = userData.streakCount || 1;

  if (lastActiveDate === todayStr) {
    // Already active today
    newStreak = userData.streakCount || 1;
  } else if (lastActiveDate) {
    const todayDate = new Date(todayStr + 'T00:00:00Z');
    const lastDate = new Date(lastActiveDate + 'T00:00:00Z');

    const diffMs = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      newStreak = (userData.streakCount || 0) + 1;
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  // Update profile
  await updateDoc(userRef, {
    streakCount: newStreak,
    lastActiveDate: todayStr,
  });

  // Mark today's check-in in Firestore streak history
  const streakHistoryRef = doc(db, 'users', userId, 'streaks', todayStr);
  await setDoc(streakHistoryRef, {
    date: todayStr,
    checkedIn: true,
    timestamp: new Date().toISOString(),
  }, { merge: true });

  return newStreak;
};
