import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Briefcase } from 'lucide-react';
import { getDivisionLogo } from '../../utils/divisionLogoMap';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const DivisionCard = ({ division, onPdfClick }) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation('divisions');
  const lang = i18n.language;

  const name = division.name?.[lang] || division.name?.en || '';
  const tagline = division.tagline?.[lang] || division.tagline?.en || '';
  const headName = division.headOfDivision?.name?.[lang] || division.headOfDivision?.name?.en || '';
  const focusCount = division.focusAreas?.length || 0;
  const servicesCount = division.services?.length || 0;
  const hasPdf = !!division.pdfResource;
  const logoPath = getDivisionLogo(division.id);

  return (
    <motion.div
      variants={cardVariants}
      className="group relative rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer"
      onClick={() => navigate(`/divisions/${division.slug}`)}
    >
      {/* Division Emblem — full card logo with glow */}
      <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${division.gradient || 'from-slate-700 to-slate-800'}`}>
        {/* Background glow effect */}
        <div
          className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 65%)',
          }}
        />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-black/5" />

        {/* Logo — large, centered */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          {logoPath ? (
            <img
              src={logoPath}
              alt={name}
              loading="lazy"
              className="w-[90%] h-[90%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15))' }}
            />
          ) : (
            <Briefcase size={64} className="text-white/30" />
          )}
        </div>

        {/* PDF Badge */}
        {hasPdf && (
          <button
            onClick={(e) => { e.stopPropagation(); onPdfClick?.(division); }}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/30 transition-colors z-10"
          >
            <FileText size={12} />
            PDF
          </button>
        )}

        {/* Category badge for regional */}
        {division.category === 'regional' && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/20 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider z-10">
            Regional Center
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 mb-1.5 group-hover:text-cyan-300 transition-colors">
          {name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-3 leading-relaxed">
          {tagline}
        </p>

        {/* Head of Division */}
        {headName && headName !== 'To be announced' && (
          <p className="text-slate-500 text-xs mb-3 truncate">
            <span className="text-slate-400">Head:</span> {headName}
          </p>
        )}

        {/* Metrics Row */}
        <div className="flex items-center gap-4 mb-4">
          {focusCount > 0 && (
            <div className="text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold">{focusCount}</span>{' '}
              {t('card.metrics.focusAreas', { defaultValue: 'Focus Areas' })}
            </div>
          )}
          {servicesCount > 0 && (
            <div className="text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold">{servicesCount}</span>{' '}
              {t('card.metrics.services', { defaultValue: 'Services' })}
            </div>
          )}
        </div>

        {/* Explore Button */}
        <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
          {t('card.actions.explore', { defaultValue: 'Explore Division' })}
          <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};

export default DivisionCard;
