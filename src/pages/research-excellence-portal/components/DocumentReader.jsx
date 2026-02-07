import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

/**
 * 📱 BEAUTIFUL DOCUMENT READER
 * iPad-style viewer with 3 languages, zoom, font controls, dark mode
 */
const DocumentReader = ({ content, onBack }) => {
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [layout, setLayout] = useState('single'); // 'single' or 'compare'

  // Get content in current language
  const getCurrentContent = (lang) => ({
    title: content.title?.[lang] || content.title?.en || 'Untitled',
    description: content.description?.[lang] || content.description?.en || '',
    abstract: content.abstract?.[lang] || content.abstract?.en || '',
    authors: content.authors || [],
    category: content.category || '',
    keywords: content.keywords || [],
    publicationDate: content.publicationDate || '',
    journal: content.journal || '',
    doi: content.doi || '',
    pages: content.pages || '',
    volume: content.volume || '',
    issue: content.issue || ''
  });

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧', font: 'font-serif' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰', font: 'font-sans' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰', font: 'font-sans' }
  ];

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));
  const increaseZoom = () => setZoom(prev => Math.min(prev + 10, 200));
  const decreaseZoom = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-900 text-slate-100' 
        : 'bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 text-slate-900'
    }`}>
      {/* Top Control Bar */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        darkMode 
          ? 'bg-slate-800/95 border-slate-700' 
          : 'bg-white/95 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Back Button & Language Tabs */}
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                      : 'bg-white hover:bg-slate-100 text-slate-900'
                  }`}
                  title="Back to Standard View"
                >
                  <Icons.ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              <div className={`flex gap-2 p-1 rounded-xl ${
                darkMode ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setActiveLanguage(lang.code)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      activeLanguage === lang.code
                        ? darkMode 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-white text-blue-600 shadow-lg'
                        : darkMode
                          ? 'text-slate-300 hover:bg-slate-600'
                          : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Font Size Controls */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                <Icons.Type className="w-4 h-4" />
                <button
                  onClick={decreaseFontSize}
                  className={`p-1 rounded hover:bg-opacity-20 ${
                    darkMode ? 'hover:bg-white' : 'hover:bg-black'
                  }`}
                >
                  <Icons.Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-semibold w-8 text-center">{fontSize}</span>
                <button
                  onClick={increaseFontSize}
                  className={`p-1 rounded hover:bg-opacity-20 ${
                    darkMode ? 'hover:bg-white' : 'hover:bg-black'
                  }`}
                >
                  <Icons.Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                darkMode ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                <Icons.ZoomIn className="w-4 h-4" />
                <button
                  onClick={decreaseZoom}
                  className={`p-1 rounded hover:bg-opacity-20 ${
                    darkMode ? 'hover:bg-white' : 'hover:bg-black'
                  }`}
                >
                  <Icons.Minus className="w-4 h-4" />
                </button>
                <span className="font-mono font-semibold w-12 text-center">{zoom}%</span>
                <button
                  onClick={increaseZoom}
                  className={`p-1 rounded hover:bg-opacity-20 ${
                    darkMode ? 'hover:bg-white' : 'hover:bg-black'
                  }`}
                >
                  <Icons.Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Layout Toggle */}
              <button
                onClick={() => setLayout(layout === 'single' ? 'compare' : 'single')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  darkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
                title={layout === 'single' ? 'Compare Languages' : 'Single View'}
              >
                {layout === 'single' ? <Icons.Columns className="w-4 h-4" /> : <Icons.FileText className="w-4 h-4" />}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' 
                    : 'bg-slate-700 text-yellow-400 hover:bg-slate-800'
                }`}
              >
                {darkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-300"
        >
          {layout === 'single' ? (
            // Single Language View
            <SingleLanguageView 
              content={getCurrentContent(activeLanguage)}
              language={languages.find(l => l.code === activeLanguage)}
              fontSize={fontSize}
              darkMode={darkMode}
            />
          ) : (
            // Compare View (All 3 Languages)
            <CompareView 
              content={content}
              languages={languages}
              fontSize={fontSize}
              darkMode={darkMode}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Single Language View Component
const SingleLanguageView = ({ content, language, fontSize, darkMode }) => (
  <div className={`max-w-4xl mx-auto rounded-2xl shadow-2xl overflow-hidden ${
    darkMode ? 'bg-slate-800' : 'bg-white'
  }`}>
    <div className={`p-12 ${language.font}`} style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}>
      {/* Title */}
      <h1 className={`text-4xl font-bold mb-6 ${
        darkMode ? 'text-blue-400' : 'text-blue-600'
      }`} style={{ fontSize: `${fontSize * 2}px` }}>
        {content.title}
      </h1>

      {/* Metadata */}
      <div className={`mb-8 pb-6 border-b ${
        darkMode ? 'border-slate-700' : 'border-slate-200'
      }`}>
        {content.authors.length > 0 && (
          <p className={`mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong>Authors:</strong> {content.authors.join(', ')}
          </p>
        )}
        {content.journal && (
          <p className={`mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong>Journal:</strong> {content.journal}
            {content.volume && ` ${content.volume}`}
            {content.issue && `(${content.issue})`}
            {content.pages && `, pp. ${content.pages}`}
          </p>
        )}
        {content.publicationDate && (
          <p className={`mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong>Published:</strong> {new Date(content.publicationDate).toLocaleDateString()}
          </p>
        )}
        {content.doi && (
          <p className={`mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong>DOI:</strong> {content.doi}
          </p>
        )}
        {content.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {content.keywords.map((keyword, i) => (
              <span 
                key={i}
                className={`px-3 py-1 rounded-full text-sm ${
                  darkMode 
                    ? 'bg-blue-900 text-blue-200' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      {content.description && (
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-cyan-400' : 'text-cyan-600'
          }`} style={{ fontSize: `${fontSize * 1.5}px` }}>
            Description
          </h2>
          <p className={`leading-relaxed whitespace-pre-wrap ${
            darkMode ? 'text-slate-200' : 'text-slate-700'
          }`}>
            {content.description}
          </p>
        </div>
      )}

      {/* Abstract */}
      {content.abstract && (
        <div>
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-cyan-400' : 'text-cyan-600'
          }`} style={{ fontSize: `${fontSize * 1.5}px` }}>
            Abstract
          </h2>
          <p className={`leading-relaxed whitespace-pre-wrap ${
            darkMode ? 'text-slate-200' : 'text-slate-700'
          }`}>
            {content.abstract}
          </p>
        </div>
      )}
    </div>
  </div>
);

// Compare View Component (All 3 Languages)
const CompareView = ({ content, languages, fontSize, darkMode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {languages.map(lang => {
      const langContent = {
        title: content.title?.[lang.code] || 'Untitled',
        description: content.description?.[lang.code] || '',
        abstract: content.abstract?.[lang.code] || ''
      };

      return (
        <div 
          key={lang.code}
          className={`rounded-2xl shadow-xl overflow-hidden ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          {/* Language Header */}
          <div className={`px-6 py-4 border-b ${
            darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{lang.flag}</span>
              <h3 className="text-xl font-bold">{lang.label}</h3>
            </div>
          </div>

          {/* Content */}
          <div className={`p-6 ${lang.font}`} style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}>
            <h4 className={`font-bold mb-4 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} style={{ fontSize: `${fontSize * 1.3}px` }}>
              {langContent.title}
            </h4>

            {langContent.description && (
              <div className="mb-4">
                <p className={`font-semibold mb-2 text-sm uppercase ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Description
                </p>
                <p className={`whitespace-pre-wrap ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {langContent.description.substring(0, 300)}
                  {langContent.description.length > 300 && '...'}
                </p>
              </div>
            )}

            {langContent.abstract && (
              <div>
                <p className={`font-semibold mb-2 text-sm uppercase ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Abstract
                </p>
                <p className={`whitespace-pre-wrap ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {langContent.abstract.substring(0, 300)}
                  {langContent.abstract.length > 300 && '...'}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default DocumentReader;
