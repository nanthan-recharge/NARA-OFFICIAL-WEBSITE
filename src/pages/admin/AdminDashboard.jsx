import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  Download,
  Bell,
  Shield,
  FileText,
  Database,
  Cloud,
  Clock,
  CheckCircle,
  AlertTriangle,
  ListChecks,
  UploadCloud,
  Loader,
  Users,
  Mail,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  dashboardService,
  vacancyIntegrationService,
  adminService,
  handleApiError
} from '../../services/procurementRecruitmentService';

const AdminDashboard = () => {
  const [workspaceStats, setWorkspaceStats] = useState(null);
  const [vacancySummary, setVacancySummary] = useState(null);
  const [vacancyArchive, setVacancyArchive] = useState([]);
  const [isRefreshingVacancies, setIsRefreshingVacancies] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setWorkspaceStats(data);
      } catch (err) {
        setError(handleApiError(err)?.message);
      }
    };

    const loadVacancyData = async () => {
      try {
        const [summary, archive] = await Promise.all([
          vacancyIntegrationService.getSyncSummary(),
          vacancyIntegrationService.getArchive({ status: 'closed', limit: 10 })
        ]);
        setVacancySummary(summary?.summary || summary || null);

        const archiveEntries = Array.isArray(archive?.archive)
          ? archive.archive
          : Array.isArray(archive?.jobs)
            ? archive.jobs
            : Array.isArray(archive)
              ? archive
              : [];
        setVacancyArchive(archiveEntries);
      } catch (err) {
        setError(handleApiError(err)?.message);
      }
    };

    loadDashboard();
    loadVacancyData();
  }, []);

  const handleManualVacancyRefresh = async () => {
    try {
      setIsRefreshingVacancies(true);
      setError(null);
      const summary = await vacancyIntegrationService.getSyncSummary();
      setVacancySummary(summary?.summary || summary || null);
    } catch (err) {
      setError(handleApiError(err)?.message);
    } finally {
      setIsRefreshingVacancies(false);
    }
  };

  const handleCsvExport = async () => {
    try {
      setIsExportingCsv(true);
      setError(null);
      const blob = await adminService.exportApplicantsCsv();
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = `nara-applicants-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(handleApiError(err)?.message);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const vacancyStats = useMemo(() => {
    const summary = vacancySummary || {};
    const open = summary.open_roles ?? summary.open ?? 0;
    const review = summary.under_review ?? summary.in_review ?? summary.reviewing ?? 0;
    const closed = summary.closed_roles ?? summary.closed ?? vacancyArchive.length;
    const gazette = summary.gazette_backlog ?? summary.gazette_pending ?? 0;
    const psc = summary.psc_links ?? summary.psc_backlog ?? 0;
    const lastSynced = summary.last_synced_at || summary.last_sync || summary.generated_at || null;

    return {
      open,
      review,
      closed,
      gazette,
      psc,
      lastSynced
    };
  }, [vacancyArchive.length, vacancySummary]);

  const workspaceMetrics = useMemo(() => ({
    totalUsers: workspaceStats?.statistics?.total_users ?? 0,
    procurement: workspaceStats?.statistics?.procurement_requests ?? 0,
    recruitment: workspaceStats?.statistics?.career_applications ?? 0,
    averageReview: workspaceStats?.statistics?.average_review_time ?? '—'
  }), [workspaceStats]);

  const archivePreview = vacancyArchive.slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">NARA Admin Console</h1>
          <p className="text-slate-500 mt-1">
            Manage procurement, recruitment, and digital operations from one secure workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleManualVacancyRefresh}
            disabled={isRefreshingVacancies}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#0066CC] hover:text-[#0066CC] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-500"
          >
            {isRefreshingVacancies ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sync vacancies
          </button>
          <button
            onClick={handleCsvExport}
            disabled={isExportingCsv}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#003366] to-[#0066CC] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sm transition hover:from-[#002244] hover:to-[#003366] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExportingCsv ? <Loader className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export applicants CSV
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStat icon={Database} label="Registered users" value={workspaceMetrics.totalUsers} accent="from-[#003366] to-[#0066CC]" />
        <DashboardStat icon={FileText} label="Procurement submissions" value={workspaceMetrics.procurement} accent="from-blue-500 to-indigo-600" />
        <DashboardStat icon={Users} label="Career applications" value={workspaceMetrics.recruitment} accent="from-emerald-500 to-teal-500" />
        <DashboardStat icon={Clock} label="Average review time" value={workspaceMetrics.averageReview} accent="from-purple-500 to-pink-500" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <VacancySyncPanel stats={vacancyStats} isRefreshing={isRefreshingVacancies} />
        <VacancyAutomationPanel stats={vacancyStats} archivePreview={archivePreview} />
        <SystemStatusPanel />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <QuickActionsPanel />
        <WorkspaceActivityPanel stats={workspaceStats} />
      </section>
    </div>
  );
};

const DashboardStat = ({ icon: Icon, label, value, accent }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
    <div className={`inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50/70 px-3 py-2 text-sm text-white shadow-inner shadow-slate-100/40 bg-gradient-to-r ${accent}`}>
      <Icon className="h-4 w-4" />
      <span className="uppercase tracking-[0.3em] text-xs text-white/80">{label}</span>
    </div>
    <p className="mt-4 text-3xl font-semibold text-slate-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
  </div>
);

const VacancySyncPanel = ({ stats, isRefreshing }) => {
  const formatRelative = (value) => {
    if (!value) return 'Awaiting sync';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const statItems = [
    { label: 'Open roles', value: stats.open, icon: Users, accent: 'from-emerald-500 to-teal-500' },
    { label: 'Under review', value: stats.review, icon: CheckCircle, accent: 'from-amber-500 to-orange-500' },
    { label: 'Closed roles', value: stats.closed, icon: FileText, accent: 'from-slate-500 to-slate-600' }
  ];

  return (
    <div className="col-span-2 rounded-2xl border border-emerald-500/20 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Vacancy sync</h2>
        <span className="text-xs uppercase tracking-wider text-slate-500">
          Last sync: {isRefreshing ? 'Refreshing...' : formatRelative(stats.lastSynced)}
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {statItems.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1 text-xs uppercase tracking-wider text-white bg-gradient-to-r ${item.accent}`}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Bell className="h-4 w-4 text-emerald-300" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Gazette backlog</p>
            <p className="text-xs text-slate-500">{stats.gazette} flagged mentions require HR confirmation.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Shield className="h-4 w-4 text-emerald-300" />
          <div>
            <p className="text-sm font-semibold text-slate-900">PSC link-backs</p>
            <p className="text-xs text-slate-500">{stats.psc} pending PSC references to embed or archive.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VacancyAutomationPanel = ({ stats, archivePreview }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 className="text-lg font-semibold text-slate-900 mb-4">Automation insights</h2>
    <ul className="space-y-3 text-sm text-slate-600">
      <li className="flex items-center gap-2">
        <UploadCloud className="h-4 w-4 text-[#0066CC]" />
        HR feed powers <span className="font-semibold text-slate-900">{stats.open}</span> active vacancies.
      </li>
      <li className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-[#0066CC]" />
        Gazette watcher flagged <span className="font-semibold text-slate-900">{stats.gazette}</span> mentions.
      </li>
      <li className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-[#0066CC]" />
        PSC references pending: <span className="font-semibold text-slate-900">{stats.psc}</span>.
      </li>
    </ul>

    {archivePreview.length > 0 && (
      <div className="mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Archive snapshot</h3>
        <div className="mt-3 space-y-3">
          {archivePreview.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600"
            >
              <div>
                <p className="font-semibold text-slate-900">{entry?.title}</p>
                <p className="text-slate-500">
                  {entry?.department || entry?.division || 'NARA'} • {new Date(entry?.closed_at || entry?.updated_at || entry?.created_at || entry?.published_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                Closed
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const SystemStatusPanel = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
    <h2 className="text-lg font-semibold text-slate-900">System status</h2>
    <div className="space-y-3 text-sm text-slate-600">
      <StatusItem icon={Database} label="Database" status="Operational" accent="text-emerald-300" />
      <StatusItem icon={Cloud} label="Cloud storage" status="Healthy" accent="text-emerald-300" />
      <StatusItem icon={CheckCircle} label="API services" status="Online" accent="text-emerald-300" />
    </div>
  </div>
);

const StatusItem = ({ icon: Icon, label, status, accent }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <Icon className={`h-5 w-5 ${accent}`} />
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className={`text-xs ${accent}`}>{status}</p>
    </div>
  </div>
);

const QuickActionsPanel = () => {
  const actions = [
    {
      icon: FileText,
      label: 'Publish tender',
      description: 'Open the procurement & recruitment portal',
      href: '/procurement-recruitment-portal'
    },
    {
      icon: Users,
      label: 'Publish vacancy',
      description: 'Review auto-synced roles before publishing',
      href: '/procurement-recruitment-portal#recruitment'
    },
    {
      icon: UploadCloud,
      label: 'Import gazette notice',
      description: 'Upload and summarise gazette PDFs',
      href: '/admin/dashboard'
    },
    {
      icon: ListChecks,
      label: 'PSC references',
      description: 'Track pending PSC link-backs',
      href: '/admin/dashboard'
    },
    {
      icon: Target,
      label: 'Audience hubs',
      description: 'Preview public landing pages',
      href: '/audiences/general-public'
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <QuickAction key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, description, href }) => (
  <Link
    to={href}
    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-[#0066CC] hover:text-[#0066CC]"
  >
    <div className="rounded-lg border border-slate-300 bg-white/95 p-3">
      <Icon className="h-5 w-5 text-[#0066CC]" />
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  </Link>
);

const WorkspaceActivityPanel = ({ stats }) => {
  const items = [
    {
      label: 'Unread notifications',
      value: stats?.notifications?.unread ?? 0,
      icon: Bell
    },
    {
      label: 'Pending clarifications',
      value: stats?.statistics?.pending_clarifications ?? 0,
      icon: AlertTriangle
    },
    {
      label: 'Emails dispatched',
      value: stats?.statistics?.emails_sent ?? 0,
      icon: Mail
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Workspace activity</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <item.icon className="h-4 w-4 text-[#0066CC]" />
            <span className="flex-1">{item.label}</span>
            <span className="font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
