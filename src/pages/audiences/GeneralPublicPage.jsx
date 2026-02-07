import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock3,
  Fish,
  FlaskConical,
  GraduationCap,
  Map,
  Phone,
  ShieldCheck,
  Ship,
  TrendingUp,
  Waves,
} from 'lucide-react';

const ESSENTIAL_SERVICES = [
  {
    icon: Fish,
    title: 'Fish Advisory Service',
    description: 'Daily safe fishing zones and fish safety updates.',
    route: '/fish-advisory-system',
    badge: 'Live'
  },
  {
    icon: FlaskConical,
    title: 'Laboratory Testing',
    description: 'Submit and track fish and water quality tests.',
    route: '/lab-results',
    badge: 'Service Desk'
  },
  {
    icon: Waves,
    title: 'Marine Forecast',
    description: 'Sea state and weather risk outlook for planning.',
    route: '/marine-forecast',
    badge: 'Updated'
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Reporting',
    description: 'Report marine emergencies through dedicated response network.',
    route: '/emergency-response-network',
    badge: '24/7'
  },
];

const ACTIVE_ADVISORIES = [
  {
    id: 'adv-01',
    title: 'Monsoon Conditions Advisory',
    message: 'Strong winds expected in southern waters. Plan departures carefully.',
    severity: 'high',
    updated: '2 hours ago'
  },
  {
    id: 'adv-02',
    title: 'Fish Safety Bulletin',
    message: 'Current coastal catches from Negombo to Colombo are safe for consumption.',
    severity: 'low',
    updated: '5 hours ago'
  },
  {
    id: 'adv-03',
    title: 'Laboratory Intake Notice',
    message: 'Express testing intake remains open today until 4:00 PM.',
    severity: 'medium',
    updated: 'Today'
  },
];

const COMMUNITY_PROGRAMS = [
  {
    icon: GraduationCap,
    title: 'Fisher Training Programs',
    description: 'Practical training on safe operations and sustainable fishing methods.',
    route: '/learning-development-academy'
  },
  {
    icon: Briefcase,
    title: 'Public Recruitment Notices',
    description: 'Current public vacancies, tenders, and recruitment updates.',
    route: '/procurement-recruitment-portal'
  },
  {
    icon: BookOpen,
    title: 'Knowledge & Guidance',
    description: 'Public educational resources on marine life, seasons, and conservation.',
    route: '/knowledge-discovery-center'
  },
];

const DATA_TOOLS = [
  {
    icon: Map,
    title: 'Fishing Zone Map',
    value: '24 zones',
    route: '/marine-spatial-planning-viewer'
  },
  {
    icon: TrendingUp,
    title: 'Market Price Insights',
    value: 'Hourly',
    route: '/export-market-intelligence'
  },
  {
    icon: Calendar,
    title: 'Seasonal Fishing Calendar',
    value: 'Monthly',
    route: '/knowledge-discovery-center'
  },
];

const EMERGENCY_CONTACTS = [
  { icon: Phone, label: 'Emergency Hotline', value: '1919', tel: '1919' },
  { icon: Ship, label: 'Coast Guard', value: '+94 11 244 0635', tel: '+94112440635' },
  { icon: AlertTriangle, label: 'Marine Incident Desk', value: '+94 11 252 2000', tel: '+94112522000' },
];

const severityStyles = {
  high: 'border-red-300 bg-red-50 text-red-800',
  medium: 'border-amber-300 bg-amber-50 text-amber-800',
  low: 'border-blue-300 bg-blue-50 text-blue-800',
};

const GeneralPublicPage = () => {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100">
      <section className="bg-gradient-to-r from-nara-navy via-[#00508f] to-nara-blue pt-24 pb-10 md:pt-28 md:pb-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              <ShieldCheck className="h-3.5 w-3.5" />
              General Public Services
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
              Public Marine Services for Coastal Communities
            </h1>
            <p className="mt-3 text-blue-100 text-base md:text-lg">
              Access fish safety, forecast updates, laboratory support, and emergency reporting through one compact government service page.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
              <p className="text-xs text-blue-100">Fish Safety Status</p>
              <p className="font-semibold mt-0.5">Safe to Consume</p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
              <p className="text-xs text-blue-100">Sea Condition</p>
              <p className="font-semibold mt-0.5">Moderate</p>
            </div>
            <div className="rounded-xl border border-white/25 bg-white/10 px-4 py-3">
              <p className="text-xs text-blue-100">Last Updated</p>
              <p className="font-semibold mt-0.5 inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Essential Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {ESSENTIAL_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.title}
                  onClick={() => navigate(service.route)}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{service.badge}</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-1 text-sm text-slate-700">{service.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                    Open Service <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 inline-flex items-center gap-2">
              <Bell className="h-6 w-6 text-amber-500" />
              Active Public Advisories
            </h2>
            <button
              onClick={() => navigate('/fish-advisory-system')}
              className="text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              View all advisories
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ACTIVE_ADVISORIES.map((item) => (
              <article key={item.id} className={`rounded-xl border p-4 ${severityStyles[item.severity] || severityStyles.low}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug">{item.title}</h3>
                  <span className="text-xs font-medium whitespace-nowrap">{item.updated}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{item.message}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Community Support Programs</h2>
            <div className="mt-4 space-y-3">
              {COMMUNITY_PROGRAMS.map((program) => {
                const Icon = program.icon;
                return (
                  <button
                    key={program.title}
                    onClick={() => navigate(program.route)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-blue-50 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-blue-600 p-2 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{program.title}</h3>
                        <p className="mt-1 text-sm text-slate-700">{program.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Practical Data Tools</h2>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {DATA_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.title}
                    onClick={() => navigate(tool.route)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-blue-50 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-cyan-600 p-2 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{tool.title}</p>
                        <p className="text-xs text-slate-600">{tool.value}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Emergency & Contact Support</h2>
              <p className="mt-2 text-sm text-slate-700">
                For urgent marine incidents, use the dedicated emergency response page.
              </p>
              <button
                onClick={() => navigate('/emergency-response-network')}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <AlertTriangle className="h-4 w-4" />
                Report Marine Emergency
              </button>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {EMERGENCY_CONTACTS.map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.label}
                    href={`tel:${contact.tel}`}
                    className="rounded-xl border border-red-200 bg-white p-3 transition-colors hover:border-red-300 hover:bg-red-50"
                  >
                    <div className="flex items-center gap-2 text-red-700">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-wide">{contact.label}</span>
                    </div>
                    <p className="mt-2 text-lg font-bold text-slate-900">{contact.value}</p>
                  </a>
                );
              })}
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            For life-threatening situations, call the Coast Guard immediately and provide location coordinates when possible.
          </p>
        </section>
      </main>
    </div>
  );
};

export default GeneralPublicPage;
