import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { AkaiLogoMark } from './Logo';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter your full name.');
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Auth Error Details:', err);
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (err?.code === 'auth/email-already-in-use') {
        setError('Email này đã được đăng ký tài khoản.');
      } else if (err?.code === 'auth/weak-password') {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
      } else if (err?.code === 'auth/operation-not-allowed') {
        setError('Phương thức đăng nhập Email/Password chưa được bật trong Firebase Console.');
      } else if (err?.code === 'auth/unauthorized-domain') {
        setError('Tên miền này (akakimanh.github.io) chưa được thêm vào Authorized Domains trong Firebase Console.');
      } else {
        setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign-In Error Details:', err);
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        return;
      }
      if (err?.code === 'auth/popup-blocked') {
        setError('Cửa sổ đăng nhập Google bị trình duyệt chặn (Popup blocked). Vui lòng cho phép popup.');
        return;
      }
      if (err?.code === 'auth/unauthorized-domain') {
        setError('Lỗi tên miền: Vui lòng thêm "akakimanh.github.io" vào mục Authorized Domains trong Firebase Authentication -> Settings.');
        return;
      }
      if (err?.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In chưa được bật trong Firebase Console (Authentication -> Sign-in method).');
        return;
      }
      setError(err?.message ? `Đăng nhập Google thất bại: ${err.message}` : 'Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans text-slate-800 relative">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative">
        {/* Top Floating Language Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageToggle variant="light" />
        </div>

        {/* Left Side: Brand Hero Banner */}
        <div className="bg-[#0D9488] p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-teal-100 p-2">
              <AkaiLogoMark size={48} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal-100">{t.heroBadge}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1 mb-3 tracking-tight">{t.heroTitle}</h1>
            <p className="text-teal-50 text-sm md:text-base opacity-90 leading-relaxed font-medium">
              {t.heroDesc}
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 hidden md:block">
            <div className="flex items-center gap-3 mb-2 text-xs font-semibold text-teal-100">
              <CheckCircle2 size={16} className="text-teal-200" />
              <span>{t.feature1}</span>
            </div>
            <div className="flex items-center gap-3 mb-2 text-xs font-semibold text-teal-100">
              <CheckCircle2 size={16} className="text-teal-200" />
              <span>{t.feature2}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-teal-100">
              <CheckCircle2 size={16} className="text-teal-200" />
              <span>{t.feature3}</span>
            </div>
          </div>

          <div className="text-teal-100/70 text-[10px] uppercase font-bold tracking-widest mt-6">
            Protected by Firebase Auth
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-6 md:p-10 flex flex-col justify-center gap-4 pt-12 md:pt-10">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-slate-800">
              {isSignUp ? t.signupWelcome : t.loginWelcome}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {isSignUp ? t.signupDesc : t.loginDesc}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Google Sign-In Primary CTA */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-[#0D9488] rounded-2xl font-bold text-sm text-slate-800 flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-98"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.26v3.15C3.26 21.3 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.2.01 10.05.01 12c0 1.95.45 3.8 1.25 5.39l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.26 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>{t.continueWithGoogle}</span>
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.orEmail}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 focus:border-[#0D9488] focus:bg-white focus:outline-none text-sm text-slate-800"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="email"
                required
                placeholder={t.emailLabel}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 focus:border-[#0D9488] focus:bg-white focus:outline-none text-sm text-slate-800"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="password"
                required
                placeholder={t.passwordLabel}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 focus:border-[#0D9488] focus:bg-white focus:outline-none text-sm text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-900/10 transition-all active:scale-98 mt-1"
            >
              <span>{isSignUp ? t.signUpBtn : t.signInBtn}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Toggle Sign-In / Sign-Up */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#0D9488] font-bold hover:underline"
            >
              {isSignUp ? `${t.hasAccountText} ${t.signInLink}` : `${t.noAccountText} ${t.signUpLink}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
