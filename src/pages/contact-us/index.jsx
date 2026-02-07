import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MultilingualContent from '../../components/compliance/MultilingualContent';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'general',
    subject: '',
    message: ''
  });

  const { t, i18n } = useTranslation('contact');
  const language = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language]);
  const sections = t('sections', { returnObjects: true });
  const info = sections?.info || {};
  const formSection = sections?.form || {};
  const mapSection = sections?.map || {};

  const responseMetrics = useMemo(() => ([
    {
      icon: 'Timer',
      label: 'Average response time',
      value: '1.2 business days'
    },
    {
      icon: 'Users',
      label: 'Dedicated specialists',
      value: '12 regional officers'
    },
    {
      icon: 'MessageCircle',
      label: 'Languages supported',
      value: 'Sinhala • Tamil • English'
    }
  ]), []);

  const supportServices = useMemo(() => ([
    {
      icon: 'LifeBuoy',
      badge: 'Urgent',
      title: 'Maritime Incidents & Emergencies',
      description: 'Report oil spills, stranded vessels, or critical ocean safety incidents.',
      contact: {
        label: '+94 11 252 1006 (24/7 hotline)',
        href: 'tel:+94112521006'
      },
      action: {
        label: 'Open emergency network',
        href: '/emergency-response-network'
      }
    },
    {
      icon: 'FileText',
      badge: 'Compliance',
      title: 'RTI & Regulatory Requests',
      description: 'Submit Right to Information forms, legal notices, and compliance documents.',
      contact: {
        label: 'rti@nara.ac.lk',
        href: 'mailto:rti@nara.ac.lk'
      },
      action: {
        label: 'Access RTI portal',
        href: '/rti'
      }
    },
    {
      icon: 'Handshake',
      badge: 'Partnerships',
      title: 'Research & Collaborations',
      description: 'Explore joint research, training, and international collaboration opportunities.',
      contact: {
        label: 'partnerships@nara.ac.lk',
        href: 'mailto:partnerships@nara.ac.lk'
      },
      action: {
        label: 'Book a consultation',
        href: '/partnership-innovation-gateway'
      }
    }
  ]), []);

  const visitOptions = useMemo(() => ([
    {
      icon: 'MapPin',
      title: info.office?.title || 'Head Office',
      lines: info.office?.lines || [],
      action: {
        label: mapSection.getDirections || 'Get directions',
        href: 'https://maps.google.com/?q=NARA+Sri+Lanka'
      }
    },
    {
      icon: 'Calendar',
      title: 'Plan your visit',
      lines: info.hours?.lines || [],
      action: {
        label: 'Schedule a facility tour',
        href: '/nara-divisions-hub'
      }
    },
    {
      icon: 'Map',
      title: mapSection.title || 'Find us',
      lines: [
        mapSection.location || 'Crow Island, Colombo 15, Sri Lanka',
        mapSection.comingSoon || 'Interactive map coming soon'
      ],
      action: {
        label: 'Download campus map (PDF)',
        href: '/documents/nara-campus-map.pdf'
      }
    }
  ]), [info.office?.lines, info.office?.title, info.hours?.lines, mapSection]);

  const reasonOptions = useMemo(() => ([
    { value: 'general', label: 'General inquiry' },
    { value: 'media', label: 'Media or press' },
    { value: 'research', label: 'Research partnership' },
    { value: 'training', label: 'Training & capacity building' },
    { value: 'data', label: 'Data / publications request' },
    { value: 'feedback', label: 'Feedback or suggestion' }
  ]), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const renderLines = (lines = []) =>
    lines.map((line, index) => (
      <span key={`${line}-${index}`}>
        {line}
        {index !== lines.length - 1 && <br />}
      </span>
    ));

  return (
    <MultilingualContent language={language}>
      <Helmet>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section - Navy Blue Government Theme */}
        <section className="relative overflow-hidden bg-gradient-to-br from-ocean-deep via-[#002a5c] to-ocean-deep py-20 px-4 text-white">
          <div className="absolute -top-16 right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-blue-500/30 blur-2xl" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white/90">
              <Icon name="Sparkles" className="h-4 w-4" />
              {language === 'si' ? 'සම්බන්ධ වන්න' : language === 'ta' ? 'தொடர்பு கொள்ளவும்' : 'Here to support you'}
            </span>
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">{t('hero.title')}</h1>
            <p className="max-w-3xl text-lg text-blue-100 md:text-xl">{t('hero.description')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                as="a"
                href="tel:+94112521000"
                variant="primary"
                className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 text-white backdrop-blur hover:bg-white/20"
              >
                <Icon name="PhoneCall" className="h-5 w-5" />
                Call main desk
              </Button>
              <Button
                as="a"
                href="mailto:info@nara.gov.lk"
                variant="ghost"
                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-6 py-3 text-white hover:bg-white/20"
              >
                <Icon name="Mail" className="h-5 w-5" />
                Email NARA
              </Button>
              <Button
                as="a"
                href="/rti"
                variant="ghost"
                className="inline-flex items-center gap-2 border border-white/30 bg-white/5 px-6 py-3 text-white hover:bg-white/20"
              >
                <Icon name="FileSearch" className="h-5 w-5" />
                Submit RTI request
              </Button>
            </div>
            <div className="mt-12 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {responseMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 text-left shadow-lg backdrop-blur-lg"
                >
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-blue-100">
                    <Icon name={metric.icon} className="h-5 w-5 text-white" />
                    {metric.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 rounded-3xl border border-blue-100 bg-gradient-to-r from-white to-blue-50 p-8 shadow-lg">
              <div className="grid gap-6 md:grid-cols-3">
                {supportServices.map((service) => (
                  <div
                    key={service.title}
                    className="flex h-full flex-col gap-4 rounded-2xl bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {service.badge}
                      </span>
                      <Icon name={service.icon} className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                      <p className="text-sm text-slate-600">{service.description}</p>
                    </div>
                    {service.contact && (
                      <a
                        href={service.contact.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <Icon name="ArrowUpRight" className="h-4 w-4" />
                        {service.contact.label}
                      </a>
                    )}
                    {service.action && (
                      <a
                        href={service.action.href}
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
                      >
                        <Icon name="ExternalLink" className="h-4 w-4" />
                        {service.action.label}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
              {/* Contact Information */}
              <div>
                <h2 className="mb-6 text-3xl font-bold text-slate-900">{info.title}</h2>
                <p className="mb-8 max-w-2xl text-sm text-slate-600">
                  Reach out directly to the team best suited to assist you. For accountability, every inquiry receives a ticket number and is routed to the relevant division. You can expect an acknowledgement email shortly after submission.
                </p>

                <div className="mb-5 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Icon name="MapPin" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.office?.title}</h3>
                      <p className="text-slate-600">{renderLines(info.office?.lines)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-5 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-green-100 p-3">
                      <Icon name="Phone" size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.phone?.title}</h3>
                      <p className="text-slate-600">{renderLines(info.phone?.lines)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-5 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-purple-100 p-3">
                      <Icon name="Mail" size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.email?.title}</h3>
                      <p className="text-slate-600">
                        {info.email?.primary && (
                          <>
                            <a href={`mailto:${info.email.primary}`} className="text-blue-600 hover:underline">
                              {info.email.primary}
                            </a>
                            <br />
                          </>
                        )}
                        {info.email?.secondary && (
                          <a href={`mailto:${info.email.secondary}`} className="text-blue-600 hover:underline">
                            {info.email.secondary}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-amber-100 p-3">
                      <Icon name="Clock" size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.hours?.title}</h3>
                      <p className="text-slate-600">
                        {(info.hours?.lines || []).map((line, index) => (
                          <span
                            key={`${line}-${index}`}
                            className={index === (info.hours?.lines?.length || 0) - 1 ? 'text-sm text-slate-500' : ''}
                          >
                            {line}
                            {index !== (info.hours?.lines?.length || 0) - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">{info.quickLinks?.title}</h3>
                  <div className="space-y-3">
                    <a href="/procurement-recruitment-portal" className="flex items-center text-blue-600 transition-colors hover:text-blue-700">
                      <Icon name="Briefcase" size={18} className="mr-2" />
                      {info.quickLinks?.careers}
                    </a>
                    <a href="/nara-news-updates-center" className="flex items-center text-blue-600 transition-colors hover:text-blue-700">
                      <Icon name="Newspaper" size={18} className="mr-2" />
                      {info.quickLinks?.news}
                    </a>
                    <a href="/emergency-response-network" className="flex items-center text-red-600 transition-colors hover:text-red-700">
                      <Icon name="AlertTriangle" size={18} className="mr-2" />
                      {info.quickLinks?.emergency}
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="mb-6 text-3xl font-bold text-slate-900">{formSection.title}</h2>
                <p className="mb-8 text-sm text-slate-600">
                  Provide as much detail as possible so we can route your inquiry to the correct division without delays.
                </p>

                <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                        {formSection.fields?.name?.label} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder={formSection.fields?.name?.placeholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                        {formSection.fields?.email?.label} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder={formSection.fields?.email?.placeholder}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                        Contact number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="+94 xx xxx xxxx"
                      />
                    </div>
                    <div>
                      <label htmlFor="reason" className="mb-2 block text-sm font-medium text-slate-700">
                        What is your inquiry about?
                      </label>
                      <select
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        {reasonOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                      {formSection.fields?.subject?.label} *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={formSection.fields?.subject?.placeholder}
                    />
                  </div>

                  <div className="mt-6">
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                      {formSection.fields?.message?.label} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={formSection.fields?.message?.placeholder}
                    />
                  </div>

                  <div className="mt-6 rounded-xl bg-blue-50/80 p-4 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" className="mt-0.5 h-4 w-4 text-blue-500" />
                      <div>
                        <p>{formSection.responseNotice}</p>
                        <p className="mt-2 text-xs text-slate-500">{formSection.disclaimer}</p>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" className="mt-6 w-full py-3 text-base font-semibold">
                    {formSection.submit}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map / Visit Section */}
        <section className="bg-slate-100 py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{mapSection.title || 'Plan your visit'}</h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  Visit our headquarters at Crow Island, Colombo 15, or schedule time with regional offices. Bring a valid photo ID for on-site access.
                </p>
              </div>
              <Button
                as="a"
                href="mailto:visits@nara.ac.lk"
                variant="secondary"
                className="inline-flex items-center gap-2"
              >
                <Icon name="CalendarPlus" className="h-5 w-5" />
                Arrange a site visit
              </Button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {visitOptions.map((option) => (
                <div key={option.title} className="flex h-full flex-col gap-4 rounded-3xl border border-white/80 bg-white p-6 shadow-md">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                    <Icon name={option.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{option.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{renderLines(option.lines)}</p>
                  </div>
                  {option.action && (
                    <a
                      href={option.action.href}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <Icon name="ArrowUpRight" className="h-4 w-4" />
                      {option.action.label}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center text-white md:flex-row md:text-left">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold">Prefer to speak to someone right now?</h2>
              <p className="text-blue-100">
                Our operators can connect you with the correct NARA division, schedule expert briefings, or help escalate urgent maritime matters. We track every conversation to ensure follow-up.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                as="a"
                href="tel:+94112521000"
                variant="primary"
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50"
              >
                <Icon name="PhoneCall" className="h-5 w-5" />
                Call +94 11 252 1000
              </Button>
              <Button
                as="a"
                href="/supporting-divisions"
                variant="ghost"
                className="inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10"
              >
                <Icon name="Users" className="h-5 w-5" />
                Meet support teams
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MultilingualContent>
  );
};

export default ContactUs;
