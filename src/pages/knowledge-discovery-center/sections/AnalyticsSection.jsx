import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Download, Award, Globe, Users } from 'lucide-react';

const AnalyticsSection = ({ metrics, publications }) => {
  const stats = [
    { label: 'Total Views', value: '2.5M+', icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { label: 'Downloads', value: metrics?.totalDownloads?.toLocaleString() || '0', icon: Download, color: 'from-green-500 to-teal-500' },
    { label: 'Citations', value: metrics?.totalCitations?.toLocaleString() || '0', icon: Award, color: 'from-purple-500 to-pink-500' },
    { label: 'Global Reach', value: '89 Countries', icon: Globe, color: 'from-amber-500 to-orange-500' },
    { label: 'H-Index', value: metrics?.hIndex || '0', icon: TrendingUp, color: 'from-red-500 to-pink-500' },
    { label: 'Collaborators', value: metrics?.partnerInstitutions || '0', icon: Users, color: 'from-cyan-500 to-blue-500' }
  ];

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Research Impact Analytics</h2>
          <p className="text-xl text-slate-200">Track the reach and influence of marine research</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1, type: 'spring' }} whileHover={{ y: -10 }} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity rounded-2xl`} />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 transition-all">
                <stat.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-200">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AnalyticsSection;
