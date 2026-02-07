import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  School,
  MapPin,
  Users,
  Calendar,
  Phone,
  Mail,
  Search,
  Filter,
  Download,
  Map as MapIcon,
  Grid,
  List,
  TrendingUp,
  Award,
  Building2,
  Upload,
  Plus,
  GraduationCap,
  BookOpen,
  University,
  Printer,
  Database,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSchoolList } from '../../hooks/useSchoolList';
import { filterSchools } from '../../services/schoolListService';
import SchoolMap from '../aqua-school-directory/components/SchoolMap';
import SchoolUploadModal from './components/SchoolUploadModal';
import SchoolAdminPanel from './components/SchoolAdminPanel';

// Multiple database URLs for different school categories
const SCHOOL_DATABASES = {
  aquaSchool: {
    name: 'Aqua School Partners',
    url: 'https://firebasestorage.googleapis.com/v0/b/nara-aquaschool.firebasestorage.app/o/Tbl20200101.xlsx?alt=media&token=d211f254-5d39-415c-ade5-524031d9287a',
    icon: School,
    color: 'from-cyan-500 to-blue-500',
    description: 'Partner schools in marine education program'
  },
  grade11: {
    name: '11th Grade Schools',
    url: null, // Will be provided later
    icon: BookOpen,
    color: 'from-green-500 to-teal-500',
    description: 'Schools offering 11th grade marine science programs'
  },
  grade12: {
    name: '12th Grade Schools',
    url: null, // Will be provided later
    icon: GraduationCap,
    color: 'from-purple-500 to-indigo-500',
    description: 'Schools offering 12th grade marine science programs'
  },
  universities: {
    name: 'Universities (Nexus)',
    url: null, // Will be provided later
    icon: University,
    color: 'from-orange-500 to-red-500',
    description: 'Universities offering Nexus graduate programs'
  },
  openUniversity: {
    name: 'Open University System',
    url: null, // Will be provided later
    icon: Globe2,
    color: 'from-pink-500 to-rose-500',
    description: 'Open university programs for marine studies'
  }
};

const EnhancedSchoolDirectory = () => {
  const { t } = useTranslation('aquaSchool');
  const [selectedCategory, setSelectedCategory] = useState('aquaSchool');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  // Get current database configuration
  const currentDB = SCHOOL_DATABASES[selectedCategory];
  
  // Fetch school data for current category
  const { schools, loading, error, stats } = useSchoolList(currentDB.url);

  // Get unique districts and years
  const districts = useMemo(() => {
    const unique = [...new Set(schools.map(s => 
      s.District || s.district || s.Location || s.location
    ).filter(Boolean))];
    return unique.sort();
  }, [schools]);

  const years = useMemo(() => {
    const unique = [...new Set(schools.map(s => 
      s['Partner Since'] || s.partnerSince || s.Year || s.year
    ).filter(Boolean))];
    return unique.sort((a, b) => b - a);
  }, [schools]);

  // Filter schools
  const filteredSchools = useMemo(() => {
    return filterSchools(schools, {
      search: searchQuery,
      location: selectedDistrict === 'all' ? null : selectedDistrict,
      yearFrom: selectedYear === 'all' ? null : parseInt(selectedYear),
      sortBy
    });
  }, [schools, searchQuery, selectedDistrict, selectedYear, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setSelectedDistrict('all');
    setSelectedYear('all');
  };

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
      {/* Hero Section - Navy Blue Government Theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute top-1/2 right-0 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.12) 1px, transparent 0)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200/90 backdrop-blur mb-6">
              <Database className="h-4 w-4" />
              <span>{t('directory.badge', 'Educational Network')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-space mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {t('directory.title', 'NARA')}
              </span>
              <br />
              <span className="text-white">{t('directory.subtitle', 'School Directory System')}</span>
            </h1>

            <p className="text-base md:text-lg text-slate-300/90 max-w-3xl mx-auto mb-8">
              {t('directory.description', 'Comprehensive database of educational institutions across Sri Lanka promoting marine science and environmental education')}
            </p>

            {/* Category Selection */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {Object.entries(SCHOOL_DATABASES).map(([key, db]) => {
                const Icon = db.icon;
                const isActive = selectedCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleCategoryChange(key)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${db.color} text-white border-transparent shadow-lg`
                        : 'bg-slate-900/60 border-slate-700/50 text-slate-300 hover:border-cyan-500/30 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{db.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: School, label: t('stats.schools', 'Institutions'), value: loading ? '...' : `${stats.totalSchools}+`, color: 'from-cyan-500 to-blue-500' },
                { icon: Users, label: t('stats.students', 'Students'), value: loading ? '...' : `${stats.totalStudents.toLocaleString()}+`, color: 'from-blue-500 to-purple-500' },
                { icon: MapPin, label: t('stats.districts', 'Districts'), value: loading ? '...' : `${stats.locations}+`, color: 'from-purple-500 to-pink-500' },
                { icon: Award, label: t('stats.avgStudents', 'Avg. Students'), value: loading ? '...' : stats.averageStudents, color: 'from-green-500 to-teal-500' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur"
                  >
                    <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white font-space">{stat.value}</div>
                    <div className="text-xs text-slate-200">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Current Category Info */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${currentDB.color}`}>
                <currentDB.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{currentDB.name}</h2>
                <p className="text-sm text-slate-200">{currentDB.description}</p>
              </div>
              {!currentDB.url && (
                <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                  <span className="text-xs text-yellow-300">Database pending</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
                <input
                  type="text"
                  placeholder={t('search.placeholder', 'Search institutions by name or location...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Upload Button */}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('actions.upload', 'Upload Data')}</span>
                </button>

                {/* Admin Panel */}
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('actions.admin', 'Admin')}</span>
                </button>

                {/* Print Button */}
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('actions.print', 'Print')}</span>
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  {[
                    { mode: 'grid', icon: Grid, label: 'Grid' },
                    { mode: 'list', icon: List, label: 'List' },
                    { mode: 'map', icon: MapIcon, label: 'Map' }
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        viewMode === mode
                          ? 'bg-cyan-500 text-white'
                          : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                      }`}
                      title={label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4">
              {/* District Filter */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="all">{t('filters.allDistricts', 'All Districts')}</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="all">{t('filters.allYears', 'All Years')}</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="name">{t('sort.name', 'Sort by Name')}</option>
                <option value="students">{t('sort.students', 'Sort by Students')}</option>
                <option value="year">{t('sort.year', 'Sort by Year')}</option>
              </select>

              {/* Results Count */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/30 text-slate-300">
                <Filter className="w-4 h-4" />
                <span className="text-sm">
                  {t('results.showing', 'Showing')} <strong className="text-white">{filteredSchools.length}</strong> {t('results.of', 'of')} {schools.length}
                </span>
              </div>

              {/* Download Button */}
              {currentDB.url && (
                <button
                  onClick={() => window.open(currentDB.url, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('actions.download', 'Download Data')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Content Display */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-200">{t('loading', 'Loading data...')}</p>
            </div>
          )}

          {error && (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {t('error', 'Error loading data')}: {error}
            </div>
          )}

          {!loading && !error && !currentDB.url && (
            <div className="text-center py-20">
              <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-200 text-lg">{t('noDatabase', 'Database not yet configured')}</p>
              <p className="text-slate-500 text-sm mt-2">{t('noDatabaseDesc', 'Upload Excel file to populate this category')}</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg transition-all"
              >
                <Upload className="w-5 h-5 inline mr-2" />
                {t('actions.uploadFirst', 'Upload First Dataset')}
              </button>
            </div>
          )}

          {!loading && !error && currentDB.url && viewMode === 'grid' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school, index) => (
                <SchoolCard key={index} school={school} index={index} t={t} category={selectedCategory} />
              ))}
            </div>
          )}

          {!loading && !error && currentDB.url && viewMode === 'list' && (
            <div className="space-y-4">
              {filteredSchools.map((school, index) => (
                <SchoolListItem key={index} school={school} index={index} t={t} category={selectedCategory} />
              ))}
            </div>
          )}

          {!loading && !error && currentDB.url && viewMode === 'map' && (
            <SchoolMap schools={filteredSchools} t={t} />
          )}

          {!loading && !error && currentDB.url && filteredSchools.length === 0 && (
            <div className="text-center py-20">
              <School className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-200 text-lg">{t('noResults', 'No institutions found matching your criteria')}</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDistrict('all');
                  setSelectedYear('all');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
              >
                {t('clearFilters', 'Clear Filters')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {showUploadModal && (
        <SchoolUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          category={selectedCategory}
          onUploadSuccess={() => {
            // Refresh data after successful upload
            window.location.reload();
          }}
        />
      )}

      {showAdminPanel && (
        <SchoolAdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          databases={SCHOOL_DATABASES}
        />
      )}

      {/* Print Styles */}
      {showPrintView && (
        <div className="print-view">
          <div className="print-header">
            <h1>NARA School Directory - {currentDB.name}</h1>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="print-content">
            {filteredSchools.map((school, index) => (
              <div key={index} className="print-school-item">
                <h3>{school['School Name'] || school.name || school.Name}</h3>
                <p><strong>District:</strong> {school.District || school.district || school.Location}</p>
                <p><strong>Students:</strong> {school.Students || school.students || school['Number of Students']}</p>
                <p><strong>Partner Since:</strong> {school['Partner Since'] || school.partnerSince || school.Year}</p>
                {school.Phone && <p><strong>Phone:</strong> {school.Phone}</p>}
                {school.Email && <p><strong>Email:</strong> {school.Email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced School Card Component
const SchoolCard = ({ school, index, t, category }) => {
  const name = school['School Name'] || school.name || school.Name;
  const district = school.District || school.district || school.Location || school.location;
  const students = school.Students || school.students || school['Number of Students'] || 0;
  const year = school['Partner Since'] || school.partnerSince || school.Year || school.year;
  const contact = school['Contact Person'] || school.contact || school.Contact;
  const phone = school.Phone || school.phone;
  const email = school.Email || school.email;

  const categoryInfo = SCHOOL_DATABASES[category];
  const Icon = categoryInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-xl bg-slate-900/60 border border-slate-700/50 p-6 hover:border-cyan-500/30 transition-all backdrop-blur"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryInfo.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${categoryInfo.color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white font-space mb-1 truncate">{name}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-200">
              <MapPin className="w-3 h-3" />
              <span>{district}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <span className="px-2 py-1 rounded-full bg-slate-800/50">{categoryInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {students > 0 && (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Users className="w-4 h-4 text-cyan-400 mb-1" />
              <div className="text-lg font-bold text-white">{students.toLocaleString()}</div>
              <div className="text-xs text-slate-200">{t('card.students', 'Students')}</div>
            </div>
          )}
          {year && (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Calendar className="w-4 h-4 text-blue-400 mb-1" />
              <div className="text-lg font-bold text-white">{year}</div>
              <div className="text-xs text-slate-200">{t('card.since', 'Since')}</div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        {(contact || phone || email) && (
          <div className="space-y-2 pt-4 border-t border-slate-700/50">
            {contact && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>{contact}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced School List Item Component
const SchoolListItem = ({ school, index, t, category }) => {
  const name = school['School Name'] || school.name || school.Name;
  const district = school.District || school.district || school.Location || school.location;
  const students = school.Students || school.students || school['Number of Students'] || 0;
  const year = school['Partner Since'] || school.partnerSince || school.Year || school.year;
  const contact = school['Contact Person'] || school.contact || school.Contact;
  const phone = school.Phone || school.phone;

  const categoryInfo = SCHOOL_DATABASES[category];
  const Icon = categoryInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-cyan-500/30 transition-all backdrop-blur"
    >
      <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryInfo.color} flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-white font-space mb-1">{name}</h3>
        <div className="flex items-center gap-1 text-sm text-slate-200">
          <MapPin className="w-3 h-3" />
          <span>{district}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-1 rounded-full bg-slate-800/50 text-xs text-slate-500">{categoryInfo.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 flex-shrink-0">
        {students > 0 && (
          <div className="text-center">
            <div className="text-lg font-bold text-white">{students.toLocaleString()}</div>
            <div className="text-xs text-slate-200">{t('card.students', 'Students')}</div>
          </div>
        )}
        {year && (
          <div className="text-center">
            <div className="text-lg font-bold text-white">{year}</div>
            <div className="text-xs text-slate-200">{t('card.since', 'Since')}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedSchoolDirectory;
