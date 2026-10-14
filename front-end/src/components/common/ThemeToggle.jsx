import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ showLabel = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={showLabel
        ? 'btn-secondary w-full py-3 justify-center'
        : 'p-2 text-ink-secondary hover:text-accent bg-muted border border-border transition-colors'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {showLabel && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
};

export default ThemeToggle;
