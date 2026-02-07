import React from 'react';
import { motion } from 'framer-motion';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

const DivisionProjects = ({ division, projects, currentLang }) => {
  const dc = getDivisionColors(division?.color);

  return (
    <section id="section-projects" className={`py-14 sm:py-16 px-4 ${dc.bg50}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${division?.gradient || 'from-blue-500 to-blue-600'}`} />
        </div>
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-slate-900 mb-8">
          {getLabel('activeProjects', currentLang)}
        </h2>

        {(!projects || projects.length === 0) ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
            <p className="text-slate-400 text-lg">{getLabel('noProjectsYet', currentLang)}</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-5"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id || index}
                variants={item}
                className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {project.title?.[currentLang] || project.titleEN || project.title?.en}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {project.description?.[currentLang] || project.descriptionEN || project.description?.en}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                    project.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : project.status === 'Completed'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {project.status === 'Active' ? getLabel('active', currentLang) :
                     project.status === 'Completed' ? getLabel('completed', currentLang) :
                     project.status}
                  </span>
                </div>

                {project.startDate && (
                  <div className={`flex items-center gap-5 text-sm text-slate-500 mt-4 pt-4 border-t ${dc.border200}`}>
                    <span>
                      {project.startDate} – {project.endDate || getLabel('ongoing', currentLang)}
                    </span>
                    {project.fundingSource && (
                      <span className="text-slate-400">
                        Funded by {project.fundingSource}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DivisionProjects;
