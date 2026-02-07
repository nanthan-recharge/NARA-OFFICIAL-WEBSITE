import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { getLabel } from '../../utils/divisionTranslations';
import { getDivisionColors } from '../../utils/divisionColorMap';

const LazyChart = lazy(() => import('./ImpactChart'));

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const ChartFallback = () => (
  <div className="w-full h-[300px] bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">
    <span className="text-slate-400 text-sm">Loading chart...</span>
  </div>
);

const DivisionImpact = ({ division, impactData, currentLang }) => {
  if (!impactData) return null;
  const dc = getDivisionColors(division?.color);

  return (
    <section id="section-impact" className={`py-14 sm:py-16 px-4 ${dc.bg50}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
            {getLabel('impactAnalytics', currentLang)}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
            {getLabel('dataDrivenInsights', currentLang)}
          </p>
        </div>

        {/* Key Metrics Grid — division-colored values */}
        {impactData.keyMetrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {impactData.keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  {metric.trend && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {metric.trend}
                    </span>
                  )}
                </div>
                <div className={`text-3xl font-black ${dc.text600}`}>{metric.value}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Research Output Chart — division color */}
        {impactData.researchOutput && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h3 className="text-xl font-bold text-slate-900">{getLabel('researchPublicationsTrend', currentLang)}</h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${dc.bg500}`} />
                  <span className="text-slate-500">
                    {getLabel('publications', currentLang)} ({impactData.researchOutput.citations} {getLabel('citations', currentLang)})
                  </span>
                </div>
                <div className={`px-2.5 py-1 ${dc.bg50} ${dc.text700} rounded-full text-xs font-bold`}>
                  {getLabel('hIndex', currentLang)}: {impactData.researchOutput.hIndex}
                </div>
              </div>
            </div>
            <Suspense fallback={<ChartFallback />}>
              <LazyChart data={impactData.researchOutput.publications} dataKey="count" color={dc.hex} />
            </Suspense>
          </motion.div>
        )}

        {/* Impact Stories */}
        {impactData.impactStories && impactData.impactStories.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              {getLabel('successStories', currentLang)}
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              {impactData.impactStories.map((story, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <h4 className="text-lg font-bold text-slate-900">{story.title}</h4>
                    <span className={`px-2.5 py-1 ${dc.bg50} ${dc.text700} rounded-full text-xs font-bold whitespace-nowrap`}>{story.year}</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">{story.description}</p>
                  <div className={`grid grid-cols-3 gap-3 p-3 ${dc.bg50} border ${dc.border200} rounded-xl`}>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">{getLabel('before', currentLang)}</div>
                      <div className="text-xl font-bold text-slate-900">{story.metrics.before.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">{story.metrics.unit}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-slate-400 text-lg">&rarr;</span>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">{getLabel('after', currentLang)}</div>
                      <div className="text-xl font-bold text-emerald-700">{story.metrics.after.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-emerald-700">{story.metrics.improvement}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Economic Impact & Partnerships */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Economic Impact — division gradient */}
          {impactData.economicImpact && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`bg-gradient-to-br ${division?.gradient || 'from-blue-500 to-blue-600'} rounded-xl p-6 sm:p-8 text-white`}
            >
              <h3 className="text-xl font-bold mb-5">
                {getLabel('economicImpact', currentLang)}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">{getLabel('valueGenerated', currentLang)}</div>
                  <div className="text-3xl sm:text-4xl font-black">{impactData.economicImpact.valueGenerated}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <div className="text-sm opacity-80">{getLabel('jobsCreated', currentLang)}</div>
                    <div className="text-2xl sm:text-3xl font-bold">{impactData.economicImpact.jobsCreated}+</div>
                  </div>
                  <div>
                    <div className="text-sm opacity-80">
                      {impactData.economicImpact.fisheriesImproved ? getLabel('fisheries', currentLang) :
                       impactData.economicImpact.communitiesBenefited ? getLabel('communities', currentLang) :
                       impactData.economicImpact.farmsEstablished ? getLabel('farms', currentLang) :
                       impactData.economicImpact.householdsBenefited ? getLabel('households', currentLang) :
                       impactData.economicImpact.vesselsSafeguarded ? getLabel('vessels', currentLang) :
                       impactData.economicImpact.processingUnitsImproved ? getLabel('processingUnits', currentLang) :
                       impactData.economicImpact.professionalsUpskilled ? getLabel('professionals', currentLang) :
                       impactData.economicImpact.waterBodiesImproved ? getLabel('waterBodies', currentLang) :
                       getLabel('beneficiaries', currentLang)}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold">
                      {impactData.economicImpact.fisheriesImproved ||
                       impactData.economicImpact.communitiesBenefited ||
                       impactData.economicImpact.farmsEstablished ||
                       impactData.economicImpact.householdsBenefited ||
                       impactData.economicImpact.vesselsSafeguarded ||
                       impactData.economicImpact.processingUnitsImproved ||
                       impactData.economicImpact.professionalsUpskilled ||
                       impactData.economicImpact.waterBodiesImproved || 0}+
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Partnerships */}
          {impactData.partnerships && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-5">
                {getLabel('globalPartnerships', currentLang)}
              </h3>
              <p className="text-slate-500 mb-5 text-sm">
                {getLabel('collaboratingWith', currentLang)} {impactData.partnerships.length} {getLabel('internationalOrganizations', currentLang)}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {impactData.partnerships.map((partner, idx) => (
                  <div
                    key={idx}
                    className={`${dc.bg50} border ${dc.border200} rounded-xl p-3 text-center`}
                  >
                    <div className="font-medium text-sm text-slate-700">{partner}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DivisionImpact;
