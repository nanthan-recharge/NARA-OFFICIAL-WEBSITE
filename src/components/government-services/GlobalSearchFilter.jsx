import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Global Search and Filter Component
 * For Government Services Portal - works across all sections
 */
const GlobalSearchFilter = ({ 
  onSearch, 
  onFilterChange,
  activeFilters = {},
  sections = ['eia', 'licensing', 'compliance', 'emergency']
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    section: activeFilters.section || 'all',
    status: activeFilters.status || 'all',
    dateFrom: activeFilters.dateFrom || null,
    dateTo: activeFilters.dateTo || null,
    severity: activeFilters.severity || 'all',
    licenseType: activeFilters.licenseType || 'all',
    projectType: activeFilters.projectType || 'all'
  });

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      section: 'all',
      status: 'all',
      dateFrom: null,
      dateTo: null,
      severity: 'all',
      licenseType: 'all',
      projectType: 'all'
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    if (onSearch) onSearch('');
    if (onFilterChange) onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.section !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.severity !== 'all') count++;
    if (filters.licenseType !== 'all') count++;
    if (filters.projectType !== 'all') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search applications, licenses, emergencies..."
            className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                if (onSearch) onSearch('');
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            showFilters || activeFilterCount > 0
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
              : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-cyan-400" />
                  Advanced Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Section Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Section
                  </label>
                  <select
                    value={filters.section}
                    onChange={(e) => handleFilterChange('section', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  >
                    <option value="all" className="bg-slate-800">All Sections</option>
                    {sections.includes('eia') && <option value="eia" className="bg-slate-800">EIA Applications</option>}
                    {sections.includes('licensing') && <option value="licensing" className="bg-slate-800">Licensing</option>}
                    {sections.includes('compliance') && <option value="compliance" className="bg-slate-800">Compliance</option>}
                    {sections.includes('emergency') && <option value="emergency" className="bg-slate-800">Emergency</option>}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  >
                    <option value="all" className="bg-slate-800">All Statuses</option>
                    <option value="pending" className="bg-slate-800">Pending</option>
                    <option value="approved" className="bg-slate-800">Approved</option>
                    <option value="rejected" className="bg-slate-800">Rejected</option>
                    <option value="active" className="bg-slate-800">Active</option>
                    <option value="completed" className="bg-slate-800">Completed</option>
                    <option value="expired" className="bg-slate-800">Expired</option>
                  </select>
                </div>

                {/* License Type (if licensing section) */}
                {(filters.section === 'all' || filters.section === 'licensing') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      License Type
                    </label>
                    <select
                      value={filters.licenseType}
                      onChange={(e) => handleFilterChange('licenseType', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value="all" className="bg-slate-800">All Types</option>
                      <option value="fishing" className="bg-slate-800">Fishing</option>
                      <option value="anchoring" className="bg-slate-800">Anchoring</option>
                      <option value="industrial" className="bg-slate-800">Industrial</option>
                    </select>
                  </div>
                )}

                {/* Project Type (if EIA section) */}
                {(filters.section === 'all' || filters.section === 'eia') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Project Type
                    </label>
                    <select
                      value={filters.projectType}
                      onChange={(e) => handleFilterChange('projectType', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value="all" className="bg-slate-800">All Types</option>
                      <option value="coastal_development" className="bg-slate-800">Coastal Development</option>
                      <option value="marine_infrastructure" className="bg-slate-800">Marine Infrastructure</option>
                      <option value="aquaculture_facility" className="bg-slate-800">Aquaculture Facility</option>
                      <option value="industrial_discharge" className="bg-slate-800">Industrial Discharge</option>
                      <option value="port_development" className="bg-slate-800">Port Development</option>
                      <option value="other" className="bg-slate-800">Other</option>
                    </select>
                  </div>
                )}

                {/* Severity (if emergency section) */}
                {(filters.section === 'all' || filters.section === 'emergency') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Severity
                    </label>
                    <select
                      value={filters.severity}
                      onChange={(e) => handleFilterChange('severity', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value="all" className="bg-slate-800">All Levels</option>
                      <option value="critical" className="bg-slate-800">🔴 Critical</option>
                      <option value="high" className="bg-slate-800">🟠 High</option>
                      <option value="medium" className="bg-slate-800">🟡 Medium</option>
                      <option value="low" className="bg-slate-800">🟢 Low</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date From
                  </label>
                  <DatePicker
                    selected={filters.dateFrom}
                    onChange={(date) => handleFilterChange('dateFrom', date)}
                    maxDate={filters.dateTo || new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date To
                  </label>
                  <DatePicker
                    selected={filters.dateTo}
                    onChange={(date) => handleFilterChange('dateTo', date)}
                    minDate={filters.dateFrom}
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select end date"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Active Filters Summary */}
              {activeFilterCount > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-slate-400">Active filters:</span>
                    {filters.section !== 'all' && (
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-semibold flex items-center gap-1">
                        Section: {filters.section}
                        <button onClick={() => handleFilterChange('section', 'all')} className="hover:bg-cyan-500/30 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.status !== 'all' && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold flex items-center gap-1">
                        Status: {filters.status}
                        <button onClick={() => handleFilterChange('status', 'all')} className="hover:bg-blue-500/30 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.dateFrom && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold flex items-center gap-1">
                        From: {filters.dateFrom.toLocaleDateString()}
                        <button onClick={() => handleFilterChange('dateFrom', null)} className="hover:bg-purple-500/30 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.dateTo && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold flex items-center gap-1">
                        To: {filters.dateTo.toLocaleDateString()}
                        <button onClick={() => handleFilterChange('dateTo', null)} className="hover:bg-purple-500/30 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearchFilter;
