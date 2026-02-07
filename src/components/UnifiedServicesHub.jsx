import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ParticleSystem from './shared/ParticleSystem';
import Icon from './AppIcon';

const UnifiedServicesHub = () => {
  const { t } = useTranslation('home');
  const [activeTab, setActiveTab] = useState('portals');
  const content = t('unifiedHub', { returnObjects: true });

  const portalLinks = [
    '/research-excellence-portal',
    '/government-services-portal',
    '/nara-digital-marketplace'
  ];

  return (
    <div className="relative w-full h-full">
      {/* Background - Exact match to Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep via-ocean-medium to-ocean-light" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-transparent to-background/90" />

      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />

      {/* Particle System - Exact Config */}
      <ParticleSystem
        particleCount={60}
        particleColor="rgba(6, 182, 212, 0.4)"
        speed={0.5}
        size="sm"
      />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-10">
        {/* Header Section */}
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {content?.heading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            {content?.subheading}
          </motion.p>
        </div>

        {/* Navigation Tabs - Glass Button Style */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1.5 rounded-full bg-ocean-deep/40 border border-white/5 backdrop-blur-xl scale-90 md:scale-100">
            {['portals', 'services', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-xs font-cta font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === tab
                  ? 'bg-coral-warm text-white shadow-lg shadow-coral-warm/25'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                {content?.tabs?.[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="min-h-[400px]">
          {/* Portals Content */}
          {activeTab === 'portals' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {content?.portals?.map((portal, idx) => (
                <Link key={idx} to={portalLinks[idx]} className="h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="h-full glass-card p-6 group hover:bg-white/10 transition-all duration-500 border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-headline font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {portal.title}
                      </h3>
                      <Icon name="ArrowUpRight" className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                    </div>

                    <p className="text-xs font-bold text-coral-warm tracking-wider uppercase mb-3 opacity-80">
                      {portal.subtitle}
                    </p>

                    <p className="border-b border-white/10 pb-4 mb-4 text-sm text-white/60 leading-relaxed min-h-[40px]">
                      {portal.description}
                    </p>

                    <div className="grid grid-cols-2 gap-8">
                      {portal.metrics?.map((metric, i) => (
                        <div key={i}>
                          <div className="text-3xl font-headline font-bold text-white mb-1">
                            {metric.value}
                          </div>
                          <div className="text-xs font-cta font-bold text-white/30 uppercase tracking-widest">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-cyan-400 font-bold uppercase text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <span>{portal.cta}</span>
                      <Icon name="ChevronRight" size={16} />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* Services Content */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {content?.services?.map((service, idx) => {
                const badgeValue = service.turnaround || service.availability || service.access || service.programs || service.response || service.updated;
                return (
                  <Link key={idx} to={service.link}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card p-6 h-full hover:border-cyan-500/30 transition-all duration-300 group flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-cyan-400 group-hover:text-white group-hover:bg-cyan-500/20 transition-all">
                            <Icon name={service.icon} size={18} />
                          </div>
                          <h4 className="text-lg font-headline font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {service.title}
                          </h4>
                        </div>
                      </div>

                      <p className="text-white/70 text-sm leading-relaxed mb-4 flex-grow">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                        {badgeValue && (
                          <span className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-wider">
                            {badgeValue}
                          </span>
                        )}
                        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Access</span>
                          <Icon name="ChevronRight" size={12} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Tools Content */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content?.quickTools?.map((tool, idx) => (
                <Link key={idx} to={tool.link}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all duration-300 group min-h-[140px]"
                  >
                    <div className="mb-4 text-white/40 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300">
                      <Icon name={tool.icon} size={32} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-base md:text-lg font-headline font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h4>
                    <div className="w-8 h-0.5 bg-white/10 group-hover:bg-cyan-400 transition-colors duration-300" />
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedServicesHub;
