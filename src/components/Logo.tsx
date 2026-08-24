import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

/**
 * AKAI Symbol Icon (3D Teal Ribbon 'A' with Leaf accent)
 */
export const AkaiLogoMark: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Main Ribbon Gradient */}
        <linearGradient id="akaiRibbonGrad1" x1="20" y1="180" x2="180" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5C0" />
          <stop offset="45%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#005C58" />
        </linearGradient>

        <linearGradient id="akaiRibbonGrad2" x1="40" y1="140" x2="160" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0D0" />
          <stop offset="60%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>

        <linearGradient id="akaiLeafGrad" x1="140" y1="90" x2="185" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F2D5" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>

        <filter id="akaiShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F766E" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#akaiShadow)">
        {/* Left Arch & Apex */}
        <path
          d="M 32 152 C 20 158, 30 135, 48 105 L 86 42 C 94 28, 108 28, 116 42 L 152 102 C 165 125, 178 148, 168 152 C 156 156, 146 138, 134 118 L 102 65 C 100 62, 96 62, 94 65 L 62 118 C 50 138, 42 148, 32 152 Z"
          fill="url(#akaiRibbonGrad1)"
        />

        {/* Dynamic Sweeping Cross Ribbon */}
        <path
          d="M 28 152 C 55 122, 85 110, 118 112 C 145 114, 168 105, 180 92 C 172 118, 142 136, 112 134 C 82 132, 52 142, 28 152 Z"
          fill="url(#akaiRibbonGrad2)"
        />

        {/* Leaf Accent on the right top tip */}
        <path
          d="M 160 92 C 160 92, 175 75, 188 78 C 190 92, 175 110, 160 110 C 158 100, 156 94, 160 92 Z"
          fill="url(#akaiLeafGrad)"
        />
      </g>
    </svg>
  );
};

/**
 * AKAI Wordmark ("ΛKΛI") in styled rounded geometric font
 */
export const AkaiWordmark: React.FC<{
  className?: string;
  height?: number;
  color?: string;
}> = ({ className = '', height = 28, color = '#005357' }) => {
  return (
    <svg
      height={height}
      viewBox="0 0 280 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* First Λ (Inverted Chevron) */}
      <path
        d="M 15 65 L 42 18 C 45 12, 53 12, 56 18 L 83 65"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* K */}
      <path
        d="M 102 15 L 102 65"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 145 18 L 108 40 L 145 62"
        stroke={color}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Second Λ (Inverted Chevron) */}
      <path
        d="M 165 65 L 192 18 C 195 12, 203 12, 206 18 L 233 65"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* I */}
      <path
        d="M 258 15 L 258 65"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Complete AKAI Brand Logo (Mark + Wordmark)
 */
export const AkaiLogo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  showText = true,
  variant = 'light',
}) => {
  const textColor =
    variant === 'dark' ? '#2DD4BF' : variant === 'light' ? '#005357' : 'currentColor';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <AkaiLogoMark size={size} />
      {showText && <AkaiWordmark height={Math.round(size * 0.65)} color={textColor} />}
    </div>
  );
};

export default AkaiLogo;
