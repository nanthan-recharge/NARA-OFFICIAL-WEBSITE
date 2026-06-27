import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from 'recharts';
import {
  RefreshCw, TrendingUp, Database, Newspaper, Image as ImageIcon, FlaskConical,
  Briefcase, Users, BookOpen, Building2, Radio, FileText, Megaphone, Shield,
  ArrowUpRight, Activity,
} from 'lucide-react';

/**
 * Enhanced government analytics dashboard — the branded overview shown at the top
 * of the admin home. Consumes the `stats` already loaded by MasterAdminPanel
 * (no extra fetching) and presents headline KPIs, live charts and an easy
 * "Quick Manage" grid. The official NARA emblem appears on the header and cards.
 */
const NARA_LOGO = '/logos/nara-logo-cropped.webp';
const CHART_COLORS = ['#0066CC', '#0f766e', '#f59e0b', '#7c3aed', '#dc2626', '#0891b2', '#16a34a', '#db2777'];

const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString() : '0');

// Small reusable NARA emblem — the "original logo on each card".
const Emblem = ({ className = 'h-7 w-7' }) => (
  <img
    src={NARA_LOGO}
    alt="NARA"
    className={`${className} rounded-full bg-white object-contain ring-1 ring-slate-200 shadow-sm`}
    loading="lazy"
    onError={(e) => { e.currentTarget.style.display = 'none'; }}
  />
);

const KPI_DEFS = [
  { id: 'total', label: 'Total Records', icon: Database, grad: 'from-[#003366] to-[#0066CC]', compute: (g, s) => s.collectionSummaries.reduce((t, i) => t + (i.count || 0), 0) },
  { id: 'news', label: 'News & Notices', icon: Newspaper, grad: 'from-cyan-500 to-blue-600', compute: (g) => g('news') },
  { id: 'media', label: 'Media Assets', icon: ImageIcon, grad: 'from-fuchsia-500 to-purple-600', compute: (g) => g('media_images') + g('media_videos') },
  { id: 'research', label: 'Research & Papers', icon: FlaskConical, grad: 'from-indigo-500 to-blue-700', compute: (g) => g('publications') + g('researchContent') },
  { id: 'vacancies', label: 'Vacancies', icon: Briefcase, grad: 'from-emerald-500 to-teal-600', compute: (g) => g('vacancies') },
  { id: 'users', label: 'Registered Users', icon: Users, grad: 'from-amber-500 to-orange-600', compute: (g, s) => (s.userSummary?.adminProfiles || 0) + (s.userSummary?.libraryUsers || 0) },
];

// Curated "easy to manage" tiles (testing mode — all key sections one tap away).
const MANAGE_TILES = [
  { label: 'News', route: '/admin/news', icon: Newspaper, color: 'cyan', countKey: 'news' },
  { label: 'Media Gallery', route: '/admin/media', icon: ImageIcon, color: 'purple', countKeys: ['media_images', 'media_videos'] },
  { label: 'Vacancies', route: '/admin/vacancies', icon: Briefcase, color: 'emerald', countKey: 'vacancies' },
  { label: 'Research Papers', route: '/admin/manage-papers', icon: FlaskConical, color: 'indigo', countKey: 'researchContent' },
  { label: 'Library', route: '/admin/library', icon: BookOpen, color: 'blue' },
  { label: 'Divisions', route: '/admin/division-content', icon: Building2, color: 'teal' },
  { label: 'Gov. Services', route: '/admin/government-services', icon: Shield, color: 'slate' },
  { label: 'Podcasts', route: '/admin/podcasts', icon: Radio, color: 'rose' },
  { label: 'Hero Images', route: '/admin/hero-images', icon: ImageIcon, color: 'amber' },
  { label: 'Public Consultation', route: '/admin/public-consultation', icon: Megaphone, color: 'orange' },
  { label: 'Reports / Papers', route: '/admin/research-data', icon: FileText, color: 'blue' },
  { label: 'Users & Access', route: '/admin/users', icon: Users, color: 'violet' },
];

const TILE_COLORS = {
  cyan: 'hover:border-cyan-400 hover:bg-cyan-50 text-cyan-700',
  purple: 'hover:border-purple-400 hover:bg-purple-50 text-purple-700',
  emerald: 'hover:border-emerald-400 hover:bg-emerald-50 text-emerald-700',
  indigo: 'hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700',
  blue: 'hover:border-blue-400 hover:bg-blue-50 text-blue-700',
  teal: 'hover:border-teal-400 hover:bg-teal-50 text-teal-700',
  slate: 'hover:border-slate-400 hover:bg-slate-50 text-slate-700',
  rose: 'hover:border-rose-400 hover:bg-rose-50 text-rose-700',
  amber: 'hover:border-amber-400 hover:bg-amber-50 text-amber-700',
  orange: 'hover:border-orange-400 hover:bg-orange-50 text-orange-700',
  violet: 'hover:border-violet-400 hover:bg-violet-50 text-violet-700',
};

const EnhancedAnalyticsDashboard = ({ stats, loading, onRefresh, profile, onNavigate }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const safeStats = stats || { collectionSummaries: [], categoryBreakdown: [], weeklyActivity: [], counts: {}, userSummary: {} };
  const byKey = useMemo(() => {
    const m = {};
    (safeStats.collectionSummaries || []).forEach((s) => { m[s.key] = s.count || 0; });
    return { ...(safeStats.counts || {}), ...m };
  }, [safeStats]);
  const get = (k) => byKey[k] || 0;

  const topCollections = useMemo(
    () => [...(safeStats.collectionSummaries || [])]
      .filter((s) => (s.count || 0) > 0)
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 7)
      .map((s) => ({ name: s.label, value: s.count || 0 })),
    [safeStats]
  );
  const weekly = (safeStats.weeklyActivity || []).map((d) => ({ day: d.day, updates: d.updates || 0 }));
  const categories = (safeStats.categoryBreakdown || []).filter((c) => (c.value || 0) > 0);
  const tileCount = (tile) => tile.countKeys ? tile.countKeys.reduce((t, k) => t + get(k), 0) : (tile.countKey ? get(tile.countKey) : null);

  const go = (route) => { if (onNavigate) onNavigate(route); };

  return (
    <div className="space-y-6">
      {/* ── Branded header band ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001f3f] via-[#003366] to-[#0066CC] px-6 py-6 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-24 h-40 w-40 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={NARA_LOGO}
              alt="NARA emblem"
              className="h-16 w-16 rounded-full bg-white object-contain p-1 ring-2 ring-white/40 shadow-md"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">National Aquatic Resources Research &amp; Development Agency</p>
              <h1 className="font-headline text-2xl font-bold leading-tight sm:text-3xl">Government Administration Dashboard</h1>
              <p className="mt-0.5 text-sm text-white/70">
                Welcome{profile?.full_name || profile?.name ? `, ${profile.full_name || profile.name}` : ''} · {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} · {now.toLocaleTimeString('en-GB', { hour12: false })} LKT
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/25 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'Refreshing…' : 'Refresh data'}
          </button>
        </div>
      </div>

      {/* ── KPI cards (each carries the NARA emblem) ─────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {KPI_DEFS.map((kpi, i) => {
          const Icon = kpi.icon;
          const value = kpi.compute(get, safeStats);
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 6) * 0.04 }}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="absolute right-2 top-2"><Emblem className="h-6 w-6 opacity-80" /></div>
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.grad} text-white shadow`}>
                <Icon size={20} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{loading ? '—' : fmt(value)}</div>
              <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">{kpi.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Charts ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800"><Activity size={16} className="text-[#0066CC]" /> Activity — last 7 days</h3>
            <Emblem className="h-6 w-6" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                <Area type="monotone" dataKey="updates" name="Updates" stroke="#0066CC" strokeWidth={2.5} fill="url(#actGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Content by category</h3>
            <Emblem className="h-6 w-6" />
          </div>
          <div className="h-64">
            {categories.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                    {categories.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {categories.slice(0, 6).map((c, i) => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                {c.name} <span className="font-semibold">{fmt(c.value)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top collections bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800"><TrendingUp size={16} className="text-emerald-600" /> Largest content collections</h3>
          <Emblem className="h-6 w-6" />
        </div>
        <div className="h-64">
          {topCollections.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCollections} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" name="Records" radius={[0, 6, 6, 0]} barSize={18}>
                  {topCollections.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Quick Manage ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-800"><Emblem className="h-6 w-6" /> Quick Manage</h3>
          <span className="text-xs text-slate-400">Tap any area to manage its content</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {MANAGE_TILES.map((tile) => {
            const Icon = tile.icon;
            const count = tileCount(tile);
            return (
              <button
                key={tile.label}
                onClick={() => go(tile.route)}
                className={`group flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left transition ${TILE_COLORS[tile.color] || TILE_COLORS.slate}`}
              >
                <div className="flex w-full items-center justify-between">
                  <Icon size={22} />
                  <ArrowUpRight size={15} className="text-slate-300 transition group-hover:text-current" />
                </div>
                <div className="text-sm font-semibold text-slate-800">{tile.label}</div>
                {count !== null && <div className="text-xs text-slate-500">{loading ? '…' : `${fmt(count)} records`}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
