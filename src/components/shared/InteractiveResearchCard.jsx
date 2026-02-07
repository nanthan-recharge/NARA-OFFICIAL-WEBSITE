import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import GlassMorphismCard from './GlassMorphismCard';

const InteractiveResearchCard = ({ 
  division, 
  className = "",
  onExplore,
  onCollaborate 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassMorphismCard
      variant="research"
      className={`p-6 cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {}}
      hover={true}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-ocean-light/10 group-hover:bg-ocean-light/20 transition-colors">
          <Icon 
            name={division?.icon || "Microscope"} 
            size={24} 
            className="text-ocean-light" 
          />
        </div>
        
        <div className="flex items-center gap-2 text-text-secondary">
          <Icon name="Users" size={14} />
          <span className="text-xs">{division?.researchers || 0} researchers</span>
        </div>
      </div>
      {/* Content */}
      <div className="mb-6">
        <h3 className="font-headline text-lg font-bold text-text-primary mb-3 group-hover:text-ocean-light transition-colors">
          {division?.name}
        </h3>
        
        <p className="font-body text-sm text-text-secondary leading-relaxed mb-4">
          {division?.description}
        </p>

        {/* Key Research Areas */}
        {division?.researchAreas && (
          <div className="flex flex-wrap gap-2 mb-4">
            {division?.researchAreas?.slice(0, 3)?.map((area, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-ocean-deep/30 text-ocean-light rounded-full border border-ocean-deep/20"
              >
                {area}
              </span>
            ))}
            {division?.researchAreas?.length > 3 && (
              <span className="text-xs text-text-secondary">
                +{division?.researchAreas?.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      {/* Statistics Row */}
      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-headline font-bold text-ocean-light">
            {division?.projects || 0}
          </div>
          <div className="text-xs text-text-secondary">Active Projects</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-headline font-bold text-coral-warm">
            {division?.publications || 0}
          </div>
          <div className="text-xs text-text-secondary">Publications</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-headline font-bold text-success">
            {division?.collaborations || 0}
          </div>
          <div className="text-xs text-text-secondary">Partnerships</div>
        </div>
      </div>
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
        className="flex gap-3"
      >
        <button
          onClick={(e) => {
            e?.stopPropagation();
            onExplore?.(division);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-ocean-deep/40 hover:bg-ocean-deep/60 text-ocean-light rounded-lg transition-colors text-sm font-cta"
        >
          <Icon name="Search" size={14} />
          <span>Explore Research</span>
        </button>
        
        <button
          onClick={(e) => {
            e?.stopPropagation();
            onCollaborate?.(division);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-coral-warm/20 hover:bg-coral-warm/30 text-coral-warm rounded-lg transition-colors text-sm font-cta"
        >
          <Icon name="Users" size={14} />
          <span>Collaborate</span>
        </button>
      </motion.div>
      {/* Hover Overlay Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
        }}
      />
    </GlassMorphismCard>
  );
};

export default InteractiveResearchCard;