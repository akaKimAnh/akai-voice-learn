import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment variables');
    }
    return new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
  };

  // API Endpoint: Gemini Chat Response
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, topic, customJD, language = 'en' } = req.body;
      const ai = getAi();

      const langInstruction = language === 'vi' 
        ? "The user's UI preference is Vietnamese ('vi'). Speak primarily in English for voice conversation practice, but provide the feedback title & details in clear Vietnamese so the learner easily understands grammar and fluency tips."
        : "The user's UI preference is English ('en'). Keep feedback notes concise in English.";

      let systemPrompt = `You are "AKAI Interviewer & Voice Coach", a friendly and encouraging English AI practice partner for learners.
Topic: "${topic || 'General Practice'}".
${customJD ? `Target Job Description: "${customJD}". Ask relevant professional interview questions based on this JD.` : 'Keep conversations engaging, clear, and focused on natural speaking.'}
Language instruction: ${langInstruction}

Instructions:
1. Respond naturally in 2-3 spoken-style English sentences appropriate for a conversation.
2. Provide a constructive feedback note in 1 sentence if there's a grammar error or compliment good flow.
3. Keep the tone warm, clear, and tailored to professional development or real-world scenarios.`;

      const contents = (messages || []).map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      // If contents is empty, add initial prompt
      if (contents.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: `Hello! I am ready for our ${topic || 'English practice'} session.` }],
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "That sounds great! Could you elaborate a bit more on that?";

      // Generate brief feedback
      let feedback: { type: 'good' | 'improvement' | 'grammar'; title: string; detail: string } = {
        type: 'good',
        title: 'Good flow',
        detail: 'Clear response and natural pacing.',
      };

      if (responseText.toLowerCase().includes('recommend') || responseText.toLowerCase().includes('note')) {
        feedback = {
          type: 'improvement',
          title: 'Tip',
          detail: 'Try expanding with specific examples to make your answer even stronger.',
        };
      }

      res.json({
        text: responseText,
        feedback,
      });
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      res.status(500).json({
        text: "I'm sorry, I missed that. Could you repeat what you said?",
        error: error.message,
      });
    }
  });

  // API Endpoint: Word Lookup (IPA + Vietnamese Meaning)
  app.post('/api/dictionary/lookup', async (req, res) => {
    try {
      const { word } = req.body;
      if (!word) {
        return res.status(400).json({ error: 'Word parameter required' });
      }

      const ai = getAi();
      const prompt = `Provide precise dictionary data for the English word "${word}".
Return ONLY a valid JSON object in this exact schema with no extra code blocks or formatting:
{
  "word": "${word}",
  "ipa": "/.../",
  "partOfSpeech": "noun/verb/adjective/etc",
  "meaning": "Vietnamese definition of the word",
  "example": "A clear example sentence in English"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const rawText = response.text || '';
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

      try {
        const result = JSON.parse(cleaned);
        res.json(result);
      } catch {
        res.json({
          word,
          ipa: `/${word.toLowerCase()}/`,
          partOfSpeech: 'word',
          meaning: 'Từ vựng tiếng Anh',
          example: `Example with ${word}.`,
        });
      }
    } catch (error: any) {
      console.error('Dictionary Lookup Error:', error);
      res.json({
        word: req.body?.word || 'word',
        ipa: `/${(req.body?.word || '').toLowerCase()}/`,
        partOfSpeech: 'noun',
        meaning: 'Ý nghĩa từ vựng',
        example: `Using ${req.body?.word || 'this word'} in context.`,
      });
    }
  });

  // Serve Vite in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
