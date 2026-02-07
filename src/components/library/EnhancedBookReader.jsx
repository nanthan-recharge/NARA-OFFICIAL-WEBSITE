import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { translateBook } from '../../services/translationService';
import bookDownloadService from '../../services/bookDownloadService';

/**
 * WORLD-CLASS BOOK READER
 * iPad/Tablet/Computer optimized with auto-translation
 */
const EnhancedBookReader = ({ book, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [fontFamily, setFontFamily] = useState('Georgia');
  const [theme, setTheme] = useState('day');
  const [language, setLanguage] = useState('original');
  const [translatedContent, setTranslatedContent] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  
  const readerRef = useRef(null);

  const themes = {
    day: { bg: '#ffffff', text: '#000000', name: 'Day' },
    night: { bg: '#1a1a1a', text: '#e0e0e0', name: 'Night' },
    sepia: { bg: '#f4ecd8', text: '#5c4a1c', name: 'Sepia' }
  };

  // Split content into pages (approx 1000 chars per page)
  const content = language === 'original' ? book.content : (translatedContent[language] || book.content);
  const pages = content ? content.match(/.{1,1000}/gs) || [content] : [''];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') setCurrentPage(p => Math.min(pages.length - 1, p + 1));
      else if (e.key === 'ArrowLeft') setCurrentPage(p => Math.max(0, p - 1));
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, pages.length, onClose]);

  // Handle translation
  const handleTranslate = async (targetLang) => {
    if (translatedContent[targetLang]) {
      setLanguage(targetLang);
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);

    try {
      const translated = await translateBook(book.content, targetLang, (progress) => {
        setTranslationProgress(progress.percentage);
      });

      setTranslatedContent(prev => ({ ...prev, [targetLang]: translated }));
      setLanguage(targetLang);
      alert(`✅ Translation to ${targetLang.toUpperCase()} complete!`);
    } catch (error) {
      alert(`❌ Translation failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Download handlers
  const handleDownloadPDF = () => {
    bookDownloadService.downloadAsPDF(book);
  };

  const handleDownloadOffline = () => {
    bookDownloadService.downloadOfflinePackage(book, translatedContent);
  };

  return (
    <div 
      ref={readerRef}
      style={{
        backgroundColor: themes[theme].bg,
        color: themes[theme].text,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Toolbar */}
      <div style={{
        padding: '15px 20px',
        borderBottom: `1px solid ${theme === 'night' ? '#333' : '#ddd'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            color: themes[theme].text 
          }}
        >
          <Icons.X size={24} />
        </button>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: themes[theme].text }}
            title="Settings"
          >
            <Icons.Settings size={20} />
          </button>
          <button 
            onClick={() => setBookmarks([...bookmarks, { page: currentPage, text: pages[currentPage].substring(0, 50) }])}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: themes[theme].text }}
            title="Bookmark"
          >
            <Icons.Bookmark size={20} />
          </button>
          <button 
            onClick={handleDownloadPDF}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: themes[theme].text }}
            title="Download PDF"
          >
            <Icons.Download size={20} />
          </button>
          <button 
            onClick={handleDownloadOffline}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: themes[theme].text }}
            title="Download Offline Package"
          >
            <Icons.Package size={20} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '20px',
            borderBottom: `1px solid ${theme === 'night' ? '#333' : '#ddd'}`,
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
            background: theme === 'night' ? '#2a2a2a' : '#f9f9f9'
          }}
        >
          {/* Font Size */}
          <div>
            <label style={{ marginRight: '10px' }}>Font:</label>
            <button onClick={() => setFontSize(f => Math.max(12, f - 2))}>-</button>
            <span style={{ margin: '0 10px' }}>{fontSize}px</span>
            <button onClick={() => setFontSize(f => Math.min(32, f + 2))}>+</button>
          </div>

          {/* Theme */}
          <div>
            <label style={{ marginRight: '10px' }}>Theme:</label>
            {Object.keys(themes).map(t => (
              <button 
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  margin: '0 5px',
                  padding: '5px 10px',
                  background: theme === t ? '#0891b2' : 'transparent',
                  color: theme === t ? 'white' : themes[theme].text,
                  border: '1px solid',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {themes[t].name}
              </button>
            ))}
          </div>

          {/* Font Family */}
          <div>
            <label style={{ marginRight: '10px' }}>Font Family:</label>
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              style={{
                padding: '5px',
                background: themes[theme].bg,
                color: themes[theme].text,
                border: '1px solid',
                borderRadius: '4px'
              }}
            >
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>

          {/* Language with Auto-Translate */}
          <div>
            <label style={{ marginRight: '10px' }}>Language:</label>
            <select 
              value={language}
              onChange={(e) => {
                const selected = e.target.value;
                if (selected === 'original') {
                  setLanguage('original');
                } else {
                  handleTranslate(selected);
                }
              }}
              style={{
                padding: '5px',
                background: themes[theme].bg,
                color: themes[theme].text,
                border: '1px solid',
                borderRadius: '4px'
              }}
            >
              <option value="original">Original</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Translation Progress */}
      {isTranslating && (
        <div style={{
          padding: '10px 20px',
          background: '#0891b2',
          color: 'white',
          textAlign: 'center'
        }}>
          Translating... {translationProgress}%
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255,255,255,0.3)',
            marginTop: '5px'
          }}>
            <div style={{
              width: `${translationProgress}%`,
              height: '100%',
              background: 'white',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      )}

      {/* Book Content */}
      <div 
        style={{
          flex: 1,
          padding: '40px',
          maxWidth: '900px',
          margin: '0 auto',
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          fontFamily: fontFamily,
          textAlign: 'justify',
          overflowY: 'auto',
          width: '100%'
        }}
      >
        <h1 style={{ marginBottom: '10px' }}>{book.title}</h1>
        <p style={{ fontStyle: 'italic', marginBottom: '30px', opacity: 0.7 }}>
          By {book.author || 'Unknown Author'}
        </p>
        <div>{pages[currentPage]}</div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        padding: '20px',
        borderTop: `1px solid ${theme === 'night' ? '#333' : '#ddd'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <button 
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          style={{
            padding: '10px 20px',
            background: currentPage === 0 ? '#ccc' : '#0891b2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ← Previous
        </button>
        
        <span>
          Page {currentPage + 1} of {pages.length}
        </span>
        
        <button 
          onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
          disabled={currentPage === pages.length - 1}
          style={{
            padding: '10px 20px',
            background: currentPage === pages.length - 1 ? '#ccc' : '#0891b2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Next →
        </button>
      </div>

      {/* Bookmarks Panel (if any) */}
      {bookmarks.length > 0 && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100px',
          background: themes[theme].bg,
          border: `1px solid ${theme === 'night' ? '#333' : '#ddd'}`,
          padding: '10px',
          maxWidth: '200px',
          maxHeight: '300px',
          overflowY: 'auto',
          borderRadius: '5px 0 0 5px',
          boxShadow: '-2px 2px 10px rgba(0,0,0,0.1)'
        }}>
          <strong>Bookmarks</strong>
          {bookmarks.map((bm, idx) => (
            <div 
              key={idx}
              onClick={() => setCurrentPage(bm.page)}
              style={{
                padding: '5px',
                marginTop: '5px',
                cursor: 'pointer',
                border: '1px solid',
                borderRadius: '3px',
                fontSize: '12px'
              }}
            >
              Page {bm.page + 1}: {bm.text}...
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedBookReader;
