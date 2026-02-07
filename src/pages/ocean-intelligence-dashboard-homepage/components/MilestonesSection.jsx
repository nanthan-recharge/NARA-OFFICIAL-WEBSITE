import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ParticleSystem from '../../../components/shared/ParticleSystem';

const MilestonesSection = () => {
    const { t } = useTranslation(['home']);
    const milestonesContent = t('milestones', { ns: 'home', returnObjects: true });

    // Fallback content if translation is missing
    const timeline = milestonesContent?.timeline || [];
    const achievements = milestonesContent?.achievements || [];

    return (
        <section className="relative py-12 overflow-hidden bg-[#0a192f]">
            {/* Digital Ocean Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#112240] to-[#0a192f]" />
            <div className="absolute inset-0">
                <ParticleSystem count={30} className="opacity-30" />
            </div>

            {/* Glowing Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                {/* Header - Compact */}
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-bold text-white font-space tracking-tight mb-2"
                    >
                        {milestonesContent?.heading || "Four Decades of Excellence"}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto"
                    >
                        {milestonesContent?.subheading || "Celebrating milestones in marine research, conservation, and innovation since 1981"}
                    </motion.p>
                </div>

                {/* Timeline - No Icons, Minimalist Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 border-b border-white/10 pb-10">
                    {timeline.map((milestone, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono mb-1">
                                {milestone.year}
                            </div>
                            <h3 className="text-sm font-semibold text-slate-200 mb-1">
                                {milestone.title}
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed px-2">
                                {milestone.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Impact/Achievements - No Icons, Just Numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="text-center p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                        >
                            <div className="text-2xl md:text-3xl font-bold text-white mb-1 font-space">
                                {item.number}
                            </div>
                            <div className="text-[10px] md:text-xs uppercase tracking-wider text-cyan-400 font-medium">
                                {item.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MilestonesSection;
