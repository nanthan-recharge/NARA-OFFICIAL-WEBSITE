/**
 * Hero Image Carousel Component
 * NARA Government Website - Technical Specification v1.0
 *
 * Features:
 * - Up to 8 images (admin-updatable via Firebase)
 * - First slide MUST display both Government logo AND NARA logo
 * - Auto-rotation with manual controls
 * - WCAG 2.1 AA Accessible
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// Default hero images - these can be replaced via admin
const DEFAULT_HERO_IMAGES = [
  {
    id: 'hero-1',
    src: '/hero_images/hero.webp',
    alt: 'NARA Ocean Research',
  },
  {
    id: 'hero-2',
    src: '/hero_images/hero 1.webp',
    alt: 'Marine Biodiversity',
  },
  {
    id: 'hero-3',
    src: '/hero_images/hero 2.webp',
    alt: 'Aquatic Resources',
  },
  {
    id: 'hero-4',
    src: '/hero_images/hero 4.webp',
    alt: 'Scientific Research',
  },
  {
    id: 'hero-6',
    src: '/hero_images/hero 6.webp',
    alt: 'Coastal Conservation',
  },
  {
    id: 'hero-8',
    src: '/hero_images/hero 8.webp',
    alt: 'Marine Technology',
  },
  {
    id: 'hero-9',
    src: '/hero_images/hero 9.webp',
    alt: 'Ocean Data Analysis',
  },
  {
    id: 'hero-10',
    src: '/hero_images/hero 10.webp',
    alt: 'Fisheries Management',
  },
  {
    id: 'hero-11',
    src: '/hero_images/hero 11.webp',
    alt: 'Sustainable Aquaculture',
  },
];

// Fallback Unsplash images (unused if local exist)
const FALLBACK_IMAGES = [];

const HeroImageCarousel = ({
  images = null, // Custom images from admin/Firebase
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageError, setImageError] = useState({});

  // Use provided images, default images, or fallback images
  const carouselImages = images && images.length > 0
    ? images
    : DEFAULT_HERO_IMAGES.some(img => !imageError[img.id])
      ? DEFAULT_HERO_IMAGES
      : FALLBACK_IMAGES;

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || carouselImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, carouselImages.length, autoPlayInterval]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  }, [carouselImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  }, [carouselImages.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleImageError = (imageId) => {
    setImageError((prev) => ({ ...prev, [imageId]: true }));
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === ' ') {
      e.preventDefault();
      togglePlayPause();
    }
  }, [goToPrevious, goToNext, togglePlayPause]);

  const currentImage = carouselImages[currentIndex];

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-2xl ${className}`}
      role="region"
      aria-label="Hero image carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Image Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage?.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentImage?.src}
            alt={currentImage?.alt || `Hero image ${currentIndex + 1}`}
            className="w-full h-full object-contain bg-black"
            width={1920}
            height={1080}
            onError={() => handleImageError(currentImage?.id)}
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
            sizes="100vw"
            decoding={currentIndex === 0 ? 'sync' : 'async'}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gov-primary/60 via-transparent to-transparent" />

          {/* Logo Display - First Slide Only */}
          {currentImage?.showLogos && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6 sm:gap-8"
            >
              {/* Government of Sri Lanka Logo */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <img
                  src="/assets/images/gov-logo.png"
                  alt="Government of Sri Lanka"
                  className="h-16 sm:h-20 md:h-24 w-auto object-contain"
                  onError={(e) => {
                    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Emblem_of_Sri_Lanka.svg/200px-Emblem_of_Sri_Lanka.svg.png';
                  }}
                />
              </div>

              {/* NARA Logo - LARGER as per specification */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <img
                  src="/assets/nara-logo.png"
                  alt="NARA - National Aquatic Resources Research and Development Agency"
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {showControls && carouselImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {showIndicators && carouselImages.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2"
          role="tablist"
          aria-label="Carousel slides"
        >
          {carouselImages.map((image, index) => (
            <button
              key={image?.id || index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/70'
                }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {carouselImages.length}: {currentImage?.alt}
      </div>
    </div>
  );
};

export default HeroImageCarousel;
