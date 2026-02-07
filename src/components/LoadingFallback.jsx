import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Optimized loading fallback component for lazy-loaded routes
 * Minimal footprint for better performance
 */
const LoadingFallback = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-deep to-ocean-light">
      <div className="text-center space-y-4">
        {/* Minimal spinner animation */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-ocean-light/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <p className="text-white text-sm font-medium animate-pulse">
          {t('common.loading')}
        </p>
      </div>
    </div>
  );
};

export default LoadingFallback;
