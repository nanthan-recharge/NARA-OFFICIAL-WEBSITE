import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';

/**
 * Language Selector Component for Library PDFs
 * Allows users to switch between English, Tamil, and Sinhala translations
 */
const LanguageSelector = ({ book, onLanguageChange }) => {
  const [selectedLang, setSelectedLang] = useState('english');

  // Available languages configuration
  const languages = [
    {
      code: 'english',
      name: 'English',
      flag: '🇬🇧',
      url: book.url,
      available: !!book.url
    },
    {
      code: 'tamil',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      url: book.translations?.tamil?.url,
      available: !!book.translations?.tamil?.url
    },
    {
      code: 'sinhala',
      name: 'Sinhala',
      nativeName: 'සිංහල',
      flag: '🇱🇰',
      url: book.translations?.sinhala?.url,
      available: !!book.translations?.sinhala?.url
    }
  ];

  // Filter to only show available languages
  const availableLanguages = languages.filter(lang => lang.available);
  const baseButtonClasses = `
    relative px-5 py-2.5 rounded-lg font-semibold transition-all duration-200
    flex items-center gap-2 min-w-[120px] justify-center tracking-wide
  `;
  const activeButtonClasses = `
    bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg
    scale-105 transform ring-2 ring-offset-2 ring-offset-indigo-200 ring-purple-400/60
    dark:ring-offset-slate-900
  `;
  const inactiveButtonClasses = `
    bg-white text-indigo-900 hover:bg-indigo-50 hover:scale-105 border border-indigo-200
    shadow-sm dark:bg-slate-800/80 dark:text-indigo-100 dark:border-indigo-500/40
    dark:hover:bg-slate-700/80 dark:shadow-indigo-900/40
  `;

  const handleLanguageChange = (lang) => {
    if (!lang.available) return;

    setSelectedLang(lang.code);

    if (onLanguageChange) {
      onLanguageChange(lang.url, lang.code, lang.name);
    }
  };

  // Don't show selector if only English is available
  if (availableLanguages.length <= 1) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-indigo-100 dark:from-slate-900/80 dark:to-slate-800/80 dark:border-slate-700">
      <div className="flex items-center justify-between">
        {/* Label */}
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
          <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
            Read in your language:
          </span>
        </div>

        {/* Language Buttons */}
        <div className="flex gap-2">
          {availableLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`
                ${baseButtonClasses}
                ${selectedLang === lang.code ? activeButtonClasses : inactiveButtonClasses}
              `}
              disabled={!lang.available}
            >
              {/* Flag */}
              <span className="text-xl">{lang.flag}</span>

              {/* Language Name */}
              <span className="text-sm">
                {lang.nativeName || lang.name}
              </span>

              {/* Selected Indicator */}
              {selectedLang === lang.code && (
                <Check className="w-4 h-4 ml-1 text-white drop-shadow-sm" />
              )}

              {/* Machine Translation Badge */}
              {lang.code !== 'english' && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm dark:bg-amber-300">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Note */}
      {selectedLang !== 'english' && (
        <div className="mt-3 pt-3 border-t border-indigo-100">
          <p className="text-xs text-indigo-800 flex items-center gap-1 dark:text-indigo-200">
            <span className="text-yellow-600 dark:text-yellow-300">⚡</span>
            <span>
              Machine-translated for reference. Original English version available above.
            </span>
          </p>
        </div>
      )}

      {/* Coming Soon Badge for missing translations */}
      {book.url && !book.translations && (
        <div className="mt-3 pt-3 border-t border-indigo-100">
          <p className="text-xs text-indigo-600 flex items-center gap-1 dark:text-indigo-300">
            <span>🌐</span>
            <span className="font-medium">
              Tamil & Sinhala translations coming soon!
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
