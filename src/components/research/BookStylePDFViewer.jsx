import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * 📚 BOOK-STYLE PDF VIEWER
 * Beautiful iPad-optimized reading experience with page flip animation
 */
const BookStylePDFViewer = ({ 
  pdfUrl, 
  title, 
  language = 'en',
  onLanguageChange,
  onDownload,
  translatedContent 
}) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [viewMode, setViewMode] = useState('single'); // single, double, scroll
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [pageFlip, setPageFlip] = useState('next');
  const containerRef = useRef(null);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' && currentPage < numPages) {
        nextPage();
      } else if (e.key === 'ArrowLeft' && currentPage > 1) {
        previousPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, numPages]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log(`📄 Loaded PDF with ${numPages} pages`);
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      setPageFlip('next');
      setCurrentPage(prev => prev + (viewMode === 'double' ? 2 : 1));
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setPageFlip('prev');
      setCurrentPage(prev => prev - (viewMode === 'double' ? 2 : 1));
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  // Page flip animation variants
  const pageVariants = {
    enter: (direction) => ({
      rotateY: direction === 'next' ? 90 : -90,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        rotateY: { type: 'spring', stiffness: 100 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (direction) => ({
      rotateY: direction === 'next' ? -90 : 90,
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
    >
      {/* Header Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900/90 to-transparent backdrop-blur-sm p-4"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Title */}
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg line-clamp-1">{title}</h2>
                <p className="text-gray-300 text-sm">Page {currentPage} of {numPages}</p>
              </div>

              {/* Language Switcher */}
              <div className="flex gap-2 mx-4">
                {['en', 'si', 'ta'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange?.(lang)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      language === lang
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {lang === 'en' ? 'ENG' : lang === 'si' ? 'සිං' : 'தமி'}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onDownload}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Icons.Download className="w-4 h-4" />
                  <span className="hidden md:inline">Download</span>
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {isFullscreen ? <Icons.Minimize2 className="w-4 h-4" /> : <Icons.Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main PDF Display */}
      <div className="h-full flex items-center justify-center p-8 pt-24 pb-24">
        <div className="relative perspective-1000">
          <AnimatePresence mode="wait" custom={pageFlip}>
            <motion.div
              key={currentPage}
              custom={pageFlip}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center p-20">
                      <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      <span className="ml-3 text-gray-600">Loading book...</span>
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center p-20 text-red-600">
                      <Icons.AlertCircle className="w-12 h-12 mb-3" />
                      <p>Failed to load PDF</p>
                    </div>
                  }
                >
                  {viewMode === 'double' ? (
                    <div className="flex gap-4">
                      {currentPage <= numPages && (
                        <Page
                          pageNumber={currentPage}
                          scale={scale}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                      )}
                      {currentPage + 1 <= numPages && (
                        <Page
                          pageNumber={currentPage + 1}
                          scale={scale}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                      )}
                    </div>
                  ) : (
                    <Page
                      pageNumber={currentPage}
                      scale={scale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  )}
                </Document>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-gray-900/90 to-transparent backdrop-blur-sm p-4"
          >
            <div className="max-w-4xl mx-auto">
              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button
                  onClick={previousPage}
                  disabled={currentPage <= 1}
                  className="p-3 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-full transition-all disabled:cursor-not-allowed"
                >
                  <Icons.ChevronLeft className="w-6 h-6 text-white" />
                </button>

                {/* Page Indicator */}
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 min-w-[120px] text-center">
                  <span className="text-white font-semibold">
                    {currentPage} / {numPages}
                  </span>
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage >= numPages}
                  className="p-3 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-full transition-all disabled:cursor-not-allowed"
                >
                  <Icons.ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Tools */}
              <div className="flex items-center justify-center gap-3">
                {/* Zoom Controls */}
                <button
                  onClick={zoomOut}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  title="Zoom Out"
                >
                  <Icons.ZoomOut className="w-5 h-5 text-white" />
                </button>

                <span className="text-white font-medium min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>

                <button
                  onClick={zoomIn}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  title="Zoom In"
                >
                  <Icons.ZoomIn className="w-5 h-5 text-white" />
                </button>

                <div className="w-px h-8 bg-white/20 mx-2"></div>

                {/* View Mode */}
                <button
                  onClick={() => setViewMode(viewMode === 'single' ? 'double' : 'single')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'double' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title={viewMode === 'single' ? 'Double Page View' : 'Single Page View'}
                >
                  {viewMode === 'single' ? (
                    <Icons.BookOpen className="w-5 h-5" />
                  ) : (
                    <Icons.Book className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => setScale(1.0)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                  title="Reset Zoom"
                >
                  <Icons.RefreshCw className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Navigation (Click Areas) */}
      <div className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize" onClick={previousPage}></div>
      <div className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize" onClick={nextPage}></div>

      {/* Keyboard Hints */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-20 right-4 bg-black/60 backdrop-blur-sm text-white text-xs rounded-lg p-3"
        >
          <p>⌨️ Keyboard Shortcuts:</p>
          <p>← → : Navigate pages</p>
          <p>F : Fullscreen</p>
        </motion.div>
      )}
    </div>
  );
};

export default BookStylePDFViewer;
