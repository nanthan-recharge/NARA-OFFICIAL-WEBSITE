import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import DynamicFormRenderer from '../../components/RTIForm/DynamicFormRenderer';
import rtiFormsData from '../../data/rtiFormsData.json';

const RTIPage = () => {
  const { t } = useTranslation('rti');
  const [activeTab, setActiveTab] = useState('forms');
  const [selectedForm, setSelectedForm] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenForm = (formId) => {
    console.log('Opening form:', formId);
    console.log('Available forms:', Object.keys(rtiFormsData?.forms || {}));
    const formData = rtiFormsData?.forms?.[formId];
    console.log('Found form data:', formData ? 'Yes' : 'No');
    if (formData) {
      setSelectedForm(formData);
      setShowFormModal(true);
    } else {
      console.error(`Form ${formId} not found in rtiFormsData`);
      alert(`Form ${formId} is not available yet. Please try downloading the PDF version.`);
    }
  };

  const hero = t('rti.hero', { returnObjects: true }) || {};
  const stats = t('rti.stats', { returnObjects: true }) || {};
  const sections = t('rti.sections', { returnObjects: true }) || {};
  const cta = t('rti.cta', { returnObjects: true }) || {};

  const statsArray = stats ? Object.entries(stats).map(([key, value]) => ({
    ...value,
    key
  })) : [];

  const categoryMap = useMemo(() => {
    const list = rtiFormsData?.form_list || [];
    return new Map(list.map((item) => [item.form_id, item.category || 'General']));
  }, []);

  const formsWithCategories = useMemo(() => {
    const formsArray = sections?.forms?.forms || [];
    return formsArray.map((form) => ({
      ...form,
      category: categoryMap.get(form.code) || 'General'
    }));
  }, [sections, categoryMap]);

  const categories = useMemo(() => {
    const unique = new Set(formsWithCategories.map((form) => form.category));
    return ['All', ...Array.from(unique)];
  }, [formsWithCategories]);

  const filteredForms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return formsWithCategories.filter((form) => {
      const matchesCategory = activeCategory === 'All' || form.category === activeCategory;
      const matchesTerm = term.length === 0
        || form.title?.toLowerCase().includes(term)
        || form.code?.toLowerCase().includes(term)
        || form.description?.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [formsWithCategories, searchTerm, activeCategory]);

  const quickActions = useMemo(() => {
    const quickActionCodes = ['RTI-01', 'RTI-05', 'RTI-10'];
    return quickActionCodes
      .map((code) => formsWithCategories.find((form) => form.code === code))
      .filter(Boolean);
  }, [formsWithCategories]);

  const processTimeline = useMemo(() => ([
    {
      step: 'Day 0',
      title: 'Submit RTI-01',
      description: 'File your information request online or via email/letter. Include as much detail as possible to speed up processing.'
    },
    {
      step: 'Day 3',
      title: 'Receive RTI-02 Acknowledgement',
      description: 'NARA formally acknowledges the request and shares your tracking number and expected response date.'
    },
    {
      step: 'Day 14',
      title: 'Decision Window',
      description: 'Information is provided (RTI-04) or a rejection/reason (RTI-05) is issued within the statutory timeframe.'
    },
    {
      step: 'Day 28',
      title: 'Follow-up & Appeals',
      description: 'If no response or you disagree with a decision, lodge an appeal with RTI-10 to reach the Designated Officer.'
    }
  ]), []);

  const supportCards = useMemo(() => ([
    {
      icon: Icons.PhoneCall,
      title: 'Talk to the RTI Desk',
      description: 'Call 011-2521000 (weekdays 08:30-16:30) for guidance on selecting the right form and submission method.',
      action: {
        label: 'Call Now',
        href: 'tel:0112521000'
      }
    },
    {
      icon: Icons.MessageCircle,
      title: 'Email Assistance',
      description: 'Send clarifications or supporting documents to rti@nara.ac.lk. Responses are typically within one business day.',
      action: {
        label: 'Email Us',
        href: 'mailto:rti@nara.ac.lk'
      }
    },
    {
      icon: Icons.Clock,
      title: 'Track Deadlines',
      description: 'Use the RTI register (RTI-03) to log responses, fees, and escalation deadlines for each request you handle.',
      action: {
        label: 'Download Register',
        onClick: () => handleOpenForm('RTI-03')
      }
    }
  ]), [handleOpenForm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'file-text': Icons.FileText,
      'check-circle': Icons.CheckCircle,
      'book-open': Icons.BookOpen,
      'check-square': Icons.CheckSquare,
      'x-circle': Icons.XCircle,
      'clock': Icons.Clock,
      'users': Icons.Users,
      'alert-circle': Icons.AlertCircle,
      'folder': Icons.Folder,
      'send': Icons.Send,
      'list': Icons.List,
      'user': Icons.User,
      'calendar': Icons.Calendar,
      'trending-up': Icons.TrendingUp,
      'flask-conical': Icons.FlaskConical,
      'star': Icons.Star
    };
    return iconMap[iconName] || Icons.FileText;
  };

  const handleFormSubmit = async (formData) => {
    // Here you can implement actual form submission logic
    // For now, we'll simulate an API call
    console.log('Form submitted:', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, send to backend/Firebase/email service
    // Example: 
    // await fetch('/api/rti/submit', {
    //   method: 'POST',
    //   body: JSON.stringify(formData)
    // });
    
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50">
      {/* Hero Section - Navy Blue Government Theme */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/10 via-navy-800/10 to-navy-700/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-navy-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div className="max-w-7xl mx-auto relative z-10" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="mx-auto flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Icons.Scale className="w-4 h-4" />
              {hero?.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {hero?.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-4 max-w-3xl">
              {hero?.headline}
            </p>
            <p className="text-lg text-slate-600 max-w-4xl leading-relaxed">
              {hero?.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setActiveTab('forms')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                <Icons.Edit3 className="w-5 h-5" />
                Start an RTI request
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold shadow border border-blue-200 hover:bg-blue-50 transition"
              >
                <Icons.FolderOpen className="w-5 h-5" />
                Browse documents
              </button>
            </div>
          </motion.div>

          {quickActions.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {quickActions.map((action) => (
                <div
                  key={action.code}
                  className="group relative overflow-hidden rounded-3xl bg-white/90 p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-500/5 to-purple-500/5 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                        {action.category}
                      </span>
                      {action.fileSize && (
                        <span className="text-sm font-semibold text-slate-500">
                          {action.fileSize}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-600">{action.code}</p>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {action.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {action.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => handleOpenForm(action.code)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                      >
                        <Icons.Edit className="w-4 h-4" />
                        Fill Online
                      </button>
                      <a
                        href={action.fileUrl}
                        download
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        <Icons.Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {statsArray.map((stat, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8 px-4 bg-white border-y border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {['forms', 'documents', 'officers', 'guidelines'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab === 'forms' && 'RTI Forms'}
                {tab === 'documents' && 'Documents Library'}
                {tab === 'officers' && 'RTI Officers'}
                {tab === 'guidelines' && 'How to Request'}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* RTI Forms Tab */}
          {activeTab === 'forms' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid gap-8 lg:grid-cols-[2fr,1fr] items-start">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                    {sections.forms?.title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {sections.forms?.description}
                  </p>
                  <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    <li className="flex items-start gap-2">
                      <Icons.CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                      Submit, track, and escalate every RTI form without downloading PDFs.
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.Clock3 className="mt-0.5 h-4 w-4 text-blue-600" />
                      Built-in reminders help you meet the 3, 14, and 28 day statutory deadlines.
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.ShieldCheck className="mt-0.5 h-4 w-4 text-blue-600" />
                      Data stays within NARA’s secure Firebase environment with audit trails.
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.ClipboardList className="mt-0.5 h-4 w-4 text-blue-600" />
                      Export summaries for monthly RTI compliance reporting in minutes.
                    </li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-blue-200 bg-white/90 p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Need a starting point?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Choose your form, launch the guided wizard, and save drafts locally. You can resume work
                    on any device as long as you keep the generated recovery link.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 text-sm">
                    <span className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                      <Icons.Sparkles className="h-4 w-4" />
                      New: Bulk register import for RTI-03 and RTI-11
                    </span>
                    <span className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                      <Icons.Wand2 className="h-4 w-4" />
                      Smart field hints powered by NARA knowledge base
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full max-w-xl">
                  <Icons.Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search for a form, e.g. RTI-05 or Appeal"
                    className="w-full rounded-2xl border border-blue-100 bg-white px-12 py-3 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activeCategory === category
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {filteredForms.length === 0 && (
                <div className="rounded-3xl border border-dashed border-blue-300 bg-white/80 p-10 text-center shadow-sm">
                  <Icons.SearchX className="mx-auto h-10 w-10 text-blue-500" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    No forms match your search
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
                    Try a different keyword or reset the filters to view all RTI templates. You can also jump to guidelines for a walkthrough.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setActiveCategory('All');
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
                    >
                      Reset filters
                    </button>
                    <button
                      onClick={() => setActiveTab('guidelines')}
                      className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      View submission guide
                    </button>
                  </div>
                </div>
              )}

              {filteredForms.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filteredForms.map((form, index) => {
                    const IconComponent = getIconComponent(form.icon);
                    return (
                      <motion.div
                        key={form.code || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="flex h-full flex-col gap-5 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                            <IconComponent className="h-7 w-7" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                              {form.code}
                            </p>
                            <h3 className="text-xl font-semibold text-slate-900">
                              {form.title}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {form.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                            <Icons.Tag className="h-3 w-3" />
                            {form.category}
                          </span>
                          {form.fileSize && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                              <Icons.FileText className="h-3 w-3" />
                              {form.fileSize}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                            <Icons.Wifi className="h-3 w-3" />
                            Digital submission ready
                          </span>
                        </div>
                        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                          <button
                            onClick={() => handleOpenForm(form.code)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                          >
                            <Icons.Edit3 className="w-4 h-4" />
                            Launch wizard
                          </button>
                          <a
                            href={form.fileUrl || `/documents/rti/${form.code}.pdf`}
                            download
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                            title="Download PDF Form"
                          >
                            <Icons.Download className="w-4 h-4" />
                            Download template
                          </a>
                        </div>
                        <button
                          onClick={() => setActiveTab('guidelines')}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                          <Icons.Compass className="h-3 w-3" />
                          View submission checklist
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    RTI processing milestones
                  </h3>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    Stay compliant with the RTI Act timelines. Use the checkpoints below to assign tasks across your team or set reminders in your calendar.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {processTimeline.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-3xl bg-gradient-to-br from-white to-blue-50 p-6 shadow-lg border border-blue-100"
                    >
                      <div className="text-sm font-bold uppercase tracking-wide text-blue-600">
                        {step.step}
                      </div>
                      <h4 className="mt-3 text-lg font-semibold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    Need help completing a request?
                  </h3>
                  <p className="text-sm text-slate-600">
                    Our compliance team and public information officers are ready to guide you at each step.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {supportCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
                      >
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-slate-900">
                            {card.title}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                        {card.action && card.action.href && (
                          <a
                            href={card.action.href}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                          >
                            <Icons.ArrowUpRight className="h-4 w-4" />
                            {card.action.label}
                          </a>
                        )}
                        {card.action && card.action.onClick && (
                          <button
                            onClick={card.action.onClick}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                          >
                            <Icons.Edit3 className="h-4 w-4" />
                            {card.action.label}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Documents Library Tab */}
          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {sections.documents?.title}
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  {sections.documents?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {sections?.documents?.categories?.map((category, index) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl border border-blue-100"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {category.name}
                          </h3>
                          <p className="text-blue-600 font-semibold">
                            {category.count} Documents
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-6">
                        {category.description}
                      </p>
                      <a
                        href={category.downloadUrl}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        <Icons.Download className="w-5 h-5" />
                        Download All
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RTI Officers Tab */}
          {activeTab === 'officers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {sections.officers?.title}
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  {sections.officers?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {sections?.officers?.officers?.map((officer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <Icons.User className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {officer.name}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm">
                          {officer.designation}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Icons.Mail className="w-5 h-5 text-blue-600" />
                        <a href={`mailto:${officer.email}`} className="hover:text-blue-600">
                          {officer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Icons.Phone className="w-5 h-5 text-blue-600" />
                        <a href={`tel:${officer.phone}`} className="hover:text-blue-600">
                          {officer.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Icons.MapPin className="w-5 h-5 text-blue-600" />
                        <span>{officer.office}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {sections.guidelines?.title}
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                {sections?.guidelines?.steps?.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 mb-8"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.step}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {cta?.title}
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            {cta?.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setActiveTab('forms')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              <Icons.Download className="w-5 h-5" />
              {cta?.button}
            </button>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
            >
              <Icons.Mail className="w-5 h-5" />
              {cta?.contact}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Interactive Form Modal */}
      <AnimatePresence>
        {showFormModal && selectedForm && (
          <DynamicFormRenderer
            formData={selectedForm}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setShowFormModal(false);
              setSelectedForm(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RTIPage;
