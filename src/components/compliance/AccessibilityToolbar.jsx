import React, { useState, useEffect } from 'react';
import { Eye, Type, Contrast, MousePointer, Moon, Sun, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const AccessibilityToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('nara-accessibility');
    return saved ? JSON.parse(saved) : {
      fontSize: 100,
      contrast: 'normal',
      cursorSize: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      highlightLinks: false,
      darkMode: false
    };
  });

  useEffect(() => {
    applySettings(settings);
    localStorage.setItem('nara-accessibility', JSON.stringify(settings));
  }, [settings]);

  const applySettings = (settings) => {
    const root = document.documentElement;

    // Font size
    root.style.fontSize = `${settings.fontSize}%`;

    // Contrast
    if (settings.contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Cursor size
    if (settings.cursorSize === 'large') {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }

    // Line height
    root.style.setProperty('--line-height',
      settings.lineHeight === 'increased' ? '1.8' : '1.5'
    );

    // Letter spacing
    root.style.setProperty('--letter-spacing',
      settings.letterSpacing === 'increased' ? '0.1em' : 'normal'
    );

    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 200) {
      updateSetting('fontSize', settings.fontSize + 10);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 50) {
      updateSetting('fontSize', settings.fontSize - 10);
    }
  };

  const resetSettings = () => {
    const defaults = {
      fontSize: 100,
      contrast: 'normal',
      cursorSize: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      highlightLinks: false,
      darkMode: false
    };
    setSettings(defaults);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9998] w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        aria-label="Accessibility Settings"
        title="Accessibility Settings"
        style={{ fontSize: '16px' }}
      >
        <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Toolbar Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-3 right-3 sm:bottom-24 sm:left-auto sm:right-6 z-[9998] w-auto sm:w-80 bg-slate-900 border-2 border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
          style={{ fontSize: '16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
            <h3 className="text-white font-bold" style={{ fontSize: '18px', lineHeight: '1.4' }}>
              Accessibility Settings
            </h3>
            <p className="text-cyan-100" style={{ fontSize: '12px', lineHeight: '1.4' }}>
              Customize your viewing experience
            </p>
          </div>

          {/* Controls */}
          <div className="p-6 space-y-6 max-h-[65vh] sm:max-h-[500px] overflow-y-auto overflow-x-hidden">

            {/* Font Size */}
            <div>
              <label
                className="flex items-center gap-2 text-white font-semibold mb-3"
                style={{ fontSize: '14px', lineHeight: '1.4' }}
              >
                <Type className="w-4 h-4 text-cyan-400" />
                Font Size ({settings.fontSize}%)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseFontSize}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  disabled={settings.fontSize <= 50}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  <ZoomOut className="w-4 h-4" />
                  Smaller
                </button>
                <button
                  onClick={increaseFontSize}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  disabled={settings.fontSize >= 200}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  <ZoomIn className="w-4 h-4" />
                  Larger
                </button>
              </div>
            </div>

            {/* Contrast */}
            <div>
              <label
                className="flex items-center gap-2 text-white font-semibold mb-3"
                style={{ fontSize: '14px', lineHeight: '1.4' }}
              >
                <Contrast className="w-4 h-4 text-cyan-400" />
                Contrast
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSetting('contrast', 'normal')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.contrast === 'normal'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('contrast', 'high')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.contrast === 'high'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  High
                </button>
              </div>
            </div>

            {/* Cursor Size */}
            <div>
              <label
                className="flex items-center gap-2 text-white font-semibold mb-3"
                style={{ fontSize: '14px', lineHeight: '1.4' }}
              >
                <MousePointer className="w-4 h-4 text-cyan-400" />
                Cursor Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSetting('cursorSize', 'normal')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.cursorSize === 'normal'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  Default
                </button>
                <button
                  onClick={() => updateSetting('cursorSize', 'large')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.cursorSize === 'large'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  Large
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label
                className="flex items-center gap-2 text-white font-semibold mb-3"
                style={{ fontSize: '14px', lineHeight: '1.4' }}
              >
                Line Spacing
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSetting('lineHeight', 'normal')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.lineHeight === 'normal'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('lineHeight', 'increased')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.lineHeight === 'increased'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  Increased
                </button>
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <label
                className="flex items-center gap-2 text-white font-semibold mb-3"
                style={{ fontSize: '14px', lineHeight: '1.4' }}
              >
                Letter Spacing
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSetting('letterSpacing', 'normal')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.letterSpacing === 'normal'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('letterSpacing', 'increased')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    settings.letterSpacing === 'increased'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  style={{ fontSize: '13px', lineHeight: '1.4' }}
                >
                  Wide
                </button>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-3">
              <button
                onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                  settings.highlightLinks
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                style={{ fontSize: '13px', lineHeight: '1.4' }}
              >
                <span>Highlight Links</span>
                <div className={`w-5 h-5 rounded ${settings.highlightLinks ? 'bg-white' : 'bg-slate-600'}`} />
              </button>

              <button
                onClick={() => updateSetting('darkMode', !settings.darkMode)}
                className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                  settings.darkMode
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                style={{ fontSize: '13px', lineHeight: '1.4' }}
              >
                <span className="flex items-center gap-2">
                  {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Dark Mode
                </span>
                <div className={`w-5 h-5 rounded ${settings.darkMode ? 'bg-white' : 'bg-slate-600'}`} />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              style={{ fontSize: '13px', lineHeight: '1.4' }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Settings
            </button>
          </div>

          {/* Footer */}
          <div className="bg-slate-800 px-6 py-3 text-center">
            <p style={{ fontSize: '11px', lineHeight: '1.4', color: '#94a3b8' }}>
              WCAG 2.1 AA Accessibility Compliance
            </p>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>{`
        .high-contrast {
          filter: contrast(1.5);
        }
        .large-cursor,
        .large-cursor * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="%23000" stroke="%23fff" stroke-width="2"/></svg>') 16 16, auto !important;
        }
        .highlight-links a {
          background-color: yellow !important;
          color: black !important;
          padding: 2px 4px !important;
          border-radius: 2px !important;
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AccessibilityToolbar;
