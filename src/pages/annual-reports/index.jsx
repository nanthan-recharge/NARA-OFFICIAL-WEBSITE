import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import annualReportsData from '../../data/annualReportsData.json';
import SEOHead from '../../components/shared/SEOHead';

const AnnualReportsPage = () => {
  const { t, i18n } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reports = annualReportsData.annualReports;
  const allYears = [...new Set(reports.map(r => r.year))].sort((a, b) => b - a);
  const languages = [
    { code: 'english', label: 'English', icon: '🇬🇧' },
    { code: 'sinhala', label: 'සිංහල', icon: '🇱🇰' },
    { code: 'tamil', label: 'தமிழ்', icon: '🇱🇰' }
  ];

  // Filter and search logic
  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Filter by year
    if (selectedYears.length > 0) {
      filtered = filtered.filter(r => selectedYears.includes(r.year));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.year.toString().includes(searchQuery)
      );
    }

    // Sort
    filtered.sort((a, b) =>
      sortOrder === 'desc' ? b.year - a.year : a.year - b.year
    );

    return filtered;
  }, [reports, selectedYears, searchQuery, sortOrder]);

  const toggleYear = (year) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const toggleLanguage = (lang) => {
    setSelectedLanguages(prev =>
      prev.includes(lang)
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const clearFilters = () => {
    setSelectedYears([]);
    setSelectedLanguages([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedYears.length > 0 || selectedLanguages.length > 0 || searchQuery;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50">
      <SEOHead
        title="Annual Reports"
        description="NARA annual reports documenting marine research achievements, financial stewardship, and institutional progress."
        path="/annual-reports"
        keywords="annual reports, marine research publications, NARA achievements"
      />
      {/* Hero Section - Light Blue Theme */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto relative z-10 text-slate-900 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium mb-6 text-blue-800 shadow-sm border border-blue-100">
            <Icons.BookOpen className="w-4 h-4" />
            <span>Transparency & Accountability</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            Annual Reports Archive
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-4">
            13 Years of Excellence • 39 Reports • 3 Languages
          </p>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Explore NARA's comprehensive annual reports from 2011-2023, available in English, Sinhala, and Tamil
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">39</div>
              <div className="text-sm text-slate-600">Total Reports</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">13</div>
              <div className="text-sm text-slate-600">Years Covered</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">3</div>
              <div className="text-sm text-slate-600">Languages</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 px-4 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full lg:w-96 relative">
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors"
              >
                {sortOrder === 'desc' ? (
                  <>
                    <Icons.ArrowDownWideNarrow className="w-5 h-5" />
                    Newest First
                  </>
                ) : (
                  <>
                    <Icons.ArrowUpWideNarrow className="w-5 h-5" />
                    Oldest First
                  </>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-semibold transition-colors"
                >
                  <Icons.X className="w-5 h-5" />
                  Clear Filters
                </button>
              )}

              <div className="text-sm text-slate-600 bg-slate-100 px-4 py-3 rounded-xl font-semibold">
                {filteredReports.length} {filteredReports.length === 1 ? 'Report' : 'Reports'}
              </div>
            </div>
          </div>

          {/* Year Filters */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Icons.Calendar className="w-4 h-4" />
              Filter by Year
            </h3>
            <div className="flex flex-wrap gap-2">
              {allYears.map(year => (
                <button
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${selectedYears.includes(year)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Icons.FileX className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No Reports Found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.year}
                  variants={itemVariants}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-slate-100"
                >
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                    {/* Report Info */}
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <div className="text-center">
                          <Icons.FileText className="w-8 h-8 mx-auto mb-1" />
                          <div className="text-xs font-bold">{report.year}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                          Annual Report {report.year}
                        </h3>
                        <p className="text-slate-600">
                          Available in 3 languages • Comprehensive institutional overview
                        </p>
                      </div>
                    </div>

                    {/* Language Downloads */}
                    <div className="flex flex-wrap gap-3">
                      {languages.map(lang => (
                        <a
                          key={lang.code}
                          href={report[lang.code]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                        >
                          <span className="text-lg">{lang.icon}</span>
                          <span>{lang.label}</span>
                          <Icons.Download className="w-4 h-4 group-hover:animate-bounce" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                    <button
                      onClick={() => window.open(report.english, '_blank')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                      <Icons.Eye className="w-4 h-4" />
                      Quick View
                    </button>
                    <button
                      onClick={() => {
                        // Download all 3 languages
                        window.open(report.english, '_blank');
                        setTimeout(() => window.open(report.sinhala, '_blank'), 500);
                        setTimeout(() => window.open(report.tamil, '_blank'), 1000);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                      <Icons.Download className="w-4 h-4" />
                      Download All Languages
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 text-slate-500 text-sm">
                      <Icons.FileType className="w-4 h-4" />
                      PDF Format
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Icons.HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Need Assistance?</h2>
          <p className="text-lg text-blue-100 mb-8">
            If you encounter any issues accessing our annual reports or need physical copies,
            please contact our administration office.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:info@nara.ac.lk"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Icons.Mail className="w-5 h-5" />
              Email Us
            </a>
            <a
              href="tel:+94112521000"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg"
            >
              <Icons.Phone className="w-5 h-5" />
              Call: 011-2521000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnualReportsPage;
