import React from 'react';
import { motion } from 'framer-motion';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const DivisionOverview = ({ division, projects, teamMembers, impactData, currentLang }) => {
  const name = division.name?.[currentLang] || division.name?.en || '';
  const desc = division.description?.[currentLang] || division.description?.en || '';
  const dc = getDivisionColors(division.color);

  return (
    <section id="section-overview" className="py-14 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Description Card */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
        >
          <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-slate-900 mb-1.5">
            {getLabel('aboutThisDivision', currentLang)}
          </h2>
          {division.pdfResource && (
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-4">
              PDF Available
            </span>
          )}

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">{desc}</p>

          {/* Quick Stats — division-colored */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 ${dc.bg50} rounded-xl border ${dc.border200}`}>
            {[
              { value: division.focusAreas?.length || 0, label: getLabel('focusAreas', currentLang) },
              { value: division.services?.length || 0, label: getLabel('services', currentLang) },
              { value: projects?.length || '10+', label: getLabel('projects', currentLang) },
              { value: teamMembers?.length || '15+', label: getLabel('experts', currentLang) },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold ${dc.text600}`}>{s.value}</div>
                <div className="text-xs sm:text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mission & Head of Division */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`bg-white border border-slate-200 rounded-xl p-6 border-l-4 ${dc.border500}`}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              {getLabel('ourMission', currentLang)}
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {currentLang === 'en' && `To advance ${name.toLowerCase()} through cutting-edge research, innovation, and sustainable practices that benefit Sri Lanka's marine and aquatic resources.`}
              {currentLang === 'si' && `ශ්‍රී ලංකාවේ සමුද්‍ර සහ ජලජ සම්පත් වලට ප්‍රයෝජන වන අති නවීන පර්යේෂණ, නවෝත්පාදන සහ තිරසාර පිළිවෙත් හරහා ${division.name?.si || name} දියුණු කිරීම.`}
              {currentLang === 'ta' && `இலங்கையின் கடல் மற்றும் நீர்வள வளங்களுக்கு பயனளிக்கும் அதிநவீன ஆராய்ச்சி, புதுமை மற்றும் நிலையான நடைமுறைகள் மூலம் ${division.name?.ta || name} முன்னேற்றுதல்.`}
            </p>
          </motion.div>

          {division.headOfDivision && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {getLabel('headOfDivision', currentLang)}
              </h3>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${division.gradient || 'from-blue-500 to-blue-600'} rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                  {(division.headOfDivision.name?.[currentLang] || division.headOfDivision.name?.en)?.charAt(0) || 'H'}
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">
                    {division.headOfDivision.name?.[currentLang] || division.headOfDivision.name?.en}
                  </div>
                  <div className="text-sm text-slate-500">
                    {division.headOfDivision.title?.[currentLang] || division.headOfDivision.title?.en}
                  </div>
                  {division.areaOfResponsibility && (
                    <div className={`mt-1.5 text-xs ${dc.text600} font-medium`}>
                      {division.areaOfResponsibility?.[currentLang] || division.areaOfResponsibility?.en}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Key Highlights */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            {getLabel('keyHighlights', currentLang)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects?.length > 0 && (
              <div className={`p-4 ${dc.bg50} border ${dc.border200} rounded-xl`}>
                <div className="font-semibold text-slate-900 text-sm">{getLabel('activeResearchProjects', currentLang)}</div>
                <div className="text-xs text-slate-500 mt-1">{projects.length} {getLabel('ongoingProjects', currentLang)}</div>
              </div>
            )}
            {teamMembers?.length > 0 && (
              <div className={`p-4 ${dc.bg50} border ${dc.border200} rounded-xl`}>
                <div className="font-semibold text-slate-900 text-sm">{getLabel('expertResearchTeam', currentLang)}</div>
                <div className="text-xs text-slate-500 mt-1">{teamMembers.length} {getLabel('scientists', currentLang)}</div>
              </div>
            )}
            {impactData && (
              <div className={`p-4 ${dc.bg50} border ${dc.border200} rounded-xl`}>
                <div className="font-semibold text-slate-900 text-sm">{getLabel('measurableImpact', currentLang)}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {impactData.economicImpact?.valueGenerated} — {impactData.economicImpact?.jobsCreated}+ {getLabel('jobsCreated', currentLang)}
                </div>
              </div>
            )}
            <div className={`p-4 ${dc.bg50} border ${dc.border200} rounded-xl`}>
              <div className="font-semibold text-slate-900 text-sm">{getLabel('internationalRecognition', currentLang)}</div>
              <div className="text-xs text-slate-500 mt-1">{getLabel('collaboratingGlobal', currentLang)}</div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            {getLabel('contactInformation', currentLang)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href={`mailto:${division.contactEmail}`} className={`p-3 ${dc.bg50} border ${dc.border200} rounded-xl ${dc.hoverBorder500} transition-colors group`}>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Email</div>
              <div className={`${dc.text600} text-sm font-medium group-hover:${dc.text700} transition-colors truncate`}>{division.contactEmail}</div>
            </a>
            {division.contactPhone && (
              <a href={`tel:${division.contactPhone}`} className={`p-3 ${dc.bg50} border ${dc.border200} rounded-xl ${dc.hoverBorder500} transition-colors group`}>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Phone</div>
                <div className={`${dc.text600} text-sm font-medium transition-colors`}>{division.contactPhone}</div>
              </a>
            )}
            {division.location && (
              <div className={`p-3 ${dc.bg50} border ${dc.border200} rounded-xl`}>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Location</div>
                <div className="text-slate-700 text-sm font-medium">{division.location}</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DivisionOverview;
