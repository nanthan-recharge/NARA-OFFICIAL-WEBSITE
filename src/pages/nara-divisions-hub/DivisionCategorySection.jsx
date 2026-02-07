import React from 'react';
import { motion } from 'framer-motion';
import DivisionCard from './DivisionCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const DivisionCategorySection = ({ id, title, subtitle, icon: Icon, divisions, gradient, onPdfClick }) => {
  if (!divisions || divisions.length === 0) return null;

  return (
    <section id={id} className="py-16 sm:py-20 px-4 relative">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center`}>
            {Icon && <Icon size={20} className="text-white" />}
          </div>
          <div className={`h-0.5 w-16 bg-gradient-to-r ${gradient || 'from-blue-500 to-cyan-500'} rounded-full`} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-space mb-2">
          {title}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          {subtitle}
        </p>
        <div className="mt-2 text-xs text-slate-500 font-medium">
          {divisions.length} {divisions.length === 1 ? 'division' : 'divisions'}
        </div>
      </div>

      {/* Division Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {divisions.map((division) => (
          <DivisionCard
            key={division.id}
            division={division}
            onPdfClick={onPdfClick}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default DivisionCategorySection;
