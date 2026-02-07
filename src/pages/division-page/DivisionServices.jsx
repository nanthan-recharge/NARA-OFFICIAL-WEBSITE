import React from 'react';
import { motion } from 'framer-motion';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const DivisionServices = ({ division, currentLang }) => {
  if (!division.services || division.services.length === 0) return null;
  const dc = getDivisionColors(division.color);

  return (
    <section id="section-services" className="py-14 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
          {getLabel('servicesWeOffer', currentLang)}
        </h2>
        <p className="text-slate-500 text-sm mb-8 max-w-2xl">
          {currentLang === 'en' && 'Our core services and capabilities.'}
          {currentLang === 'si' && 'අපගේ මූලික සේවාවන් සහ හැකියාවන්.'}
          {currentLang === 'ta' && 'எங்கள் முக்கிய சேவைகள் மற்றும் திறன்கள்.'}
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {division.services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all border-l-4 border-l-transparent ${dc.hoverBorder500}`}
            >
              <span className={`text-xs font-medium ${dc.text500} uppercase tracking-wider`}>
                Service {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-semibold text-slate-900 mt-2 mb-2">
                {service.title?.[currentLang] || service.title?.en}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {service.description?.[currentLang] || service.description?.en}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DivisionServices;
