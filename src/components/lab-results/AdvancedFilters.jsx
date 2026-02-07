import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import * as Icons from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Advanced Filtering Component for Lab Results
 * Includes: Date range, multi-select filters, sort options
 */
const AdvancedFilters = ({ onFilterChange, onClear }) => {
  const { t } = useTranslation('labResults');
  
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    statuses: [],
    testTypes: [],
    sampleTypes: [],
    sortBy: 'date-desc'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter Options
  const statusOptions = [
    { value: 'pending', label: t('status.pending') },
    { value: 'in_progress', label: t('status.in_progress') },
    { value: 'processing', label: t('status.processing') },
    { value: 'completed', label: t('status.completed') },
    { value: 'submitted', label: t('status.submitted') },
    { value: 'received', label: t('status.received') }
  ];

  const testTypeOptions = [
    { value: 'water_quality', label: 'Water Quality' },
    { value: 'microbiological', label: 'Microbiological' },
    { value: 'chemical', label: 'Chemical Analysis' },
    { value: 'toxicology', label: 'Toxicology' },
    { value: 'biological', label: 'Biological' },
    { value: 'genetic', label: 'Genetic Analysis' }
  ];

  const sampleTypeOptions = [
    { value: 'seawater', label: 'Seawater' },
    { value: 'freshwater', label: 'Freshwater' },
    { value: 'fish', label: 'Fish' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'sediment', label: 'Sediment' },
    { value: 'plankton', label: 'Plankton' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'status-asc', label: 'Status (A-Z)' },
    { value: 'type-asc', label: 'Test Type (A-Z)' }
  ];

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      dateFrom: null,
      dateTo: null,
      statuses: [],
      testTypes: [],
      sampleTypes: [],
      sortBy: 'date-desc'
    };
    setFilters(clearedFilters);
    onClear();
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderWidth: '2px',
      borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
      borderRadius: '0.75rem',
      padding: '0.25rem',
      boxShadow: state.isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#dbeafe',
      borderRadius: '0.5rem'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#1e40af',
      fontWeight: '500'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#1e40af',
      ':hover': {
        backgroundColor: '#bfdbfe',
        color: '#1e3a8a'
      }
    })
  };

  const activeFiltersCount = 
    (filters.statuses.length > 0 ? 1 : 0) +
    (filters.testTypes.length > 0 ? 1 : 0) +
    (filters.sampleTypes.length > 0 ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Filter Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icons.Filter className="text-white" size={24} />
            <h3 className="text-xl font-bold text-white">
              Advanced Filters
              {activeFiltersCount > 0 && (
                <span className="ml-3 px-3 py-1 bg-white/20 rounded-full text-sm">
                  {activeFiltersCount} active
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            {showAdvanced ? <Icons.ChevronUp size={20} /> : <Icons.ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {showAdvanced && (
        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Icons.Calendar className="inline mr-2" size={16} />
              Date Range
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">From Date</label>
                <DatePicker
                  selected={filters.dateFrom}
                  onChange={(date) => handleFilterUpdate('dateFrom', date)}
                  selectsStart
                  startDate={filters.dateFrom}
                  endDate={filters.dateTo}
                  maxDate={filters.dateTo || new Date()}
                  placeholderText="Select start date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  dateFormat="MMM d, yyyy"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">To Date</label>
                <DatePicker
                  selected={filters.dateTo}
                  onChange={(date) => handleFilterUpdate('dateTo', date)}
                  selectsEnd
                  startDate={filters.dateFrom}
                  endDate={filters.dateTo}
                  minDate={filters.dateFrom}
                  maxDate={new Date()}
                  placeholderText="Select end date"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Icons.Tag className="inline mr-2" size={16} />
              Status
            </label>
            <Select
              isMulti
              options={statusOptions}
              value={filters.statuses}
              onChange={(selected) => handleFilterUpdate('statuses', selected || [])}
              placeholder="Select status..."
              styles={customSelectStyles}
              classNamePrefix="react-select"
            />
          </div>

          {/* Test Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Icons.FlaskConical className="inline mr-2" size={16} />
              Test Type
            </label>
            <Select
              isMulti
              options={testTypeOptions}
              value={filters.testTypes}
              onChange={(selected) => handleFilterUpdate('testTypes', selected || [])}
              placeholder="Select test types..."
              styles={customSelectStyles}
              classNamePrefix="react-select"
            />
          </div>

          {/* Sample Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Icons.TestTube className="inline mr-2" size={16} />
              Sample Type
            </label>
            <Select
              isMulti
              options={sampleTypeOptions}
              value={filters.sampleTypes}
              onChange={(selected) => handleFilterUpdate('sampleTypes', selected || [])}
              placeholder="Select sample types..."
              styles={customSelectStyles}
              classNamePrefix="react-select"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Icons.ArrowUpDown className="inline mr-2" size={16} />
              Sort By
            </label>
            <Select
              options={sortOptions}
              value={sortOptions.find(opt => opt.value === filters.sortBy)}
              onChange={(selected) => handleFilterUpdate('sortBy', selected.value)}
              styles={customSelectStyles}
              classNamePrefix="react-select"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleClear}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Icons.X size={18} />
              Clear All
            </button>
            <button
              onClick={() => setShowAdvanced(false)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Icons.Check size={18} />
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick Filter Summary (when collapsed) */}
      {!showAdvanced && activeFiltersCount > 0 && (
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex flex-wrap gap-2">
            {filters.dateFrom && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2">
                <Icons.Calendar size={14} />
                {filters.dateFrom.toLocaleDateString()} - {filters.dateTo?.toLocaleDateString() || 'Now'}
              </span>
            )}
            {filters.statuses.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filters.statuses.length} Status
              </span>
            )}
            {filters.testTypes.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filters.testTypes.length} Test Types
              </span>
            )}
            {filters.sampleTypes.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filters.sampleTypes.length} Sample Types
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
