import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import GlassMorphismCard from './GlassMorphismCard';

const GlobalPartnershipShowcase = ({ 
  partnerships = [],
  className = "",
  autoRotate = true,
  interval = 4000
}) => {
  const [activePartnership, setActivePartnership] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (autoRotate && partnerships?.length > 1) {
      const timer = setInterval(() => {
        setActivePartnership((prev) => (prev + 1) % partnerships?.length);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [autoRotate, interval, partnerships?.length]);

  if (!partnerships?.length) return null;

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Global Partnership Network
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
            Collaborating with leading institutions worldwide to advance marine science
            and ocean conservation through innovative research partnerships.
          </p>
        </motion.div>

        {/* Interactive World Map Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mb-12"
        >
          <GlassMorphismCard className="p-8 mb-8" onClick={() => {}}>
            <div className="relative aspect-[2/1] bg-ocean-deep/20 rounded-lg overflow-hidden">
              {/* World Map SVG or Image would go here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Globe" size={48} className="text-ocean-light mx-auto mb-4" />
                  <div className="font-headline text-2xl font-bold text-text-primary mb-2">
                    {partnerships?.length} International Partners
                  </div>
                  <div className="font-body text-text-secondary">
                    Across {new Set(partnerships?.map(p => p?.country))?.size || 0} countries
                  </div>
                </div>
              </div>

              {/* Partnership Dots - Interactive Points */}
              {partnerships?.map((partnership, index) => (
                <motion.div
                  key={partnership?.id || index}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer ${
                    activePartnership === index ? 'bg-coral-warm' : 'bg-ocean-light'
                  }`}
                  style={{
                    left: `${partnership?.mapPosition?.x || Math.random() * 80 + 10}%`,
                    top: `${partnership?.mapPosition?.y || Math.random() * 60 + 20}%`,
                  }}
                  animate={{
                    scale: activePartnership === index ? [1, 1.5, 1] : 1,
                    opacity: hoveredIndex === index ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.3 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onClick={() => setActivePartnership(index)}
                >
                  {/* Ripple effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      activePartnership === index ? 'bg-coral-warm' : 'bg-ocean-light'
                    }`}
                    animate={{
                      scale: activePartnership === index ? [1, 2.5] : 1,
                      opacity: activePartnership === index ? [0.6, 0] : 0,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </div>
          </GlassMorphismCard>
        </motion.div>

        {/* Active Partnership Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePartnership}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <GlassMorphismCard className="p-8 mb-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Partnership Info */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-lg bg-ocean-light/20 flex items-center justify-center">
                      <Icon name="Building" size={32} className="text-ocean-light" />
                    </div>
                    <div>
                      <h3 className="font-headline text-2xl font-bold text-text-primary">
                        {partnerships?.[activePartnership]?.name}
                      </h3>
                      <p className="font-body text-text-secondary">
                        {partnerships?.[activePartnership]?.location}
                      </p>
                    </div>
                  </div>

                  <p className="font-body text-text-secondary mb-6 leading-relaxed">
                    {partnerships?.[activePartnership]?.description}
                  </p>

                  {/* Partnership Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-ocean-deep/20 rounded-lg">
                      <div className="font-headline text-2xl font-bold text-ocean-light">
                        {partnerships?.[activePartnership]?.collaborativeProjects || 0}
                      </div>
                      <div className="text-xs text-text-secondary">Joint Projects</div>
                    </div>
                    <div className="text-center p-4 bg-coral-warm/20 rounded-lg">
                      <div className="font-headline text-2xl font-bold text-coral-warm">
                        {partnerships?.[activePartnership]?.publications || 0}
                      </div>
                      <div className="text-xs text-text-secondary">Publications</div>
                    </div>
                    <div className="text-center p-4 bg-success/20 rounded-lg">
                      <div className="font-headline text-2xl font-bold text-success">
                        {partnerships?.[activePartnership]?.exchangePrograms || 0}
                      </div>
                      <div className="text-xs text-text-secondary">Exchanges</div>
                    </div>
                  </div>
                </div>

                {/* Research Areas & Recent Projects */}
                <div>
                  <h4 className="font-headline text-lg font-bold text-text-primary mb-4">
                    Research Focus Areas
                  </h4>
                  
                  <div className="space-y-3 mb-6">
                    {partnerships?.[activePartnership]?.researchAreas?.map((area, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Icon name="ChevronRight" size={16} className="text-ocean-light" />
                        <span className="font-body text-text-secondary">{area}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recent Collaboration */}
                  {partnerships?.[activePartnership]?.recentProject && (
                    <div className="bg-muted/20 rounded-lg p-4">
                      <h5 className="font-cta font-semibold text-text-primary mb-2">
                        Latest Collaboration
                      </h5>
                      <p className="font-body text-sm text-text-secondary mb-3">
                        {partnerships?.[activePartnership]?.recentProject?.title}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          <span>{partnerships?.[activePartnership]?.recentProject?.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="DollarSign" size={12} />
                          <span>{partnerships?.[activePartnership]?.recentProject?.funding}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassMorphismCard>
          </motion.div>
        </AnimatePresence>

        {/* Partnership Navigation */}
        <div className="flex items-center justify-center gap-2">
          {partnerships?.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePartnership(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activePartnership === index 
                  ? 'bg-coral-warm scale-125' 
                  : 'bg-text-secondary/30 hover:bg-text-secondary/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalPartnershipShowcase;