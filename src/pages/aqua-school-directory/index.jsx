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
  Building2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSchoolList } from '../../hooks/useSchoolList';
import { filterSchools } from '../../services/schoolListService';
import SchoolMap from './components/SchoolMap';

const SCHOOL_LIST_URL = 'https://firebasestorage.googleapis.com/v0/b/nara-aquaschool.firebasestorage.app/o/Tbl20200101.xlsx?alt=media&token=d211f254-5d39-415c-ade5-524031d9287a';

const AquaSchoolDirectory = () => {
  const { t } = useTranslation('aquaSchool');
  const { schools, loading, error, stats } = useSchoolList(SCHOOL_LIST_URL);
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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
              <School className="h-4 w-4" />
              <span>{t('directory.badge', 'Partner Schools')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold font-space mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {t('directory.title', 'Aqua School')}
              </span>
              <br />
              <span className="text-white">{t('directory.subtitle', 'Network Directory')}</span>
            </h1>

            <p className="text-base md:text-lg text-slate-300/90 max-w-3xl mx-auto mb-8">
              {t('directory.description', 'Discover our network of partner schools across Sri Lanka promoting marine education and environmental awareness')}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: School, label: t('stats.schools', 'Partner Schools'), value: loading ? '...' : `${stats.totalSchools}+`, color: 'from-cyan-500 to-blue-500' },
                { icon: Users, label: t('stats.students', 'Students Reached'), value: loading ? '...' : `${stats.totalStudents.toLocaleString()}+`, color: 'from-blue-500 to-purple-500' },
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
          {/* Filters & Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
                <input
                  type="text"
                  placeholder={t('search.placeholder', 'Search schools by name or location...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

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
              <button
                onClick={() => window.open(SCHOOL_LIST_URL, '_blank')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">{t('actions.download', 'Download List')}</span>
              </button>
            </div>
          </div>

          {/* Content Display */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-200">{t('loading', 'Loading schools...')}</p>
            </div>
          )}

          {error && (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {t('error', 'Error loading school data')}: {error}
            </div>
          )}

          {!loading && !error && viewMode === 'grid' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school, index) => (
                <SchoolCard key={index} school={school} index={index} t={t} />
              ))}
            </div>
          )}

          {!loading && !error && viewMode === 'list' && (
            <div className="space-y-4">
              {filteredSchools.map((school, index) => (
                <SchoolListItem key={index} school={school} index={index} t={t} />
              ))}
            </div>
          )}

          {!loading && !error && viewMode === 'map' && (
            <SchoolMap schools={filteredSchools} t={t} />
          )}

          {!loading && !error && filteredSchools.length === 0 && (
            <div className="text-center py-20">
              <School className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-200 text-lg">{t('noResults', 'No schools found matching your criteria')}</p>
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
    </div>
  );
};

// School Card Component (Grid View)
const SchoolCard = ({ school, index, t }) => {
  const name = school['School Name'] || school.name || school.Name;
  const district = school.District || school.district || school.Location || school.location;
  const students = school.Students || school.students || school['Number of Students'] || 0;
  const year = school['Partner Since'] || school.partnerSince || school.Year || school.year;
  const contact = school['Contact Person'] || school.contact || school.Contact;
  const phone = school.Phone || school.phone;
  const email = school.Email || school.email;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-xl bg-slate-900/60 border border-slate-700/50 p-6 hover:border-cyan-500/30 transition-all backdrop-blur"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
            <School className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white font-space mb-1 truncate">{name}</h3>
            {district && (
              <div className="flex items-center gap-1 text-sm text-slate-200">
                <MapPin className="w-3 h-3" />
                <span>{district}</span>
              </div>
            )}
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
              <div className="text-xs text-slate-200">{t('card.since', 'Partner Since')}</div>
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

// School List Item Component (List View)
const SchoolListItem = ({ school, index, t }) => {
  const name = school['School Name'] || school.name || school.Name;
  const district = school.District || school.district || school.Location || school.location;
  const students = school.Students || school.students || school['Number of Students'] || 0;
  const year = school['Partner Since'] || school.partnerSince || school.Year || school.year;
  const contact = school['Contact Person'] || school.contact || school.Contact;
  const phone = school.Phone || school.phone;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-cyan-500/30 transition-all backdrop-blur"
    >
      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0">
        <School className="w-5 h-5 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-white font-space mb-1">{name}</h3>
        {district && (
          <div className="flex items-center gap-1 text-sm text-slate-200">
            <MapPin className="w-3 h-3" />
            <span>{district}</span>
          </div>
        )}
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

export default AquaSchoolDirectory;
