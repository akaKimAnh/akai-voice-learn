import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'vi';

export interface Translations {
  // Brand & General
  brandName: string;
  brandSubtitle: string;
  loading: string;
  
  // Auth / Login
  loginWelcome: string;
  signupWelcome: string;
  loginDesc: string;
  signupDesc: string;
  continueWithGoogle: string;
  orEmail: string;
  emailLabel: string;
  passwordLabel: string;
  signInBtn: string;
  signUpBtn: string;
  noAccountText: string;
  hasAccountText: string;
  signUpLink: string;
  signInLink: string;
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  feature1: string;
  feature2: string;
  feature3: string;

  // Header / Nav
  dashboardTab: string;
  exploreTab: string;
  vaultTab: string;
  profileTab: string;
  logOut: string;
  activeStreak: string;
  days: string;
  welcomeBack: string;

  // Dashboard Home
  weeklyActivity: string;
  dailyHabit: string;
  vocabVaultMetric: string;
  fluencyMetric: string;
  wordsCount: string;
  startVoicePractice: string;
  startVoiceSub: string;
  practiceWithJd: string;
  practiceWithJdSub: string;
  initializingAi: string;
  featuredScenarios: string;
  selectContext: string;
  seeAllScenarios: string;
  practiceNow: string;
  coffeeShopTitle: string;
  coffeeShopDesc: string;
  interviewTitle: string;
  interviewDesc: string;
  airportTitle: string;
  airportDesc: string;
  customJdTitle: string;
  customJdDesc: string;
  uploadJdBtn: string;

  // Explore
  practiceLibrary: string;
  exploreScenariosTitle: string;
  behavioralInterviewTitle: string;
  behavioralInterviewDesc: string;
  coffeeSmallTalkTitle: string;
  coffeeSmallTalkDesc: string;
  airportHotelTitle: string;
  airportHotelDesc: string;

  // Vocabulary Vault
  vocabStorageTag: string;
  savedVaultTitle: string;
  vaultSubtitle: string;
  customAiInterview: string;
  customInterviewDesc: string;
  launchJdBtn: string;
  savedWordsTitle: string;
  savedTag: string;
  addWordBtn: string;
  noSavedWords: string;
  noSavedWordsSub: string;
  addCustomWord: string;
  wordLabel: string;
  ipaLabel: string;
  partOfSpeechLabel: string;
  meaningLabel: string;
  exampleLabel: string;
  saveToVaultBtn: string;
  cancelBtn: string;
  closeBtn: string;

  // Profile
  accountSettings: string;
  userProfileTitle: string;
  activeStreakLabel: string;
  vaultWordsLabel: string;
  logOutAccount: string;

  // Custom JD Modal
  tailoredMockInterview: string;
  customJdModalTitle: string;
  customJdModalDesc: string;
  jdPlaceholder: string;
  aiAnalyzeNotice: string;
  startAiInterviewBtn: string;

  // Voice Chat Room
  backToDashboard: string;
  liveSession: string;
  voiceChatWelcome: string;
  listeningText: string;
  geminiGenerating: string;
  listenPronunciation: string;
  saveToVault: string;
  switchToType: string;
  switchToVoice: string;
  tapToSpeak: string;
  typePlaceholder: string;
  suggestedHint: string;
  wordDefinition: string;
}

const translations: Record<Language, Translations> = {
  en: {
    brandName: 'AKAI Voice AI',
    brandSubtitle: 'English Coach',
    loading: 'Loading AKAI Voice AI...',

    loginWelcome: 'Welcome back',
    signupWelcome: 'Create your account',
    loginDesc: 'Sign in to continue your voice sessions',
    signupDesc: 'Start practicing your spoken English today',
    continueWithGoogle: 'Continue with Google',
    orEmail: 'or sign in with email',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    signInBtn: 'Sign In',
    signUpBtn: 'Create Account',
    noAccountText: "Don't have an account?",
    hasAccountText: 'Already have an account?',
    signUpLink: 'Sign Up',
    signInLink: 'Sign In',
    heroBadge: 'AI Voice Coach',
    heroTitle: 'AKAI Voice AI',
    heroDesc: 'Master Spoken English with Gemini 1.5 Real-time Voice Practice, interactive vocabulary translations, and instant feedback.',
    feature1: 'Real-time voice synthesis & speech feedback',
    feature2: 'Interactive vocabulary translation & vault storage',
    feature3: 'Custom job description mock interview practice',

    dashboardTab: 'Dashboard',
    exploreTab: 'Explore',
    vaultTab: 'Vocabulary Vault',
    profileTab: 'Profile',
    logOut: 'Log Out',
    activeStreak: 'Streak',
    days: 'Days',
    welcomeBack: 'Welcome back,',

    weeklyActivity: 'Weekly Practice Activity',
    dailyHabit: 'Daily Habit',
    vocabVaultMetric: 'VOCABULARY VAULT',
    fluencyMetric: 'SPEECH FLUENCY',
    wordsCount: 'words',
    startVoicePractice: 'Start AI Voice Practice',
    startVoiceSub: 'Real-time English conversation with Gemini 1.5',
    practiceWithJd: 'Practice with Custom JD',
    practiceWithJdSub: 'Paste job description to tailor interview questions',
    initializingAi: 'Initializing AI...',
    featuredScenarios: 'Featured Scenarios',
    selectContext: 'Select Practice Context',
    seeAllScenarios: 'See all scenarios',
    practiceNow: 'Practice now',
    coffeeShopTitle: 'Coffee Shop',
    coffeeShopDesc: 'Ordering food, drinks, and casual social dialogue.',
    interviewTitle: 'Job Interview',
    interviewDesc: 'Professional Q&A, STAR method, behavioral responses.',
    airportTitle: 'Airport & Hotel',
    airportDesc: 'Check-in process, directions, and travel inquiries.',
    customJdTitle: 'Custom JD Upload',
    customJdDesc: 'Paste job descriptions to build targeted question lists.',
    uploadJdBtn: 'Upload JD',

    practiceLibrary: 'Practice Library',
    exploreScenariosTitle: 'Explore AI Voice Scenarios',
    behavioralInterviewTitle: 'Technical & Behavioral Interview',
    behavioralInterviewDesc: 'Master STAR format answers & leadership questions',
    coffeeSmallTalkTitle: 'Coffee Shop Small Talk',
    coffeeSmallTalkDesc: 'Casual social dialogue, ordering, and small talk',
    airportHotelTitle: 'Airport & Hotel Check-in',
    airportHotelDesc: 'Travel English, asking directions, hotel check-in',

    vocabStorageTag: 'Vocabulary Storage',
    savedVaultTitle: 'Saved Vocabulary Vault',
    vaultSubtitle: 'Words collected during your AI voice sessions',
    customAiInterview: 'Custom AI Interview',
    customInterviewDesc: "Paste a Job Description (JD) to tailor the AI's questions to your target role.",
    launchJdBtn: 'Launch Custom Interview Setup',
    savedWordsTitle: 'Saved Words',
    savedTag: 'saved',
    addWordBtn: 'Add Word',
    noSavedWords: 'No saved words yet.',
    noSavedWordsSub: 'Tap words during any AI voice chat session to translate and save them to your vault!',
    addCustomWord: 'Add Custom Word',
    wordLabel: 'Word',
    ipaLabel: 'IPA Phonetic',
    partOfSpeechLabel: 'Part of Speech',
    meaningLabel: 'Vietnamese Meaning',
    exampleLabel: 'Example Sentence',
    saveToVaultBtn: 'Save to Vault',
    cancelBtn: 'Cancel',
    closeBtn: 'Close',

    accountSettings: 'Account Settings',
    userProfileTitle: 'User Profile',
    activeStreakLabel: 'Active Streak',
    vaultWordsLabel: 'Vault Words',
    logOutAccount: 'Log Out Account',

    tailoredMockInterview: 'Tailored Mock Interview',
    customJdModalTitle: 'Custom Job Description Interview',
    customJdModalDesc: "Paste a Job Description (JD) to tailor the AI's questions to your target role.",
    jdPlaceholder: 'Paste the job description (JD) here... e.g., Senior Frontend Engineer requirements, key responsibilities, tech stack...',
    aiAnalyzeNotice: 'AI will extract key requirements & ask relevant questions.',
    startAiInterviewBtn: 'Start AI Interview',

    backToDashboard: 'Back to Dashboard',
    liveSession: 'LIVE SESSION',
    voiceChatWelcome: 'Welcome to your {topic} practice session! Tap the mic button below to start speaking. Tap underlined words to translate & save to Vault.',
    listeningText: 'Listening to your voice...',
    geminiGenerating: 'Gemini AI is processing response...',
    listenPronunciation: 'Listen Pronunciation',
    saveToVault: 'Save to Vault',
    switchToType: 'Switch to Type',
    switchToVoice: 'Switch to Voice',
    tapToSpeak: 'Tap Mic to Speak',
    typePlaceholder: 'Type your response...',
    suggestedHint: 'Suggested Speaking Hint',
    wordDefinition: 'Definition',
  },
  vi: {
    brandName: 'AKAI Voice AI',
    brandSubtitle: 'Gia Sư Tiếng Anh AI',
    loading: 'Đang tải AKAI Voice AI...',

    loginWelcome: 'Chào mừng trở lại',
    signupWelcome: 'Tạo tài khoản mới',
    loginDesc: 'Đăng nhập để tiếp tục buổi luyện nói',
    signupDesc: 'Bắt đầu luyện nói tiếng Anh ngay hôm nay',
    continueWithGoogle: 'Đăng nhập bằng Google',
    orEmail: 'hoặc đăng nhập bằng Email',
    emailLabel: 'Địa chỉ Email',
    passwordLabel: 'Mật khẩu',
    signInBtn: 'Đăng Nhập',
    signUpBtn: 'Đăng Ký Tài Khoản',
    noAccountText: 'Chưa có tài khoản?',
    hasAccountText: 'Đã có tài khoản?',
    signUpLink: 'Đăng Ký',
    signInLink: 'Đăng Nhập',
    heroBadge: 'Gia Sư Nói AI',
    heroTitle: 'AKAI Voice AI',
    heroDesc: 'Luyện làm chủ tiếng Anh giao tiếp với AI Gemini 1.5 theo thời gian thực, dịch từ vựng tương tác và phản hồi tức thì.',
    feature1: 'Tổng hợp giọng nói & phản hồi phát âm thời gian thực',
    feature2: 'Tra từ vựng tương tác & lưu vào kho từ cá nhân',
    feature3: 'Luyện phỏng vấn thử theo mô tả công việc (JD) tùy chỉnh',

    dashboardTab: 'Bảng Điều Khiển',
    exploreTab: 'Khám Phá',
    vaultTab: 'Kho Từ Vựng',
    profileTab: 'Cá Nhân',
    logOut: 'Đăng Xuất',
    activeStreak: 'Chuỗi',
    days: 'Ngày',
    welcomeBack: 'Chào mừng trở lại,',

    weeklyActivity: 'Hoạt Động Luyện Tập Tuần',
    dailyHabit: 'Thói Quản Hằng Ngày',
    vocabVaultMetric: 'KHO TỪ VỰNG',
    fluencyMetric: 'ĐỘ LƯU LOÁT',
    wordsCount: 'từ vựng',
    startVoicePractice: 'Bắt Đầu Luyện Nói AI',
    startVoiceSub: 'Hội thoại tiếng Anh thời gian thực cùng Gemini 1.5',
    practiceWithJd: 'Luyện Phỏng Vấn Theo JD',
    practiceWithJdSub: 'Dán mô tả công việc để tạo câu hỏi phỏng vấn chuẩn',
    initializingAi: 'Đang khởi tạo AI...',
    featuredScenarios: 'Tình Huống Nổi Bật',
    selectContext: 'Chọn Tình Huống Luyện Tập',
    seeAllScenarios: 'Xem tất cả tình huống',
    practiceNow: 'Luyện tập ngay',
    coffeeShopTitle: 'Quán Cà Phê',
    coffeeShopDesc: 'Gọi món, thức uống và giao tiếp xã giao hằng ngày.',
    interviewTitle: 'Phỏng Vấn Xin Việc',
    interviewDesc: 'Hỏi đáp chuyên nghiệp, phương pháp STAR, hành vi.',
    airportTitle: 'Sân Bay & Khách Sạn',
    airportDesc: 'Thủ tục check-in, hỏi đường và thông tin du lịch.',
    customJdTitle: 'Tải JD Tùy Chỉnh',
    customJdDesc: 'Dán JD công việc để tạo bộ câu hỏi tập trung.',
    uploadJdBtn: 'Tải JD Lên',

    practiceLibrary: 'Thư Viện Luyện Tập',
    exploreScenariosTitle: 'Khám Phá Tình Huống Nói AI',
    behavioralInterviewTitle: 'Phỏng Vấn Kỹ Thuật & Hành Vi',
    behavioralInterviewDesc: 'Làm chủ câu trả lời theo cấu trúc STAR & câu hỏi lãnh đạo',
    coffeeSmallTalkTitle: 'Trò Chuyện Tại Quán Cà Phê',
    coffeeSmallTalkDesc: 'Giao tiếp xã giao, gọi món và trò chuyện thân mật',
    airportHotelTitle: 'Check-in Sân Bay & Khách Sạn',
    airportHotelDesc: 'Tiếng Anh du lịch, hỏi đường và nhận phòng khách sạn',

    vocabStorageTag: 'Lưu Trữ Từ Vựng',
    savedVaultTitle: 'Kho Từ Vựng Đã Lưu',
    vaultSubtitle: 'Các từ vựng bạn thu thập được trong buổi luyện nói AI',
    customAiInterview: 'Phỏng Vấn AI Tùy Chỉnh',
    customInterviewDesc: 'Dán Mô Tả Công Việc (JD) để AI điều chỉnh câu hỏi sát thực tế.',
    launchJdBtn: 'Mở Cấu Hình Phỏng Vấn JD',
    savedWordsTitle: 'Từ Đã Lưu',
    savedTag: 'đã lưu',
    addWordBtn: 'Thêm Từ',
    noSavedWords: 'Chưa có từ vựng nào được lưu.',
    noSavedWordsSub: 'Chạm vào từ gạch chân trong buổi thoại AI để dịch và lưu vào kho từ!',
    addCustomWord: 'Thêm Từ Mới',
    wordLabel: 'Từ Vựng',
    ipaLabel: 'Phiên Âm IPA',
    partOfSpeechLabel: 'Từ Loại',
    meaningLabel: 'Nghĩa Tiếng Việt',
    exampleLabel: 'Câu Ví Dụ',
    saveToVaultBtn: 'Lưu Vào Kho',
    cancelBtn: 'Hủy',
    closeBtn: 'Đóng',

    accountSettings: 'Cài Đặt Tài Khoản',
    userProfileTitle: 'Hồ Sơ Người Dùng',
    activeStreakLabel: 'Chuỗi Ngày Liên Tục',
    vaultWordsLabel: 'Từ Trong Kho',
    logOutAccount: 'Đăng Xuất Tài Khoản',

    tailoredMockInterview: 'Phỏng Vấn Thử Tùy Chỉnh',
    customJdModalTitle: 'Phỏng Vấn Theo Mô Tả Công Việc (JD)',
    customJdModalDesc: 'Dán Mô Tả Công Việc (JD) để AI xây dựng bộ câu hỏi chuẩn nhất.',
    jdPlaceholder: 'Dán nội dung JD công việc vào đây... ví dụ: Yêu cầu Tuyển dụng Kỹ sư Frontend, trách nhiệm chính, công nghệ...',
    aiAnalyzeNotice: 'AI sẽ trích xuất yêu cầu chính & đặt câu hỏi phù hợp.',
    startAiInterviewBtn: 'Bắt Đầu Phỏng Vấn AI',

    backToDashboard: 'Quay Về Bảng Điều Khiển',
    liveSession: 'BUỔI TRỰC TIẾP',
    voiceChatWelcome: 'Chào mừng bạn đến với buổi luyện tập {topic}! Bấm nút micro bên dưới để bắt đầu nói. Bấm vào từ gạch chân để dịch & lưu vào Kho Từ.',
    listeningText: 'Đang lắng nghe giọng nói của bạn...',
    geminiGenerating: 'Gemini AI đang xử lý phản hồi...',
    listenPronunciation: 'Nghe Phát Âm',
    saveToVault: 'Lưu Vào Kho',
    switchToType: 'Chuyển Sang Nhập Chữ',
    switchToVoice: 'Chuyển Sang Giọng Nói',
    tapToSpeak: 'Bấm Micro Để Nói',
    typePlaceholder: 'Nhập câu trả lời của bạn...',
    suggestedHint: 'Gợi Ý Nối Câu',
    wordDefinition: 'Định nghĩa',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('akai_app_lang');
    return (saved === 'vi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('akai_app_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
