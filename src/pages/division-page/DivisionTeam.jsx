import React from 'react';
import { motion } from 'framer-motion';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const DivisionTeam = ({ division, teamMembers, currentLang }) => {
  const dc = getDivisionColors(division?.color);

  return (
    <section id="section-team" className="py-14 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline text-2xl sm:text-3xl font-semibold text-slate-900 mb-8">
          {getLabel('meetOurTeam', currentLang)}
        </h2>

        {(!teamMembers || teamMembers.length === 0) ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
            <p className="text-slate-400 text-lg">{getLabel('teamInfoComingSoon', currentLang)}</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id || index}
                variants={item}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-5 mb-5">
                    {/* Avatar — division gradient */}
                    <div className={`w-20 h-20 flex-shrink-0 rounded-2xl bg-gradient-to-br ${division?.gradient || 'from-blue-500 to-blue-600'} flex items-center justify-center text-white text-2xl font-bold`}>
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name?.[currentLang] || member.name?.en}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        (member.name?.[currentLang] || member.name?.en)?.charAt(0)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {member.name?.[currentLang] || member.name?.en}
                      </h3>
                      <p className={`${dc.text600} font-medium text-sm mb-1`}>
                        {typeof member.position === 'object' ? member.position?.[currentLang] || member.position?.en : member.position}
                      </p>
                      {member.role && (
                        <p className="text-slate-400 text-xs">
                          {typeof member.role === 'object' ? member.role?.[currentLang] || member.role?.en : member.role}
                        </p>
                      )}

                      {/* Contact Links */}
                      <div className="flex flex-wrap gap-3 mt-2">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className={`text-xs text-slate-400 hover:${dc.text600} transition-colors`}>
                            {member.email}
                          </a>
                        )}
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className={`text-xs text-slate-400 hover:${dc.text600} transition-colors`}>
                            {member.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {typeof member.bio === 'object' ? member.bio?.[currentLang] || member.bio?.en : member.bio}
                    </p>
                  )}

                  {/* Education */}
                  {member.education && (
                    <div className={`mb-4 p-3 ${dc.bg50} border ${dc.border200} rounded-xl`}>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {getLabel('education', currentLang)}
                      </p>
                      <p className="text-sm text-slate-700">
                        {typeof member.education === 'object' ? member.education?.[currentLang] || member.education?.en : member.education}
                      </p>
                    </div>
                  )}

                  {/* Expertise Tags */}
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {getLabel('areasOfExpertise', currentLang)}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.expertise.map((skill, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 ${dc.bg50} border ${dc.border200} text-slate-700 text-xs rounded-full`}
                          >
                            {typeof skill === 'object' ? skill?.[currentLang] || skill?.en : skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publications */}
                  {member.publications && (
                    <div className="pt-4 border-t border-slate-100 text-slate-500">
                      <span className="text-sm">
                        <span className={`${dc.text600} font-bold`}>{member.publications}</span>{' '}
                        {getLabel('publications', currentLang)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DivisionTeam;
