import { GoogleGenAI } from '@google/genai';

export const getClientApiKey = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('GEMINI_API_KEY') || localStorage.getItem('VITE_GEMINI_API_KEY');
    if (stored) return stored.trim();
  }
  const meta = import.meta as any;
  return meta.env?.VITE_GEMINI_API_KEY || meta.env?.GEMINI_API_KEY || '';
};

export const setClientApiKey = (key: string) => {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('GEMINI_API_KEY', key.trim());
    } else {
      localStorage.removeItem('GEMINI_API_KEY');
    }
  }
};

// Intelligent dynamic fallback interview response generator when offline or no API key
const generateSmartInterviewFallback = (
  userText: string,
  topic: string,
  turnCount: number,
  language: 'en' | 'vi' = 'en'
) => {
  const lower = userText.toLowerCase();

  let text = '';
  let feedback = {
    type: 'good' as const,
    title: language === 'vi' ? 'Phát âm & Nhịp điệu tốt' : 'Good flow & phrasing',
    detail: language === 'vi' 
      ? 'Bạn đã trả lời tự nhiên. Hãy tiếp tục đào sâu vào chi tiết công việc hoặc số liệu cụ thể.' 
      : 'Clear and natural delivery. Try adding specific metrics or project outcomes.',
  };

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('morning') || turnCount <= 1) {
    text = `Welcome to your ${topic} session! To begin, could you introduce yourself and tell me about your background?`;
    feedback.title = language === 'vi' ? 'Chào hỏi tự nhiên' : 'Friendly greeting';
    feedback.detail = language === 'vi' ? 'Khởi đầu tốt! Hãy nêu bật thế mạnh chính của bạn.' : 'Great start! Highlight your core strengths.';
  } else if (lower.includes('project') || lower.includes('experience') || lower.includes('work') || lower.includes('built')) {
    text = `That's very interesting experience! What was the biggest challenge you encountered during that project, and how did your team solve it?`;
    feedback.title = language === 'vi' ? 'STAR Method' : 'STAR Method';
    feedback.detail = language === 'vi' ? 'Rất tốt! Sử dụng phương pháp STAR (Tình huống, Nhiệm vụ, Hành động, Kết quả) sẽ giúp câu trả lời sắc bén hơn.' : 'Nice! Frame your answer using STAR (Situation, Task, Action, Result) for maximum impact.';
  } else if (lower.includes('challenge') || lower.includes('difficult') || lower.includes('problem') || lower.includes('bug')) {
    text = `Handling obstacles effectively is key. What measurable results or lessons did you achieve after implementing that solution?`;
    feedback.title = language === 'vi' ? 'Tư duy giải quyết vấn đề' : 'Problem solving';
    feedback.detail = language === 'vi' ? 'Rõ ràng và mạch lạc. Tiếp tục giữ vững sự tự tin khi nói.' : 'Structured and clear. Keep up the confident cadence.';
  } else if (lower.includes('strength') || lower.includes('skill') || lower.includes('good at')) {
    text = `Those skills are highly valuable for this role. Can you share an example of how you used them to help a team succeed?`;
  } else if (lower.includes('weakness') || lower.includes('improve') || lower.includes('learn')) {
    text = `Self-awareness is a great trait. What proactive steps are you currently taking to continually grow in that area?`;
    feedback.title = language === 'vi' ? 'Thái độ tích cực' : 'Positive mindset';
    feedback.detail = language === 'vi' ? 'Cách tiếp cận vấn đề chân thực và cầu tiến.' : 'Honest and constructive approach to personal development.';
  } else {
    const followUps = [
      `Thank you for sharing that insight. How do you usually collaborate with cross-functional teams when deadlines are tight?`,
      `That sounds very impactful. What technologies or methodologies did you find most effective in that scenario?`,
      `Great perspective! If you were to do that again today, what would you optimize or do differently?`,
      `Understood. How do you stay updated with the latest industry trends and best practices in your domain?`,
    ];
    text = followUps[turnCount % followUps.length];
  }

  return { text, feedback };
};

export const callGeminiChatClient = async (params: {
  messages: Array<{ role: string; text: string }>;
  topic?: string;
  customJD?: string;
  language?: 'en' | 'vi';
}) => {
  const apiKey = getClientApiKey();
  const { messages = [], topic = 'General Practice', customJD, language = 'en' } = params;

  if (!apiKey) {
    console.info('No Gemini API Key set, using smart conversational engine.');
    const lastUserMsg = messages[messages.length - 1]?.text || '';
    return generateSmartInterviewFallback(lastUserMsg, topic, messages.length, language);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const langInstruction = language === 'vi' 
      ? "The user's UI preference is Vietnamese ('vi'). Speak naturally in spoken English for conversational fluency practice, but provide the feedback title & details in clear, helpful Vietnamese."
      : "The user's UI preference is English ('en'). Keep feedback notes concise in English.";

    const systemPrompt = `You are "AKAI Interviewer & Voice Coach", a friendly, encouraging AI practice partner for English communication and mock job interviews.
Topic: "${topic}".
${customJD ? `Target Job Description / Context: "${customJD}". Ask relevant professional interview questions based on this JD.` : 'Keep conversations interactive, engaging, and focused on natural speaking flow.'}
Language instruction: ${langInstruction}

Instructions:
1. Respond naturally in 2-3 spoken-style English sentences (conversational, easy to listen via audio TTS).
2. Always ask a relevant follow-up question to keep the conversation going.
3. Provide a constructive feedback note (1-2 sentences) evaluating fluency, grammar, or phrasing.`;

    const contents = (messages || []).map((m) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: `Hello! I am ready for our ${topic} session.` }],
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

    let feedback: { type: 'good' | 'improvement' | 'grammar'; title: string; detail: string } = {
      type: 'good',
      title: language === 'vi' ? 'Lưu loát tốt' : 'Good flow',
      detail: language === 'vi' ? 'Câu trả lời rõ ràng và nhịp điệu tự nhiên.' : 'Clear response and natural pacing.',
    };

    if (responseText.toLowerCase().includes('recommend') || responseText.toLowerCase().includes('note') || responseText.toLowerCase().includes('improve')) {
      feedback = {
        type: 'improvement',
        title: language === 'vi' ? 'Gợi ý nâng cao' : 'Fluency Tip',
        detail: language === 'vi' ? 'Thử mở rộng thêm các ví dụ thực tế hoặc từ vựng chuyên ngành.' : 'Try expanding with specific real-world examples or industry keywords.',
      };
    }

    return {
      text: responseText,
      feedback,
    };
  } catch (error) {
    console.warn('Gemini API call failed, falling back to smart conversational engine:', error);
    const lastUserMsg = messages[messages.length - 1]?.text || '';
    return generateSmartInterviewFallback(lastUserMsg, topic, messages.length, language);
  }
};

export const lookupWordClient = async (word: string) => {
  const apiKey = getClientApiKey();
  const cleanWord = word.replace(/[^a-zA-Z]/g, '').trim();

  if (!apiKey) {
    return {
      word: cleanWord,
      ipa: `/${cleanWord.toLowerCase()}/`,
      partOfSpeech: 'vocabulary',
      meaning: `Từ vựng tiếng Anh trong chủ đề giao tiếp / phỏng vấn`,
      example: `Used in professional conversation: "${cleanWord}".`,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Provide precise dictionary data for the English word "${cleanWord}".
Return ONLY a valid JSON object in this exact schema with no markdown code blocks:
{
  "word": "${cleanWord}",
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
    return JSON.parse(cleaned);
  } catch {
    return {
      word: cleanWord,
      ipa: `/${cleanWord.toLowerCase()}/`,
      partOfSpeech: 'vocabulary',
      meaning: `Từ vựng tiếng Anh`,
      example: `Key term: ${cleanWord}.`,
    };
  }
};
