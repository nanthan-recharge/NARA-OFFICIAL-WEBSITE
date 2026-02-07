import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, X, Calendar, User, FileText, Building,
  Tag, TrendingUp, Star, Plus, Minus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RESEARCH_AREAS_FALLBACK = [
  'Marine Biology',
  'Climate Change',
  'Fisheries Management',
  'Oceanography',
  'Conservation',
  'Marine Policy',
  'Aquaculture',
  'Coastal Engineering',
  'Marine Biotechnology',
  'Ocean Modeling'
];

const PUBLICATION_TYPES_FALLBACK = [
  'Journal Article',
  'Conference Paper',
  'Technical Report',
  'Book Chapter',
  'Dataset',
  'Thesis/Dissertation',
  'Review Article',
  'Policy Brief'
];

const LANGUAGES_FALLBACK = [
  { value: 'all', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'si', label: 'Sinhala' },
  { value: 'ta', label: 'Tamil' }
];

const AdvancedSearch = ({ onSearch, onClose }) => {
  const { t } = useTranslation('researchEnhanced');
  const [searchCriteria, setSearchCriteria] = useState({
    keywords: '',
    title: '',
    author: '',
    institution: '',
    yearFrom: '',
    yearTo: '',
    researchAreas: [],
    publicationType: [],
    minCitations: '',
    maxCitations: '',
    minImpactFactor: '',
    openAccessOnly: false,
    hasDataset: false,
    language: 'all'
  });

  const researchAreas = useMemo(() => {
    const translated = t('advancedSearch.researchAreas', { returnObjects: true, defaultValue: RESEARCH_AREAS_FALLBACK });
    return Array.isArray(translated) && translated.length ? translated : RESEARCH_AREAS_FALLBACK;
  }, [t]);

  const publicationTypes = useMemo(() => {
    const translated = t('advancedSearch.publicationTypes', { returnObjects: true, defaultValue: PUBLICATION_TYPES_FALLBACK });
    return Array.isArray(translated) && translated.length ? translated : PUBLICATION_TYPES_FALLBACK;
  }, [t]);

  const languages = useMemo(() => {
    const translated = t('advancedSearch.languages', { returnObjects: true, defaultValue: LANGUAGES_FALLBACK });
    return Array.isArray(translated) && translated.length ? translated : LANGUAGES_FALLBACK;
  }, [t]);

  const copy = useMemo(() => ({
    title: t('advancedSearch.title', 'Advanced Search'),
    headerDefault: t('advancedSearch.header.default', 'Search across 1,247 publications'),
    textHeading: t('advancedSearch.sections.text.heading', 'Text Search'),
    keywordsLabel: t('advancedSearch.sections.text.fields.keywords.label', 'Keywords (any field)'),
    keywordsPlaceholder: t('advancedSearch.sections.text.fields.keywords.placeholder', 'e.g., coral reef, microplastic'),
    titleLabel: t('advancedSearch.sections.text.fields.title.label', 'Title'),
    titlePlaceholder: t('advancedSearch.sections.text.fields.title.placeholder', 'Publication title'),
    authorLabel: t('advancedSearch.sections.text.fields.author.label', 'Author'),
    authorPlaceholder: t('advancedSearch.sections.text.fields.author.placeholder', 'Author name'),
    institutionLabel: t('advancedSearch.sections.text.fields.institution.label', 'Institution'),
    institutionPlaceholder: t('advancedSearch.sections.text.fields.institution.placeholder', 'Institution name'),
    dateHeading: t('advancedSearch.sections.date.heading', 'Publication Date'),
    fromYear: t('advancedSearch.sections.date.fields.fromYear', 'From Year'),
    toYear: t('advancedSearch.sections.date.fields.toYear', 'To Year'),
    researchAreasHeading: t('advancedSearch.sections.areas.heading', 'Research Areas'),
    publicationTypeHeading: t('advancedSearch.sections.types.heading', 'Publication Type'),
    impactHeading: t('advancedSearch.sections.impact.heading', 'Impact Metrics'),
    minCitations: t('advancedSearch.sections.impact.fields.minCitations', 'Min. Citations'),
    maxCitations: t('advancedSearch.sections.impact.fields.maxCitations', 'Max. Citations'),
    minImpact: t('advancedSearch.sections.impact.fields.minImpact', 'Min. Impact Factor'),
    minCitationsPlaceholder: t('advancedSearch.sections.impact.fields.minCitationsPlaceholder', 'e.g., 10'),
    maxCitationsPlaceholder: t('advancedSearch.sections.impact.fields.maxCitationsPlaceholder', 'e.g., 1000'),
    minImpactPlaceholder: t('advancedSearch.sections.impact.fields.minImpactPlaceholder', 'e.g., 5.0'),
    additionalHeading: t('advancedSearch.sections.additional.heading', 'Additional Filters'),
    openAccessOnly: t('advancedSearch.sections.additional.openAccess.label', 'Open Access Only'),
    openAccessDescription: t('advancedSearch.sections.additional.openAccess.description', 'Show only freely available publications'),
    hasDataset: t('advancedSearch.sections.additional.dataset.label', 'Has Dataset'),
    hasDatasetDescription: t('advancedSearch.sections.additional.dataset.description', 'Publications with linked datasets'),
    languageLabel: t('advancedSearch.sections.additional.language.label', 'Language'),
    reset: t('advancedSearch.actions.reset', 'Reset All'),
    cancel: t('advancedSearch.actions.cancel', 'Cancel'),
    search: t('advancedSearch.actions.search', 'Search')
  }), [t]);

  const toggleArrayValue = (array, value) => {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    }
    return [...array, value];
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
    if (onClose) onClose();
  };

  const handleReset = () => {
    setSearchCriteria({
      keywords: '',
      title: '',
      author: '',
      institution: '',
      yearFrom: '',
      yearTo: '',
      researchAreas: [],
      publicationType: [],
      minCitations: '',
      maxCitations: '',
      minImpactFactor: '',
      openAccessOnly: false,
      hasDataset: false,
      language: 'all'
    });
  };

  const activeFiltersCount = Object.entries(searchCriteria).filter(([key, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== '' && value !== 'all';
  }).length;

  const headerSubtitle = activeFiltersCount > 0
    ? t('advancedSearch.header.activeFilters', '{{count}} filters active', { count: activeFiltersCount })
    : copy.headerDefault;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/20 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Filter className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{copy.title}</h2>
                <p className="text-sm text-slate-200">{headerSubtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Text Search Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              {copy.textHeading}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.keywordsLabel}</label>
                <input
                  type="text"
                  value={searchCriteria.keywords}
                  onChange={(e) => setSearchCriteria({...searchCriteria, keywords: e.target.value})}
                  placeholder={copy.keywordsPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.titleLabel}</label>
                <input
                  type="text"
                  value={searchCriteria.title}
                  onChange={(e) => setSearchCriteria({...searchCriteria, title: e.target.value})}
                  placeholder={copy.titlePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.authorLabel}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200" />
                  <input
                    type="text"
                    value={searchCriteria.author}
                    onChange={(e) => setSearchCriteria({...searchCriteria, author: e.target.value})}
                    placeholder={copy.authorPlaceholder}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.institutionLabel}</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-200" />
                  <input
                    type="text"
                    value={searchCriteria.institution}
                    onChange={(e) => setSearchCriteria({...searchCriteria, institution: e.target.value})}
                    placeholder={copy.institutionPlaceholder}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              {copy.dateHeading}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.fromYear}</label>
                <input
                  type="number"
                  value={searchCriteria.yearFrom}
                  onChange={(e) => setSearchCriteria({...searchCriteria, yearFrom: e.target.value})}
                  placeholder="2020"
                  min="1900"
                  max="2024"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.toYear}</label>
                <input
                  type="number"
                  value={searchCriteria.yearTo}
                  onChange={(e) => setSearchCriteria({...searchCriteria, yearTo: e.target.value})}
                  placeholder="2024"
                  min="1900"
                  max="2024"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Research Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              {copy.researchAreasHeading}
            </h3>

            <div className="flex flex-wrap gap-2">
              {researchAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSearchCriteria({
                    ...searchCriteria,
                    researchAreas: toggleArrayValue(searchCriteria.researchAreas, area)
                  })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    searchCriteria.researchAreas.includes(area)
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 border'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {searchCriteria.researchAreas.includes(area) ? (
                    <Minus className="w-3 h-3 inline mr-1" />
                  ) : (
                    <Plus className="w-3 h-3 inline mr-1" />
                  )}
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Publication Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-400" />
              {copy.publicationTypeHeading}
            </h3>

            <div className="flex flex-wrap gap-2">
              {publicationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchCriteria({
                    ...searchCriteria,
                    publicationType: toggleArrayValue(searchCriteria.publicationType, type)
                  })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    searchCriteria.publicationType.includes(type)
                      ? 'bg-green-500/20 border-green-500/50 text-green-300 border'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {searchCriteria.publicationType.includes(type) ? (
                    <Minus className="w-3 h-3 inline mr-1" />
                  ) : (
                    <Plus className="w-3 h-3 inline mr-1" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Citation & Impact Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              {copy.impactHeading}
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.minCitations}</label>
                <input
                  type="number"
                  value={searchCriteria.minCitations}
                  onChange={(e) => setSearchCriteria({...searchCriteria, minCitations: e.target.value})}
                  placeholder={copy.minCitationsPlaceholder}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.maxCitations}</label>
                <input
                  type="number"
                  value={searchCriteria.maxCitations}
                  onChange={(e) => setSearchCriteria({...searchCriteria, maxCitations: e.target.value})}
                  placeholder={copy.maxCitationsPlaceholder}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">{copy.minImpact}</label>
                <input
                  type="number"
                  value={searchCriteria.minImpactFactor}
                  onChange={(e) => setSearchCriteria({...searchCriteria, minImpactFactor: e.target.value})}
                  placeholder={copy.minImpactPlaceholder}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-cyan-400" />
              {copy.additionalHeading}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={searchCriteria.openAccessOnly}
                  onChange={(e) => setSearchCriteria({...searchCriteria, openAccessOnly: e.target.checked})}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                />
                <div>
                  <div className="text-white font-medium">{copy.openAccessOnly}</div>
                  <div className="text-xs text-slate-200">{copy.openAccessDescription}</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                <input
                  type="checkbox"
                  checked={searchCriteria.hasDataset}
                  onChange={(e) => setSearchCriteria({...searchCriteria, hasDataset: e.target.checked})}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                />
                <div>
                  <div className="text-white font-medium">{copy.hasDataset}</div>
                  <div className="text-xs text-slate-200">{copy.hasDatasetDescription}</div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm text-slate-200 mb-2">{copy.languageLabel}</label>
              <select
                value={searchCriteria.language}
                onChange={(e) => setSearchCriteria({...searchCriteria, language: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-white/10">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all font-medium"
            >
              {copy.reset}
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all font-medium"
              >
                {copy.cancel}
              </button>
              <button
                onClick={handleSearch}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {copy.search}
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedSearch;
