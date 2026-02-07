import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import MultilingualContent from '../../components/compliance/MultilingualContent';

const RESEARCH_SERVICES = [
  { id: 'papers', icon: Icons.FileText, link: '/research-excellence-portal' },
  { id: 'lab', icon: Icons.FlaskConical, link: '/lab-results' },
  { id: 'vessel', icon: Icons.Ship, link: '/admin/research-vessels' },
  { id: 'data', icon: Icons.Database, link: '/open-data-portal' },
  { id: 'library', icon: Icons.BookOpen, link: '/library' },
  { id: 'collab', icon: Icons.Users, link: '/knowledge-discovery-center' }
];

const STUDENT_SERVICES = [
  { id: 'courses', icon: Icons.GraduationCap, link: '/learning-development-academy' },
  { id: 'intern', icon: Icons.Briefcase, link: '/careers' },
  { id: 'projects', icon: Icons.Award, link: '/research-excellence-portal' },
  { id: 'mentor', icon: Icons.UserCheck, link: '/knowledge-discovery-center' },
  { id: 'shop', icon: Icons.ShoppingBag, link: '/nara-digital-marketplace' }
];

const GRANTS = [
  { id: 'earlyCareer', icon: Icons.DollarSign },
  { id: 'studentGrant', icon: Icons.GraduationCap },
  { id: 'collaborativeFund', icon: Icons.Users }
];

const FACILITIES = [
  { id: 'marineBiologyLab', icon: Icons.Microscope },
  { id: 'oceanographyLab', icon: Icons.Waves },
  { id: 'fishTechnology', icon: Icons.Fish },
  { id: 'researchVessels', icon: Icons.Ship }
];

const toArray = (value) => (Array.isArray(value) ? value : []);

const ResearchersStudentsHub = () => {
  const navigate = useNavigate();
  const { currentUser } = useFirebaseAuth();
  const { t, i18n } = useTranslation('audiences');
  const [activeTab, setActiveTab] = useState('overview');

  const language = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language]);

  const tabItems = useMemo(
    () => [
      { id: 'overview', label: t('researchersHub.tabs.overview'), icon: Icons.LayoutGrid },
      { id: 'research', label: t('researchersHub.tabs.research'), icon: Icons.Microscope },
      { id: 'student', label: t('researchersHub.tabs.students'), icon: Icons.GraduationCap },
      { id: 'grants', label: t('researchersHub.tabs.grants'), icon: Icons.DollarSign },
      { id: 'facilities', label: t('researchersHub.tabs.facilities'), icon: Icons.Building2 }
    ],
    [t]
  );

  return (
    <MultilingualContent language={language}>
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
        <section className="relative border-b border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm mb-6">
                <Icons.Sparkles className="w-4 h-4" /> {t('researchersHub.hero.badge')}
              </span>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {t('researchersHub.hero.title')}
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl">
                {t('researchersHub.hero.description')}
              </p>
              <div className="flex gap-4">
                {currentUser ? (
                  <div className="flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <Icons.CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{t('researchersHub.hero.loggedInAs', { email: currentUser.email })}</span>
                  </div>
                ) : (
                  <>
                    <button onClick={() => navigate('/unified-registration')} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                      <Icons.Microscope className="w-5 h-5" /> {t('researchersHub.hero.researcherLogin')}
                    </button>
                    <button onClick={() => navigate('/unified-registration')} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                      <Icons.GraduationCap className="w-5 h-5" /> {t('researchersHub.hero.studentLogin')}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-3 border-b border-slate-700 mb-8 overflow-x-auto">
            {tabItems.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-200'}`}>
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-8">
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Icons.Microscope className="w-8 h-8" /> {t('researchersHub.overview.research.title')}</h2>
                  <ul className="space-y-3 mb-6">
                    {toArray(t('researchersHub.overview.research.features', { returnObjects: true })).map((item) => (
                      <li key={item} className="flex gap-2"><Icons.CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" /> {item}</li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveTab('research')} className="w-full px-6 py-3 bg-cyan-500 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">{t('researchersHub.overview.research.cta')}</button>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Icons.GraduationCap className="w-8 h-8" /> {t('researchersHub.overview.students.title')}</h2>
                  <ul className="space-y-3 mb-6">
                    {toArray(t('researchersHub.overview.students.features', { returnObjects: true })).map((item) => (
                      <li key={item} className="flex gap-2"><Icons.CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" /> {item}</li>
                    ))}
                  </ul>
                  <button onClick={() => setActiveTab('student')} className="w-full px-6 py-3 bg-purple-500 rounded-lg font-semibold hover:bg-purple-600 transition-colors">{t('researchersHub.overview.students.cta')}</button>
                </div>
              </motion.div>
            )}

            {activeTab === 'research' && (
              <motion.div key="research" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
                {RESEARCH_SERVICES.map((service) => (
                  <div key={service.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                    <service.icon className="w-12 h-12 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{t(`researchersHub.services.research.${service.id}.title`)}</h3>
                    <ul className="space-y-2 mb-4 text-sm text-slate-200">
                      {toArray(t(`researchersHub.services.research.${service.id}.features`, { returnObjects: true })).map((feature) => <li key={feature}>• {feature}</li>)}
                    </ul>
                    <button onClick={() => navigate(service.link)} className="w-full px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors">{t('researchersHub.services.access')}</button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'student' && (
              <motion.div key="student" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
                {STUDENT_SERVICES.map((service) => (
                  <div key={service.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                    <service.icon className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{t(`researchersHub.services.students.${service.id}.title`)}</h3>
                    <ul className="space-y-2 mb-4 text-sm text-slate-200">
                      {toArray(t(`researchersHub.services.students.${service.id}.features`, { returnObjects: true })).map((feature) => <li key={feature}>• {feature}</li>)}
                    </ul>
                    <button onClick={() => navigate(service.link)} className="w-full px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors">{t('researchersHub.services.access')}</button>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'grants' && (
              <motion.div key="grants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {GRANTS.map((grant) => (
                  <div key={grant.id} className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <grant.icon className="w-12 h-12 text-green-400" />
                      <div>
                        <h3 className="text-2xl font-bold">{t(`researchersHub.grants.items.${grant.id}.title`)}</h3>
                        <p className="text-green-400 font-semibold">{t(`researchersHub.grants.items.${grant.id}.amount`)}</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-200 mb-2">{t('researchersHub.grants.deadline')}</p>
                      <p className="text-orange-400 font-semibold mb-3">{t(`researchersHub.grants.items.${grant.id}.deadline`)}</p>
                      <button className="px-6 py-2 bg-green-500 rounded-lg font-semibold hover:bg-green-600 transition-colors">{t('researchersHub.grants.applyNow')}</button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'facilities' && (
              <motion.div key="facilities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
                {FACILITIES.map((facility) => (
                  <div key={facility.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
                    <facility.icon className="w-12 h-12 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{t(`researchersHub.facilities.items.${facility.id}.name`)}</h3>
                    <p className="text-sm text-slate-200 mb-2 flex items-center gap-2"><Icons.MapPin className="w-4 h-4" /> {t(`researchersHub.facilities.items.${facility.id}.location`)}</p>
                    <p className="text-sm text-slate-300 mb-4">{t(`researchersHub.facilities.items.${facility.id}.equipment`)}</p>
                    <button className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors w-full">{t('researchersHub.facilities.bookNow')}</button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </MultilingualContent>
  );
};

export default ResearchersStudentsHub;
