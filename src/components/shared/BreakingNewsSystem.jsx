import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

const BreakingNewsSystem = ({ 
  news = [], 
  autoPlay = true, 
  interval = 5000,
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (news?.length > 0) {
      setIsVisible(true);
    }
  }, [news]);

  useEffect(() => {
    if (autoPlay && news?.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news?.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, news?.length]);

  if (!news?.length || !isVisible) return null;

  const currentNews = news?.[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 breaking-news-ticker ${className}`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white font-cta font-semibold">
                <Icon name="AlertTriangle" size={18} className="text-warning animate-pulse" />
                <span className="text-sm uppercase tracking-wide">URGENT</span>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-white font-body"
                  >
                    <span className="font-semibold mr-2">{currentNews?.title}:</span>
                    <span className="opacity-90">{currentNews?.description}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + news?.length) % news?.length)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <Icon name="ChevronLeft" size={16} />
                </button>
                
                <div className="text-white/60 text-xs">
                  {currentIndex + 1} / {news?.length}
                </div>
                
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % news?.length)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <Icon name="ChevronRight" size={16} />
                </button>
                
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 ml-2"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreakingNewsSystem;