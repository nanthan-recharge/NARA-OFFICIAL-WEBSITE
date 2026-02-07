import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DolphinAnimation = ({ count = 3 }) => {
  const [dolphins, setDolphins] = useState([]);

  useEffect(() => {
    const newDolphins = Array.from({ length: count }, (_, i) => ({
      id: i,
      startY: 40 + (i * 15), // Spread vertically
      delay: i === 0 ? 0 : i * 3, // First dolphin starts immediately!
      duration: 6 + Math.random() * 2, // Even faster animation
      arcHeight: 180 + Math.random() * 100, // Big jumps
      size: 100 + Math.random() * 50 // HUGE dolphins (100-150px)
    }));
    setDolphins(newDolphins);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none" style={{ zIndex: 9999 }}>
      {dolphins.map((dolphin) => (
        <motion.div
          key={dolphin.id}
          className="absolute"
          style={{
            width: dolphin.size,
            height: dolphin.size * 0.6,
            left: '-10%',
            top: `${dolphin.startY}%`,
            zIndex: 9999,
            position: 'absolute'
          }}
          animate={{
            x: ['-10%', '50%', '110%'],
            y: [
              0,
              -dolphin.arcHeight,
              -dolphin.arcHeight * 0.3,
              -dolphin.arcHeight,
              0
            ],
            rotate: [0, -30, -15, -30, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{
            duration: dolphin.duration,
            delay: dolphin.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
        >
          <svg
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0, 120, 255, 0.8)) drop-shadow(0 0 20px rgba(100, 180, 255, 0.6))'
            }}
          >
            {/* Dolphin body */}
            <path
              d="M 10 30 Q 20 20, 40 22 Q 60 24, 70 28 Q 80 32, 85 35 L 82 38 Q 70 34, 60 32 Q 40 28, 20 32 Q 15 33, 10 30 Z"
              fill="url(#dolphinGradient)"
              stroke="rgba(0, 86, 179, 0.6)"
              strokeWidth="0.5"
            />

            {/* Dorsal fin */}
            <path
              d="M 45 22 Q 47 10, 48 22 Z"
              fill="url(#finGradient)"
              stroke="rgba(0, 86, 179, 0.6)"
              strokeWidth="0.5"
            />

            {/* Tail */}
            <path
              d="M 82 35 Q 88 30, 95 28 Q 92 35, 88 38 Q 85 40, 82 38 Z"
              fill="url(#tailGradient)"
              stroke="rgba(0, 86, 179, 0.6)"
              strokeWidth="0.5"
            />

            {/* Pectoral fin */}
            <path
              d="M 30 30 Q 28 38, 25 40 Q 28 35, 30 32 Z"
              fill="url(#finGradient)"
              stroke="rgba(0, 86, 179, 0.6)"
              strokeWidth="0.5"
            />

            {/* Eye */}
            <circle
              cx="22"
              cy="26"
              r="2"
              fill="rgba(0, 50, 120, 0.8)"
            />

            {/* Highlight on body */}
            <ellipse
              cx="35"
              cy="25"
              rx="15"
              ry="5"
              fill="rgba(255, 255, 255, 0.3)"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="dolphinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(150, 220, 255, 1)" />
                <stop offset="50%" stopColor="rgba(100, 180, 240, 1)" />
                <stop offset="100%" stopColor="rgba(70, 150, 220, 1)" />
              </linearGradient>

              <linearGradient id="finGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(120, 200, 250, 1)" />
                <stop offset="100%" stopColor="rgba(80, 160, 230, 1)" />
              </linearGradient>

              <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(100, 180, 240, 1)" />
                <stop offset="100%" stopColor="rgba(80, 160, 230, 1)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Water splash effect when dolphin jumps */}
          <motion.div
            className="absolute -bottom-2 left-0 right-0"
            animate={{
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0.5, 1, 1.2, 1, 0.5]
            }}
            transition={{
              duration: dolphin.duration,
              delay: dolphin.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/40"
                style={{
                  width: 4 + Math.random() * 6,
                  height: 4 + Math.random() * 6,
                  left: `${20 + i * 15}%`,
                  bottom: 0
                }}
                animate={{
                  y: [0, -20 - Math.random() * 10],
                  x: [(Math.random() - 0.5) * 10],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: dolphin.delay + 0.1 * i,
                  repeat: Infinity,
                  repeatDelay: dolphin.duration - 0.8
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default DolphinAnimation;
