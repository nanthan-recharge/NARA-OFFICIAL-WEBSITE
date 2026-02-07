import React, { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Fish,
  FlaskConical,
  MapPin,
  PhoneCall,
  Radio,
  Search,
  ShieldCheck,
  Ship,
  UserCog,
  Users,
  Waves,
} from 'lucide-react';
import EIAApplicationForm from '../../components/government-services/forms/EIAApplicationForm';
import LicenseApplicationForm from '../../components/government-services/forms/LicenseApplicationForm';
import EmergencyReportForm from '../../components/government-services/forms/EmergencyReportForm';
import {
  exportEIAToExcel,
  exportEmergenciesToExcel,
  exportLicensesToExcel,
} from '../../utils/governmentServicesExcelExport';
import {
  exportEIAToPDF,
  exportEmergencyToPDF,
  exportLicenseToPDF,
} from '../../utils/governmentServicesPDFExport';
import SEOHead from '../../components/shared/SEOHead';

const CATEGORY_STYLES = {
  regulatory: {
    labelKey: 'categories.regulatory',
    chip: 'bg-blue-500/20 text-blue-100 border-blue-300/40',
    dot: 'bg-blue-300',
  },
  operations: {
    labelKey: 'categories.operations',
    chip: 'bg-emerald-500/20 text-emerald-100 border-emerald-300/40',
    dot: 'bg-emerald-300',
  },
  intelligence: {
    labelKey: 'categories.intelligence',
    chip: 'bg-cyan-500/20 text-cyan-100 border-cyan-300/40',
    dot: 'bg-cyan-300',
  },
  collaboration: {
    labelKey: 'categories.collaboration',
    chip: 'bg-amber-500/20 text-amber-100 border-amber-300/40',
    dot: 'bg-amber-300',
  },
};

const AUDIENCE_OPTIONS = [
  { id: 'all', label: 'All Audiences' },
  { id: 'ministries', label: 'Ministries' },
  { id: 'provincial', label: 'Provincial Authorities' },
  { id: 'industry', label: 'Industry Operators' },
  { id: 'research', label: 'Research & Technical Teams' },
  { id: 'public', label: 'Public Services' },
];

const PORTAL_METRICS = [
  {
    id: 'services',
    value: '24',
    label: 'Integrated Digital Services',
    sublabel: 'Across NARA divisions',
    icon: Building2,
  },
  {
    id: 'sla',
    value: '92%',
    label: 'SLA Compliance',
    sublabel: 'Last 90 days',
    icon: CheckCircle2,
  },
  {
    id: 'applications',
    value: '690+',
    label: 'Monthly Applications',
    sublabel: 'Licensing + EIA + reporting',
    icon: FileCheck2,
  },
  {
    id: 'alerts',
    value: '24/7',
    label: 'Emergency Operations',
    sublabel: 'Marine monitoring desk',
    icon: Radio,
  },
];

const WORKFLOW_STEPS = [
  {
    id: 'submit',
    title: 'Submit',
    description: 'Start requests through digital forms for EIA, licensing, and emergency response.',
    icon: FileText,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'NARA technical officers validate scope, compliance, and supporting evidence.',
    icon: ShieldCheck,
  },
  {
    id: 'coordinate',
    title: 'Coordinate',
    description: 'Inter-agency coordination is triggered with timeline tracking and ownership.',
    icon: Users,
  },
  {
    id: 'deliver',
    title: 'Deliver',
    description: 'Decision outputs, permits, datasets, and advisories are delivered to stakeholders.',
    icon: BarChart3,
  },
];

const SERVICE_DIRECTORY = [
  {
    id: 'eia-management',
    title: 'Environmental Impact Assessment (EIA) Management',
    category: 'regulatory',
    audience: ['ministries', 'provincial', 'industry'],
    owner: 'Environmental Studies Division',
    sla: '15 working days for first review',
    delivery: 'Digital submission + technical panel review',
    description:
      'Submit coastal and marine development projects for scientific and regulatory environmental review.',
    requiredDocs: ['Project concept note', 'Location details', 'Environmental baseline data'],
    action: 'modal:eia',
  },
  {
    id: 'digital-licensing',
    title: 'Digital Marine Licensing',
    category: 'regulatory',
    audience: ['industry', 'provincial', 'public'],
    owner: 'Fisheries Technology + Admin',
    sla: '7 working days after complete documentation',
    delivery: 'Online application and status updates',
    description:
      'Apply for fishing, anchoring, and marine industrial licenses with validation and renewal workflow.',
    requiredDocs: ['Applicant identity', 'Vessel/operation documents', 'Safety or compliance records'],
    action: 'modal:license',
  },
  {
    id: 'compliance-inspections',
    title: 'Compliance & Inspection Registry',
    category: 'regulatory',
    audience: ['ministries', 'provincial', 'industry'],
    owner: 'National Compliance Cell',
    sla: 'High-risk issues triaged within 24 hours',
    delivery: 'Inspection logs and enforcement records',
    description:
      'Track environmental and operational compliance outcomes for ports, fishery harbours, and marine facilities.',
    requiredDocs: ['Inspection reports', 'Corrective action plans', 'Follow-up verification'],
    route: '/public-consultation-portal',
  },
  {
    id: 'marine-emergency-desk',
    title: 'Marine Emergency Reporting Desk',
    category: 'operations',
    audience: ['public', 'industry', 'provincial'],
    owner: 'NARA Emergency Coordination Unit',
    sla: 'Immediate intake + rapid dispatch routing',
    delivery: '24/7 incident reporting and response escalation',
    description:
      'Report oil spills, illegal fishing, coastal hazards, or marine incidents for immediate operational action.',
    requiredDocs: ['Incident details', 'Location', 'Contact information'],
    action: 'modal:emergency',
  },
  {
    id: 'fish-advisory',
    title: 'Fish Advisory & Safety Guidance',
    category: 'operations',
    audience: ['public', 'industry', 'provincial'],
    owner: 'Oceanography + Fisheries Analytics',
    sla: 'Daily advisory cycle',
    delivery: 'Operational forecasts and alerts',
    description:
      'Receive fishing zone advisories and risk guidance for safer, data-backed marine operations.',
    requiredDocs: ['Vessel operator account (optional)'],
    route: '/fish-advisory-system',
  },
  {
    id: 'marine-forecast',
    title: 'Marine Forecast & Risk Outlook',
    category: 'operations',
    audience: ['ministries', 'provincial', 'industry', 'public'],
    owner: 'Ocean Observation Center',
    sla: 'Continuous updates',
    delivery: 'Forecast maps and risk dashboards',
    description:
      'Monitor sea-state, weather, and operational risk conditions for planning and field operations.',
    requiredDocs: ['None'],
    route: '/marine-forecast',
  },
  {
    id: 'open-data-portal',
    title: 'Open Data Portal',
    category: 'intelligence',
    audience: ['ministries', 'provincial', 'industry', 'research', 'public'],
    owner: 'Data & Intelligence Unit',
    sla: 'Dataset refresh by publishing schedule',
    delivery: 'Machine-readable datasets',
    description:
      'Access NARA’s validated marine and fisheries datasets for planning, analytics, and evidence workflows.',
    requiredDocs: ['None'],
    route: '/open-data-portal',
  },
  {
    id: 'evidence-repository',
    title: 'Scientific Evidence Repository',
    category: 'intelligence',
    audience: ['ministries', 'provincial', 'research', 'industry'],
    owner: 'Research Excellence Unit',
    sla: 'Policy brief updates by publication cycle',
    delivery: 'Policy-ready summaries and scientific references',
    description:
      'Retrieve policy briefs, technical references, and peer-reviewed outputs to support official decisions.',
    requiredDocs: ['None'],
    route: '/scientific-evidence-repository',
  },
  {
    id: 'lab-results',
    title: 'Laboratory Result Services',
    category: 'intelligence',
    audience: ['industry', 'research', 'public'],
    owner: 'NARA Laboratory Network',
    sla: 'As per test protocol',
    delivery: 'Digital result publication and verification',
    description:
      'View test outputs and report status for aquatic product quality, safety, and technical assessments.',
    requiredDocs: ['Sample submission reference'],
    route: '/lab-results',
  },
  {
    id: 'vessel-booking',
    title: 'Research Vessel Booking',
    category: 'collaboration',
    audience: ['ministries', 'research'],
    owner: 'Marine Operations & Logistics',
    sla: 'Planning confirmation within 5 working days',
    delivery: 'Mission scheduling and crew coordination',
    description:
      'Coordinate scientific cruise logistics, onboard instrumentation, and marine sampling missions.',
    requiredDocs: ['Mission plan', 'Team details', 'Equipment request'],
    route: '/research-vessel-booking',
  },
  {
    id: 'collaboration-platform',
    title: 'Research Collaboration Platform',
    category: 'collaboration',
    audience: ['ministries', 'research', 'industry'],
    owner: 'Partnership & Innovation Desk',
    sla: 'Partner screening in 10 working days',
    delivery: 'Project collaboration and innovation matching',
    description:
      'Develop multi-stakeholder research and implementation programs with NARA divisions and partners.',
    requiredDocs: ['Concept note', 'Partner profile'],
    route: '/research-collaboration-platform',
  },
  {
    id: 'procurement-recruitment',
    title: 'Procurement & Recruitment Portal',
    category: 'collaboration',
    audience: ['ministries', 'industry', 'public'],
    owner: 'Administration Division',
    sla: 'As per procurement cycle',
    delivery: 'Tender, recruitment, and official notices',
    description:
      'Track procurement, staffing, and tender opportunities aligned with NARA service delivery programs.',
    requiredDocs: ['Bid or applicant documents'],
    route: '/procurement-recruitment-portal',
  },
];

const LIVE_OPERATIONS = [
  {
    id: 'ops-001',
    title: 'Mannar Coastal Elevation Monitoring',
    status: 'active',
    owner: 'Oceanography Division',
    location: 'Gulf of Mannar',
    note: 'Weekly shoreline and sea-level variance review in progress.',
  },
  {
    id: 'ops-002',
    title: 'Palk Bay Illegal Trawling Enforcement Support',
    status: 'urgent',
    owner: 'Fisheries + Coast Guard Coordination',
    location: 'Palk Bay',
    note: 'High-priority compliance support with active patrol coordination.',
  },
  {
    id: 'ops-003',
    title: 'Bar Reef Recovery Observation Program',
    status: 'monitoring',
    owner: 'Marine Biological Resources Division',
    location: 'Bar Reef Sanctuary',
    note: 'Coral recovery metrics improving in current assessment cycle.',
  },
];

const AGENCY_PROGRAMS = [
  {
    id: 'prog-1',
    name: 'National Coastal Quality Assurance Program',
    lead: 'Environmental Studies Division',
    progress: 78,
    timeline: 'Q1 2026 - Q4 2027',
  },
  {
    id: 'prog-2',
    name: 'Fisheries Risk Intelligence Rollout',
    lead: 'Fishing Technology Division',
    progress: 64,
    timeline: 'Q4 2025 - Q3 2026',
  },
  {
    id: 'prog-3',
    name: 'Marine Data Harmonization Initiative',
    lead: 'Data & Evidence Unit',
    progress: 52,
    timeline: 'Q2 2026 - Q2 2027',
  },
];

const INITIAL_ACTIVITY_FEED = [
  {
    id: 'ACT-2026-001',
    title: 'EIA pre-screening completed',
    timestamp: 'Today 09:45',
    channel: 'Environmental Studies Division',
  },
  {
    id: 'ACT-2026-002',
    title: 'License renewal approved',
    timestamp: 'Today 08:12',
    channel: 'Digital Licensing Desk',
  },
  {
    id: 'ACT-2026-003',
    title: 'Incident follow-up note published',
    timestamp: 'Yesterday 17:30',
    channel: 'Emergency Coordination Unit',
  },
];

const EXPORT_EIA_DATA = [
  {
    applicationId: 'EIA-2026-001',
    projectName: 'Point Pedro Fisheries Harbour Upgrade',
    projectType: 'Harbour Infrastructure',
    location: 'Point Pedro',
    district: 'Jaffna',
    estimatedBudget: 180000000,
    projectDuration: 24,
    startDate: '2026-03-01',
    applicantName: 'Harbour Development Unit',
    applicantOrganization: 'Ministry of Fisheries',
    contactEmail: 'fisheries.projects@gov.lk',
    contactPhone: '0112345678',
    status: 'pending',
    submittedAt: new Date(),
    documents: [{ name: 'concept-note.pdf' }],
  },
  {
    applicationId: 'EIA-2026-002',
    projectName: 'Western Coastal Wastewater Monitoring Network',
    projectType: 'Environmental Monitoring',
    location: 'Western Coastline',
    district: 'Colombo',
    estimatedBudget: 92000000,
    projectDuration: 18,
    startDate: '2026-02-10',
    applicantName: 'Water Environment Team',
    applicantOrganization: 'Marine Environment Authority',
    contactEmail: 'marine.env@gov.lk',
    contactPhone: '0112555344',
    status: 'approved',
    submittedAt: new Date(),
    documents: [{ name: 'technical-annex.pdf' }],
  },
];

const EXPORT_LICENSE_DATA = [
  {
    applicationId: 'LIC-FISH-2026-102',
    licenseNumber: 'NARA-LIC-8842',
    licenseType: 'fishing',
    applicantName: 'Global Seafoods Pvt Ltd',
    applicantNIC: '912345678V',
    contactPhone: '0771234567',
    contactEmail: 'ops@globalseafoods.lk',
    vesselName: 'Sea Falcon',
    vesselRegNo: 'WF-0012',
    businessName: 'Global Seafoods Pvt Ltd',
    businessRegNo: 'PV112233',
    operationArea: 'Western Offshore Zone',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    status: 'active',
    licenseFee: 15000,
    paymentStatus: 'paid',
    submittedAt: new Date(),
  },
  {
    applicationId: 'LIC-IND-2026-041',
    licenseNumber: 'Pending',
    licenseType: 'industrial',
    applicantName: 'Ocean Protein Exports',
    applicantNIC: '843456789V',
    contactPhone: '0768899000',
    contactEmail: 'compliance@oceanprotein.lk',
    vesselName: '',
    vesselRegNo: '',
    businessName: 'Ocean Protein Exports',
    businessRegNo: 'BR-77881',
    operationArea: 'Negombo Processing Zone',
    validFrom: '2026-04-01',
    validUntil: '2027-03-31',
    status: 'pending',
    licenseFee: 22000,
    paymentStatus: 'pending',
    submittedAt: new Date(),
  },
];

const EXPORT_EMERGENCY_DATA = [
  {
    incidentId: 'EMG-2026-011',
    title: 'Fuel spill response support',
    incidentType: 'oil_spill',
    severity: 'high',
    status: 'active',
    location: 'Galle Harbor Channel',
    district: 'Galle',
    coordinates: '6.0329, 80.2168',
    description: 'Localized fuel spill containment and water quality impact assessment ongoing.',
    immediateAction: 'Containment booms deployed and sampling initiated.',
    reporterName: 'Harbor Operations Desk',
    reporterContact: '0711112233',
    reporterEmail: 'harbor.ops@gov.lk',
    reportedAt: new Date(),
    photos: [{ name: 'incident-photo-1.jpg' }],
    responseTeam: 'NARA + Coast Guard',
    resolutionDate: null,
  },
  {
    incidentId: 'EMG-2026-004',
    title: 'Restricted zone trawling report',
    incidentType: 'illegal_fishing',
    severity: 'critical',
    status: 'active',
    location: 'Palk Bay Monitoring Sector 4',
    district: 'Mannar',
    coordinates: '9.1054, 79.5120',
    description: 'Unauthorized bottom trawling activity detected in protected area.',
    immediateAction: 'Joint patrol dispatched and compliance evidence archived.',
    reporterName: 'Fisheries Monitoring Unit',
    reporterContact: '0705554433',
    reporterEmail: 'monitoring@nara.gov.lk',
    reportedAt: new Date(),
    photos: [{ name: 'radar-capture.png' }],
    responseTeam: 'Fisheries Task Group',
    resolutionDate: null,
  },
];

const STATUS_STYLES = {
  active: 'bg-emerald-500/20 text-emerald-100 border-emerald-300/40',
  urgent: 'bg-red-500/20 text-red-100 border-red-300/40',
  monitoring: 'bg-cyan-500/20 text-cyan-100 border-cyan-300/40',
};

const GovernmentServicesPortal = () => {
  const { t } = useTranslation('governmentServices');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [activeModal, setActiveModal] = useState(null);
  const [activityFeed, setActivityFeed] = useState(INITIAL_ACTIVITY_FEED);
  const [exportNotice, setExportNotice] = useState('');

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICE_DIRECTORY.filter((service) => {
      const matchQuery =
        !q ||
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.owner.toLowerCase().includes(q);
      const matchCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchAudience =
        selectedAudience === 'all' || service.audience.includes(selectedAudience);
      return matchQuery && matchCategory && matchAudience;
    });
  }, [query, selectedCategory, selectedAudience]);

  const categoryOptions = useMemo(() => {
    const base = [
      { id: 'all', label: t('directory.allCategories') },
      ...Object.entries(CATEGORY_STYLES).map(([id, cfg]) => ({ id, label: t(cfg.labelKey) })),
    ];
    return base;
  }, [t]);

  const registerSubmission = (title) => (payload) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed((prev) => [
      {
        id: payload?.id || `${Date.now()}`,
        title,
        timestamp: `Today ${timestamp}`,
        channel: t('activity.channel'),
      },
      ...prev,
    ].slice(0, 8));
  };

  const handleExport = (runner, successLabel) => {
    const result = runner();
    if (result?.success) {
      setExportNotice(`${successLabel} ${t('reporting.exported')}: ${result.filename}`);
    } else {
      setExportNotice(`${t('reporting.exportFailed')}${result?.error ? `: ${result.error}` : ''}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001b33] via-[#002a4d] to-[#00111f] text-white">
      <SEOHead
        title="Government Services Portal"
        description="Access government marine services, permits, and regulatory information through NARA."
        path="/government-services-portal"
        keywords="government services, marine permits, fisheries regulation, NARA"
      />
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
            <Building2 className="h-4 w-4" />
            {t('hero.badge')}
          </div>

          <div className="mt-5 grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
                {t('hero.title')}
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              <p className="mt-4 text-slate-200 text-base md:text-lg max-w-3xl">
                {t('hero.description')}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveModal('eia')}
                  className="inline-flex items-center gap-2 rounded-xl bg-nara-blue hover:bg-blue-500 px-5 py-3 font-semibold transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  {t('hero.submitEia')}
                </button>
                <button
                  onClick={() => setActiveModal('license')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 px-5 py-3 font-semibold transition-colors"
                >
                  <FileCheck2 className="h-4 w-4" />
                  {t('hero.applyLicense')}
                </button>
                <button
                  onClick={() => setActiveModal('emergency')}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-300/40 bg-red-500/20 hover:bg-red-500/30 px-5 py-3 font-semibold transition-colors"
                >
                  <AlertTriangle className="h-4 w-4" />
                  {t('hero.reportEmergency')}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-100 font-semibold">{t('hero.dutyWindow')}</p>
              <div className="mt-3 text-3xl font-bold">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <p className="text-sm text-slate-200 mt-1">
                {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-cyan-200" />
                  <span>{t('hero.emergencyHotline')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-cyan-200" />
                  <span>{t('hero.serviceDesk')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-200" />
                  <span>{t('hero.location')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PORTAL_METRICS.map((metric) => {
              const MetricIcon = metric.icon;
              return (
                <div key={metric.id} className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <MetricIcon className="h-5 w-5 text-cyan-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm text-slate-100">{metric.label}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{metric.sublabel}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200 font-semibold">{t('workflow.sectionLabel')}</p>
              <h2 className="text-3xl font-headline font-bold">{t('workflow.title')}</h2>
            </div>
            <Link
              to="/research-collaboration-platform"
              className="inline-flex items-center gap-2 text-cyan-100 hover:text-white transition-colors"
            >
              {t('workflow.coordinationLink')} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-cyan-500/20 text-cyan-100 font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <StepIcon className="h-4 w-4 text-cyan-200" />
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-200 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200 font-semibold">{t('directory.sectionLabel')}</p>
              <h2 className="text-3xl font-headline font-bold">{t('directory.title')}</h2>
              <p className="mt-1 text-sm text-slate-200">{t('directory.subtitle')}</p>
            </div>
            <div className="text-sm text-slate-200">{filteredServices.length} {t('directory.servicesAvailable')}</div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
            <div className="grid lg:grid-cols-3 gap-3">
              <label className="relative lg:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('directory.searchPlaceholder')}
                  className="w-full rounded-xl border border-white/20 bg-[#001a31]/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </label>

              <div className="flex gap-2 overflow-x-auto lg:col-span-1 pb-1">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCategory(option.id)}
                    className={`px-3.5 py-2 rounded-xl border text-xs whitespace-nowrap transition-colors ${selectedCategory === option.id
                      ? 'bg-cyan-500/20 border-cyan-300/40 text-cyan-100'
                      : 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 overflow-x-auto lg:col-span-1 pb-1">
                {AUDIENCE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAudience(option.id)}
                    className={`px-3.5 py-2 rounded-xl border text-xs whitespace-nowrap transition-colors ${selectedAudience === option.id
                      ? 'bg-cyan-500/20 border-cyan-300/40 text-cyan-100'
                      : 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredServices.map((service) => {
              const categoryStyle = CATEGORY_STYLES[service.category];
              return (
                <article key={service.id} className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border ${categoryStyle.chip}`}>
                      <span className={`h-2 w-2 rounded-full ${categoryStyle.dot}`} />
                      {t(categoryStyle.labelKey)}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-white/20 bg-white/5 text-slate-200">
                      {service.sla}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold leading-snug">{service.title}</h3>
                  <p className="mt-2 text-sm text-slate-200 leading-relaxed">{service.description}</p>

                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                      <p className="uppercase tracking-[0.12em] text-slate-300">{t('directory.serviceOwner')}</p>
                      <p className="text-slate-100 mt-1">{service.owner}</p>
                    </div>
                    <div className="rounded-lg border border-white/15 bg-white/5 p-3">
                      <p className="uppercase tracking-[0.12em] text-slate-300">{t('directory.deliveryMode')}</p>
                      <p className="text-slate-100 mt-1">{service.delivery}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-300">{t('directory.requiredInputs')}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {service.requiredDocs.map((doc) => (
                        <span key={`${service.id}-${doc}`} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-slate-200">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    {service.action === 'modal:eia' ? (
                      <button
                        onClick={() => setActiveModal('eia')}
                        className="inline-flex items-center gap-2 rounded-xl bg-nara-blue hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold transition-colors"
                      >
                        {t('directory.startEia')}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : null}

                    {service.action === 'modal:license' ? (
                      <button
                        onClick={() => setActiveModal('license')}
                        className="inline-flex items-center gap-2 rounded-xl bg-nara-blue hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold transition-colors"
                      >
                        {t('directory.startLicense')}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : null}

                    {service.action === 'modal:emergency' ? (
                      <button
                        onClick={() => setActiveModal('emergency')}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500/80 hover:bg-red-500 px-4 py-2.5 text-sm font-semibold transition-colors"
                      >
                        {t('directory.submitEmergency')}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : null}

                    {!service.action && service.route ? (
                      <Link
                        to={service.route}
                        className="inline-flex items-center gap-2 rounded-xl bg-nara-blue hover:bg-blue-500 px-4 py-2.5 text-sm font-semibold transition-colors"
                      >
                        {t('directory.openService')}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-2xl border border-white/15 bg-white/10 p-5">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200 font-semibold">{t('operations.sectionLabel')}</p>
                <h2 className="text-2xl font-headline font-bold">{t('operations.title')}</h2>
              </div>
              <Link to="/marine-incident-portal" className="text-sm text-cyan-100 hover:text-white inline-flex items-center gap-1">
                {t('operations.incidentPortal')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {LIVE_OPERATIONS.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/15 bg-[#00152a]/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_STYLES[item.status] || STATUS_STYLES.monitoring}`}>
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-300">{item.owner}</span>
                  </div>
                  <h3 className="mt-2 font-semibold text-lg">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-200">{item.note}</p>
                  <p className="mt-2 text-xs text-slate-300 inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <h3 className="text-xl font-headline font-bold">{t('programs.title')}</h3>
              <div className="mt-4 space-y-4">
                {AGENCY_PROGRAMS.map((program) => (
                  <div key={program.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold leading-snug">{program.name}</p>
                        <p className="text-xs text-slate-300 mt-0.5">{program.lead}</p>
                      </div>
                      <span className="text-sm font-semibold text-cyan-100">{program.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${program.progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-300 inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {program.timeline}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <h3 className="text-xl font-headline font-bold">{t('activity.title')}</h3>
              <div className="mt-4 space-y-3">
                {activityFeed.map((activity) => (
                  <div key={activity.id} className="rounded-lg border border-white/15 bg-white/5 p-3">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-300">
                      <span>{activity.channel}</span>
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200 font-semibold">{t('reporting.sectionLabel')}</p>
              <h2 className="text-2xl font-headline font-bold">{t('reporting.title')}</h2>
              <p className="text-sm text-slate-200 mt-1">{t('reporting.subtitle')}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <h3 className="font-semibold text-lg">{t('reporting.eiaTitle')}</h3>
              <p className="text-sm text-slate-200 mt-1">{t('reporting.eiaDescription')}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleExport(() => exportEIAToExcel(EXPORT_EIA_DATA), 'EIA Excel')}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-sm"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </button>
                <button
                  onClick={() => exportEIAToPDF(EXPORT_EIA_DATA[0])}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-sm"
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <h3 className="font-semibold text-lg">{t('reporting.licenseTitle')}</h3>
              <p className="text-sm text-slate-200 mt-1">{t('reporting.licenseDescription')}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleExport(() => exportLicensesToExcel(EXPORT_LICENSE_DATA), 'License Excel')}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-sm"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </button>
                <button
                  onClick={() => exportLicenseToPDF(EXPORT_LICENSE_DATA[0])}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-sm"
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5">
              <h3 className="font-semibold text-lg">{t('reporting.emergencyTitle')}</h3>
              <p className="text-sm text-slate-200 mt-1">{t('reporting.emergencyDescription')}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleExport(() => exportEmergenciesToExcel(EXPORT_EMERGENCY_DATA), 'Emergency Excel')}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-sm"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </button>
                <button
                  onClick={() => exportEmergencyToPDF(EXPORT_EMERGENCY_DATA[0])}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 text-sm"
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>
            </div>
          </div>

          {exportNotice ? (
            <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/15 text-emerald-100 px-4 py-3 text-sm">
              {exportNotice}
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/15 bg-gradient-to-r from-[#003366]/70 to-[#00508f]/60 p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-headline font-bold">{t('contacts.title')}</h3>
              <p className="text-sm text-slate-200 mt-2">
                {t('contacts.description')}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{t('contacts.operationsDesk')}</p>
              <p className="text-slate-100">+94 11 252 1000</p>
              <p className="text-slate-200">operations@nara.gov.lk</p>
              <p className="text-slate-300">{t('contacts.operationsNote')}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-semibold">{t('contacts.policyDesk')}</p>
              <p className="text-slate-100">+94 11 252 1001</p>
              <p className="text-slate-200">evidence@nara.gov.lk</p>
              <p className="text-slate-300">{t('contacts.policyNote')}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/open-data-portal"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-sm"
            >
              <Database className="h-4 w-4" /> {t('quickLinks.openData')}
            </Link>
            <Link
              to="/scientific-evidence-repository"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-sm"
            >
              <FlaskConical className="h-4 w-4" /> {t('quickLinks.scientificEvidence')}
            </Link>
            <Link
              to="/fish-advisory-system"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-sm"
            >
              <Fish className="h-4 w-4" /> {t('quickLinks.fishAdvisory')}
            </Link>
            <Link
              to="/live-ocean-data"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-sm"
            >
              <Waves className="h-4 w-4" /> {t('quickLinks.liveOcean')}
            </Link>
            <Link
              to="/research-vessel-booking"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-sm"
            >
              <Ship className="h-4 w-4" /> {t('quickLinks.vesselBooking')}
            </Link>
            <Link
              to="/procurement-recruitment-portal"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2.5 text-sm"
            >
              <UserCog className="h-4 w-4" /> {t('quickLinks.procurement')}
            </Link>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {activeModal === 'eia' ? (
          <EIAApplicationForm
            onClose={() => setActiveModal(null)}
            onSuccess={registerSubmission(t('activity.newEia'))}
          />
        ) : null}

        {activeModal === 'license' ? (
          <LicenseApplicationForm
            onClose={() => setActiveModal(null)}
            onSuccess={registerSubmission(t('activity.newLicense'))}
          />
        ) : null}

        {activeModal === 'emergency' ? (
          <EmergencyReportForm
            onClose={() => setActiveModal(null)}
            onSuccess={registerSubmission(t('activity.newEmergency'))}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default GovernmentServicesPortal;
