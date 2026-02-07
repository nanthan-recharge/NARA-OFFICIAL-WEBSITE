import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, BookOpen, Database, Users, GraduationCap, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const { t } = useTranslation('knowledge');

  const stats = useMemo(() => [
    { 
      value: t('hero.stats.publications.value'),
      label: t('hero.stats.publications.label'),
      icon: BookOpen,
      color: 'from-cyan-400 to-blue-600'
    },
    { 
      value: t('hero.stats.datasets.value'),
      label: t('hero.stats.datasets.label'),
      icon: Database,
      color: 'from-purple-400 to-pink-600'
    },
    { 
      value: t('hero.stats.researchers.value'),
      label: t('hero.stats.researchers.label'),
      icon: Users,
      color: 'from-green-400 to-emerald-600'
    },
    { 
      value: t('hero.stats.training.value'),
      label: t('hero.stats.training.label'),
      icon: GraduationCap,
      color: 'from-amber-400 to-orange-600'
    }
  ], [t]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-blue-900/30 to-purple-900/20" />
        
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,194,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.1) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-xl mb-8"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-300 font-semibold tracking-wide">
            {t('hero.badge')}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 px-4"
        >
          <span className="block text-white mb-3 leading-tight">{t('hero.title')}</span>
          <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            {t('hero.titleHighlight')}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed px-4"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2">
            {t('hero.cta.primary')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white font-semibold hover:bg-white/10 transition-all">
            {t('hero.cta.secondary')}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`} />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
                <stat.icon className="w-8 h-8 text-cyan-400 mb-3 mx-auto" />
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-200">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
