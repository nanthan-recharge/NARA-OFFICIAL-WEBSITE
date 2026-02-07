import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RealTimeCounter = ({ 
  value, 
  suffix = "", 
  prefix = "", 
  duration = 2, 
  className = "",
  size = "md" 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl"
  };

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const startValue = displayValue;
      const endValue = parseFloat(value) || 0;
      const startTime = Date.now();
      const endTime = startTime + (duration * 1000);

      const updateCounter = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (endTime - startTime), 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        
        setDisplayValue(Math.floor(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(updateCounter);
    }
  }, [value, duration, displayValue]);

  return (
    <motion.div 
      className={`counter-metric ${sizeClasses?.[size]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={displayValue}
          initial={isAnimating ? { y: 20, opacity: 0 } : {}}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          {prefix}{displayValue?.toLocaleString()}{suffix}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

export default RealTimeCounter;