import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FlaskConical, Calendar, Clock, MapPin, Users, Video,
  Presentation, ExternalLink, Search,
  ChevronRight, PlayCircle, Archive, AlertCircle, RefreshCw
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';

/* ── status badge styles ── */
const STATUS_STYLES = {
  upcoming: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
  ongoing: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  completed: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

/* ── format badge styles (static classes — no dynamic Tailwind) ── */
const FORMAT_OPTIONS = {
  virtual: { icon: Video, label: 'virtual', style: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  'in-person': { icon: Users, label: 'inPerson', style: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  hybrid: { icon: Presentation, label: 'hybrid', style: 'bg-teal-500/20 text-teal-400 border border-teal-500/30' },
};

/**
 * Scientist Session Public Page
 * Dark-themed design consistent with NARA site
 */
const ScientistSessionPage = () => {
  const { t, i18n } = useTranslation('scientistSession');
  const currentLang = i18n.language;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionsRef = collection(db, 'scientist_sessions');
      const q = query(sessionsRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(sessionsData);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming' || s.status === 'ongoing');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  const filteredSessions = (activeTab === 'upcoming' ? upcomingSessions : pastSessions)
    .filter(session =>
      session.title?.[currentLang]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.title?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.presenter?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  /* ── format date nicely ── */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <SEOHead
        title="Scientist Sessions"
        description="NARA scientist sessions — research presentations, seminars, and knowledge sharing events."
        path="/scientist-session"
        keywords="scientist sessions, research seminars, NARA presentations"
      />
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031730] via-[#06254a] to-[#0b3d74] text-white">
        {/* Decorative radial gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.12),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                {t('badge')}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg text-blue-200/70 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t('subtitle')}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
              {[
                { value: upcomingSessions.length, label: t('upcomingSessions'), color: 'text-cyan-400' },
                { value: pastSessions.length, label: t('pastSessions'), color: 'text-blue-400' },
                { value: pastSessions.filter(s => s.recordingUrl).length, label: t('recordings'), color: 'text-emerald-400' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="min-w-[120px] rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-5 py-4"
                >
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Tab pills */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t('upcoming')} ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Archive className="w-4 h-4" />
              {t('past')} ({pastSessions.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
            />
          </div>
        </div>

        {/* ─── Sessions List ─── */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-400 text-sm">{t('loading')}</p>
          </div>
        ) : error ? (
          /* Error state with retry */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('errorTitle')}</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={loadSessions}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/15 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {t('errorRetry')}
            </button>
          </motion.div>
        ) : filteredSessions.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mb-5">
              <FlaskConical className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {activeTab === 'upcoming' ? t('noUpcoming') : t('noPast')}
            </h3>
            <p className="text-sm text-slate-400">
              {activeTab === 'upcoming' ? t('noUpcomingHint') : t('noPastHint')}
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-5">
            <AnimatePresence mode="popLayout">
              {filteredSessions.map((session, index) => {
                const fmt = FORMAT_OPTIONS[session.format] || FORMAT_OPTIONS['in-person'];
                const FormatIcon = fmt.icon;

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.06 }}
                    layout
                    className="group rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                        {/* Date badge */}
                        <div className="flex-shrink-0 hidden sm:block">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nara-navy to-nara-blue flex flex-col items-center justify-center text-white shadow-lg shadow-nara-navy/30">
                            <span className="text-2xl font-bold leading-none">
                              {session.date?.split('-')[2] || '--'}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider opacity-80 mt-0.5">
                              {session.date
                                ? new Date(session.date).toLocaleDateString('en', { month: 'short' })
                                : '---'}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${STATUS_STYLES[session.status] || STATUS_STYLES.completed}`}>
                              {session.status}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${fmt.style}`}>
                              <FormatIcon size={10} />
                              {t(fmt.label)}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-headline text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
                            {session.title?.[currentLang] || session.title?.en || 'Untitled Session'}
                          </h3>

                          {/* Presenter */}
                          {session.presenter?.name && (
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nara-navy to-nara-blue flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {session.presenter.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{session.presenter.name}</div>
                                {session.presenter.designation && (
                                  <div className="text-xs text-slate-400 truncate">{session.presenter.designation}</div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Description */}
                          {(session.description?.[currentLang] || session.description?.en) && (
                            <p className="text-sm text-slate-300/80 mb-3 line-clamp-2 leading-relaxed">
                              {session.description[currentLang] || session.description.en}
                            </p>
                          )}

                          {/* Topics */}
                          {session.topics?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {session.topics.slice(0, 4).map((topic, i) => (
                                <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-white/5 border border-white/10 text-slate-300 rounded-full">
                                  {topic}
                                </span>
                              ))}
                              {session.topics.length > 4 && (
                                <span className="px-2 py-0.5 text-[10px] text-slate-500 rounded-full">
                                  +{session.topics.length - 4}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Meta row */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                            {session.date && (
                              <span className="flex items-center gap-1.5 sm:hidden">
                                <Calendar size={13} className="text-cyan-500" />
                                {formatDate(session.date)}
                              </span>
                            )}
                            {session.time && (
                              <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-cyan-500" />
                                {session.time}
                                {session.duration && ` (${session.duration} ${t('min')})`}
                              </span>
                            )}
                            {session.venue && (
                              <span className="flex items-center gap-1.5">
                                <MapPin size={13} className="text-cyan-500" />
                                {session.venue}
                              </span>
                            )}
                            {session.maxParticipants > 0 && (
                              <span className="flex items-center gap-1.5">
                                <Users size={13} className="text-cyan-500" />
                                {session.currentParticipants || 0}/{session.maxParticipants} {t('registered')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex-shrink-0 flex sm:flex-col gap-2 mt-1 lg:mt-0">
                          {session.status === 'upcoming' && session.registrationUrl && (
                            <a
                              href={session.registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20"
                            >
                              {t('register')}
                              <ExternalLink size={14} />
                            </a>
                          )}
                          {session.recordingUrl && (
                            <a
                              href={session.recordingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/15 hover:border-white/20 transition-all"
                            >
                              <PlayCircle size={14} />
                              {t('watchRecording')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ─── Call to Action ─── */}
      <section className="relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-nara-navy/20 to-nara-blue/10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-4">
              {t('ctaTitle')}
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t('ctaDesc')}
            </p>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20"
            >
              {t('ctaButton')}
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ScientistSessionPage;
