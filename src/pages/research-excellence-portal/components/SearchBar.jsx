import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onSearch, onFilterChange, filters }) => {
  const { t } = useTranslation(['researchPortal']);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ ...filters, [filterType]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      language: '',
      sortBy: 'newest'
    });
    setSearchTerm('');
    onSearch('');
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'newest').length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Icons.Search className="w-5 h-5" />
          {t('search.button')}
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 relative"
        >
          <Icons.SlidersHorizontal className="w-5 h-5" />
          {t('search.filters')}
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </form>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('filters.category')}
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">{t('categories.all')}</option>
                    <option value="marineEcology">{t('categories.marineEcology')}</option>
                    <option value="oceanography">{t('categories.oceanography')}</option>
                    <option value="fisheries">{t('categories.fisheries')}</option>
                    <option value="climateChange">{t('categories.climateChange')}</option>
                    <option value="conservation">{t('categories.conservation')}</option>
                    <option value="biotechnology">{t('categories.biotechnology')}</option>
                    <option value="policy">{t('categories.policy')}</option>
                    <option value="other">{t('categories.other')}</option>
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('filters.language')}
                  </label>
                  <select
                    value={filters.language || ''}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Languages</option>
                    <option value="en">English</option>
                    <option value="si">සිංහල</option>
                    <option value="ta">தமிழ்</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('filters.sortBy')}
                  </label>
                  <select
                    value={filters.sortBy || 'newest'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">{t('filters.newest')}</option>
                    <option value="oldest">{t('filters.oldest')}</option>
                    <option value="mostViewed">{t('filters.mostViewed')}</option>
                    <option value="mostDownloaded">{t('filters.mostDownloaded')}</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.X className="w-5 h-5" />
                    {t('search.clearFilters')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
