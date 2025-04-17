'use client'

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
    >
      {theme === 'dark' ? (
        <FaSun className="text-yellow-300 w-5 h-5" />
      ) : (
        <FaMoon className="text-blue-700 w-5 h-5" />
      )}
    </button>
  );
} 