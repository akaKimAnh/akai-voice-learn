import { useState, useEffect, useRef, useCallback } from 'react';
import { addMessageToSession, subscribeToMessages } from '../services/firestoreService';
import { updateStreakOnActivity } from '../utils/streakTracker';
import { SessionMessage, WordLookupResult } from '../types';
import { callGeminiChatClient, lookupWordClient } from '../services/geminiClientService';

export const useRealtimeVoiceChat = (
  userId: string | undefined,
  sessionId: string | undefined,
  topic: string = 'Job Interview',
  customJD: string = '',
  language: 'en' | 'vi' = 'en'
) => {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordLookupResult | null>(null);
  const [loadingWord, setLoadingWord] = useState<false | boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  // Subscribe to real-time Firestore messages
  useEffect(() => {
    if (!userId || !sessionId) return;
    const unsubscribe = subscribeToMessages(userId, sessionId, (fetchedMessages) => {
      if (fetchedMessages && fetchedMessages.length > 0) {
        setMessages(fetchedMessages);
      }
    });
    return () => unsubscribe();
  }, [userId, sessionId]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setTranscript(currentTranscript);
          transcriptRef.current = currentTranscript;
          setSpeechError(null);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access was denied. Please allow microphone permission in your browser or switch to text mode.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Speech recognition issue (${event.error}). Try typing your response.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const text = transcriptRef.current?.trim();
        if (text) {
          transcriptRef.current = '';
          setTranscript('');
          sendMessage(text);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [userId, sessionId, topic, customJD, language]);

  // Text-to-speech synthesis
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS speak error:', e);
    }
  }, []);

  // Send message to Gemini and save to Firestore
  const sendMessage = async (userText: string) => {
    const trimmed = userText?.trim();
    if (!trimmed) return;

    setTranscript('');
    transcriptRef.current = '';
    setLoadingAi(true);

    // Optimistically add user message immediately so it NEVER disappears
    const tempUserMsgId = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const userMsg: SessionMessage = {
      id: tempUserMsgId,
      role: 'user',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Save user message to Firestore in background
    if (userId && sessionId) {
      try {
        await addMessageToSession(userId, sessionId, {
          role: 'user',
          text: trimmed,
        });
        await updateStreakOnActivity(userId).catch(() => {});
      } catch (e) {
        console.warn('Firestore user message write error:', e);
      }
    }

    try {
      let data: any = null;
      try {
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            topic,
            customJD,
            language,
          }),
        });
        if (response.ok) {
          data = await response.json();
        }
      } catch (fetchErr) {
        console.warn('Backend API endpoint unavailable, attempting client-side Gemini fallback:', fetchErr);
      }

      // Client-side fallback if server API is unavailable or returns error (e.g. static GitHub Pages)
      if (!data || !data.text) {
        data = await callGeminiChatClient({
          messages: [...messages, userMsg],
          topic,
          customJD,
          language,
        });
      }

      const aiText = data.text || "That sounds impactful! Could you describe another detail?";

      // Optimistically add AI response to UI
      const tempAiMsgId = 'ai-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const aiMsg: SessionMessage = {
        id: tempAiMsgId,
        role: 'model',
        text: aiText,
        feedback: data.feedback,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Save AI message to Firestore in background
      if (userId && sessionId) {
        try {
          await addMessageToSession(userId, sessionId, {
            role: 'model',
            text: aiText,
            feedback: data.feedback,
          });
        } catch (e) {
          console.warn('Firestore AI message write error:', e);
        }
      }

      // Play audio response
      speakText(aiText);
    } catch (error) {
      console.error('Failed to get Gemini response:', error);
      const fallbackText = "Thank you for sharing that. Could you describe another key achievement or project?";
      const fallbackAiMsg: SessionMessage = {
        id: 'ai-fallback-' + Date.now(),
        role: 'model',
        text: fallbackText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
      speakText(fallbackText);
    } finally {
      setLoadingAi(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      transcriptRef.current = '';
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition already active:', e);
      }
    } else {
      // Prompt for voice input text fallback if speech API unavailable
      const fallbackInput = prompt('Browser mic stream unavailable. Type your voice response:');
      if (fallbackInput) {
        sendMessage(fallbackInput);
      }
    }
  };

  const stopListeningAndSend = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    }
    setIsListening(false);
    const text = transcriptRef.current?.trim() || transcript?.trim();
    if (text) {
      transcriptRef.current = '';
      setTranscript('');
      sendMessage(text);
    }
  };

  // Word lookup function
  const lookupWord = async (word: string) => {
    if (!word) return;
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').trim();
    if (!cleanWord) return;

    setLoadingWord(true);
    try {
      let data: any = null;
      try {
        const res = await fetch('/api/dictionary/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word: cleanWord }),
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch (err) {
        console.warn('Backend dictionary API unavailable, using client-side Gemini lookup:', err);
      }

      if (!data || !data.ipa) {
        data = await lookupWordClient(cleanWord);
      }

      setSelectedWord(data);
    } catch (e) {
      setSelectedWord({
        word: cleanWord,
        ipa: `/${cleanWord.toLowerCase()}/`,
        partOfSpeech: 'noun',
        meaning: 'Từ vựng tiếng Anh',
        example: `Used in ${topic}`,
      });
    } finally {
      setLoadingWord(false);
    }
  };

  const clearSelectedWord = () => setSelectedWord(null);

  return {
    messages,
    isListening,
    isSpeaking,
    transcript,
    loadingAi,
    selectedWord,
    loadingWord,
    speechError,
    startListening,
    stopListeningAndSend,
    sendMessage,
    speakText,
    lookupWord,
    clearSelectedWord,
  };
};
