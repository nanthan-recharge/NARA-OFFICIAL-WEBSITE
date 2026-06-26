import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import {
  collection,
  getCountFromServer,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
} from 'firebase/firestore';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { PERMISSIONS } from '../../constants/roles';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard, Image, Video, FileText, Users, Ship, Fish,
  TrendingUp, AlertCircle, Map, Database, BookOpen, Settings, LogOut,
  Search, Bell, ChevronDown, ChevronLeft, ChevronRight, Plus,
  Upload, RefreshCw, Calendar, Tag, Globe,
  Mail, Shield, BarChart3, Waves, Anchor, Microscope, FlaskConical,
  FileCheck, Briefcase, Building2, Target,
  Activity, PieChart, DollarSign, Package,
  CheckCircle, Clock, ExternalLink,
  Grid3x3, MessageSquare, Radio, Languages,
  Newspaper
} from 'lucide-react';

const NARA_LOGO_SRC = '/logos/nara-logo-cropped.webp';
const DAY_MS = 24 * 60 * 60 * 1000;
const CHART_COLORS = ['#0066CC', '#0f766e', '#f59e0b', '#7c3aed', '#dc2626', '#0891b2', '#16a34a'];

// Static color map — prevents Tailwind purge issues with dynamic class names
const COLOR_MAP = {
  cyan:    { bg: 'bg-cyan-500',    bgGrad: 'from-cyan-500 to-cyan-600',    text: 'text-cyan-600',    textLight: 'text-cyan-400', bgLight: 'bg-cyan-50',    bgAlpha: 'bg-cyan-500/20',    ring: 'ring-cyan-500/20', border: 'border-cyan-500/30', hoverBg: 'hover:bg-cyan-500/30' },
  purple:  { bg: 'bg-purple-500',  bgGrad: 'from-purple-500 to-purple-600',  text: 'text-purple-600',  textLight: 'text-purple-400', bgLight: 'bg-purple-50',  bgAlpha: 'bg-purple-500/20',  ring: 'ring-purple-500/20', border: 'border-purple-500/30', hoverBg: 'hover:bg-purple-500/30' },
  blue:    { bg: 'bg-blue-500',    bgGrad: 'from-blue-500 to-blue-600',    text: 'text-blue-600',    textLight: 'text-blue-400', bgLight: 'bg-blue-50',    bgAlpha: 'bg-blue-500/20',    ring: 'ring-blue-500/20', border: 'border-blue-500/30', hoverBg: 'hover:bg-blue-500/30' },
  teal:    { bg: 'bg-teal-500',    bgGrad: 'from-teal-500 to-teal-600',    text: 'text-teal-600',    textLight: 'text-teal-400', bgLight: 'bg-teal-50',    bgAlpha: 'bg-teal-500/20',    ring: 'ring-teal-500/20', border: 'border-teal-500/30', hoverBg: 'hover:bg-teal-500/30' },
  amber:   { bg: 'bg-amber-500',   bgGrad: 'from-amber-500 to-amber-600',   text: 'text-amber-600',   textLight: 'text-amber-400', bgLight: 'bg-amber-50',   bgAlpha: 'bg-amber-500/20',   ring: 'ring-amber-500/20', border: 'border-amber-500/30', hoverBg: 'hover:bg-amber-500/30' },
  emerald: { bg: 'bg-emerald-500', bgGrad: 'from-emerald-500 to-emerald-600', text: 'text-emerald-600', textLight: 'text-emerald-400', bgLight: 'bg-emerald-50', bgAlpha: 'bg-emerald-500/20', ring: 'ring-emerald-500/20', border: 'border-emerald-500/30', hoverBg: 'hover:bg-emerald-500/30' },
  rose:    { bg: 'bg-rose-500',    bgGrad: 'from-rose-500 to-rose-600',    text: 'text-rose-600',    textLight: 'text-rose-400', bgLight: 'bg-rose-50',    bgAlpha: 'bg-rose-500/20',    ring: 'ring-rose-500/20', border: 'border-rose-500/30', hoverBg: 'hover:bg-rose-500/30' },
  indigo:  { bg: 'bg-indigo-500',  bgGrad: 'from-indigo-500 to-indigo-600',  text: 'text-indigo-600',  textLight: 'text-indigo-400', bgLight: 'bg-indigo-50',  bgAlpha: 'bg-indigo-500/20',  ring: 'ring-indigo-500/20', border: 'border-indigo-500/30', hoverBg: 'hover:bg-indigo-500/30' },
  orange:  { bg: 'bg-orange-500',  bgGrad: 'from-orange-500 to-orange-600',  text: 'text-orange-600',  textLight: 'text-orange-400', bgLight: 'bg-orange-50',  bgAlpha: 'bg-orange-500/20',  ring: 'ring-orange-500/20', border: 'border-orange-500/30', hoverBg: 'hover:bg-orange-500/30' },
  slate:   { bg: 'bg-slate-500',   bgGrad: 'from-slate-500 to-slate-600',   text: 'text-slate-600',   textLight: 'text-slate-400', bgLight: 'bg-slate-50',   bgAlpha: 'bg-slate-500/20',   ring: 'ring-slate-500/20', border: 'border-slate-500/30', hoverBg: 'hover:bg-slate-500/30' },
  pink:    { bg: 'bg-pink-500',    bgGrad: 'from-pink-500 to-pink-600',    text: 'text-pink-600',    textLight: 'text-pink-400', bgLight: 'bg-pink-50',    bgAlpha: 'bg-pink-500/20',    ring: 'ring-pink-500/20', border: 'border-pink-500/30', hoverBg: 'hover:bg-pink-500/30' },
  red:     { bg: 'bg-red-500',     bgGrad: 'from-red-500 to-red-600',     text: 'text-red-600',     textLight: 'text-red-400', bgLight: 'bg-red-50',     bgAlpha: 'bg-red-500/20',     ring: 'ring-red-500/20', border: 'border-red-500/30', hoverBg: 'hover:bg-red-500/30' },
  green:   { bg: 'bg-green-500',   bgGrad: 'from-green-500 to-green-600',   text: 'text-green-600',   textLight: 'text-green-400', bgLight: 'bg-green-50',   bgAlpha: 'bg-green-500/20',   ring: 'ring-green-500/20', border: 'border-green-500/30', hoverBg: 'hover:bg-green-500/30' },
  violet:  { bg: 'bg-violet-500',  bgGrad: 'from-violet-500 to-violet-600',  text: 'text-violet-600',  textLight: 'text-violet-400', bgLight: 'bg-violet-50',  bgAlpha: 'bg-violet-500/20',  ring: 'ring-violet-500/20', border: 'border-violet-500/30', hoverBg: 'hover:bg-violet-500/30' },
  yellow:  { bg: 'bg-yellow-500',  bgGrad: 'from-yellow-500 to-yellow-600',  text: 'text-yellow-600',  textLight: 'text-yellow-400', bgLight: 'bg-yellow-50',  bgAlpha: 'bg-yellow-500/20',  ring: 'ring-yellow-500/20', border: 'border-yellow-500/30', hoverBg: 'hover:bg-yellow-500/30' },
  gray:    { bg: 'bg-gray-500',    bgGrad: 'from-gray-500 to-gray-600',    text: 'text-gray-600',    textLight: 'text-gray-400', bgLight: 'bg-gray-50',    bgAlpha: 'bg-gray-500/20',    ring: 'ring-gray-500/20', border: 'border-gray-500/30', hoverBg: 'hover:bg-gray-500/30' },
};

const DASHBOARD_COLLECTIONS = [
  {
    key: 'news',
    collectionName: 'news',
    label: 'News Articles',
    category: 'Publishing',
    icon: Newspaper,
    color: 'cyan',
    route: '/admin/news',
    timestampFields: ['updatedAt', 'createdAt', 'publishedAt', 'date'],
    titleFields: ['title.en', 'title', 'headline.en', 'headline', 'slug'],
  },
  {
    key: 'media_images',
    collectionName: 'media_images',
    label: 'Media Images',
    category: 'Media',
    icon: Image,
    color: 'purple',
    route: '/admin/media',
    timestampFields: ['updatedAt', 'createdAt', 'uploadedAt'],
    titleFields: ['title.en', 'title', 'caption.en', 'caption', 'filename'],
  },
  {
    key: 'media_videos',
    collectionName: 'media_videos',
    label: 'Videos',
    category: 'Media',
    icon: Video,
    color: 'pink',
    route: '/admin/media',
    timestampFields: ['updatedAt', 'createdAt', 'uploadedAt'],
    titleFields: ['title.en', 'title', 'caption.en', 'caption', 'filename'],
  },
  {
    key: 'publications',
    collectionName: 'publications',
    label: 'Publications',
    category: 'Research',
    icon: FileText,
    color: 'blue',
    route: '/admin/research-data',
    timestampFields: ['updatedAt', 'createdAt', 'publishedAt', 'year'],
    titleFields: ['title.en', 'title', 'name', 'documentTitle'],
  },
  {
    key: 'researchContent',
    collectionName: 'researchContent',
    label: 'Research Papers',
    category: 'Research',
    icon: Microscope,
    color: 'indigo',
    route: '/admin/manage-papers',
    timestampFields: ['updatedAt', 'createdAt', 'uploadedAt', 'translatedAt'],
    titleFields: ['title.en', 'title', 'originalTitle', 'filename'],
  },
  {
    key: 'projects',
    collectionName: 'projects',
    label: 'Projects',
    category: 'Research',
    icon: Briefcase,
    color: 'green',
    route: '/admin/research-data',
    timestampFields: ['updatedAt', 'createdAt', 'startDate'],
    titleFields: ['title.en', 'title', 'projectTitle', 'name'],
  },
  {
    key: 'events',
    collectionName: 'events',
    label: 'Events',
    category: 'Publishing',
    icon: Calendar,
    color: 'amber',
    route: '/admin/news',
    timestampFields: ['updatedAt', 'createdAt', 'date', 'eventDate'],
    titleFields: ['title.en', 'title', 'name'],
  },
  {
    key: 'hero_images',
    collectionName: 'hero_images',
    label: 'Hero Images',
    category: 'Website',
    icon: Image,
    color: 'teal',
    route: '/admin/hero-images',
    timestampFields: ['updatedAt', 'createdAt'],
    titleFields: ['title.en', 'title', 'caption.en', 'caption'],
  },
  {
    key: 'vacancies',
    collectionName: 'vacancies',
    label: 'Vacancies',
    category: 'People',
    icon: Users,
    color: 'yellow',
    route: '/admin/vacancies',
    timestampFields: ['updatedAt', 'createdAt', 'closingDate'],
    titleFields: ['title.en', 'title', 'position', 'jobTitle'],
  },
  {
    key: 'maritime_vessels',
    collectionName: 'maritime_vessels',
    label: 'Maritime Vessels',
    category: 'Services',
    icon: Ship,
    color: 'orange',
    route: '/admin/maritime',
    timestampFields: ['updatedAt', 'createdAt'],
    titleFields: ['name', 'vesselName', 'title'],
  },
  {
    key: 'fish_advisories',
    collectionName: 'fish_advisories',
    label: 'Fish Advisories',
    category: 'Services',
    icon: Fish,
    color: 'emerald',
    route: '/admin/fish-advisory',
    timestampFields: ['updatedAt', 'createdAt', 'issuedAt'],
    titleFields: ['title.en', 'title', 'advisoryTitle', 'region'],
  },
  {
    key: 'podcasts',
    collectionName: 'podcasts',
    label: 'Podcast Episodes',
    category: 'Media',
    icon: Radio,
    color: 'violet',
    route: '/admin/podcasts',
    timestampFields: ['updatedAt', 'createdAt', 'publishedAt'],
    titleFields: ['title.en', 'title', 'episodeTitle'],
  },
];

const USER_COLLECTIONS = [
  {
    key: 'adminProfiles',
    collectionName: 'adminProfiles',
    label: 'Admin Profiles',
    color: 'red',
    timestampFields: ['lastLoginAt', 'updatedAt', 'createdAt'],
    titleFields: ['displayName', 'email'],
    sampleLimit: 250,
  },
  {
    key: 'adminUsers',
    collectionName: 'adminUsers',
    label: 'Staff Admin Users',
    color: 'blue',
    timestampFields: ['lastLoginAt', 'updatedAt', 'createdAt'],
    titleFields: ['displayName', 'email'],
    sampleLimit: 250,
  },
  {
    key: 'libraryUsers',
    collectionName: 'libraryUsers',
    label: 'Library Users',
    color: 'indigo',
    timestampFields: ['lastLoginAt', 'updatedAt', 'createdAt', 'registeredAt'],
    titleFields: ['displayName', 'email', 'name'],
    sampleLimit: 100,
  },
  {
    key: 'userActivityLogs',
    collectionName: 'userActivityLogs',
    label: 'User Activity Logs',
    color: 'green',
    timestampFields: ['createdAt', 'timestamp', 'updatedAt'],
    titleFields: ['action', 'message', 'description'],
    sampleLimit: 100,
  },
];

const USAGE_SIGNAL_COLLECTIONS = [
  {
    key: 'userActivityLogs',
    collectionName: 'userActivityLogs',
    label: 'Admin Activity Logs',
    color: 'blue',
    timestampFields: ['createdAt', 'timestamp', 'updatedAt'],
    titleFields: ['action', 'message', 'description'],
  },
  {
    key: 'mspActivityLog',
    collectionName: 'mspActivityLog',
    label: 'MSP Activity Log',
    color: 'teal',
    timestampFields: ['createdAt', 'timestamp', 'updatedAt'],
    titleFields: ['action', 'message', 'description', 'module'],
  },
  {
    key: 'podcastViews',
    collectionName: 'podcastViews',
    label: 'Podcast Views',
    color: 'violet',
    timestampFields: ['viewedAt', 'createdAt', 'timestamp'],
    titleFields: ['podcastTitle', 'title', 'episodeId'],
  },
  {
    key: 'podcastEngagements',
    collectionName: 'podcastEngagements',
    label: 'Podcast Engagements',
    color: 'pink',
    timestampFields: ['createdAt', 'timestamp', 'engagedAt'],
    titleFields: ['type', 'action', 'podcastTitle'],
  },
  {
    key: 'notifications',
    collectionName: 'notifications',
    label: 'Notifications',
    color: 'amber',
    timestampFields: ['createdAt', 'timestamp', 'updatedAt'],
    titleFields: ['title', 'message', 'type'],
  },
];

// Content coverage data — static list of what's editable vs not
const EDITABLE_SECTIONS = [
  'News', 'Events', 'Publications', 'Media', 'Research Papers',
  'Maritime Safety', 'Fish Advisory', 'Library', 'Marketplace',
  'Podcasts', 'HR / Recruitment', 'User Management', 'LDA',
  'Divisions', 'Hero Images'
];

const NOT_EDITABLE_SECTIONS = [
  'About NARA', 'Contact Us', 'Partnership Gateway', 'Government Services Portal',
  'Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Accessibility Statement',
  'RTI Disclosure', 'Security Policy', 'Data Subject Rights',
  'Footer Content', 'Audience Pages (3)'
];

const GOVERNANCE_AREAS = [
  {
    label: 'Website & public notices',
    owner: 'Communications / Administration',
    route: '/admin/news',
    permission: PERMISSIONS.MANAGE_NEWS,
    status: 'Controlled publishing',
    icon: Newspaper,
    color: 'cyan',
  },
  {
    label: 'Media library',
    owner: 'Media & Press Unit',
    route: '/admin/media',
    permission: PERMISSIONS.MANAGE_MEDIA,
    status: 'Separate image/video workflow',
    icon: Image,
    color: 'purple',
  },
  {
    label: 'Research & publications',
    owner: 'Research divisions',
    route: '/admin/research-data',
    permission: PERMISSIONS.MANAGE_RESEARCH_DATA,
    status: 'Metadata and document governance',
    icon: Microscope,
    color: 'blue',
  },
  {
    label: 'Citizen services',
    owner: 'Service operations',
    route: '/admin/government-services',
    permission: PERMISSIONS.MANAGE_GOVERNMENT_SERVICES,
    status: 'Applications and requests',
    icon: Building2,
    color: 'green',
  },
  {
    label: 'Library administration',
    owner: 'Library & Documentation',
    route: '/admin/library',
    permission: PERMISSIONS.MANAGE_LIBRARY,
    status: 'Cataloguing and circulation',
    icon: BookOpen,
    color: 'indigo',
  },
  {
    label: 'Users and permissions',
    owner: 'IT / System administration',
    route: '/admin/users',
    permission: PERMISSIONS.MANAGE_USERS,
    status: 'Role based access',
    icon: Shield,
    color: 'red',
  },
];

const ADMIN_SECTION_PERMISSIONS = {
  dashboard: PERMISSIONS.VIEW_DASHBOARD,
  media: PERMISSIONS.MANAGE_MEDIA,
  research: PERMISSIONS.MANAGE_RESEARCH_DATA,
  library: PERMISSIONS.MANAGE_LIBRARY,
  maritime: PERMISSIONS.MANAGE_MARITIME,
  services: PERMISSIONS.MANAGE_GOVERNMENT_SERVICES,
  analytics: PERMISSIONS.VIEW_ANALYTICS,
  website: PERMISSIONS.MANAGE_CONTENT,
  content: PERMISSIONS.MANAGE_CONTENT,
  marketplace: PERMISSIONS.MANAGE_MARKETPLACE,
  hr: PERMISSIONS.MANAGE_RECRUITMENT,
  podcasts: PERMISSIONS.MANAGE_PODCASTS,
  integration: PERMISSIONS.MANAGE_DATA_INTEGRATION,
  settings: PERMISSIONS.MANAGE_USERS,
};

const ADMIN_SUBSECTION_PERMISSIONS = {
  'research.lab-results': PERMISSIONS.MANAGE_LAB_DATA,
  'library.library-dashboard': PERMISSIONS.MANAGE_LIBRARY,
  'library.cataloguing': PERMISSIONS.MANAGE_CATALOGUE,
  'library.circulation': PERMISSIONS.MANAGE_CIRCULATION,
  'library.patrons': PERMISSIONS.MANAGE_LIBRARY_PATRONS,
  'library.acquisitions': PERMISSIONS.MANAGE_LIBRARY_ACQUISITIONS,
  'library.research-review': PERMISSIONS.REVIEW_RESEARCH,
  'maritime.bathymetry': PERMISSIONS.MANAGE_BATHYMETRY,
  'maritime.incidents': PERMISSIONS.MANAGE_INCIDENTS,
  'services.fish-advisory': PERMISSIONS.MANAGE_FISH_ADVISORY,
  'services.vessel-booking': PERMISSIONS.MANAGE_RESEARCH_VESSELS,
  'services.lda': PERMISSIONS.MANAGE_LDA,
  'analytics.simulations': PERMISSIONS.MANAGE_ANALYTICS,
  'analytics.economics': PERMISSIONS.MANAGE_ANALYTICS,
  'website.news': PERMISSIONS.MANAGE_NEWS,
  'website.hero-images': PERMISSIONS.MANAGE_HERO_IMAGES,
  'website.vacancies': PERMISSIONS.MANAGE_VACANCIES,
  'website.scientist-sessions': PERMISSIONS.MANAGE_SCIENTIST_SESSIONS,
  'content.divisions': PERMISSIONS.MANAGE_DIVISIONS,
  'content.division-images': PERMISSIONS.MANAGE_DIVISIONS,
  'content.consultations': PERMISSIONS.MANAGE_PUBLIC_CONSULTATION,
  'hr.pipeline': PERMISSIONS.MANAGE_PROJECT_PIPELINE,
  'integration.water-quality': PERMISSIONS.MANAGE_WATER_QUALITY,
  'integration.seeder': PERMISSIONS.MANAGE_SYSTEM,
};

const toMillis = (value) => {
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const getNestedValue = (data, path) => (
  path.split('.').reduce((current, key) => current?.[key], data)
);

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'Active' : 'Inactive';
  if (typeof value === 'object' && typeof value.toMillis !== 'function') {
    return value.en || value.title || value.name || value.label || '';
  }
  return '';
};

const getPreferredText = (data, fields = []) => {
  for (const field of fields) {
    const normalized = normalizeText(getNestedValue(data, field));
    if (normalized) return normalized;
  }
  return '';
};

const getPreferredTimestamp = (data, fields = []) => {
  for (const field of fields) {
    const millis = toMillis(getNestedValue(data, field));
    if (millis) return millis;
  }
  return null;
};

const getDocumentStatus = (data) => {
  const rawStatus =
    data.status ||
    data.state ||
    data.workflowStatus ||
    data.publicationStatus ||
    (data.published === true ? 'published' : '') ||
    (data.active === true || data.is_active === true ? 'active' : '');

  return normalizeText(rawStatus) || 'recorded';
};

const getDocumentActor = (data) => (
  getPreferredText(data, ['updatedBy', 'createdBy', 'author.email', 'author', 'email', 'userEmail', 'owner'])
);

const normalizeDoc = (docSnap, metric) => {
  const data = docSnap.data();
  const timestamp = getPreferredTimestamp(data, metric.timestampFields);
  return {
    id: docSnap.id,
    key: metric.key,
    collectionName: metric.collectionName,
    section: metric.label,
    category: metric.category || 'Operations',
    route: metric.route,
    color: metric.color || 'slate',
    title:
      getPreferredText(data, metric.titleFields) ||
      `${metric.label} record`,
    status: getDocumentStatus(data),
    actor: getDocumentActor(data),
    timestamp,
  };
};

const createEmptyTrend = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getTime() - (6 - index) * DAY_MS);
    const key = date.toISOString().slice(0, 10);
    return {
      key,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      updates: 0,
    };
  });
};

const createEmptyDashboardData = () => ({
  counts: {},
  collectionSummaries: [],
  categoryBreakdown: [],
  topSections: [],
  weeklyActivity: createEmptyTrend(),
  recentActivity: [],
  userSummary: {
    adminProfiles: 0,
    adminUsers: 0,
    libraryUsers: 0,
    activityLogs: 0,
    activeAdmins: 0,
    recentLogins: [],
  },
  usageSummary: {
    totalSignals: 0,
    signalRows: [],
    latestSignal: null,
    dataSourceNote: 'Usage signals are assembled from existing activity collections.',
  },
  errors: [],
});

const formatNumber = (value) => (
  Number.isFinite(value) ? value.toLocaleString() : '0'
);

const formatRelativeTime = (millis) => {
  if (!millis) return 'No timestamp';
  const diff = Date.now() - millis;
  if (diff < 60 * 1000) return 'Just now';
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} min ago`;
  if (diff < DAY_MS) return `${Math.floor(diff / (60 * 60 * 1000))} hr ago`;
  if (diff < DAY_MS * 30) return `${Math.floor(diff / DAY_MS)} days ago`;
  return new Date(millis).toLocaleDateString();
};

const formatDuration = (millis) => {
  const totalMinutes = Math.max(0, Math.floor(millis / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours} hr ${minutes} min`;
};

const groupByCategory = (summaries) => (
  Object.values(
    summaries.reduce((acc, summary) => {
      const category = summary.category || 'Operations';
      if (!acc[category]) acc[category] = { name: category, value: 0 };
      acc[category].value += summary.count;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value)
);

const buildWeeklyActivity = (items) => {
  const trend = createEmptyTrend();
  const byKey = new Map(trend.map((day) => [day.key, day]));

  items.forEach((item) => {
    if (!item.timestamp) return;
    const key = new Date(item.timestamp).toISOString().slice(0, 10);
    const day = byKey.get(key);
    if (day) day.updates += 1;
  });

  return trend;
};

const loadCollectionSummary = async (metric) => {
  const collectionRef = collection(db, metric.collectionName);
  let count = 0;
  let access = 'ok';
  const errors = [];

  try {
    const countSnapshot = await getCountFromServer(collectionRef);
    count = countSnapshot.data().count || 0;
  } catch {
    try {
      const fallbackSnapshot = await getDocs(query(collectionRef, firestoreLimit(metric.sampleLimit || 100)));
      count = fallbackSnapshot.size;
      access = 'sampled';
    } catch (fallbackError) {
      access = 'restricted';
      errors.push(`${metric.label}: ${fallbackError.message}`);
    }
  }

  let recentDocs = [];
  for (const field of metric.timestampFields || ['updatedAt', 'createdAt']) {
    try {
      const recentSnapshot = await getDocs(
        query(collectionRef, orderBy(field, 'desc'), firestoreLimit(metric.sampleLimit || 6))
      );
      recentDocs = recentSnapshot.docs.map((docSnap) => normalizeDoc(docSnap, metric));
      if (recentDocs.length > 0) break;
    } catch (error) {
      errors.push(`${metric.label} ordered by ${field}: ${error.message}`);
    }
  }

  if (recentDocs.length === 0 && access !== 'restricted') {
    try {
      const sampleSnapshot = await getDocs(query(collectionRef, firestoreLimit(metric.sampleLimit || 6)));
      recentDocs = sampleSnapshot.docs.map((docSnap) => normalizeDoc(docSnap, metric));
    } catch (error) {
      errors.push(`${metric.label} sample: ${error.message}`);
    }
  }

  return {
    ...metric,
    count,
    access,
    recentDocs,
    errors,
  };
};

const MasterAdminPanel = () => {
  const navigate = useNavigate();
  const { profile, logout, getAdminPermissions } = useFirebaseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubSection, setActiveSubSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(createEmptyDashboardData);
  const [sessionStartedAt] = useState(() => Date.now());
  const [nowTick, setNowTick] = useState(() => Date.now());

  // Admin Sections Configuration
  const adminSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/master',
      color: 'cyan'
    },
    {
      id: 'media',
      label: 'Media Management',
      icon: Image,
      color: 'purple',
      subsections: [
        { id: 'images', label: 'Images', icon: Image, path: '/admin/media', collection: 'media_images' },
        { id: 'videos', label: 'Videos', icon: Video, path: '/admin/media', collection: 'media_videos' },
        { id: 'gallery', label: 'Public Gallery', icon: Grid3x3, external: '/media-gallery' }
      ]
    },
    {
      id: 'research',
      label: 'Research & Data',
      icon: Microscope,
      color: 'blue',
      subsections: [
        { id: 'research-upload', label: 'Upload Research Paper', icon: Upload, path: '/admin/research-upload', highlight: true },
        { id: 'research-bulk-upload', label: 'Bulk Upload Papers', icon: Package, path: '/admin/research-bulk-upload', highlight: true },
        { id: 'manage-papers', label: 'Manage & Translate Papers', icon: Languages, path: '/admin/manage-papers', highlight: true },
        { id: 'research-data', label: 'Research Data', icon: Database, path: '/admin/research-data' },
        { id: 'publications', label: 'Publications', icon: FileText, path: '/admin/research-data', collection: 'publications' },
        { id: 'projects', label: 'Projects', icon: Briefcase, path: '/admin/research-data', collection: 'projects' },
        { id: 'lab-results', label: 'Lab Results', icon: FlaskConical, path: '/admin/lab-results' }
      ]
    },
    {
      id: 'library',
      label: 'Library Management',
      icon: BookOpen,
      color: 'indigo',
      subsections: [
        { id: 'library-dashboard', label: 'Library Dashboard', icon: LayoutDashboard, path: '/admin/library' },
        { id: 'cataloguing', label: 'Cataloguing', icon: BookOpen, path: '/admin/library/cataloguing' },
        { id: 'circulation', label: 'Circulation', icon: RefreshCw, path: '/admin/library/circulation' },
        { id: 'patrons', label: 'Patron Records', icon: Users, path: '/admin/library/patrons' },
        { id: 'acquisitions', label: 'Acquisitions', icon: Package, path: '/admin/library/acquisitions' },
        { id: 'research-review', label: 'Research Review', icon: FileCheck, path: '/admin/library/research-review' }
      ]
    },
    {
      id: 'maritime',
      label: 'Maritime Services',
      icon: Ship,
      color: 'indigo',
      subsections: [
        { id: 'vessels', label: 'Vessels', icon: Ship, path: '/admin/maritime', collection: 'maritime_vessels' },
        { id: 'ports', label: 'Ports', icon: Anchor, path: '/admin/maritime', collection: 'maritime_ports' },
        { id: 'bathymetry', label: 'Bathymetry', icon: Map, path: '/admin/bathymetry' },
        { id: 'incidents', label: 'Incidents', icon: AlertCircle, path: '/admin/marine-incident' }
      ]
    },
    {
      id: 'services',
      label: 'Public Services',
      icon: Users,
      color: 'green',
      subsections: [
        { id: 'fish-advisory', label: 'Fish Advisory', icon: Fish, path: '/admin/fish-advisory' },
        { id: 'vessel-booking', label: 'Vessel Booking', icon: Calendar, path: '/admin/research-vessel' },
        { id: 'lda', label: 'LDA System', icon: FileCheck, path: '/admin/lda' },
        { id: 'government', label: 'Government Services', icon: Building2, path: '/admin/government-services' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      color: 'orange',
      subsections: [
        { id: 'dashboard-analytics', label: 'Analytics Dashboard', icon: TrendingUp, path: '/admin/analytics' },
        { id: 'predictions', label: 'Predictions', icon: Target, path: '/admin/analytics/predictions' },
        { id: 'simulations', label: 'Simulations', icon: Activity, path: '/admin/analytics/simulations' },
        { id: 'economics', label: 'Economic Data', icon: DollarSign, path: '/admin/analytics/economic' }
      ]
    },
    {
      id: 'website',
      label: 'Website Management',
      icon: Globe,
      color: 'cyan',
      subsections: [
        { id: 'news', label: 'News Manager', icon: FileText, path: '/admin/news', highlight: true },
        { id: 'hero-images', label: 'Hero Images', icon: Image, path: '/admin/hero-images', highlight: true },
        { id: 'vacancies', label: 'Vacancies', icon: Briefcase, path: '/admin/vacancies', highlight: true },
        { id: 'scientist-sessions', label: 'Scientist Sessions', icon: FlaskConical, path: '/admin/scientist-sessions', highlight: true }
      ]
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      color: 'pink',
      subsections: [
        { id: 'divisions', label: 'Divisions', icon: Building2, path: '/admin/division-content' },
        { id: 'division-images', label: 'Division Images', icon: Image, path: '/admin/division-images' },
        { id: 'consultations', label: 'Public Consultations', icon: MessageSquare, path: '/admin/public-consultation' }
      ]
    },
    {
      id: 'marketplace',
      label: 'Digital Marketplace',
      icon: Package,
      color: 'emerald',
      subsections: [
        { id: 'products', label: 'Products', icon: Package, path: '/admin/marketplace/products' },
        { id: 'orders', label: 'Orders', icon: CheckCircle, path: '/admin/marketplace/orders' },
        { id: 'payments', label: 'Payments', icon: DollarSign, path: '/admin/marketplace/payments' },
        { id: 'categories', label: 'Categories', icon: Tag, disabled: true }
      ]
    },
    {
      id: 'hr',
      label: 'HR & Recruitment',
      icon: Briefcase,
      color: 'yellow',
      subsections: [
        { id: 'recruitment', label: 'Recruitment ATS', icon: Users, path: '/admin/recruitment-ats' },
        { id: 'pipeline', label: 'Project Pipeline', icon: Package, path: '/admin/project-pipeline' },
        { id: 'teams', label: 'Teams', icon: Users, disabled: true }
      ]
    },
    {
      id: 'podcasts',
      label: 'Podcast System',
      icon: Video,
      color: 'violet',
      subsections: [
        { id: 'manage-podcasts', label: 'Manage Episodes', icon: Video, path: '/admin/podcasts' },
        { id: 'podcast-analytics', label: 'Analytics Dashboard', icon: BarChart3, path: '/admin/podcasts' },
        { id: 'public-podcasts', label: 'Public Page', icon: ExternalLink, external: '/podcasts' }
      ]
    },
    {
      id: 'integration',
      label: 'Data Integration',
      icon: Database,
      color: 'red',
      subsections: [
        { id: 'data-center', label: 'Data Center Hub', icon: Database, path: '/admin/data-center-integration' },
        { id: 'water-quality', label: 'Water Quality', icon: Waves, path: '/admin/water-quality-monitoring' },
        { id: 'seeder', label: 'Phase 4 Seeder', icon: Upload, path: '/admin/phase4-seeder' }
      ]
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      color: 'gray',
      subsections: [
        { id: 'users', label: 'User Management', icon: Users, path: '/admin/users' },
        { id: 'email', label: 'Email System', icon: Mail, disabled: true },
        { id: 'seo', label: 'SEO Manager', icon: Globe, disabled: true },
        { id: 'security', label: 'Security', icon: Shield, disabled: true }
      ]
    }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setNowTick(Date.now()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const permissions = getAdminPermissions();
  const canAccessPermission = (permission) => !permission || permissions.includes(permission);
  const applySectionAccess = (section) => {
    const sectionPermission = section.permission || ADMIN_SECTION_PERMISSIONS[section.id];
    const subsections = section.subsections?.map((subsection) => ({
      ...subsection,
      permission:
        subsection.permission ||
        ADMIN_SUBSECTION_PERMISSIONS[`${section.id}.${subsection.id}`] ||
        sectionPermission,
    }));

    return { ...section, permission: sectionPermission, subsections };
  };
  const adminSectionsWithAccess = adminSections.map(applySectionAccess);
  const accessibleAdminSections = adminSectionsWithAccess
    .map((section) => {
      const sectionAllowed = canAccessPermission(section.permission);
      const visibleSubsections = section.subsections?.filter((subsection) =>
        sectionAllowed
          ? subsection.disabled || canAccessPermission(subsection.permission)
          : canAccessPermission(subsection.permission)
      );

      if (sectionAllowed || visibleSubsections?.length) {
        return { ...section, subsections: visibleSubsections };
      }

      return null;
    })
    .filter(Boolean);
  const accessibleGovernanceAreas = GOVERNANCE_AREAS.filter((area) => canAccessPermission(area.permission));
  const quickActions = [
    { icon: Upload, label: 'Upload Research', path: '/admin/research-upload', color: 'cyan', permission: PERMISSIONS.MANAGE_RESEARCH_DATA },
    { icon: Package, label: 'Bulk Upload', path: '/admin/research-bulk-upload', color: 'blue', permission: PERMISSIONS.MANAGE_RESEARCH_DATA },
    { icon: Languages, label: 'Manage Papers', path: '/admin/manage-papers', color: 'green', permission: PERMISSIONS.MANAGE_RESEARCH_DATA },
    { icon: Plus, label: 'Add Media', path: '/admin/media', color: 'purple', permission: PERMISSIONS.MANAGE_MEDIA },
    { icon: Newspaper, label: 'Manage News', path: '/admin/news', color: 'cyan', permission: PERMISSIONS.MANAGE_NEWS },
    { icon: BookOpen, label: 'Library', path: '/admin/library', color: 'indigo', permission: PERMISSIONS.MANAGE_LIBRARY },
    { icon: Ship, label: 'Maritime', path: '/admin/maritime', color: 'teal', permission: PERMISSIONS.MANAGE_MARITIME },
  ].filter((action) => canAccessPermission(action.permission));
  const displayName = profile?.displayName || profile?.email || 'Authorized admin';
  const roleLabel = (profile?.role || 'admin').replace(/_/g, ' ');
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredAdminSections = normalizedSearch
    ? accessibleAdminSections
      .map((section) => {
        const sectionMatches = section.label.toLowerCase().includes(normalizedSearch);
        const subsections = section.subsections?.filter((subsection) => (
          subsection.label.toLowerCase().includes(normalizedSearch) ||
          subsection.id.toLowerCase().includes(normalizedSearch)
        ));

        if (sectionMatches || subsections?.length) {
          return { ...section, subsections: subsections?.length ? subsections : section.subsections };
        }

        return null;
      })
      .filter(Boolean)
    : accessibleAdminSections;
  const currentSessionDuration = formatDuration(nowTick - sessionStartedAt);
  const lastLoginMillis = toMillis(profile?.lastLoginAt || profile?.updatedAt);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [collectionSummaries, userSummaries, usageSummaries] = await Promise.all([
        Promise.all(DASHBOARD_COLLECTIONS.map(loadCollectionSummary)),
        Promise.all(USER_COLLECTIONS.map(loadCollectionSummary)),
        Promise.all(USAGE_SIGNAL_COLLECTIONS.map(loadCollectionSummary)),
      ]);

      const counts = Object.fromEntries(
        [...collectionSummaries, ...userSummaries, ...usageSummaries].map((summary) => [summary.key, summary.count])
      );
      const allActivity = [...collectionSummaries, ...userSummaries, ...usageSummaries]
        .flatMap((summary) => summary.recentDocs)
        .filter((item) => item.timestamp)
        .sort((a, b) => b.timestamp - a.timestamp);
      const adminProfilesSummary = userSummaries.find((summary) => summary.key === 'adminProfiles');
      const activeAdmins = adminProfilesSummary?.recentDocs?.filter((item) =>
        !['suspended', 'terminated', 'retired', 'inactive'].includes(String(item.status).toLowerCase())
      ).length || 0;
      const signalRows = usageSummaries.map((summary) => ({
        label: summary.label,
        value: summary.count,
        color: summary.color,
        access: summary.access,
      }));
      const dashboardData = {
        counts,
        collectionSummaries,
        categoryBreakdown: groupByCategory(collectionSummaries),
        topSections: [...collectionSummaries].sort((a, b) => b.count - a.count).slice(0, 7),
        weeklyActivity: buildWeeklyActivity(allActivity),
        recentActivity: allActivity.slice(0, 10),
        userSummary: {
          adminProfiles: counts.adminProfiles || 0,
          adminUsers: counts.adminUsers || 0,
          libraryUsers: counts.libraryUsers || 0,
          activityLogs: counts.userActivityLogs || 0,
          activeAdmins,
          recentLogins: (adminProfilesSummary?.recentDocs || []).slice(0, 5),
        },
        usageSummary: {
          totalSignals: usageSummaries.reduce((total, summary) => total + summary.count, 0),
          signalRows,
          latestSignal: allActivity.find((item) =>
            USAGE_SIGNAL_COLLECTIONS.some((signal) => signal.collectionName === item.collectionName)
          ) || null,
          dataSourceNote: usageSummaries.some((summary) => summary.count > 0)
            ? 'Usage signals are pulled from existing admin/activity/event collections.'
            : 'No dedicated page-view collection is populated yet; current session time is shown from the browser.',
        },
        errors: [...collectionSummaries, ...userSummaries, ...usageSummaries]
          .flatMap((summary) => summary.errors || [])
          .slice(0, 8),
      };

      setStats(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setStats((current) => ({
        ...current,
        errors: ['Dashboard analytics could not be refreshed. Check Firestore permissions and connectivity.'],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('adminAuth');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section.id);
    if (section.path) {
      navigate(section.path);
    }
    if (!section.subsections) {
      setActiveSubSection(null);
    }
  };

  const handleSubSectionClick = (subsection) => {
    if (subsection.disabled) return;
    setActiveSubSection(subsection.id);
    if (subsection.path) {
      navigate(subsection.path);
    } else if (subsection.external) {
      window.open(subsection.external, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${sidebarOpen ? 'w-20 lg:w-72' : 'w-20'} bg-white/95 backdrop-blur-xl border-r border-slate-200 transition-all duration-300 z-50 overflow-y-auto`}>
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-xl">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3 min-w-0' : 'justify-center'}`}>
            <div className="h-10 w-10 flex-shrink-0 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <img
                src={NARA_LOGO_SRC}
                alt="NARA logo"
                className="h-full w-full object-contain"
              />
            </div>
            {sidebarOpen && (
              <div className="hidden min-w-0 lg:block">
                <span className="block truncate font-bold text-[#003366] text-lg leading-tight">NARA</span>
                <p className="truncate text-xs font-medium text-slate-500">Master Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-500 hover:text-slate-900"
            aria-label={sidebarOpen ? 'Collapse admin sidebar' : 'Expand admin sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredAdminSections.map((section) => {
            const colors = COLOR_MAP[section.color] || COLOR_MAP.slate;
            return (
              <div key={section.id}>
                <button
                  onClick={() => handleSectionClick(section)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${sidebarOpen ? 'justify-center lg:justify-start' : 'justify-center'} ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${colors.bgGrad} text-white shadow-lg`
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="hidden flex-1 text-left font-medium lg:block">{section.label}</span>
                      {section.subsections && (
                        <ChevronDown className={`hidden w-4 h-4 transition-transform lg:block ${
                          activeSection === section.id ? 'rotate-180' : ''
                        }`} />
                      )}
                    </>
                  )}
                </button>

                {/* Subsections */}
                {sidebarOpen && section.subsections && activeSection === section.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-2 hidden space-y-1 lg:block"
                  >
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => handleSubSectionClick(subsection)}
                        disabled={subsection.disabled}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          subsection.disabled
                            ? 'opacity-50 cursor-not-allowed text-slate-400'
                            : activeSubSection === subsection.id
                              ? 'bg-slate-100 text-slate-800'
                              : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900'
                        }`}
                      >
                        <subsection.icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{subsection.label}</span>
                        {subsection.disabled && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded-full font-medium">
                            Soon
                          </span>
                        )}
                        {subsection.external && !subsection.disabled && <ExternalLink className="w-3 h-3 ml-auto" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200 sticky bottom-0 bg-white/95 backdrop-blur-xl">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-400 transition-all ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="hidden font-medium lg:inline">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-20 lg:ml-72' : 'ml-20'} min-w-0 transition-all duration-300`}>
        {/* Top Bar */}
        <header className="h-16 bg-white/50 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-40">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="hidden h-9 w-9 rounded-full border border-slate-200 bg-white p-1 shadow-sm sm:block">
                <img src={NARA_LOGO_SRC} alt="NARA logo" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-[#003366] sm:text-2xl">
                  Master Admin Panel
                </h1>
                <p className="hidden text-xs font-medium text-slate-500 md:block">
                  NARA operational control center
                </p>
              </div>
              {normalizedSearch && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                  {filteredAdminSections.length} matching sections
                </span>
              )}
            </div>

          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Search */}
            <div className="relative hidden xl:block">
              <input
                type="text"
                placeholder="Search admin functions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#0066CC]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Refresh */}
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1.5 sm:px-3 sm:py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-full flex items-center justify-center">
                <span className="text-[11px] font-bold uppercase text-white">
                  {displayName.split(' ').map((name) => name[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-sm font-semibold text-slate-800">{displayName}</span>
                <span className="block text-[11px] capitalize text-slate-500">{roleLabel}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <DashboardOverviewHeader
                profile={profile}
                loading={loading}
                onRefresh={loadDashboardData}
                currentSessionDuration={currentSessionDuration}
                lastLoginMillis={lastLoginMillis}
                totalRecords={stats.collectionSummaries.reduce((total, item) => total + item.count, 0)}
              />

              <ExecutiveKpiGrid
                stats={stats}
                loading={loading}
                currentSessionDuration={currentSessionDuration}
                lastLoginMillis={lastLoginMillis}
              />

              <AnalyticsChartsGrid stats={stats} />

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <RecentActivityPanel activity={stats.recentActivity} loading={loading} />
                <UserUsagePanel
                  userSummary={stats.userSummary}
                  usageSummary={stats.usageSummary}
                  currentSessionDuration={currentSessionDuration}
                  lastLoginMillis={lastLoginMillis}
                />
              </div>

              <OperationalSecurityPanel permissions={permissions} profile={profile} />

              <AdminGovernanceGrid areas={accessibleGovernanceAreas} onOpen={navigate} />

              <CollectionAnalysisGrid summaries={stats.collectionSummaries} loading={loading} />

              {/* Content Coverage Panel */}
              <ContentCoveragePanel />

              {/* Quick Actions */}
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {quickActions.map((action) => (
                    <QuickActionButton
                      key={action.path}
                      icon={action.icon}
                      label={action.label}
                      onClick={() => navigate(action.path)}
                      color={action.color}
                    />
                  ))}
                </div>
              </div>

              <SystemReadinessPanel errors={stats.errors} loading={loading} />
            </div>
          )}

          {/* Other sections will load their respective admin panels */}
          {activeSection !== 'dashboard' && (
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const section = accessibleAdminSections.find(s => s.id === activeSection);
                    const Icon = section?.icon || LayoutDashboard;
                    return <Icon className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {accessibleAdminSections.find(s => s.id === activeSection)?.label}
                </h3>
                <p className="text-slate-500 mb-6">
                  Navigate using the sidebar or click a subsection to access specific management tools
                </p>
                {accessibleAdminSections.find(s => s.id === activeSection)?.subsections && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {accessibleAdminSections.find(s => s.id === activeSection).subsections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubSectionClick(sub)}
                        disabled={sub.disabled}
                        className={`p-4 rounded-xl transition-all text-left ${
                          sub.disabled
                            ? 'bg-slate-50 opacity-60 cursor-not-allowed'
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        <sub.icon className="w-6 h-6 text-cyan-400 mb-2" />
                        <p className="text-sm font-medium text-slate-800">{sub.label}</p>
                        {sub.disabled && (
                          <span className="text-[10px] text-slate-400 font-medium">Coming Soon</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Helper Components — using static COLOR_MAP classes

const DashboardOverviewHeader = ({
  profile,
  loading,
  onRefresh,
  currentSessionDuration,
  lastLoginMillis,
  totalRecords,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 flex-shrink-0 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
          <img src={NARA_LOGO_SRC} alt="NARA logo" className="h-full w-full object-contain" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">NARA Master Control</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Operations and analytics dashboard</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Monitor publishing, media, research data, users, service activity, and admin session signals from one governed workspace.
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-3 sm:min-w-[280px] sm:grid-cols-2 lg:w-auto">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-400">Signed in as</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-800">{profile?.email || 'Admin profile'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-400">Current session</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{currentSessionDuration}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-slate-400">Managed records</p>
          <p className="mt-1 text-sm font-bold text-slate-800">{formatNumber(totalRecords)}</p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0066CC] disabled:cursor-wait disabled:opacity-70"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
    <p className="mt-4 text-xs text-slate-400">
      Last profile touch: {formatRelativeTime(lastLoginMillis)}
    </p>
  </section>
);

const ExecutiveKpiGrid = ({ stats, loading, currentSessionDuration, lastLoginMillis }) => {
  const totalRecords = stats.collectionSummaries.reduce((total, summary) => total + summary.count, 0);
  const topSection = stats.topSections[0];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <StatCard
        icon={Database}
        label="Managed Records"
        value={formatNumber(totalRecords)}
        color="cyan"
        loading={loading}
      />
      <StatCard
        icon={Users}
        label="Admin Users"
        value={formatNumber(stats.userSummary.adminUsers)}
        color="red"
        loading={loading}
      />
      <StatCard
        icon={BookOpen}
        label="Library Users"
        value={formatNumber(stats.userSummary.libraryUsers)}
        color="indigo"
        loading={loading}
      />
      <StatCard
        icon={Activity}
        label="Activity Signals"
        value={formatNumber(stats.usageSummary.totalSignals)}
        color="green"
        loading={loading}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500">
            Live
          </span>
        </div>
        <p className="mt-4 text-2xl font-bold text-slate-800">{currentSessionDuration}</p>
        <p className="mt-1 text-sm text-slate-500">Current admin page time</p>
        <p className="mt-2 text-xs text-slate-400">
          Last login/profile update: {formatRelativeTime(lastLoginMillis)}
        </p>
        {topSection && (
          <p className="mt-3 truncate text-xs font-semibold text-[#0066CC]">
            Highest volume: {topSection.label}
          </p>
        )}
      </div>
    </div>
  );
};

const AnalyticsChartsGrid = ({ stats }) => {
  const topSectionData = stats.topSections.map((summary) => ({
    name: summary.label,
    count: summary.count,
  }));
  const categoryData = stats.categoryBreakdown.filter((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">Activity Trend</p>
            <h3 className="text-lg font-bold text-slate-900">Recent updates by day</h3>
          </div>
          <p className="text-xs text-slate-500">Based on timestamped records available to this admin role.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.weeklyActivity}>
              <defs>
                <linearGradient id="updatesGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#0066CC" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0066CC" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="updates" stroke="#0066CC" strokeWidth={2} fill="url(#updatesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">Governance Mix</p>
          <h3 className="text-lg font-bold text-slate-900">Records by area</h3>
        </div>
        <div className="h-64">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={86}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyDashboardState label="No category data yet" />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">Most Used Sections</p>
            <h3 className="text-lg font-bold text-slate-900">Highest-volume admin areas</h3>
          </div>
          <p className="text-xs text-slate-500">Collection counts use Firestore aggregation when allowed.</p>
        </div>
        <div className="h-72">
          {topSectionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSectionData} margin={{ top: 10, right: 16, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  interval={0}
                  angle={-24}
                  textAnchor="end"
                  height={70}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#003366" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyDashboardState label="No section count data yet" />
          )}
        </div>
      </section>
    </div>
  );
};

const RecentActivityPanel = ({ activity, loading }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">Audit-Like Activity</p>
        <h3 className="text-lg font-bold text-slate-900">Latest content and user updates</h3>
      </div>
      {loading && <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />}
    </div>

    {activity.length === 0 ? (
      <EmptyDashboardState label="No timestamped activity found yet" />
    ) : (
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[1fr_140px_120px] gap-3 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
          <span>Record</span>
          <span>Section</span>
          <span>Updated</span>
        </div>
        <div className="divide-y divide-slate-100">
          {activity.map((item) => {
            const colors = COLOR_MAP[item.color] || COLOR_MAP.slate;
            return (
              <div key={`${item.collectionName}-${item.id}`} className="grid grid-cols-[1fr_140px_120px] gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {item.actor ? `By ${item.actor}` : item.status}
                  </p>
                </div>
                <span className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold ${colors.bgAlpha} ${colors.text}`}>
                  {item.section}
                </span>
                <span className="text-xs font-medium text-slate-500">{formatRelativeTime(item.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </section>
);

const UserUsagePanel = ({ userSummary, usageSummary, currentSessionDuration, lastLoginMillis }) => {
  const userRows = [
    { label: 'Admin profiles', value: userSummary.adminProfiles, color: 'red' },
    { label: 'Staff admin users', value: userSummary.adminUsers, color: 'blue' },
    { label: 'Library users', value: userSummary.libraryUsers, color: 'indigo' },
    { label: 'Activity logs', value: userSummary.activityLogs, color: 'green' },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">Users And Page Time</p>
        <h3 className="text-lg font-bold text-slate-900">User footprint and usage signals</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">Current page time</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{currentSessionDuration}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">Last profile touch</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatRelativeTime(lastLoginMillis)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {userRows.map((row) => {
          const colors = COLOR_MAP[row.color] || COLOR_MAP.slate;
          return (
            <div key={row.label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${colors.bg}`} />
                <span className="text-sm font-medium text-slate-600">{row.label}</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{formatNumber(row.value)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">Usage signal collections</p>
          <span className="text-sm font-bold text-[#003366]">{formatNumber(usageSummary.totalSignals)}</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-500">{usageSummary.dataSourceNote}</p>
        <div className="mt-3 space-y-2">
          {usageSummary.signalRows.map((row) => {
            const colors = COLOR_MAP[row.color] || COLOR_MAP.slate;
            return (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{row.label}</span>
                <span className={`rounded-full px-2 py-0.5 font-semibold ${colors.bgAlpha} ${colors.text}`}>
                  {row.access === 'restricted' ? 'restricted' : formatNumber(row.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CollectionAnalysisGrid = ({ summaries, loading }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">Full Section Analysis</p>
        <h3 className="text-lg font-bold text-slate-900">Collection coverage and access state</h3>
      </div>
      {loading && <span className="text-xs font-semibold text-slate-400">Refreshing live counts...</span>}
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {summaries.map((summary) => {
        const colors = COLOR_MAP[summary.color] || COLOR_MAP.slate;
        return (
          <div key={summary.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bgAlpha}`}>
                <summary.icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${summary.access === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {summary.access}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{formatNumber(summary.count)}</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{summary.label}</p>
            <p className="mt-1 text-xs text-slate-500">{summary.category}</p>
          </div>
        );
      })}
    </div>
  </section>
);

const SystemReadinessPanel = ({ errors, loading }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
        <Activity className="h-5 w-5 text-emerald-500" />
        System readiness
      </h3>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
        {loading ? 'Refreshing' : 'Dashboard online'}
      </span>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <HealthMetric label="Hosting" value="Live" percentage={100} color="green" />
      <HealthMetric label="Firestore Reads" value={errors.length ? 'Partial' : 'Healthy'} percentage={errors.length ? 72 : 98} color={errors.length ? 'yellow' : 'green'} />
      <HealthMetric label="Admin Session" value="Active" percentage={100} color="green" />
    </div>
    {errors.length > 0 && (
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-bold text-amber-800">Some analytics sources could not be read.</p>
        <ul className="mt-2 space-y-1 text-xs leading-5 text-amber-700">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

const EmptyDashboardState = ({ label }) => (
  <div className="flex h-full min-h-[160px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-400">
    {label}
  </div>
);

const OperationalSecurityPanel = ({ permissions, profile }) => {
  const permissionCount = permissions?.length || 0;
  const controls = [
    {
      label: 'Authentication',
      value: 'Enforced',
      description: 'Admin bypass is disabled unless explicitly enabled in local development.',
      icon: Shield,
      color: 'green',
    },
    {
      label: 'Role access',
      value: profile?.role ? profile.role.replace(/_/g, ' ') : 'Profile required',
      description: `${permissionCount} permissions available from the active role profile.`,
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Media governance',
      value: 'Separated',
      description: 'Images, videos, press material, and public galleries are managed as distinct sections.',
      icon: Image,
      color: 'purple',
    },
    {
      label: 'Data maintenance',
      value: 'Admin write only',
      description: 'Official content writes are routed through authenticated admin profiles.',
      icon: Database,
      color: 'red',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {controls.map((control) => {
        const colors = COLOR_MAP[control.color] || COLOR_MAP.slate;
        return (
          <div key={control.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colors.bgAlpha}`}>
                <control.icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{control.label}</p>
                <p className="mt-1 text-sm font-bold capitalize text-slate-800">{control.value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{control.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AdminGovernanceGrid = ({ areas, onOpen }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#0066CC]">Government maintenance model</p>
        <h3 className="text-xl font-bold text-slate-800">Section-wise administration</h3>
      </div>
      <p className="max-w-xl text-sm leading-6 text-slate-500">
        Each operational area has a clear owner, route, and publishing responsibility so media, research, services, and staff access do not blur together.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {areas.map((area) => {
        const colors = COLOR_MAP[area.color] || COLOR_MAP.slate;
        return (
          <button
            key={area.label}
            type="button"
            onClick={() => onOpen(area.route)}
            className="group rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[#0066CC]/40 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${colors.bgAlpha}`}>
                <area.icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 group-hover:text-[#003366]">{area.label}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{area.owner}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">{area.status}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, loading: isLoading }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.slate;
  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bgAlpha} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.textLight}`} />
        </div>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-1">
        {isLoading ? (
          <span className="inline-block w-12 h-6 bg-slate-200 rounded animate-pulse" />
        ) : (
          value
        )}
      </h3>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, onClick, color }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.slate;
  return (
    <button
      onClick={onClick}
      className={`p-4 ${colors.bgAlpha} ${colors.hoverBg} border ${colors.border} rounded-xl transition-all text-left`}
    >
      <Icon className={`w-6 h-6 ${colors.textLight} mb-2`} />
      <p className="text-sm font-medium text-slate-800">{label}</p>
    </button>
  );
};

const HealthMetric = ({ label, value, percentage, color }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.slate;
  return (
    <div className="p-4 bg-slate-100/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-500">{label}</p>
        <CheckCircle className={`w-4 h-4 ${colors.textLight}`} />
      </div>
      <p className="text-lg font-bold text-slate-800 mb-2">{value}</p>
      <div className="w-full bg-slate-300 rounded-full h-2">
        <div
          className={`${colors.bg} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ContentCoveragePanel = () => {
  const totalSections = EDITABLE_SECTIONS.length + NOT_EDITABLE_SECTIONS.length;
  const editableCount = EDITABLE_SECTIONS.length;
  const percentage = Math.round((editableCount / totalSections) * 100);

  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
      <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
        <PieChart className="w-5 h-5 text-blue-400" />
        Content Coverage
      </h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600 font-medium">
            {editableCount} of {totalSections} sections editable from admin
          </span>
          <span className="text-sm font-bold text-slate-800">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editable */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Editable via Admin Panel
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {EDITABLE_SECTIONS.map((section) => (
              <span key={section} className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                {section}
              </span>
            ))}
          </div>
        </div>

        {/* Not Yet Editable */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Not Yet Editable (Hardcoded)
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {NOT_EDITABLE_SECTIONS.map((section) => (
              <span key={section} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                {section}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminPanel;
