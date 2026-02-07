import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

// Import act content data
import actContentEn from '../../data/actContent-en.json';
import actContentSi from '../../data/actContent-si.json';
import actContentTa from '../../data/actContent-ta.json';
import SEOHead from '../../components/shared/SEOHead';

const ICON_MAP = {
  scale: Icons.Scale,
  fileText: Icons.FileText,
  shield: Icons.Shield,
  target: Icons.Target
};

const NARAActPage = () => {
  const { t, i18n } = useTranslation('naraAct');
  const [viewMode, setViewMode] = useState('download'); // 'download' or 'read'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [showTOC, setShowTOC] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get act content based on current language
  const getActContent = () => {
    const lang = i18n.language;
    if (lang === 'si') return actContentSi.act;
    if (lang === 'ta') return actContentTa.act;
    return actContentEn.act;
  };

  const actContent = getActContent();

  const hero = t('naraAct.hero', { returnObjects: true });
  const highlights = t('naraAct.highlights', { returnObjects: true });
  const documents = t('naraAct.documents', { returnObjects: true });
  const cta = t('naraAct.cta', { returnObjects: true });

  const highlightItems = Array.isArray(highlights?.items) ? highlights.items : [];
  const actVersions = Array.isArray(documents?.naraAct?.versions) ? documents.naraAct.versions : [];
  const amendmentVersions = Array.isArray(documents?.amendment?.versions) ? documents.amendment.versions : [];
  const enactmentVersions = Array.isArray(documents?.enactment?.versions) ? documents.enactment.versions : [];

  // Filter sections based on search
  const filteredSections = actContent.sections.filter(section => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(query) ||
      section.content.toLowerCase().includes(query) ||
      (section.subsections && section.subsections.some(sub => sub.toLowerCase().includes(query)))
    );
  });

  // Highlight search terms in text
  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 text-slate-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(sectionId);
    }
  };

  // Generate PDF (placeholder - would use a library like jsPDF)
  const handleGeneratePDF = () => {
    alert(`PDF generation for ${i18n.language.toUpperCase()} version - This would use jsPDF library in production`);
    // In production, use jsPDF to generate PDF from actContent
  };

  const handleDownload = (fileUrl, language, documentType) => {
    console.log(`Downloading ${documentType} in ${language}: ${fileUrl}`);
    window.open(fileUrl, '_blank');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50">
      <SEOHead
        title="NARA Act"
        description="The National Aquatic Resources Research and Development Agency Act — legislative framework governing NARA Sri Lanka."
        path="/nara-act"
        keywords="NARA act, legislation, Sri Lanka marine law"
      />
      {/* Hero Section - Navy Blue Government Theme */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-600/10 via-navy-500/10 to-navy-400/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          className="max-w-6xl mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Icons.Scale className="w-4 h-4" />
              {hero?.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              {hero?.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-6">
              {hero?.headline}
            </p>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {hero?.description}
            </p>

            {/* View Mode Toggle */}
            <div className="mt-8 flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('read')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  viewMode === 'read'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icons.BookOpen className="w-5 h-5 inline mr-2" />
                Read Online
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('download')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  viewMode === 'download'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icons.Download className="w-5 h-5 inline mr-2" />
                Download PDFs
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Key Highlights Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {highlights?.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highlightItems.map((item, index) => {
              const IconComponent = ICON_MAP[item.icon] || Icons.FileText;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {viewMode === 'read' ? (
          /* Read Online View */
          <motion.section
            key="read"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-16 px-4 bg-white"
          >
            <div className="max-w-7xl mx-auto">
              {/* Toolbar */}
              <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm mb-8 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* TOC Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowTOC(!showTOC)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Icons.List className="w-5 h-5 inline mr-2" />
                      {showTOC ? 'Hide' : 'Show'} Contents
                    </motion.button>

                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search sections..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <Icons.X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PDF Download */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGeneratePDF}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Icons.FileDown className="w-5 h-5 inline mr-2" />
                    Export PDF
                  </motion.button>

                  {/* Print */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Icons.Printer className="w-5 h-5 inline mr-2" />
                    Print
                  </motion.button>
                </div>

                {/* Search Results Count */}
                {searchQuery && (
                  <div className="mt-4 text-sm text-slate-600">
                    Found {filteredSections.length} of {actContent.sections.length} sections
                  </div>
                )}
              </div>

              <div className="flex gap-8">
                {/* Table of Contents */}
                <AnimatePresence>
                  {showTOC && (
                    <motion.aside
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-80 flex-shrink-0 sticky top-32 h-fit max-h-[calc(100vh-200px)] overflow-y-auto"
                    >
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Icons.BookOpen className="w-5 h-5" />
                          Table of Contents
                        </h3>
                        <div className="space-y-1">
                          {actContent.sections.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => scrollToSection(section.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                activeSectionId === section.id
                                  ? 'bg-blue-100 text-blue-700 font-semibold'
                                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
                              }`}
                            >
                              <span className="font-medium">§{section.number}</span> {section.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>

                {/* Act Content */}
                <div ref={contentRef} className="flex-1 min-w-0">
                  {/* Act Header */}
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mb-8">
                    <h2 className="text-3xl font-bold mb-2">{actContent.shortTitle}</h2>
                    <p className="text-lg text-blue-100 mb-4">{actContent.fullTitle}</p>
                    <div className="flex items-center gap-2 text-blue-100">
                      <Icons.Calendar className="w-4 h-4" />
                      <span>{actContent.enactmentDate}</span>
                    </div>
                  </div>

                  {/* Preamble */}
                  {actContent.preamble && (
                    <div className="bg-slate-50 rounded-xl p-6 mb-8 border-l-4 border-blue-600">
                      <p className="text-slate-700 leading-relaxed italic">
                        {highlightText(actContent.preamble)}
                      </p>
                    </div>
                  )}

                  {/* Sections */}
                  <div className="space-y-6">
                    {filteredSections.map((section, index) => (
                      <motion.div
                        key={section.id}
                        id={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow scroll-mt-32"
                      >
                        {/* Section Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">{section.number}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-900">
                              {highlightText(section.title)}
                            </h3>
                          </div>
                        </div>

                        {/* Section Content */}
                        <div className="pl-16">
                          <p className="text-slate-700 leading-relaxed mb-4">
                            {highlightText(section.content)}
                          </p>

                          {/* Subsections */}
                          {section.subsections && section.subsections.length > 0 && (
                            <ul className="space-y-2">
                              {section.subsections.map((subsection, subIndex) => (
                                <li
                                  key={subIndex}
                                  className="text-slate-700 leading-relaxed pl-4 border-l-2 border-slate-200"
                                >
                                  {highlightText(subsection)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* No Results */}
                  {filteredSections.length === 0 && searchQuery && (
                    <div className="text-center py-12">
                      <Icons.Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">No sections found matching "{searchQuery}"</p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          /* Download PDFs View */
          <motion.section
            key="download"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-16 px-4 bg-white"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {documents?.title}
                </h2>
                <p className="text-lg text-slate-600">
                  {documents?.subtitle}
                </p>
              </motion.div>

              <div className="space-y-12">
                {/* NARA Act Document */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Icons.FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {documents?.naraAct?.title}
                      </h3>
                      <p className="text-slate-600">
                        {documents?.naraAct?.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {actVersions.map((version, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleDownload(version.fileUrl, version.language, 'NARA Act')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{version.flag}</span>
                          <div className="text-left flex-1">
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {version.language}
                            </div>
                            <div className="text-sm text-slate-500">{version.fileSize}</div>
                          </div>
                          <Icons.Download className="w-5 h-5 text-blue-600 group-hover:translate-y-1 transition-transform" />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium">
                          <Icons.FileDown className="w-4 h-4" />
                          {t('naraAct.documents.downloadButton', { language: version.language })}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* NARA Amendment Document */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl flex items-center justify-center">
                      <Icons.FileEdit className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {documents?.amendment?.title}
                      </h3>
                      <p className="text-slate-600">
                        {documents?.amendment?.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {amendmentVersions.map((version, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleDownload(version.fileUrl, version.language, 'NARA Amendment')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{version.flag}</span>
                          <div className="text-left flex-1">
                            <div className="font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                              {version.language}
                            </div>
                            <div className="text-sm text-slate-500">{version.fileSize}</div>
                          </div>
                          <Icons.Download className="w-5 h-5 text-cyan-600 group-hover:translate-y-1 transition-transform" />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-cyan-600 font-medium">
                          <Icons.FileDown className="w-4 h-4" />
                          {t('naraAct.documents.downloadButton', { language: version.language })}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* NARA Enactment Document */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Icons.BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {documents?.enactment?.title}
                      </h3>
                      <p className="text-slate-600">
                        {documents?.enactment?.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {enactmentVersions.map((version, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleDownload(version.fileUrl, version.language, 'NARA Enactment')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{version.flag}</span>
                          <div className="text-left flex-1">
                            <div className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                              {version.language}
                            </div>
                            <div className="text-sm text-slate-500">{version.fileSize}</div>
                          </div>
                          <Icons.Download className="w-5 h-5 text-teal-600 group-hover:translate-y-1 transition-transform" />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-teal-600 font-medium">
                          <Icons.FileDown className="w-4 h-4" />
                          {t('naraAct.documents.downloadButton', { language: version.language })}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
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
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
          >
            <Icons.Mail className="w-5 h-5" />
            {cta?.button}
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default NARAActPage;
