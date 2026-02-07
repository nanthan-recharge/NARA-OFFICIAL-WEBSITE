import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, FolderGit, MessageSquare, GitBranch, Shield, CheckCircle } from 'lucide-react';

const CollaborationSection = () => {
  const { t } = useTranslation('knowledge');

  const features = [
    { icon: FolderGit, title: 'Shared Workspaces', description: 'Collaborate in real-time', color: 'from-cyan-500 to-blue-600' },
    { icon: MessageSquare, title: 'Discussion Forums', description: 'Engage with community', color: 'from-purple-500 to-pink-600' },
    { icon: GitBranch, title: 'Version Control', description: 'Track all changes', color: 'from-green-500 to-teal-600' },
    { icon: Shield, title: 'Secure Data Sharing', description: 'Protected access controls', color: 'from-amber-500 to-orange-600' },
    { icon: Users, title: 'Team Management', description: 'Organize collaborators', color: 'from-blue-500 to-indigo-600' },
    { icon: CheckCircle, title: 'Peer Review', description: 'Expert feedback system', color: 'from-pink-500 to-rose-600' }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{t('collaboration.title')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-200">{t('collaboration.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 px-4">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="text-center">
              <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
                <feature.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-200">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-lg">
            {t('collaboration.actions.createWorkspace')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
