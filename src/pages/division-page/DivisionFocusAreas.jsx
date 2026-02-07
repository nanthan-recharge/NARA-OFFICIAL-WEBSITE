import React from 'react';
import { motion } from 'framer-motion';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const DivisionFocusAreas = ({ division, currentLang }) => {
  if (!division.focusAreas || division.focusAreas.length === 0) return null;
  const dc = getDivisionColors(division.color);

  return (
    <section id="section-focus" className={`py-14 sm:py-16 px-4 ${dc.bg50}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${division.gradient || 'from-blue-500 to-blue-600'}`} />
          <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-slate-900">
            {getLabel('researchFocusAreas', currentLang)}
          </h2>
        </div>
        <p className="text-slate-500 text-sm mb-8 max-w-2xl">
          {currentLang === 'en' && 'Key areas of research and development focus.'}
          {currentLang === 'si' && 'පර්යේෂණ සහ සංවර්ධන අවධානය යොමු කරන ප්‍රධාන ක්ෂේත්‍ර.'}
          {currentLang === 'ta' && 'ஆராய்ச்சி மற்றும் மேம்பாட்டு கவனம் செலுத்தும் முக்கிய பகுதிகள்.'}
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {division.focusAreas.map((area, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow border-l-4 ${dc.border500}`}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-1.5">
                {area.title?.[currentLang] || area.title?.en}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {area.description?.[currentLang] || area.description?.en}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DivisionFocusAreas;
