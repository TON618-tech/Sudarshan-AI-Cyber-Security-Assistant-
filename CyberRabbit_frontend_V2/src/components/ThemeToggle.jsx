import React from 'react';
import { useTheme } from '../hooks/useTheme.js';

function ThemeToggle() {
  const { theme, setTheme, appliedTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently system, switch to the opposite of what's visually applied
      // to ensure every click causes a visual change (avoids "double click" dead zones)
      setTheme(appliedTheme === 'dark' ? 'light' : 'dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('system');
    }
  };

  return (
    <button 
      className={`theme-toggle theme-${theme} applied-${appliedTheme}`} 
      onClick={toggleTheme}
      aria-label={`Toggle theme (Current: ${theme})`}
      title={`Theme: ${theme}`}
    >
      <div className="chakra-glow" />
      <svg className="chakra-svg" viewBox="0 0 24 24" fill="none" stroke={theme === 'system' ? "url(#systemGradient)" : "currentColor"} strokeWidth="1.5">
        <defs>
          <linearGradient id="systemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="var(--color-indigo, #443199)" />
            <stop offset="50%" stopColor="var(--text-secondary, #4b5563)" />
          </linearGradient>
        </defs>
        {/* Outer Ring */}
        <circle cx="12" cy="12" r="9" />
        {/* Inner Hub */}
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        {/* 8 Spokes */}
        <path d="M12 3v6.5m0 5v6.5M3 12h6.5m5 0h6.5M5.636 5.636l4.596 4.596m3.536 3.536l4.596 4.596M5.636 18.364l4.596-4.596m3.536-3.536l4.596-4.596" strokeLinecap="round" />
      </svg>
      {/* System indicator dot */}
      {theme === 'system' && <span className="system-dot" />}
    </button>
  );
}

export default ThemeToggle;
