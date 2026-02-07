import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WaterBubbles = ({ count = 15 }) => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 10,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
      opacity: Math.random() * 0.3 + 0.1
    }));
    setBubbles(newBubbles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: '-10%',
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${bubble.opacity}), rgba(147, 216, 255, ${bubble.opacity * 0.5}))`,
            boxShadow: `
              inset -2px -2px 4px rgba(255, 255, 255, 0.3),
              inset 2px 2px 4px rgba(0, 0, 0, 0.1),
              0 4px 8px rgba(0, 86, 179, 0.1)
            `,
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [
              0,
              Math.sin(bubble.delay) * 50,
              Math.cos(bubble.delay * 2) * -30,
              0
            ],
            scale: [1, 1.1, 0.9, 1],
            opacity: [0, bubble.opacity, bubble.opacity, 0]
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

export default WaterBubbles;
