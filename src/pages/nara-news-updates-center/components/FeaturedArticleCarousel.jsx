import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Star,
  MapPin,
  ArrowRight
} from 'lucide-react';

const FeaturedArticleCarousel = ({ articles, onArticleSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || articles?.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % articles?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, articles?.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + articles?.length) % articles?.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % articles?.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!articles || articles?.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Articles</h3>
        <p className="text-gray-500">Featured articles will appear here when available.</p>
      </div>
    );
  }

  const currentArticle = articles?.[currentIndex];

  return (
    <div className="relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full mb-4">
          <Star className="w-4 h-4" />
          <span className="font-medium text-sm">Featured Articles</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Latest Highlights from NARA
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the most impactful stories and breakthrough research from our marine science teams
        </p>
      </motion.div>
      {/* Main Carousel Container */}
      <div 
        className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Article Content */}
        <div className="relative h-96 md:h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="grid md:grid-cols-2 h-full">
                {/* Image Section */}
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                  </div>
                  
                  {/* Article visual representation */}
                  <div className="relative z-10 text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {currentArticle?.title?.charAt(0)}
                      </span>
                    </div>
                    <div className="text-white/80 text-sm">
                      Featured Article {currentIndex + 1} of {articles?.length}
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                      {currentArticle?.category}
                    </span>
                  </div>

                  {/* Featured badge */}
                  <div className="absolute top-6 right-6">
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-medium">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentArticle?.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {currentArticle?.read_time} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {(currentArticle?.views || 0)?.toLocaleString()} views
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                    {currentArticle?.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed line-clamp-3">
                    {currentArticle?.summary}
                  </p>

                  {/* Location and Author */}
                  <div className="space-y-2 mb-6">
                    {currentArticle?.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {currentArticle?.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      {currentArticle?.author?.split(',')?.[0] || 'NARA Research Team'}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onArticleSelect(currentArticle)}
                    className="group inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 self-start"
                  >
                    Read Full Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {articles?.length > 1 && (
          <>
            {/* Previous/Next Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {articles?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-125' :'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ 
                  width: isAutoPlaying ? '100%' : `${((currentIndex + 1) / articles?.length) * 100}%`
                }}
                transition={{ 
                  duration: isAutoPlaying ? 5 : 0.3,
                  ease: "linear"
                }}
                key={`${currentIndex}-${isAutoPlaying}`}
              />
            </div>
          </>
        )}

        {/* Auto-play toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
        >
          {isAutoPlaying ? (
            <div className="w-3 h-3 flex gap-0.5">
              <div className="w-0.5 h-full bg-current"></div>
              <div className="w-0.5 h-full bg-current"></div>
            </div>
          ) : (
            <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[3px] border-y-transparent ml-0.5"></div>
          )}
        </button>
      </div>
      {/* Article Navigation Preview */}
      {articles?.length > 1 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles?.map((article, index) => (
            <motion.button
              key={article?.id}
              onClick={() => goToSlide(index)}
              className={`group text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <span className="text-xs text-gray-500">{formatDate(article?.date)}</span>
              </div>
              <h4 className={`font-medium text-sm line-clamp-2 ${
                index === currentIndex ? 'text-blue-800' : 'text-gray-800 group-hover:text-blue-600'
              }`}>
                {article?.title}
              </h4>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedArticleCarousel;