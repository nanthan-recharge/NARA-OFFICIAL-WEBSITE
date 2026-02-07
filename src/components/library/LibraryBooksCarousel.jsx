import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Library,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Calendar,
  User,
  BookMarked
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_BOOKS = [
  {
    id: 'marine-biodiversity',
    categoryKey: 'marineBiology',
    cover: '/images/books/marine-bio.jpg',
    isbn: '978-955-1234-56-7',
    pages: 456,
    year: 2023
  },
  {
    id: 'sustainable-fisheries',
    categoryKey: 'fisheries',
    cover: '/images/books/fisheries.jpg',
    isbn: '978-955-1234-57-8',
    pages: 320,
    year: 2023
  },
  {
    id: 'coastal-restoration',
    categoryKey: 'conservation',
    cover: '/images/books/coastal.jpg',
    isbn: '978-955-1234-58-9',
    pages: 280,
    year: 2024
  },
  {
    id: 'climate-ocean-acidification',
    categoryKey: 'climateScience',
    cover: '/images/books/climate.jpg',
    isbn: '978-955-1234-59-0',
    pages: 412,
    year: 2023
  },
  {
    id: 'marine-spatial-planning',
    categoryKey: 'policy',
    cover: '/images/books/spatial.jpg',
    isbn: '978-955-1234-60-6',
    pages: 350,
    year: 2024
  },
  {
    id: 'aquaculture-innovations',
    categoryKey: 'aquaculture',
    cover: '/images/books/aquaculture.jpg',
    isbn: '978-955-1234-61-3',
    pages: 298,
    year: 2023
  }
];

const CATEGORY_GRADIENTS = {
  marineBiology: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800',
  fisheries: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800',
  conservation: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800',
  climateScience: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800',
  policy: 'bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800',
  aquaculture: 'bg-gradient-to-br from-blue-600 via-sky-700 to-teal-800',
  default: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800'
};

/**
 * Homepage Library Books Carousel
 * Redesigned to match the light hero aesthetic on the landing page.
 */
const LibraryBooksCarousel = () => {
  const { t, i18n } = useTranslation('library');
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Mock data for demonstration - replace with actual API call
  const getLocalizedBooks = () => {
    const localizedBooks = t('carousel.books', { returnObjects: true }) || [];
    const fallbackBundle = i18n.getResourceBundle('en', 'library');
    const fallbackBooks = fallbackBundle?.carousel?.books || [];

    return BASE_BOOKS.map((baseBook, index) => {
      const localized = localizedBooks.find((entry) => entry.id === baseBook.id) || localizedBooks[index] || {};
      const fallback = fallbackBooks.find((entry) => entry.id === baseBook.id) || fallbackBooks[index] || {};

      return {
        ...baseBook,
        title: localized.title || fallback.title || '',
        author: localized.author || fallback.author || '',
        category: localized.category || fallback.category || '',
        description: localized.description || fallback.description || '',
        language: localized.language || fallback.language || '',
        displayYear: localized.year || fallback.year || baseBook.year,
        displayPages: localized.pages || fallback.pages || baseBook.pages
      };
    });
  };

  // Fetch books from library service
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const data = await catalogueService.getAllItems({ limit: 12, random: true });
        const mockData = getLocalizedBooks();
        setBooks(mockData);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Error fetching library books:', error);
        // Use mock data as fallback
        setBooks(getLocalizedBooks());
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [i18n.language]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && books.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(books.length / 3));
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, books.length]);

  const nextSlide = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(books.length / 3));
  };

  const prevSlide = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(books.length / 3)) % Math.ceil(books.length / 3));
  };

  const visibleBooks = books.slice(currentIndex * 3, currentIndex * 3 + 3);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-4 h-4 bg-nara-blue rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-nara-navy rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

  return (
    <section className="relative py-6 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl border border-blue-100/80">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Book shelf pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nara-blue/40 to-transparent"></div>
          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"></div>
          <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nara-navy/30 to-transparent"></div>
        </div>
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-nara-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <BookMarked className="w-6 h-6 text-nara-blue" />
            </motion.div>
            <span className="text-sm font-semibold text-nara-blue uppercase tracking-wider">
              {t('carousel.badge')}
            </span>
            <BookMarked className="w-6 h-6 text-nara-blue" />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-nara-navy mb-3">
            {t('carousel.title')}{' '}
            <span className="bg-gradient-to-r from-nara-blue via-sky-500 to-nara-navy bg-clip-text text-transparent">
              {t('carousel.titleHighlight')}
            </span>
          </h2>

          <p className="text-sm md:text-base text-nara-gray max-w-3xl mx-auto">
            {t('carousel.description')}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-nara-blue/20 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 hover:bg-white group"
            aria-label="Previous books"
          >
            <ChevronLeft className="w-6 h-6 text-nara-navy group-hover:text-nara-blue transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-nara-blue/20 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all hover:scale-110 hover:bg-white group"
            aria-label="Next books"
          >
            <ChevronRight className="w-6 h-6 text-nara-navy group-hover:text-nara-blue transition-colors" />
          </button>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-12">
            <AnimatePresence mode="sync">
              {visibleBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Link
                    to="/library"
                    className="block h-full"
                  >
                    <div className="relative h-full bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-xl hover:shadow-blue-300/30 hover:border-nara-blue/30 transition-all duration-300 overflow-hidden group">
                      {/* Realistic Book Cover */}
                      <div className="relative h-56 overflow-hidden">
                        {/* Book spine effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent z-10"></div>

                        {/* Book cover with gradient based on category */}
                        <div
                          className={`absolute inset-0 ${CATEGORY_GRADIENTS[book.categoryKey] || CATEGORY_GRADIENTS.default
                            } flex flex-col items-center justify-center p-8 text-center`}
                        >
                          {/* Book title on cover */}
                          <div className="relative z-10 space-y-4">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20">
                              <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-3">
                              {book.title}
                            </h3>
                            <p className="text-sm text-white/80 font-medium">
                              {book.author}
                            </p>
                            <div className="flex items-center justify-center gap-4 text-xs text-white/60">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {book.displayPages} {t('carousel.pages')}
                              </span>
                              <span>•</span>
                              <span>{book.displayYear}</span>
                            </div>
                          </div>

                          {/* Book texture overlay */}
                          <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.5" /%3E%3C/svg%3E")' }}></div>

                          {/* Shine effect on hover */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '200%' }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-nara-blue border border-nara-blue/20">
                          {book.category}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-nara-navy/90 via-nara-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-20">
                          <div className="flex items-center gap-2 text-white font-semibold">
                            <span>{t('carousel.viewDetails')}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>

                      {/* Book Description */}
                      <div className="p-4 bg-gradient-to-b from-blue-50/80 to-white/70">
                        <p className="text-sm text-nara-gray line-clamp-2 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-nara-blue/15 via-sky-400/20 to-nara-navy/15 blur-xl"></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(books.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutoPlay(false);
                }}
                className={`h-2 rounded-full transition-all ${currentIndex === index
                    ? 'w-8 bg-gradient-to-r from-nara-blue to-sky-500'
                    : 'w-2 bg-nara-blue/25 hover:bg-nara-blue/40'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/library"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-bold rounded-full hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-2xl hover:shadow-cyan-500/50 group relative overflow-hidden"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Library className="w-6 h-6 group-hover:rotate-12 transition-transform relative z-10" />
            <span className="relative z-10">{t('carousel.exploreFullLibrary')}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
          </Link>

          <p className="mt-6 text-base text-nara-gray max-w-2xl mx-auto">
            {t('carousel.accessInfo')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LibraryBooksCarousel;
