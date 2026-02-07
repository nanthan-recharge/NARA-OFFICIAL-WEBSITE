import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { circulationService } from '../../services/libraryService';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  BookMarked,
  Bookmark,
  Clock,
  User,
  LogOut,
  Search,
  Microscope,
  HelpCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  History,
  BookCopy,
  CalendarClock,
  CreditCard,
  Settings,
  Edit2,
  Save,
  RefreshCw,
  Library,
  ChevronRight,
  Shield,
  Mail,
  Phone,
  Building2,
  FlaskConical,
  ExternalLink,
  Calendar,
  Tag,
  AlertTriangle
} from 'lucide-react';
import { RoleGuard } from '../../components/library';
import { useTranslation } from 'react-i18next';

// ─── Stat Card Component ───────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, sub }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-500', value: 'text-blue-900', label: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-500', value: 'text-emerald-900', label: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'text-amber-500', value: 'text-amber-900', label: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', icon: 'text-purple-500', value: 'text-purple-900', label: 'text-purple-600' }
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${c.label}`}>{label}</p>
          <p className={`text-3xl font-bold ${c.value} mt-1`}>{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
};

// ─── Empty State Component ─────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-xl transition-colors text-sm"
      >
        <Search className="w-4 h-4" />
        {actionLabel}
      </button>
    )}
  </div>
);

// ─── Loan Item Row ─────────────────────────────────────────────────
const LoanItem = ({ item, onRenew, renewing, t }) => {
  const dueDate = item.dueDate ? new Date(item.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date();
  const daysUntilDue = dueDate ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-colors">
      <div className="w-12 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 truncate">{item.title || 'Untitled Item'}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{item.author || 'Unknown Author'}</p>
        {dueDate && (
          <div className={`inline-flex items-center gap-1 mt-1.5 text-xs font-medium ${isOverdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-amber-600' : 'text-slate-500'}`}>
            <CalendarClock className="w-3 h-3" />
            {isOverdue
              ? t('loans.overdue', { defaultValue: 'Overdue' })
              : t('loans.dueIn', { defaultValue: `Due in ${daysUntilDue} days`, count: daysUntilDue })}
            {' - '}{dueDate.toLocaleDateString()}
          </div>
        )}
      </div>
      {onRenew && (
        <button
          onClick={() => onRenew(item.transactionId || item.id)}
          disabled={renewing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0066CC] hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {renewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {t('loans.renew', { defaultValue: 'Renew' })}
        </button>
      )}
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────
const LibraryDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userProfile, signOut, updateProfile } = useLibraryUser();
  const { t } = useTranslation('libraryDashboard');

  const [activeTab, setActiveTab] = useState('loans');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [holds, setHolds] = useState([]);
  const [loansLoading, setLoansLoading] = useState(false);
  const [renewingId, setRenewingId] = useState(null);

  // Show messages from URL params
  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setMessage({ type: 'success', key: 'messages.welcome' });
    } else if (searchParams.get('submission') === 'success') {
      setMessage({ type: 'success', key: 'messages.submissionSuccess' });
    }
  }, [searchParams]);

  // Auto-dismiss messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Populate edit data
  useEffect(() => {
    if (userProfile && !isEditing) {
      setEditData({
        firstName: userProfile.profile?.firstName || '',
        lastName: userProfile.profile?.lastName || '',
        phoneNumber: userProfile.profile?.phoneNumber || '',
        institution: userProfile.profile?.institution || '',
        researchArea: userProfile.profile?.researchArea || '',
      });
    }
  }, [userProfile, isEditing]);

  // Load loans
  useEffect(() => {
    const loadLoans = async () => {
      if (!userProfile?.uid) return;
      setLoansLoading(true);
      try {
        const [activeLoans, history, patronHolds] = await Promise.allSettled([
          circulationService.getPatronActiveLoans(userProfile.uid),
          circulationService.getPatronHistory(userProfile.uid),
          circulationService.getPatronHolds(userProfile.uid)
        ]);
        if (activeLoans.status === 'fulfilled') setLoans(activeLoans.value?.data || []);
        if (history.status === 'fulfilled') setLoanHistory(history.value?.data || []);
        if (patronHolds.status === 'fulfilled') setHolds(patronHolds.value?.data || []);
      } catch (err) {
        console.error('Error loading circulation data:', err);
      } finally {
        setLoansLoading(false);
      }
    };
    loadLoans();
  }, [userProfile?.uid]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateProfile({
        profile: {
          ...userProfile.profile,
          ...editData,
          displayName: `${editData.firstName} ${editData.lastName}`.trim()
        }
      });
      setIsEditing(false);
      setMessage({ type: 'success', key: 'messages.updateSuccess' });
    } catch (err) {
      setMessage({ type: 'error', key: 'messages.updateError' });
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = useCallback(async (transactionId) => {
    setRenewingId(transactionId);
    try {
      await circulationService.renewItem(transactionId);
      setMessage({ type: 'success', text: 'Item renewed successfully' });
      const result = await circulationService.getPatronActiveLoans(userProfile.uid);
      setLoans(result?.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to renew item' });
    } finally {
      setRenewingId(null);
    }
  }, [userProfile?.uid]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/library-login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      researcher: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      student: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      public: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
    };
    return styles[role] || styles.public;
  };

  const roleLabels = useMemo(() => ({
    researcher: t('roles.researcher', { defaultValue: 'Researcher' }),
    student: t('roles.student', { defaultValue: 'Student' }),
    public: t('roles.public', { defaultValue: 'Free Reader' }),
    default: t('roles.default', { defaultValue: 'Member' })
  }), [t]);

  const tabs = useMemo(() => [
    { id: 'loans', label: t('tabs.loans', { defaultValue: 'My Loans' }), icon: BookCopy, count: loans.length },
    { id: 'history', label: t('tabs.history', { defaultValue: 'Reading History' }), icon: History, count: loanHistory.length },
    { id: 'bookmarks', label: t('tabs.bookmarks', { defaultValue: 'Bookmarks' }), icon: Bookmark },
    { id: 'holds', label: t('tabs.holds', { defaultValue: 'Holds' }), icon: CalendarClock, count: holds.length },
    { id: 'account', label: t('tabs.account', { defaultValue: 'My Account' }), icon: CreditCard }
  ], [t, loans.length, loanHistory.length, holds.length]);

  const daysMember = useMemo(() => {
    if (!userProfile?.accountCreatedAt) return 0;
    const created = userProfile.accountCreatedAt?.toDate
      ? userProfile.accountCreatedAt.toDate()
      : new Date(userProfile.accountCreatedAt);
    return Math.floor((new Date() - created) / (1000 * 60 * 60 * 24));
  }, [userProfile?.accountCreatedAt]);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#003366]" />
          <p className="text-sm text-slate-500">{t('loading', { defaultValue: 'Loading your dashboard...' })}</p>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(userProfile.role);
  const displayedRole = roleLabels[userProfile.role] || roleLabels.default;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#003366] flex items-center justify-center">
                <Library className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#003366]">NARA Library</span>
                <span className="text-xs text-slate-400 ml-2 hidden sm:inline">{t('header.dashboard', { defaultValue: 'Member Dashboard' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/library"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-[#003366] hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
                {t('buttons.browseCatalogue', { defaultValue: 'Browse Library' })}
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('header.signOut', { defaultValue: 'Sign Out' })}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Message Banner */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">
                {message.key ? t(message.key, { defaultValue: message.key }) : message.text || ''}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003366] to-[#0066CC] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {userProfile.profile?.firstName?.[0]?.toUpperCase()}{userProfile.profile?.lastName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t('header.welcome', { defaultValue: 'Welcome back,' })}{' '}
                {userProfile.profile?.displayName || t('roles.default', { defaultValue: 'Member' })}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}>
                  <Shield className="w-3 h-3" />
                  {displayedRole}
                </span>
                <span className="text-sm text-slate-500">
                  {t('header.cardLabel', {
                    defaultValue: 'Card: ',
                    cardNumber: userProfile.libraryCard?.cardNumber || '--'
                  })}
                  <span className="font-mono text-slate-700">{userProfile.libraryCard?.cardNumber || '--'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={BookCopy}
            label={t('stats.borrowed', { defaultValue: 'Items Borrowed' })}
            value={userProfile.statistics?.activeLoans || 0}
            color="blue"
            sub={t('stats.borrowedSub', { defaultValue: 'Currently active' })}
          />
          <StatCard
            icon={BookMarked}
            label={t('stats.read', { defaultValue: 'Items Read' })}
            value={userProfile.statistics?.totalBorrowed || 0}
            color="green"
            sub={t('stats.readSub', { defaultValue: 'Total lifetime' })}
          />
          <StatCard
            icon={Bookmark}
            label={t('stats.bookmarks', { defaultValue: 'Bookmarks' })}
            value={0}
            color="amber"
            sub={t('stats.bookmarksSub', { defaultValue: 'Saved items' })}
          />
          <StatCard
            icon={Calendar}
            label={t('stats.member', { defaultValue: 'Days Member' })}
            value={daysMember}
            color="purple"
            sub={t('stats.memberSub', { defaultValue: 'Active membership' })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? 'bg-[#003366] text-white font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.count > 0 && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {t('sidebar.quickActions', { defaultValue: 'Quick Actions' })}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => navigate('/library')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    {t('buttons.browseCatalogue', { defaultValue: 'Browse Library' })}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>
                <RoleGuard allowedRoles={['researcher']}>
                  <button
                    onClick={() => navigate('/library-research-submit')}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Microscope className="w-4 h-4" />
                      {t('buttons.submitResearch', { defaultValue: 'Submit Research' })}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-300 group-hover:text-purple-500 transition-colors" />
                  </button>
                </RoleGuard>
                <button
                  onClick={() => navigate('/contact-us')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    {t('buttons.getHelp', { defaultValue: 'Get Help' })}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <AnimatePresence mode="wait">
                {/* ─── My Loans Tab ─────────────────────────── */}
                {activeTab === 'loans' && (
                  <motion.div
                    key="loans"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-900">
                        {t('loans.title', { defaultValue: 'My Loans' })}
                      </h2>
                      <span className="text-sm text-slate-500">
                        {t('loans.count', { defaultValue: `${loans.length} active`, count: loans.length })}
                      </span>
                    </div>

                    {loansLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-[#003366]" />
                      </div>
                    ) : loans.length > 0 ? (
                      <div className="space-y-3">
                        {loans.map((loan, idx) => (
                          <LoanItem
                            key={loan.id || idx}
                            item={loan}
                            onRenew={handleRenew}
                            renewing={renewingId === (loan.transactionId || loan.id)}
                            t={t}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={BookOpen}
                        title={t('loans.emptyTitle', { defaultValue: 'No active loans' })}
                        description={t('loans.emptyDesc', { defaultValue: 'You have no items currently checked out. Browse the library to find something to read.' })}
                        actionLabel={t('buttons.browseCatalogue', { defaultValue: 'Browse Library' })}
                        onAction={() => navigate('/library')}
                      />
                    )}
                  </motion.div>
                )}

                {/* ─── Reading History Tab ──────────────────── */}
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                      {t('history.title', { defaultValue: 'Reading History' })}
                    </h2>

                    {loansLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-[#003366]" />
                      </div>
                    ) : loanHistory.length > 0 ? (
                      <div className="space-y-3">
                        {loanHistory.map((item, idx) => (
                          <div key={item.id || idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white">
                            <div className="w-12 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <BookMarked className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 truncate">{item.title || 'Untitled Item'}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{item.author || 'Unknown Author'}</p>
                              {item.returnDate && (
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {t('history.returned', { defaultValue: 'Returned' })}{' '}
                                  {new Date(item.returnDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={History}
                        title={t('history.emptyTitle', { defaultValue: 'No reading history' })}
                        description={t('history.emptyDesc', { defaultValue: 'Your completed loan history will appear here once you return items.' })}
                        actionLabel={t('buttons.browseCatalogue', { defaultValue: 'Browse Library' })}
                        onAction={() => navigate('/library')}
                      />
                    )}
                  </motion.div>
                )}

                {/* ─── Bookmarks Tab ───────────────────────── */}
                {activeTab === 'bookmarks' && (
                  <motion.div
                    key="bookmarks"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                      {t('bookmarks.title', { defaultValue: 'Bookmarks' })}
                    </h2>
                    <EmptyState
                      icon={Bookmark}
                      title={t('bookmarks.emptyTitle', { defaultValue: 'No bookmarks yet' })}
                      description={t('bookmarks.emptyDesc', { defaultValue: 'Save items you find interesting to easily find them later.' })}
                      actionLabel={t('buttons.browseCatalogue', { defaultValue: 'Browse Library' })}
                      onAction={() => navigate('/library')}
                    />
                  </motion.div>
                )}

                {/* ─── Holds Tab ───────────────────────────── */}
                {activeTab === 'holds' && (
                  <motion.div
                    key="holds"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-6">
                      {t('holds.title', { defaultValue: 'Items on Hold' })}
                    </h2>

                    {holds.length > 0 ? (
                      <div className="space-y-3">
                        {holds.map((hold, idx) => (
                          <div key={hold.id || idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white">
                            <div className="w-12 h-16 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                              <CalendarClock className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 truncate">{hold.title || 'Untitled Item'}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">{hold.author || 'Unknown Author'}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                  hold.status === 'ready'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}>
                                  <Tag className="w-3 h-3" />
                                  {hold.status === 'ready'
                                    ? t('holds.ready', { defaultValue: 'Ready for pickup' })
                                    : t('holds.waiting', { defaultValue: 'Waiting' })}
                                </span>
                                {hold.position && (
                                  <span className="text-xs text-slate-400">
                                    {t('holds.position', { defaultValue: `Position: ${hold.position}`, position: hold.position })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={CalendarClock}
                        title={t('holds.emptyTitle', { defaultValue: 'No items on hold' })}
                        description={t('holds.emptyDesc', { defaultValue: 'When items you want are unavailable, you can place them on hold here.' })}
                        actionLabel={t('buttons.browseCatalogue', { defaultValue: 'Browse Library' })}
                        onAction={() => navigate('/library')}
                      />
                    )}
                  </motion.div>
                )}

                {/* ─── My Account Tab ──────────────────────── */}
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-900">
                        {t('account.title', { defaultValue: 'My Account' })}
                      </h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-xl transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t('buttons.editProfile', { defaultValue: 'Edit Profile' })}
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                          >
                            {t('buttons.cancel', { defaultValue: 'Cancel' })}
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                            {t('buttons.saveChanges', { defaultValue: 'Save' })}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-6">
                      {/* Personal Details */}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          {t('account.personal', { defaultValue: 'Personal Details' })}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              {t('account.fields.firstName', { defaultValue: 'First Name' })}
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="firstName"
                                value={editData.firstName}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] outline-none"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-900">{userProfile.profile?.firstName || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              {t('account.fields.lastName', { defaultValue: 'Last Name' })}
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="lastName"
                                value={editData.lastName}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] outline-none"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-900">{userProfile.profile?.lastName || '-'}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              {t('account.fields.email', { defaultValue: 'Email' })}
                            </label>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-900">{userProfile.email}</p>
                              {user?.emailVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                  <CheckCircle className="w-3 h-3" />
                                  {t('account.verified', { defaultValue: 'Verified' })}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                                  <AlertTriangle className="w-3 h-3" />
                                  {t('account.unverified', { defaultValue: 'Unverified' })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">
                              {t('account.fields.phone', { defaultValue: 'Phone' })}
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                name="phoneNumber"
                                value={editData.phoneNumber}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] outline-none"
                              />
                            ) : (
                              <p className="text-sm font-medium text-slate-900">{userProfile.profile?.phoneNumber || '-'}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Role-specific fields */}
                      {(userProfile.role === 'student' || userProfile.role === 'researcher') && (
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {t('account.academic', { defaultValue: 'Academic Details' })}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">
                                {t('account.fields.institution', { defaultValue: 'Institution' })}
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="institution"
                                  value={editData.institution}
                                  onChange={handleEditChange}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] outline-none"
                                />
                              ) : (
                                <p className="text-sm font-medium text-slate-900">{userProfile.profile?.institution || '-'}</p>
                              )}
                            </div>
                            {userProfile.role === 'researcher' && (
                              <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                  {t('account.fields.researchArea', { defaultValue: 'Research Area' })}
                                </label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    name="researchArea"
                                    value={editData.researchArea}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] outline-none"
                                  />
                                ) : (
                                  <p className="text-sm font-medium text-slate-900">{userProfile.profile?.researchArea || '-'}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Membership & Library Card */}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-slate-400" />
                          {t('account.membership', { defaultValue: 'Membership & Library Card' })}
                        </h3>
                        <div className="bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl p-5 text-white">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                              <Library className="w-5 h-5 text-white/80" />
                              <span className="text-sm font-semibold text-white/90">NARA Library</span>
                            </div>
                            <span className="text-xs font-medium bg-white/20 px-2.5 py-1 rounded-full">
                              {displayedRole}
                            </span>
                          </div>
                          <p className="text-xl font-mono font-bold tracking-wider mb-4">
                            {userProfile.libraryCard?.cardNumber || '--'}
                          </p>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs text-white/50 uppercase">
                                {t('account.card.holder', { defaultValue: 'Card Holder' })}
                              </p>
                              <p className="text-sm font-semibold text-white/90">
                                {userProfile.profile?.displayName || '-'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-white/50 uppercase">
                                {t('account.card.expires', { defaultValue: 'Expires' })}
                              </p>
                              <p className="text-sm font-semibold text-white/90">
                                {userProfile.libraryCard?.expiryDate
                                  ? new Date(userProfile.libraryCard.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                  : '-'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                          <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-xs text-slate-500">{t('account.card.status', { defaultValue: 'Status' })}</p>
                            <p className="text-sm font-semibold text-slate-900 capitalize mt-0.5">{userProfile.libraryCard?.status || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-xs text-slate-500">{t('account.card.maxLoans', { defaultValue: 'Max Loans' })}</p>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{userProfile.permissions?.maxLoans || 0}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-xs text-slate-500">{t('account.card.loanPeriod', { defaultValue: 'Loan Period' })}</p>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{userProfile.permissions?.loanPeriodDays || 0} {t('account.card.days', { defaultValue: 'days' })}</p>
                          </div>
                        </div>
                      </div>

                      {/* Permissions */}
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-slate-400" />
                          {t('account.permissions', { defaultValue: 'Permissions' })}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.permissions?.canBorrow && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                              <CheckCircle className="w-3 h-3" />
                              {t('account.perm.borrow', { defaultValue: 'Can Borrow' })}
                            </span>
                          )}
                          {userProfile.permissions?.canSubmitResearch && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">
                              <CheckCircle className="w-3 h-3" />
                              {t('account.perm.research', { defaultValue: 'Submit Research' })}
                            </span>
                          )}
                          {userProfile.permissions?.canAccessPremium && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                              <CheckCircle className="w-3 h-3" />
                              {t('account.perm.premium', { defaultValue: 'Premium Access' })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Security */}
                      <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-slate-400" />
                          {t('account.security', { defaultValue: 'Security' })}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {t('account.emailVerification', { defaultValue: 'Email Verification' })}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {user?.emailVerified
                                  ? t('account.emailVerified', { defaultValue: 'Your email is verified' })
                                  : t('account.emailNotVerified', { defaultValue: 'Please verify your email' })}
                              </p>
                            </div>
                            {!user?.emailVerified && (
                              <button className="text-xs text-[#0066CC] hover:text-[#003366] font-semibold">
                                {t('buttons.resendVerification', { defaultValue: 'Resend' })}
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {t('account.password', { defaultValue: 'Password' })}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {t('account.passwordDesc', { defaultValue: 'Change your account password' })}
                              </p>
                            </div>
                            <button className="text-xs text-[#0066CC] hover:text-[#003366] font-semibold">
                              {t('buttons.changePassword', { defaultValue: 'Change' })}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryDashboard;
