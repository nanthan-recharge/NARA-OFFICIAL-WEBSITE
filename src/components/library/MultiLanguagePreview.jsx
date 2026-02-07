import React, { useState } from 'react';
import { Globe, Download, ExternalLink, Check, Languages } from 'lucide-react';

/**
 * Multi-Language Preview Component
 * Displays all 3 languages (English, Tamil, Sinhala) in tabs within the same view
 */
const MultiLanguagePreview = ({ book }) => {
  const [activeTab, setActiveTab] = useState('english');

  // Configure all available languages
  const languages = [
    {
      code: 'english',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      url: book.url,
      available: !!book.url,
      color: 'blue'
    },
    {
      code: 'tamil',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      url: book.translations?.tamil?.url,
      available: !!book.translations?.tamil?.url,
      color: 'orange'
    },
    {
      code: 'sinhala',
      name: 'Sinhala',
      nativeName: 'සිංහල',
      flag: '🇱🇰',
      url: book.translations?.sinhala?.url,
      available: !!book.translations?.sinhala?.url,
      color: 'green'
    }
  ];

  // Get available languages
  const availableLanguages = languages.filter(lang => lang.available);

  // Get current language object
  const currentLang = languages.find(lang => lang.code === activeTab);

  if (availableLanguages.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">No PDF available for this item</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header with Language Tabs */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Languages className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">
              Multi-Language Preview
            </h3>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <Globe className="w-4 h-4" />
            <span>{availableLanguages.length} language{availableLanguages.length > 1 ? 's' : ''} available</span>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => lang.available && setActiveTab(lang.code)}
              disabled={!lang.available}
              className={`
                relative px-6 py-3 rounded-lg font-semibold transition-all duration-200
                flex items-center gap-2 min-w-[140px] justify-center
                ${lang.available
                  ? activeTab === lang.code
                    ? 'bg-white text-indigo-700 shadow-lg transform scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30 hover:scale-102'
                  : 'bg-gray-400/20 text-gray-300 cursor-not-allowed opacity-50'
                }
              `}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{lang.nativeName}</span>
                <span className="text-xs opacity-80">{lang.name}</span>
              </div>

              {activeTab === lang.code && lang.available && (
                <Check className="w-4 h-4 ml-auto" />
              )}

              {!lang.available && (
                <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  N/A
                </span>
              )}

              {lang.code !== 'english' && lang.available && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Info Banner */}
        {activeTab !== 'english' && currentLang?.available && (
          <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-lg p-2">
            <p className="text-xs text-white flex items-center gap-2">
              <span className="text-yellow-300">⚡</span>
              <span>
                AI-translated by Google Gemini. Switch to English for original content.
              </span>
            </p>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      {currentLang?.available && (
        <div className="relative">
          {/* Action Bar */}
          <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Now viewing:</span>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-semibold">
                {currentLang.flag} {currentLang.nativeName}
              </span>
            </div>

            <div className="flex gap-2">
              <a
                href={currentLang.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2 font-medium transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
              <a
                href={currentLang.url}
                download
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2 font-medium transition"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>

          {/* PDF Viewer - Multiple Options */}
          <div className="bg-gray-100">
            {/* Option 1: Direct embed (works best) */}
            <iframe
              key={activeTab} // Force reload when changing language
              src={currentLang.url}
              className="w-full h-[800px] border-0"
              title={`PDF Viewer - ${book.title} (${currentLang.name})`}
              type="application/pdf"
            />

            {/* Fallback message if PDF doesn't display */}
            <div className="bg-blue-50 border-t border-blue-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Can't see the PDF?</strong> Try one of these options:
                </p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={`https://docs.google.com/viewer?url=${encodeURIComponent(currentLang.url)}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 font-medium transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View in Google Docs Viewer
                  </a>
                  <a
                    href={currentLang.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 flex items-center gap-2 font-medium transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open PDF Directly
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Language Switcher (bottom) */}
          <div className="bg-gray-50 border-t border-gray-200 p-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Quick switch:</span>
              {availableLanguages.map(lang => (
                <button
                  key={`quick-${lang.code}`}
                  onClick={() => setActiveTab(lang.code)}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm transition
                    flex items-center gap-2
                    ${activeTab === lang.code
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }
                  `}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Message */}
      {book.url && availableLanguages.length === 1 && (
        <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-indigo-100">
          <div className="text-center max-w-md mx-auto">
            <Globe className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              More Languages Coming Soon!
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Tamil and Sinhala translations are being processed by our AI translation system.
              Check back soon for multilingual access.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              <span className="animate-pulse">🤖</span>
              <span>Automated translation in progress</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiLanguagePreview;
