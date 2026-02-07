import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ParticleSystem from './ParticleSystem';
import RealTimeCounter from './RealTimeCounter';
import Icon from '../AppIcon';

const ImmersiveHeroSection = ({
  title,
  subtitle,
  description,
  backgroundImage,
  metrics = [],
  ctaButtons = [],
  showParticles = true,
  showCounters = true,
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { scrollY } = useScroll();
  
  // Parallax effects
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Background with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {backgroundImage ? (
          <div
            className="w-full h-[120%] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div className="w-full h-[120%] bg-gradient-to-br from-ocean-deep via-ocean-medium to-ocean-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
      </motion.div>
      {/* Particle System */}
      {showParticles && (
        <ParticleSystem 
          particleCount={60}
          particleColor="rgba(6, 182, 212, 0.4)"
          speed={0.5}
          size="sm"
        />
      )}
      {/* Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 pt-32 pb-20"
        style={{ y: contentY }}
      >
        <div className="max-w-6xl">
          {/* Live Status Indicator */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 bg-success/20 glass-morphism px-4 py-2 rounded-full">
              <motion.div
                className="w-2 h-2 bg-success rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-cta text-success">LIVE DATA</span>
            </div>
            
            <div className="text-sm text-text-secondary font-mono">
              {currentTime?.toLocaleTimeString('en-US', { 
                hour12: false,
                timeZone: 'Asia/Colombo'
              })} LKT
            </div>
          </motion.div>

          {/* Main Headlines */}
          <div className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-headline text-5xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight"
            >
              {title}
              {subtitle && (
                <motion.span
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block text-coral-warm"
                >
                  {subtitle}
                </motion.span>
              )}
            </motion.h1>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-body text-xl text-text-secondary max-w-4xl leading-relaxed"
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Real-time Metrics */}
          {showCounters && metrics?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {metrics?.map((metric, index) => (
                <motion.div
                  key={metric?.id || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="glass-card p-6 text-center interactive-glow"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon name={metric?.icon} size={20} className={metric?.iconColor || "text-ocean-light"} />
                    <span className="text-xs text-text-secondary font-cta uppercase tracking-wide">
                      {metric?.title}
                    </span>
                  </div>
                  
                  <RealTimeCounter
                    value={metric?.value}
                    suffix={metric?.suffix}
                    prefix={metric?.prefix}
                    size="lg"
                    className="text-text-primary mb-2"
                  />
                  
                  <div className="text-xs text-coral-warm font-mono">
                    {metric?.trend}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Buttons */}
          {ctaButtons?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {ctaButtons?.map((button, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-cta font-semibold transition-all duration-300 ${
                    button?.variant === 'primary' ?'bg-coral-warm hover:bg-coral-warm/90 text-white coral-glow' :'glass-button text-text-primary hover:bg-ocean-light/10'
                  }`}
                  onClick={button?.onClick}
                >
                  {button?.icon && <Icon name={button?.icon} size={18} />}
                  <span>{button?.text}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-text-secondary"
        >
          <span className="text-xs font-cta uppercase tracking-wide">Explore More</span>
          <Icon name="ChevronDown" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ImmersiveHeroSection;