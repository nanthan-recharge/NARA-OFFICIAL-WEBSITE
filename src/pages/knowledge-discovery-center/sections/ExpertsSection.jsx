import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, BookOpen, Briefcase, Calendar, Mail } from 'lucide-react';

const ExpertsSection = ({ teams }) => {
  const { t } = useTranslation('knowledge');

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{t('experts.title')}</h2>
          <p className="text-xl text-slate-200">{t('experts.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {teams?.map((team, index) => (
            <motion.div key={team.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{team.lead}</h3>
                  <p className="text-sm text-slate-200">{t('experts.expertCard.specialization')}</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-4">{team.focus}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200 flex items-center gap-2"><Briefcase className="w-4 h-4" /> {t('experts.expertCard.experience')}</span>
                  <span className="text-white font-semibold">15+ years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-200 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {t('experts.expertCard.publications')}</span>
                  <span className="text-cyan-400 font-semibold">{team.publications}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('experts.expertCard.bookNow')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ExpertsSection;
