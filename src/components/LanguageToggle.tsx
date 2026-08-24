import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const USFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    className={`rounded-xs shadow-2xs overflow-hidden inline-block shrink-0 border border-black/10 ${className}`}
    viewBox="0 0 640 480"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#bd3d44" d="M0 0h640v480H0z" />
    <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640" />
    <path fill="#192f5d" d="M0 0h284.8v258.5H0z" />
    <g fill="#fff">
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(15,10)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(75,10)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(135,10)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(195,10)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(255,10)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(45,60)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(105,60)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(165,60)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(225,60)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(15,110)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(75,110)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(135,110)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(195,110)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(255,110)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(45,160)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(105,160)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(165,160)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(225,160)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(15,210)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(75,210)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(135,210)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(195,210)" />
      <polygon points="12,0 15,9 24,9 17,14 19,23 12,17 5,23 7,14 0,9 9,9" transform="scale(0.8) translate(255,210)" />
    </g>
  </svg>
);

export const VNFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    className={`rounded-xs shadow-2xs overflow-hidden inline-block shrink-0 border border-black/10 ${className}`}
    viewBox="0 0 300 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="300" height="200" fill="#DA251D" />
    <polygon
      points="150,40 163,82 207,82 171,108 185,150 150,124 115,150 129,108 93,82 137,82"
      fill="#FFFF00"
    />
  </svg>
);

interface LanguageToggleProps {
  className?: string;
  variant?: 'light' | 'dark' | 'glass';
  showText?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  variant = 'light',
  showText = true,
}) => {
  const { language, setLanguage } = useLanguage();

  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-slate-800 border-slate-700 text-slate-200';
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border-white/20 text-white';
      case 'light':
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl border text-xs font-bold transition-all ${getVariantStyles()} ${className}`}
    >
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
          language === 'en'
            ? 'bg-[#0D9488] text-white shadow-xs font-extrabold'
            : 'opacity-70 hover:opacity-100'
        }`}
        title="English (US)"
      >
        <USFlagIcon className="w-5 h-3.5" />
        {showText && <span>EN</span>}
      </button>
      <button
        onClick={() => setLanguage('vi')}
        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
          language === 'vi'
            ? 'bg-[#0D9488] text-white shadow-xs font-extrabold'
            : 'opacity-70 hover:opacity-100'
        }`}
        title="Tiếng Việt (VN)"
      >
        <VNFlagIcon className="w-5 h-3.5" />
        {showText && <span>VI</span>}
      </button>
    </div>
  );
};

