import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Enhanced Project Filters Component
 * Includes timeline categorization, date range, and advanced search
 */
const EnhancedProjectFilters = ({ 
  filters, 
  onFilterChange, 
  projects,
  filteredProjects 
}) => {
  const { t } = useTranslation('project-pipeline');

  // Calculate project counts by timeline
  const timelineStats = {
    past: projects.filter(p => p.status === 'completed').length,
    ongoing: projects.filter(p => p.status === 'active' || p.status === 'planning').length,
    future: projects.filter(p => p.status === 'planning' && new Date(p.startDate) > new Date()).length,
    onHold: projects.filter(p => p.status === 'on_hold').length
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Timeline Tabs */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Icons.Filter className="w-5 h-5 text-blue-600" />
          Project Timeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onFilterChange({ ...filters, timeline: 'all' })}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
              filters.timeline === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-2xl font-bold">{projects.length}</div>
            <div className="text-xs mt-1">All Projects</div>
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, timeline: 'past' })}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
              filters.timeline === 'past'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <div className="text-2xl font-bold">{timelineStats.past}</div>
            <div className="text-xs mt-1">Past Projects</div>
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, timeline: 'ongoing' })}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
              filters.timeline === 'ongoing'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            <div className="text-2xl font-bold">{timelineStats.ongoing}</div>
            <div className="text-xs mt-1">Ongoing</div>
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, timeline: 'future' })}
            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
              filters.timeline === 'future'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <div className="text-2xl font-bold">{timelineStats.future}</div>
            <div className="text-xs mt-1">Future/Planned</div>
          </button>
        </div>
      </div>

      {/* Advanced Search */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Icons.Search className="w-4 h-4" />
          Advanced Search & Filters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search (ID, Title, PI, Keywords)
            </label>
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {filters.searchTerm && (
                <button
                  onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icons.X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* RAG Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Health (RAG)</label>
            <select
              value={filters.ragStatus}
              onChange={(e) => onFilterChange({ ...filters, ragStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All</option>
              <option value="green">🟢 Green (On Track)</option>
              <option value="amber">🟡 Amber (At Risk)</option>
              <option value="red">🔴 Red (Critical)</option>
            </select>
          </div>

          {/* Division */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Division</label>
            <select
              value={filters.division}
              onChange={(e) => onFilterChange({ ...filters, division: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Divisions</option>
              <option value="Marine Biology & Ecosystems">Marine Biology & Ecosystems</option>
              <option value="Fisheries Science">Fisheries Science</option>
              <option value="Aquaculture">Aquaculture</option>
              <option value="Environmental Monitoring">Environmental Monitoring</option>
              <option value="Post-Harvest & Quality">Post-Harvest & Quality</option>
              <option value="Hydrography">Hydrography</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
            <select
              value={filters.year}
              onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Years</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <Icons.Calendar className="w-3 h-3 inline mr-1" />
              Start Date From
            </label>
            <input
              type="date"
              value={filters.startDateFrom || ''}
              onChange={(e) => onFilterChange({ ...filters, startDateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <Icons.Calendar className="w-3 h-3 inline mr-1" />
              End Date To
            </label>
            <input
              type="date"
              value={filters.endDateTo || ''}
              onChange={(e) => onFilterChange({ ...filters, endDateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> projects
          </span>
          {filters.timeline !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
              Timeline: {filters.timeline}
            </span>
          )}
        </div>
        <button
          onClick={() => onFilterChange({
            timeline: 'all',
            status: 'all',
            ragStatus: 'all',
            division: 'all',
            year: 'all',
            searchTerm: '',
            startDateFrom: '',
            endDateTo: ''
          })}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <Icons.RotateCcw className="w-4 h-4" />
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default EnhancedProjectFilters;
