import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDivisionColors } from '../../utils/divisionColorMap';

const DivisionHero = ({
  division,
  heroImages,
  currentImageIndex,
  setCurrentImageIndex,
  imageSource,
  projects,
  teamMembers,
  currentLang
}) => {
  const name = division.name?.[currentLang] || division.name?.en || '';
  const tagline = division.tagline?.[currentLang] || division.tagline?.en || '';
  const dc = getDivisionColors(division.color);

  return (
    <section className="relative h-[50vh] min-h-[400px] max-h-[560px] overflow-hidden">
      {/* Image Carousel — fade only */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${heroImages[currentImageIndex] || division.heroImage}")`,
                backgroundPosition: '50% 18%',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
            {/* Division color overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${division.gradient || 'from-blue-500 to-blue-600'} opacity-15 mix-blend-overlay`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Dots — colored ring for active */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`rounded-full transition-all ${
                  idx === currentImageIndex
                    ? `w-7 h-2.5 ring-2 ${dc.ring} ring-offset-1 ring-offset-black/30`
                    : 'bg-white/50 w-2.5 h-2.5 hover:bg-white/70'
                }`}
                style={idx === currentImageIndex ? { backgroundColor: dc.hex } : undefined}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hero Content */}
      <div className="relative h-full flex items-end pb-10 px-4">
        <div className="max-w-7xl mx-auto w-full">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight"
          >
            {name}
          </motion.h1>
          {tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/85 mt-2 max-w-2xl line-clamp-2"
            >
              {tagline}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DivisionHero;
