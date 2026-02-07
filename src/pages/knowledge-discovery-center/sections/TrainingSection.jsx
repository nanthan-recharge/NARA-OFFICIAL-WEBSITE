import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Clock, Users, Award, Calendar, ExternalLink } from 'lucide-react';

const TrainingSection = () => {
  const { t } = useTranslation('knowledge');

  const trainings = [
    { id: 1, title: 'Ocean Data Science Fundamentals', type: t('training.types.courses'), level: t('training.levels.beginner'), duration: '12 weeks', seats: 25, startDate: '2024-12-01', instructor: 'Dr. Priya Fernando', price: t('training.labels.free'), color: 'from-cyan-500 to-blue-600' },
    { id: 2, title: 'Marine Conservation Strategies', type: t('training.types.workshops'), level: t('training.levels.intermediate'), duration: '3 days', seats: 15, startDate: '2024-11-25', instructor: 'Prof. Nimal Perera', price: t('training.labels.free'), color: 'from-green-500 to-teal-600' },
    { id: 3, title: 'Advanced Oceanographic Research Methods', type: t('training.types.certifications'), level: t('training.levels.advanced'), duration: '6 weeks', seats: 20, startDate: '2025-01-15', instructor: 'Dr. Ayesha Khan', price: t('training.labels.paid'), color: 'from-purple-500 to-pink-600' },
    { id: 4, title: 'Field Training: Coral Reef Monitoring', type: t('training.types.fieldwork'), level: t('training.levels.intermediate'), duration: '5 days', seats: 12, startDate: '2024-12-10', instructor: 'Dr. Sunil Wickramasinghe', price: t('training.labels.paid'), color: 'from-amber-500 to-orange-600' }
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{t('training.title')}</h2>
          <p className="text-xl text-slate-200">{t('training.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {trainings.map((training, index) => (
            <motion.div key={training.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1, type: 'spring' }} whileHover={{ y: -10 }} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${training.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`} />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${training.color}`}>
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${training.price === t('training.labels.free') ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {training.price}
                  </span>
                </div>

                <span className="text-xs text-slate-200 uppercase tracking-wider">{training.type}</span>
                <h3 className="text-xl font-bold text-white mb-3">{training.title}</h3>
                <p className="text-sm text-slate-200 mb-4">{training.instructor}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {training.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="w-4 h-4 text-green-400" />
                    {training.seats} {t('training.labels.seats')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Award className="w-4 h-4 text-purple-400" />
                    {training.level}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    {training.startDate}
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2">
                  {t('training.labels.enroll')}
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TrainingSection;
