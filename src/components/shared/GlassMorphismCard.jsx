import React from 'react';
import { motion } from 'framer-motion';

const GlassMorphismCard = ({ 
  children, 
  className = "", 
  variant = "default",
  hover = true,
  onClick,
  ...props 
}) => {
  const variants = {
    default: "glass-card",
    button: "glass-button",
    modal: "glass-morphism",
    research: "research-card"
  };

  const hoverEffects = {
    scale: hover ? { scale: 1.02, y: -4 } : {},
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      className={`${variants?.[variant]} ${className}`}
      whileHover={hoverEffects?.scale}
      whileTap={hoverEffects?.tap}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassMorphismCard;