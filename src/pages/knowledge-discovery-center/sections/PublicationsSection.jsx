import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Eye, Share2, ExternalLink, Star } from 'lucide-react';

const PublicationsSection = ({ publications, loading, searchQuery }) => {
  const { t } = useTranslation('knowledge');

  const filteredPubs = useMemo(() => {
    if (!publications) return [];
    if (!searchQuery) return publications.slice(0, 12);
    return publications.filter(pub => 
      pub.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 12);
  }, [publications, searchQuery]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-4" />
              <div className="h-3 bg-white/10 rounded w-full mb-2" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {t('publications.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-200">{t('publications.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredPubs.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-8 h-8 text-cyan-400" />
                {pub.access === 'open' && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                    {t('publications.labels.openAccess')}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                {pub.title}
              </h3>
              
              <p className="text-sm text-slate-200 mb-3">{pub.authors}</p>
              
              <div className="text-xs text-slate-500 mb-4">
                {pub.journal} • {pub.year}
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-200 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {pub.citations || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {pub.downloads || 0}
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  {t('publications.labels.viewPdf')}
                </button>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4 text-slate-200" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPubs.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-200 text-lg">No publications found</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default PublicationsSection;
