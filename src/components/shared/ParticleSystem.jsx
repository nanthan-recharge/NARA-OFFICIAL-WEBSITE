import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ParticleSystem = ({
  particleCount = 50,
  className = "",
  particleColor = "rgba(6, 182, 212, 0.6)",
  speed = 1,
  size = "sm"
}) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Skip rendering on mobile — saves 30-60 animated divs
  // Cap particles at 20 on desktop for performance
  const effectiveCount = isMobile ? 0 : Math.min(particleCount, 20);

  const sizeClasses = {
    xs: "w-1 h-1",
    sm: "w-2 h-2", 
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef?.current) {
        const { clientWidth, clientHeight } = containerRef?.current;
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (dimensions?.width && dimensions?.height && effectiveCount > 0) {
      const newParticles = Array.from({ length: effectiveCount }, (_, i) => ({
        id: i,
        x: Math.random() * dimensions?.width,
        y: Math.random() * dimensions?.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        opacity: Math.random() * 0.6 + 0.4,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [dimensions, effectiveCount, speed]);

  // Return nothing on mobile
  if (isMobile) return null;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles?.map((particle) => (
        <motion.div
          key={particle?.id}
          className={`absolute rounded-full ${sizeClasses?.[size]}`}
          style={{
            backgroundColor: particleColor,
            opacity: particle?.opacity,
          }}
          initial={{
            x: particle?.x,
            y: particle?.y,
          }}
          animate={{
            x: [
              particle?.x,
              particle?.x + particle?.vx * 100,
              particle?.x + particle?.vx * 200,
            ],
            y: [
              particle?.y,
              particle?.y + particle?.vy * 100,
              particle?.y + particle?.vy * 200,
            ],
            opacity: [0, particle?.opacity, 0],
          }}
          transition={{
            duration: 8 + particle?.delay,
            repeat: Infinity,
            ease: "linear",
            delay: particle?.delay
          }}
        />
      ))}
    </div>
  );
};

export default ParticleSystem;